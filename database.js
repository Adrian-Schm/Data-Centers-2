/* ══════════════════════════════════════════
   DATABASE EXPLORER
   - Multi-select chip filters (state, status, posture)
   - Text search on name + company
   - Stub rows hidden always
   - Clear sort direction indicators on all columns
══════════════════════════════════════════ */
(function () {
  const MOUNT_ID = 'dbApp';

  const dbState = {
    filters: { states: [], statuses: [], postures: [], search: '' },
    sort:    { col: 'name', dir: 'asc' },
    detailId: null,
  };

  // ── drought helpers ────────────────────────────────────────────────
  const DROUGHT_TEXT   = { D0: '#a08500', D1: '#b35900', D2: '#b35900', D3: '#c00000', D4: '#5a0000' };
  const DROUGHT_LABEL  = { D0: 'D0 — Abnormally Dry', D1: 'D1 — Moderate', D2: 'D2 — Severe', D3: 'D3 — Extreme', D4: 'D4 — Exceptional' };
  const DROUGHT_LEVELS = ['D0','D1','D2','D3','D4'];
  const DROUGHT_SEG_COLOR = { D0: '#FFE600', D1: '#FFB300', D2: '#E07000', D3: '#C00000', D4: '#6B0000' };

  function droughtInline(level) {
    if (!level) return '';
    if (level === 'None') return `<span class="drought-inline" style="color:var(--text2)">No drought</span>`;
    if (!DROUGHT_TEXT[level]) return '';
    const activeIdx = DROUGHT_LEVELS.indexOf(level);
    const segs = DROUGHT_LEVELS.map((l, i) => {
      const fill = i <= activeIdx ? `background:${DROUGHT_SEG_COLOR[l]}` : `background:var(--border)`;
      return `<span class="drought-seg" style="${fill}"></span>`;
    }).join('');
    const bar = `<span class="drought-bar-track">${segs}</span>`;
    return `${bar}<span class="drought-inline" style="color:${DROUGHT_TEXT[level]};font-weight:500">${DROUGHT_LABEL[level]}</span>`;
  }

  // ── formatters ─────────────────────────────────────────────────────
  function fmtMoney(b) {
    if (b == null) return '—';
    if (typeof b !== 'number') return String(b);
    if (b >= 1) return '$' + b.toFixed(1) + 'B';
    const m = Math.round(b * 1000);
    return '$' + m + 'M';
  }
  function fmtMw(v) {
    if (v == null) return '—';
    if (typeof v !== 'number') return String(v);
    return v.toLocaleString() + ' MW';
  }
  function fmtAcres(v) {
    if (v == null) return '—';
    if (typeof v !== 'number') return String(v);
    return v.toLocaleString() + ' ac';
  }
  function fmtDate(s) {
    if (!s) return null;
    if (/^\d{4}$/.test(s)) return s;
    const d = new Date(s + 'T00:00:00');
    if (isNaN(d)) return s;
    return d.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
  }
  function fmtMonth(s) {
    if (!s) return null;
    if (/^\d{4}$/.test(s)) return s;
    const d = new Date(s + 'T00:00:00');
    if (isNaN(d)) return s;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }
  function fmtDateParts(s) {
    if (!s) return { month: '', year: '—' };
    if (/^\d{4}$/.test(s)) return { month: '', year: s };
    const d = new Date(s + 'T00:00:00');
    if (isNaN(d)) return { month: '', year: s };
    return {
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      year:  d.toLocaleDateString('en-US', { year: 'numeric' }),
    };
  }
  function fmtRange(a, b) {
    const af = fmtDate(a), bf = fmtDate(b);
    if (!af && !bf) return null;
    if (af && bf)   return af + ' → ' + bf;
    return af || bf;
  }
  function postureBadgeClass(p) {
    if (!p) return 'b-Empty';
    if (p === 'Positive') return 'b-Positive';
    if (p === 'Negative') return 'b-Negative';
    if (p === 'Neutral')  return 'b-Neutral';
    return 'b-Delayed';
  }
  // Exact-match lookup so the database badge color always agrees with the
  // map's pin color for the same literal status string.
  const STATUS_BADGE_CLASS = {
    'Proposed':              'b-Neutral',
    'Planned':               'b-Planned',
    'In Progress':           'b-Progress',
    'Completed':             'b-Positive',
    'Delayed/Scaled Back':   'b-Delayed',
    'Canceled / Withdrawn': 'b-Cancelled',
  };
  function statusBadgeClass(s) {
    if (!s) return 'b-Empty';
    return STATUS_BADGE_CLASS[s] || 'b-Neutral';
  }
  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); }
    catch (e) { return url; }
  }
  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function uniqueValues(field) {
    const s = new Set();
    PROJECTS.forEach(p => { if (!p.stub && p[field]) s.add(p[field]); });
    return Array.from(s).sort();
  }

  // ── filter / sort ──────────────────────────────────────────────────
  function applyFilters(list) {
    const q = dbState.filters.search.toLowerCase().trim();
    return list.filter(p => {
      if (p.stub) return false;
      if (dbState.filters.states.length   && !dbState.filters.states.includes(p.state))            return false;
      if (dbState.filters.statuses.length && !dbState.filters.statuses.includes(p.status))         return false;
      if (dbState.filters.postures.length && !dbState.filters.postures.includes(p.communityPosture)) return false;
      if (q) {
        const name    = (p.name    || '').toLowerCase();
        const company = (p.company || '').toLowerCase();
        if (!name.includes(q) && !company.includes(q)) return false;
      }
      return true;
    });
  }
  function applySort(list) {
    const { col, dir } = dbState.sort;
    const mul = dir === 'asc' ? 1 : -1;
    return list.slice().sort((a, b) => {
      let av = a[col], bv = b[col];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'string') { av = av.toLowerCase(); bv = String(bv).toLowerCase(); }
      if (av < bv) return -1 * mul;
      if (av > bv) return  1 * mul;
      // secondary: sort by name within same primary value
      const an = (a.name || '').toLowerCase(), bn = (b.name || '').toLowerCase();
      return an < bn ? -1 : an > bn ? 1 : 0;
    });
  }

  function toggleFilter(key, value) {
    const arr = dbState.filters[key];
    const idx = arr.indexOf(value);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(value);
    dbNavTo(null);
  }

  // ── render dispatcher ──────────────────────────────────────────────
  function render() {
    const mount = document.getElementById(MOUNT_ID);
    if (!mount) return;
    if (dbState.detailId) {
      renderDetail(mount);
      requestAnimationFrame(() => {
        const card = mount.querySelector('.db-detail-bar');
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      renderBrowse(mount);
    }
  }

  // ── chip row builder ───────────────────────────────────────────────
  function chipRow(key, values, activeArr, labelFn) {
    return values.map(v => {
      const on = activeArr.includes(v);
      const label = labelFn ? labelFn(v) : v;
      return `<button class="db-chip-btn${on?' active':''}" data-filter="${key}" data-value="${esc(v)}">${esc(label)}</button>`;
    }).join('');
  }

  // ── browse view ────────────────────────────────────────────────────
  function renderBrowse(mount) {
    const allReal = PROJECTS.filter(p => !p.stub);
    const list    = applySort(applyFilters(PROJECTS));

    const stateOpts   = uniqueValues('state');
    const statusOpts  = ['Proposed', 'Planned', 'In Progress', 'Completed', 'Delayed/Scaled Back', 'Canceled / Withdrawn'].filter(s => PROJECTS.some(p => p.status === s));
    const postureOpts = uniqueValues('communityPosture').filter(v => v !== 'Positive/Neutral');

    const anyFilter = dbState.filters.states.length || dbState.filters.statuses.length ||
                      dbState.filters.postures.length || dbState.filters.search;

    mount.innerHTML = `
      <div class="db-filter-bar">
        <div class="db-search-row">
          <input class="db-search-input" type="search" placeholder="Search project name or company…"
            value="${esc(dbState.filters.search)}" />
          <div class="db-search-meta">
            <div class="db-browse-count">${list.length} of ${allReal.length} shown</div>
            ${anyFilter ? `<button class="db-reset" type="button">Clear</button>` : ''}
            <button class="db-download-btn" type="button">↓ Download CSV</button>
          </div>
        </div>

        <div class="db-filter-cols">
          <div class="db-filter-row">
            <span class="db-filter-label">State</span>
            <div class="db-chips-row">${chipRow('states', stateOpts, dbState.filters.states)}</div>
          </div>
          <div class="db-filter-row">
            <span class="db-filter-label">Status</span>
            <div class="db-chips-row">${chipRow('statuses', statusOpts, dbState.filters.statuses)}</div>
          </div>
          <div class="db-filter-row">
            <span class="db-filter-label">Posture</span>
            <div class="db-chips-row">${chipRow('postures', postureOpts, dbState.filters.postures)}</div>
          </div>
        </div>
        <div></div>
      </div>

      <div class="db-table-wrap">
        <table class="db-table db-table-header">
          <colgroup>
            <col style="width:21%"><col style="width:18%"><col style="width:6%">
            <col style="width:10%"><col style="width:9%"><col style="width:10%">
            <col style="width:14%"><col style="width:12%">
          </colgroup>
          <thead>
            <tr>
              ${headerCell('name',             'Project')}
              ${headerCell('company',          'Company')}
              ${headerCell('state',            'State')}
              ${headerCell('county',           'County')}
              ${headerCell('capacityMw',       'Capacity')}
              ${headerCell('investmentB',      'Investment')}
              ${headerCell('status',           'Status')}
              ${headerCell('communityPosture', 'Posture')}
            </tr>
          </thead>
        </table>
        <div class="db-table-scroll">
          <table class="db-table db-table-body">
            <colgroup>
              <col style="width:21%"><col style="width:18%"><col style="width:6%">
              <col style="width:10%"><col style="width:9%"><col style="width:10%">
              <col style="width:14%"><col style="width:12%">
            </colgroup>
            <tbody>
              ${list.length === 0
                ? `<tr><td colspan="8" class="db-empty-state">No projects match these filters.</td></tr>`
                : list.map(rowHtml).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Search input
    const searchInput = mount.querySelector('.db-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        dbState.filters.search = e.target.value;
        dbNavTo(null);
      });
      // Keep cursor at end after re-render
      if (dbState.filters.search) {
        searchInput.focus();
        const len = searchInput.value.length;
        searchInput.setSelectionRange(len, len);
      }
    }

    // Chip filter buttons
    mount.querySelectorAll('.db-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleFilter(btn.dataset.filter, btn.dataset.value);
      });
    });

    // Reset
    const resetBtn = mount.querySelector('.db-reset');
    if (resetBtn) resetBtn.addEventListener('click', () => {
      dbState.filters = { states:[], statuses:[], postures:[], search:'' };
      dbState.sort    = { col:'name', dir:'asc' };
      dbNavTo(null);
    });

    // Column sort
    mount.querySelectorAll('thead th[data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.col;
        if (dbState.sort.col === col) dbState.sort.dir = dbState.sort.dir === 'asc' ? 'desc' : 'asc';
        else { dbState.sort.col = col; dbState.sort.dir = 'asc'; }
        dbNavTo(null);
      });
    });

    // Row click → detail
    mount.querySelectorAll('tbody tr[data-id]').forEach(tr => {
      tr.addEventListener('click', () => {
        dbNavTo(tr.dataset.id);
      });
    });

    // Download CSV
    const dlBtn = mount.querySelector('.db-download-btn');
    if (dlBtn) dlBtn.addEventListener('click', () => showDownloadModal(list));
  }

  function headerCell(col, label) {
    const active = dbState.sort.col === col;
    const dir    = dbState.sort.dir;
    const ind = active
      ? `<span class="db-sort-ind active">${dir === 'asc' ? '↓' : '↑'}</span>`
      : `<span class="db-sort-ind">↕</span>`;
    return `<th data-col="${col}" class="${active ? 'active' : ''}" title="Sort by ${label}">${label}${ind}</th>`;
  }

  function rowHtml(p) {
    return `
      <tr data-id="${esc(p.id)}">
        <td><div class="db-proj-name">${p.featured ? '<span class="db-star">✶</span>' : ''}${esc(p.name)}</div></td>
        <td>${p.company ? esc(p.company) : '<span class="b-Empty">—</span>'}</td>
        <td>${p.state || '—'}</td>
        <td>${p.county ? esc(p.county) : '—'}</td>
        <td>${fmtMw(p.capacityMw)}</td>
        <td>${fmtMoney(p.investmentB)}</td>
        <td>${p.status ? `<span class="badge ${statusBadgeClass(p.status)}">${esc(p.status)}</span>` : '<span class="b-Empty">—</span>'}</td>
        <td>${p.communityPosture ? `<span class="badge ${postureBadgeClass(p.communityPosture)}">${esc(p.communityPosture)}</span>` : '<span class="b-Empty">—</span>'}</td>
      </tr>
    `;
  }

  // ── detail view ────────────────────────────────────────────────────
  function renderDetail(mount) {
    // Navigate within the current filtered+sorted set, falling back to all projects
    const realProjects = applySort(applyFilters(PROJECTS)).filter(p => !p.stub);
    const idx = realProjects.findIndex(p => p.id === dbState.detailId);
    const p   = idx >= 0 ? realProjects[idx] : null;

    if (!p) {
      mount.innerHTML = `
        <a class="db-back-link" data-action="back">← All projects</a>
        <div class="db-stub-state"><div class="db-big">Project not found</div></div>
      `;
      mount.querySelector('[data-action="back"]').addEventListener('click', () => { dbNavTo(null); });
      return;
    }

    const prev = idx > 0 ? realProjects[idx - 1] : null;
    const next = idx < realProjects.length - 1 ? realProjects[idx + 1] : null;
    const { metricsHtml, mapHtml, renderSections } = renderFullDetail(p);

    mount.innerHTML = `
      <div class="db-detail-bar">
        <a class="db-back-link" data-action="back">← All projects</a>
        <div class="db-nav-arrows">
          ${prev
            ? `<a data-action="prev"><span class="db-arrow">←</span> ${esc(prev.name)}</a>`
            : `<span class="db-disabled"><span class="db-arrow">←</span> Start of list</span>`}
          ${next
            ? `<a data-action="next">${esc(next.name)} <span class="db-arrow">→</span></a>`
            : `<span class="db-disabled">End of list <span class="db-arrow">→</span></span>`}
        </div>
      </div>

      <div class="db-detail-card">
        <div class="db-detail-head">
          <div class="db-detail-name">${p.featured ? '<span class="db-star" style="font-size:20px;margin-right:8px">✶</span>' : ''}${esc(p.name)}</div>
          ${(() => {
            const place = [p.county ? esc(p.county) + ' County' : '', p.state ? esc(p.state) : ''].filter(Boolean).join(', ');
            const loc = [place, p.communities ? 'Nearby Communities: ' + esc(p.communities) : ''].filter(Boolean).join(' — ');
            return loc ? `<div class="db-detail-location">${loc}</div>` : '';
          })()}
          ${p.monthRecorded ? `<div class="db-detail-recorded"><em>Data recorded ${esc(fmtMonth(p.monthRecorded))}</em></div>` : ''}
        </div>
        <div class="db-detail-card-inner">
          <div class="db-detail-left">
            <div class="db-metrics-grid">${metricsHtml}</div>
          </div>
          ${mapHtml}
        </div>
        ${renderSections()}
      </div>
    `;

    const back = mount.querySelector('[data-action="back"]');
    if (back) back.addEventListener('click', () => { dbNavTo(null); });
    const pv = mount.querySelector('[data-action="prev"]');
    if (pv && prev) pv.addEventListener('click', () => { dbNavTo(prev.id); });
    const nx = mount.querySelector('[data-action="next"]');
    if (nx && next) nx.addEventListener('click', () => { dbNavTo(next.id); });

    if (p.lat != null && p.lng != null) initDetailMap(p);
  }

  // ── MapLibre detail map (OpenFreeMap tiles) ───────────────────────
  let _activeDetailMap = null;
  function initDetailMap(p) {
    if (typeof maplibregl === 'undefined') return;
    requestAnimationFrame(() => {
      const el = document.getElementById('dbMap-' + p.id);
      if (!el) return;
      if (_activeDetailMap) { try { _activeDetailMap.remove(); } catch (e) {} _activeDetailMap = null; }
      const zoom = 10;
      const map = new maplibregl.Map({
        container: el,
        style:     'https://tiles.openfreemap.org/styles/bright',
        center:    [p.lng, p.lat],
        zoom:      zoom,
        scrollZoom: false,
        attributionControl: false,
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
      map.on('load', () => {
        map.addSource('pin', {
          type: 'geojson',
          data: { type:'Feature', geometry:{ type:'Point', coordinates:[p.lng, p.lat] }, properties:{} },
        });
        map.addLayer({
          id: 'pin-dot',
          type: 'circle',
          source: 'pin',
          paint: {
            'circle-radius': 9,
            'circle-color': '#a32d2d',
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2,
          },
        });
        // Container can finish sizing after the map initializes (e.g. when the
        // detail view lays out or the tab becomes visible); resize so tiles
        // fill the box instead of rendering as a gray panel.
        map.resize();
      });
      _activeDetailMap = map;
    });
  }

  function renderFullDetail(p) {
    const metricsHtml = `
      ${p.company ? `<div class="db-metric"><div class="db-ml">Company</div><div class="db-mv">${esc(p.company)}</div></div>` : ''}
      <div class="db-metric"><div class="db-ml">Investment</div><div class="db-mv">${fmtMoney(p.investmentB)}</div></div>
      <div class="db-metric"><div class="db-ml">Capacity</div><div class="db-mv">${fmtMw(p.capacityMw)}</div></div>
      <div class="db-metric"><div class="db-ml">Acreage</div><div class="db-mv">${fmtAcres(p.acreage)}</div></div>
      <div class="db-metric"><div class="db-ml">Timeline</div><div class="db-mv ${fmtRange(p.timelineStart,p.timelineEnd)?'text':'empty'}">${esc(fmtRange(p.timelineStart,p.timelineEnd)) || 'Not yet set'}</div></div>
      ${p.status ? `<div class="db-metric db-metric-status ${statusBadgeClass(p.status)}"><div class="db-ml">Status</div><div class="db-mv">${esc(p.status)}</div></div>` : ''}
      ${p.droughtLevel ? `<div class="db-metric"><div class="db-ml">Drought level <span class="info-tip" tabindex="0"><svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="6.5" cy="6.5" r="6" stroke="currentColor" stroke-width="1.2"/><circle cx="6.5" cy="4" r="0.9" fill="currentColor"/><line x1="6.5" y1="6" x2="6.5" y2="10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg><span class="info-tip-text">From <a href="https://droughtmonitor.unl.edu" target="_blank" rel="noopener">U.S. Drought Monitor</a>, as of ${(typeof PROJECTS_META !== 'undefined' && PROJECTS_META.droughtDate) ? PROJECTS_META.droughtDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') : 'latest release'}.</span></span></div><div class="db-mv" style="display:flex;flex-direction:column;gap:5px;font-size:13px;font-weight:400">${droughtInline(p.droughtLevel)}</div></div>` : ''}
      ${p.energySources ? `<div class="db-metric ${p.droughtLevel ? 'db-two-thirds' : 'db-full'}"><div class="db-ml">Energy sources</div><div class="db-mv text">${esc(p.energySources)}</div></div>` : ''}
    `;

    const hasCoords = p.lat != null && p.lng != null;
    const mapId = 'dbMap-' + p.id;
    const precisionLabel = p.coordsPrecision === 'parcel' ? 'Approx. parcel'
                         : p.coordsPrecision === 'town'   ? 'Town vicinity'
                         : p.coordsPrecision === 'county' ? 'County area'
                         : 'Site location';
    const mapHtml = hasCoords ? `
      <div class="db-map-col">
        <div class="db-map-box">
          <div class="db-map" id="${mapId}"></div>
          <div class="db-map-meta">
            <span>${precisionLabel}</span>
            <span>Lat ${p.lat.toFixed(3)}, Lng ${p.lng.toFixed(3)}</span>
          </div>
        </div>
      </div>` : `
      <div class="db-map-col">
        <div class="db-map-box">
          <div class="db-map-pending">Coordinates not yet added</div>
        </div>
      </div>`;

    const timelineHtml = (p.timeline && p.timeline.length)
      ? `<div class="db-timeline">
           ${p.timeline.map((e, i) => {
             const last = i === p.timeline.length - 1 ? 'last' : '';
             const src = resolveSourceUrl(e.source, p);
             const { month, year } = fmtDateParts(e.date);
             const prevYear = i > 0 ? fmtDateParts(p.timeline[i-1].date).year : null;
             const yearBreak = (i > 0 && prevYear !== year) ? 'year-break' : '';
             return `
               <div class="db-te ${last} ${yearBreak}">
                 <div class="db-te-date">
                   <div class="db-te-month">${esc(month)}</div>
                   <div class="db-te-year">${esc(year)}</div>
                 </div>
                 <div class="db-te-body">
                   <div class="db-te-label">${esc(e.label || 'Event')}${e.isProposal ? '<span class="db-te-proposal-tag">proposal</span>' : ''}</div>
                   ${src ? `<div class="db-te-meta"><a href="${esc(src)}" target="_blank" rel="noopener">↗ ${esc(hostOf(src))}</a></div>` : ''}
                 </div>
               </div>`;
           }).join('')}
         </div>`
      : `<div class="db-field-empty">No timeline events recorded.</div>`;

    const concernsChips = p.concernsCategories
      ? p.concernsCategories.split(/[,;]/).map(c => c.trim()).filter(Boolean)
      : [];

    const CHIP_COLORS = {
      'air quality':          'db-chip-air',
      'noise pollution':      'db-chip-noise',
      'noise':                'db-chip-noise',
      'light pollution':      'db-chip-light',
      'water demand':         'db-chip-water',
      'water':                'db-chip-water',
      'land':                 'db-chip-land',
      'environmental':        'db-chip-env',
      'environment':          'db-chip-env',
      'climate':              'db-chip-climate',
      'individual economic':  'db-chip-econ',
      'qol':                  'db-chip-qol',
    };
    function chipClass(c) {
      return CHIP_COLORS[c.toLowerCase().trim()] || 'db-chip-default';
    }

    const devSide = `
      <div class="db-section-label">Developer-Side</div>
      ${fieldHtml('Resource usage claims', p.resourceClaims)}
      ${fieldHtml('Developer promises', p.developerPromises)}
      ${fieldHtml('Developer action', p.developerAction)}
    `;
    const commSide = `
      <div class="db-section-label">Community-Side</div>
      <div class="db-sentiment-row">
        ${p.communityPosture ? `
          <div class="db-sentiment-item">
            <div class="db-field-label">Sentiment</div>
            <span class="db-sentiment-badge ${postureBadgeClass(p.communityPosture)}">${esc(p.communityPosture)}</span>
          </div>` : ''}
        ${p.communityIntensity ? `
          <div class="db-sentiment-item">
            <div class="db-field-label">Intensity</div>
            <span class="db-sentiment-badge db-intensity-${esc(p.communityIntensity).toLowerCase()}">${esc(p.communityIntensity)}</span>
          </div>` : ''}
      </div>
      <div class="db-field">
        <div class="db-field-label">Concern categories</div>
        ${concernsChips.length
          ? `<div class="db-chips">${concernsChips.map(c=>`<span class="db-chip ${chipClass(c)}">${esc(c)}</span>`).join('')}</div>`
          : `<div class="db-field-empty">None recorded.</div>`}
      </div>
      ${fieldHtml('Articulated concerns', p.articulatedConcerns)}
      ${fieldHtml('Community action', p.communityActionDetails)}
    `;

    return { metricsHtml, mapHtml, renderSections };

    function renderSections() {
      return `
        <div class="db-section">
          <div class="db-split">
            <div>${commSide}</div>
            <div>${devSide}</div>
          </div>
        </div>
        <div class="db-section">
          <div class="db-section-label">Timeline</div>
          ${timelineHtml}
        </div>
        ${renderSources(p)}`;
    }
  }

  function fieldHtml(label, text) {
    return `
      <div class="db-field">
        <div class="db-field-label">${esc(label)}</div>
        ${text ? `<div class="db-field-text">${esc(text)}</div>` : `<div class="db-field-empty">Not recorded.</div>`}
      </div>`;
  }

  function resolveSourceUrl(src, project) {
    if (!src) return null;
    if (/^project proposal$/i.test(src)) return project.sources.projectProposal;
    if (/^https?:\/\//.test(src)) return src;
    return null;
  }

  function renderSources(p) {
    const s = p.sources;
    const hasAny = s.projectProposal || s.govtRecords.length > 0 || s.other.length > 0;
    if (!hasAny) return '';
    const rows = [];
    if (s.projectProposal)
      rows.push(`<a href="${esc(s.projectProposal)}" target="_blank" rel="noopener"><span class="db-source-tag">PROPOSAL</span>↗ ${esc(hostOf(s.projectProposal))}</a>`);
    s.govtRecords.forEach(u =>
      rows.push(`<a href="${esc(u)}" target="_blank" rel="noopener"><span class="db-source-tag">GOV'T</span>↗ ${esc(hostOf(u))}</a>`)
    );
    s.other.forEach(u =>
      rows.push(`<a href="${esc(u)}" target="_blank" rel="noopener"><span class="db-source-tag">OTHER</span>↗ ${esc(hostOf(u))}</a>`)
    );
    return `
      <div class="db-section">
        <div class="db-section-label">SOURCES</div>
        <div class="db-source-list">${rows.join('')}</div>
      </div>`;
  }

  // ── hash serialization ─────────────────────────────────────────────
  function filtersToQuery() {
    const p = new URLSearchParams();
    if (dbState.filters.states.length)   p.set('state',   dbState.filters.states.join(','));
    if (dbState.filters.statuses.length) p.set('status', dbState.filters.statuses.join(','));
    if (dbState.filters.postures.length) p.set('posture', dbState.filters.postures.join(','));
    if (dbState.filters.search)          p.set('search',   dbState.filters.search);
    if (dbState.sort.col !== 'name' || dbState.sort.dir !== 'asc')
      p.set('sort', dbState.sort.col + ':' + dbState.sort.dir);
    const s = p.toString();
    return s ? '?' + s : '';
  }

  function applyQueryToState(query) {
    if (!query) return;
    const p = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    if (p.has('state'))   dbState.filters.states   = p.get('state').split(',').filter(Boolean);
    if (p.has('status')) dbState.filters.statuses = p.get('status').split(',').filter(Boolean);
    if (p.has('posture')) dbState.filters.postures = p.get('posture').split(',').filter(Boolean);
    if (p.has('search'))   dbState.filters.search   = p.get('search');
    if (p.has('sort')) {
      const [col, dir] = p.get('sort').split(':');
      if (col) dbState.sort.col = col;
      if (dir === 'asc' || dir === 'desc') dbState.sort.dir = dir;
    }
  }

  // Navigate the database tab by writing the URL hash; the page-level
  // router reads it back and calls dbApplySubHash / dbGoHome to render.
  // id = project id to open, or null/'' to return to the list.
  function dbNavTo(id) {
    const q = filtersToQuery();
    location.hash = id ? 'database/' + encodeURIComponent(id) : 'database' + q;
  }

  // ── CSV download ───────────────────────────────────────────────────
  // Fields are derived automatically from project keys.
  // FIELD_CONFIG overrides label/default for known keys; anything not listed
  // gets a auto-generated label and default:false.
  // Keys in FIELD_SKIP are excluded entirely; 'sources' is handled as a
  // single combined column instead.
  const FIELD_SKIP    = new Set(['id', 'stub', 'coordsPrecision', 'timeline', 'sources']);
  const FIELD_CONFIG  = {
    name:                  { label: 'Project Name',         default: true  },
    company:               { label: 'Company',              default: true  },
    state:                 { label: 'State',                default: true  },
    county:                { label: 'County',               default: true  },
    status:                { label: 'Status',               default: true  },
    capacityMw:            { label: 'Capacity (MW)',        default: true  },
    investmentB:           { label: 'Investment ($B)',      default: true  },
    communityPosture:      { label: 'Community Posture',    default: true  },
    acreage:               { label: 'Acreage',              default: false },
    communityIntensity:    { label: 'Community Intensity',  default: false },
    energySources:         { label: 'Energy Sources',       default: false },
    droughtLevel:          { label: 'Drought Level',        default: false },
    communities:           { label: 'Nearby Communities',   default: false },
    timelineStart:         { label: 'Timeline Start',       default: false },
    timelineEnd:           { label: 'Timeline End',         default: false },
    articulatedConcerns:   { label: 'Articulated Concerns', default: false },
    developerPromises:     { label: 'Developer Promises',   default: false },
    resourceClaims:        { label: 'Resource Claims',      default: false },
    communityActionDetails:{ label: 'Community Action',     default: false },
    developerAction:       { label: 'Developer Action',     default: false },
  };

  // Auto-label: camelCase → Title Case words
  function autoLabel(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
  }

  function buildCsvFields() {
    if (!PROJECTS.length) return [];
    // Derive ordered field list from actual project keys
    const fields = Object.keys(PROJECTS[0])
      .filter(k => !FIELD_SKIP.has(k))
      .map(k => ({
        key:     k,
        label:   (FIELD_CONFIG[k] || {}).label   || autoLabel(k),
        default: (FIELD_CONFIG[k] || {}).default || false,
      }));
    // Append sources as a single combined column at the end
    fields.push({ key: '__sources__', label: 'Sources', default: false });
    return fields;
  }

  const CSV_FIELDS = buildCsvFields();

  function buildFilename() {
    const parts = ['projects'];
    if (dbState.filters.states.length)   parts.push(dbState.filters.states.join('-'));
    if (dbState.filters.statuses.length) parts.push(dbState.filters.statuses.map(s => s.replace(/\s+/g,'-').replace(/\//g,'')).join('-'));
    if (dbState.filters.postures.length) parts.push(dbState.filters.postures.join('-'));
    if (dbState.filters.search)          parts.push(dbState.filters.search.trim().replace(/\s+/g,'-').toLowerCase());
    return parts.join('_').replace(/[^a-zA-Z0-9_\-]/g, '') + '.csv';
  }

  function csvEscape(v) {
    if (v == null) return '';
    const s = String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function projectValue(p, key) {
    if (key !== '__sources__') return p[key];
    const s = p.sources || {};
    const urls = [
      s.projectProposal,
      ...(s.govtRecords  || []),
      ...(s.other        || []),
    ].filter(Boolean);
    return urls.join('; ');
  }

  function exportCsv(rows, selectedKeys) {
    const headers = CSV_FIELDS.filter(f => selectedKeys.includes(f.key)).map(f => f.label);
    const lines = [
      '# Duke Data Center Policy Project · CC BY 4.0 · Please credit if reused or republished. · Drought data: U.S. Drought Monitor (NDMC / USDA / NOAA) · droughtmonitor.unl.edu',
      headers.map(csvEscape).join(','),
    ];
    rows.forEach(p => {
      lines.push(selectedKeys.map(k => csvEscape(projectValue(p, k))).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = buildFilename();
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function showDownloadModal(rows) {
    const existing = document.getElementById('db-dl-modal');
    if (existing) existing.remove();

    const saved = JSON.parse(localStorage.getItem('dbCsvFields') || 'null');
    const checked = new Set(saved || CSV_FIELDS.filter(f => f.default).map(f => f.key));

    const overlay = document.createElement('div');
    overlay.id = 'db-dl-modal';
    overlay.className = 'db-modal-overlay';
    overlay.innerHTML = `
      <div class="db-modal">
        <div class="db-modal-head">
          <div class="db-modal-title">Download CSV</div>
          <button class="db-modal-close" type="button">✕</button>
        </div>
        <div class="db-modal-sub">${rows.length} project${rows.length === 1 ? '' : 's'} · <span class="db-modal-filename">${buildFilename()}</span></div>
        <div class="db-modal-section-label">Choose columns</div>
        <div class="db-modal-fields">
          ${CSV_FIELDS.map(f => `
            <label class="db-modal-field${checked.has(f.key) ? ' on' : ''}">
              <input type="checkbox" value="${f.key}"${checked.has(f.key) ? ' checked' : ''}> ${f.label}
            </label>`).join('')}
        </div>
        <div class="db-modal-actions">
          <button class="db-modal-cancel" type="button">Cancel</button>
          <button class="db-modal-dl" type="button">Download</button>
        </div>
        <div class="db-modal-footer">
          Data shared under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>. Please credit Duke Data Center Policy Project if reused or republished. Drought data: <a href="https://droughtmonitor.unl.edu" target="_blank" rel="noopener">U.S. Drought Monitor</a> (NDMC, USDA, NOAA).
        </div>
      </div>`;

    overlay.querySelector('.db-modal-close').addEventListener('click', () => overlay.remove());
    overlay.querySelector('.db-modal-cancel').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelectorAll('.db-modal-field input').forEach(cb => {
      cb.addEventListener('change', () => {
        cb.closest('label').classList.toggle('on', cb.checked);
      });
    });

    overlay.querySelector('.db-modal-dl').addEventListener('click', () => {
      const selected = [...overlay.querySelectorAll('.db-modal-field input:checked')].map(cb => cb.value);
      if (!selected.length) return;
      localStorage.setItem('dbCsvFields', JSON.stringify(selected));
      exportCsv(rows, selected);
      overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  // External hooks
  window.dbOpenProject = function (id) {
    dbNavTo(id);
  };
  window.dbGoHome = function (query) {
    applyQueryToState(query);
    dbState.detailId = null;
    render();
  };
  // Called by the page router when the hash is #database/<id>[?query]
  window.dbApplySubHash = function (id, query) {
    applyQueryToState(query);
    const exists = PROJECTS.some(p => p.id === id && !p.stub);
    dbState.detailId = exists ? id : null;
    render();
  };

  // ── init ───────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
