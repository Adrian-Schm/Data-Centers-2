"""
Extracts project data from DATABASE-DataCenter_Backlash.xlsx
and writes projects-data.js with PROJECTS and PROJECTS_META constants.

The xlsx is read by SHEET POSITION, not by sheet name. Exactly two sheets
are expected: the first is the main project-data sheet, the second is its
timelines sheet. Any additional sheets in the workbook are ignored.

The main sheet is read through the Philly-Fed-shaped FIELD_MAP via
header-name lookup.

Run: python3 extract-projects.py
"""
import json
import re
import datetime
from pathlib import Path

import openpyxl

ROOT = Path(__file__).parent
XLSX = ROOT / "DATABASE-DataCenter_Backlash.xlsx"
OUT_JS = ROOT / "projects-data.js"


# Canonical schema — the Philadelphia Fed Region column layout.
# Both sheet pairs are read using this single mapping by header-name lookup,
# so any NC/VA columns that match these names get picked up automatically.
# Anything missing from a sheet falls through to None on that project.
FIELD_MAP = {
    "name": "Project",
    "company": "Company",
    "investmentB": "Investment (B$)",
    "state": "State",
    "county": "County",
    "communities": "Nearby Communities",
    "capacityMw": "Energy Capacity (MW)",
    "acreage": "Acreage",
    "timelineStart": "Timeline - Start",
    "timelineEnd": "Timeline - End",
    "status": "Status",
    "resourceClaims": "Resource Usage Claims",
    "energySources": "Energy Sources",
    "developerPromises": "Developer Promises",
    "concernsCategories": "Comm. Concerns - Categories",
    "articulatedConcerns": "Articulated Concerns",
    "communityPosture": "Comm. Action - Posture",
    "communityIntensity": "Comm. Action - Intensity",
    "communityActionDetails": "Comm. Action - Details",
    "developerAction": "Developer Action",
    "monthRecorded": "Month of Recording",
    "lat": "Latitude",
    "lng": "Longitude",
}

SOURCE_MAP = {
    "projectProposal": "Project Proposal",
    "govtRecords": ["Govt Records"],
    "other": ["Source 3", "Source 4", "Source 5"],
}


# ── helpers ──────────────────────────────────────────────────────────

def clean(v):
    if v is None:
        return None
    if isinstance(v, str):
        s = v.strip()
        return s if s else None
    return v


def slugify(name):
    s = re.sub(r"[^\w\s-]", "", name.lower())
    s = re.sub(r"\s+", "-", s).strip("-")
    return s


def parse_date(v):
    if isinstance(v, datetime.datetime):
        return v.date().isoformat()
    if isinstance(v, datetime.date):
        return v.isoformat()
    if isinstance(v, (int, float)):
        # NC VA "Timeline" column often holds a bare year like 2028
        if 1900 <= v <= 2100 and v == int(v):
            return str(int(v))
        return None
    if isinstance(v, str):
        return v.strip() or None
    return None


def split_sources(v):
    if not v:
        return []
    return [u.strip() for u in str(v).split(";") if u.strip()]


def build_header_index(headers):
    """Map cleaned header string → column index. Skips None / blank headers."""
    out = {}
    for i, h in enumerate(headers):
        h_clean = clean(h)
        if h_clean and h_clean not in out:
            out[h_clean] = i
    return out


def resolve_col(spec, header_index):
    """Translate a column spec into a column index (or None)."""
    if spec is None:
        return None
    if isinstance(spec, int):
        return spec
    return header_index.get(spec)


def cell(row, spec, header_index):
    idx = resolve_col(spec, header_index)
    if idx is None or idx >= len(row):
        return None
    return clean(row[idx])


# ── extraction ───────────────────────────────────────────────────────

def extract_pair(main_ws, timelines_ws):
    rows = list(main_ws.iter_rows(values_only=True))
    if not rows:
        return []
    header_index = build_header_index(rows[0])
    field_map = FIELD_MAP
    source_map = SOURCE_MAP

    projects = []
    for r in rows[1:]:
        name = cell(r, field_map["name"], header_index)
        if not name:
            continue
        featured = name.startswith("✶") or name.startswith("*")
        clean_name = name.lstrip("✶* ").strip()

        proj = {
            "id": slugify(clean_name),
            "name": clean_name,
            "featured": featured,
        }
        for target, spec in field_map.items():
            if target == "name":
                continue
            val = cell(r, spec, header_index)
            if target in ("timelineStart", "timelineEnd"):
                val = parse_date(val) if val is not None else None
            elif target in ("lat", "lng"):
                if val is None:
                    pass
                else:
                    try:
                        val = float(val)
                    except (TypeError, ValueError):
                        val = None  # unparsable coords get dropped silently
            proj[target] = val

        proj_proposal = cell(r, source_map.get("projectProposal"), header_index)
        govt_records = []
        for spec in source_map.get("govtRecords") or []:
            govt_records.extend(split_sources(cell(r, spec, header_index)))
        other_sources = []
        for spec in source_map.get("other") or []:
            other_sources.extend(split_sources(cell(r, spec, header_index)))
        proj["sources"] = {
            "projectProposal": proj_proposal,
            "govtRecords": govt_records,
            "other": other_sources,
        }

        # Stub detection: count fields with real content
        substantive = sum(
            1 for k, v in proj.items()
            if k not in ("id", "name", "featured", "sources") and v not in (None, "", [])
        )
        proj["stub"] = substantive <= 1

        # placeholders for fields not in the spreadsheet yet
        proj["coordsPrecision"] = None
        proj["timeline"] = []

        projects.append(proj)

    attach_timelines(timelines_ws, projects)
    return projects


def attach_timelines(ws, projects):
    if ws is None:
        return
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return

    # Map cleaned project name → column in the timeline sheet
    col_by_name = {}
    for j, v in enumerate(rows[0]):
        n = clean(v)
        if n:
            cleaned = n.lstrip("✶* ").strip()
            col_by_name.setdefault(cleaned, j)

    # Walk rows looking for (label, date, source) triples
    triples = []
    i = 1
    while i < len(rows):
        label = clean(rows[i][0])
        if label and ("Proposal/Announcement" in str(label) or "Development" in str(label)):
            triples.append((
                i,
                i + 1 if i + 1 < len(rows) else None,
                i + 2 if i + 2 < len(rows) else None,
                "Proposal/Announcement" in str(label),
            ))
            i += 3
        else:
            i += 1

    by_name = {p["name"]: p for p in projects}
    for name, col in col_by_name.items():
        proj = by_name.get(name)
        if not proj:
            continue
        for (lr, dr, sr, is_proposal) in triples:
            label = clean(rows[lr][col]) if lr is not None else None
            date = parse_date(rows[dr][col]) if dr is not None else None
            source = clean(rows[sr][col]) if sr is not None else None
            if not (label or date or source):
                continue
            proj["timeline"].append({
                "date": date,
                "label": label,
                "isProposal": is_proposal,
                "source": source,
            })
        proj["timeline"].sort(key=lambda e: (e["date"] is None, e["date"] or ""))


# ── main ─────────────────────────────────────────────────────────────

def main():
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    sheets = wb.worksheets
    if not sheets:
        raise SystemExit("Workbook has no sheets.")
    main_ws = sheets[0]
    timelines_ws = sheets[1] if len(sheets) > 1 else None

    all_projects = extract_pair(main_ws, timelines_ws)
    pair_stats = [{
        "mainSheet": main_ws.title,
        "timelinesSheet": timelines_ws.title if timelines_ws is not None else None,
        "projectCount": len(all_projects),
        "fullCount": sum(1 for p in all_projects if not p["stub"]),
    }]
    if len(sheets) > 2:
        ignored = [s.title for s in sheets[2:]]
        print(f"  ⚠ Ignoring {len(ignored)} extra sheet(s): {', '.join(ignored)}")

    # Detect id collisions across pairs (currently none, but warn future-us)
    seen = {}
    for p in all_projects:
        if p["id"] in seen:
            print(f"  ⚠ duplicate id '{p['id']}' — '{p['name']}' clashes with '{seen[p['id']]}'")
        else:
            seen[p["id"]] = p["name"]

    payload_meta = {
        "generatedAt": datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "sourceFile": XLSX.name,
        "sheetsRead": pair_stats,
    }

    js = (
        "// Auto-generated from DATABASE-DataCenter_Backlash.xlsx\n"
        "// Run extract-projects.py to regenerate.\n"
        "// Do not edit by hand.\n\n"
        f"const PROJECTS_META = {json.dumps(payload_meta, indent=2, ensure_ascii=False)};\n\n"
        f"const PROJECTS = {json.dumps(all_projects, indent=2, ensure_ascii=False)};\n"
    )
    OUT_JS.write_text(js, encoding="utf-8")

    total_events = sum(len(p["timeline"]) for p in all_projects)
    s = pair_stats[0]
    stubs = s["projectCount"] - s["fullCount"]
    print(f"Wrote {OUT_JS.name}")
    print(f"  main sheet:      {s['mainSheet']}")
    print(f"  timelines sheet: {s['timelinesSheet']}")
    print(f"  {len(all_projects)} projects ({s['fullCount']} full, {stubs} stub), {total_events} timeline events")


if __name__ == "__main__":
    main()
