/* ══════════════════════════════════════════
   MAP TAB
   - Pins visible in both full & drilled views
   - Zoom-in/out animation on drill
   - Hover pin → detail panel; click → lock selection
   - Click state (full view) → project list in sidebar
   - Click outside state (drilled view) → back to full
   - NJ/DE use abbreviations to avoid label overlap
   - Hover state label keeps highlight active
   - Smaller pins, larger project name labels
══════════════════════════════════════════ */

const MD_PIN_COLORS = {
  Positive: '#3b6d11',
  Negative: '#a32d2d',
  Neutral:  '#5f5e5a',
  Delayed:  '#854f0b',
  Planned:  '#185fa5',
  Cancelled:'#993556',
};

function mdSentimentOf(p) {
  const s = (p.status || '').toLowerCase();
  if (/cancel|withdraw/.test(s)) return 'Cancelled';
  if (/complete/.test(s))         return 'Positive';
  if (/delay|scaled/.test(s))     return 'Delayed';
  if (p.communityPosture === 'Positive') return 'Positive';
  if (p.communityPosture === 'Negative') return 'Negative';
  if (p.communityPosture === 'Neutral')  return 'Neutral';
  return 'Planned';
}

function mdFmtMoney(b) {
  if (b == null) return '—';
  if (typeof b !== 'number') return String(b);
  if (b >= 1) return '$' + b.toFixed(1) + 'B';
  const m = Math.round(b * 1000);
  return '$' + m + 'M';
}
function mdFmtMw(v) {
  if (v == null) return '—';
  if (typeof v !== 'number') return String(v);
  return v.toLocaleString() + ' MW';
}
function mdFmtAcres(v) {
  if (v == null) return '—';
  if (typeof v !== 'number') return String(v);
  return v.toLocaleString() + ' ac';
}

// ── state constants ───────────────────────────────────────────────────
const MD_FOCUS_FIPS   = new Set(['10','34','37','42','51']);
const MD_FIPS_TO_ABBR = { '10':'DE','34':'NJ','37':'NC','42':'PA','51':'VA' };
const MD_FIPS_TO_FULL = { '10':'Delaware','34':'New Jersey','37':'North Carolina','42':'Pennsylvania','51':'Virginia' };
const MD_STATE_FULL   = { DE:'Delaware', NJ:'New Jersey', NC:'North Carolina', PA:'Pennsylvania', VA:'Virginia' };

// NJ and DE use abbreviations + adjusted positions to prevent border overlap
const MD_STATE_LABELS = [
  { fips:'42', text:'Pennsylvania',   lat:41.0,  lng:-77.6,  anchor:'middle', size:18 },
  { fips:'34', text:'New Jersey',     lat:40.35, lng:-74.2,  anchor:'middle', size:13 },
  { fips:'10', text:'Delaware',       lat:39.1,  lng:-75.42, anchor:'middle', size:13 },
  { fips:'51', text:'Virginia',       lat:37.6,  lng:-78.7,  anchor:'middle', size:18 },
  { fips:'37', text:'North Carolina', lat:35.55, lng:-79.1,  anchor:'middle', size:18 },
];

const MD_W = 860, MD_H = 680;

// ── mutable state ─────────────────────────────────────────────────────
let mdSelectedId   = null;
let mdViewFips     = null;
let mdUsAtlas      = null;
let mdHoveredFips  = null;
let mdIsAnimating  = false;
let mdFullViewProj = null;
let mdFullViewPath = null;

// ── panel helpers ─────────────────────────────────────────────────────
function mdHideTooltip() {
  const tip = document.getElementById('mdTooltip');
  if (tip) tip.style.display = 'none';
}

function mdClearPinRings() {
  document.querySelectorAll('[id^="mdRing-"]').forEach(el => {
    el.setAttribute('stroke', 'none');
    el.setAttribute('stroke-width', '0');
  });
}

function mdSelectPin(id) {
  mdSelectedId = id;
  mdClearPinRings();
  const ring = document.getElementById('mdRing-' + id);
  if (ring) {
    ring.setAttribute('stroke', '#1a3a5c');
    ring.setAttribute('stroke-width', '2.5');
  }
  mdRenderDetailPanel(id);
}

function mdClearSelection() {
  mdSelectedId = null;
  mdClearPinRings();
  mdRenderEmptyPanel();
}

function mdRenderEmptyPanel() {
  const el = document.getElementById('mdDetailPanel');
  if (!el) return;
  el.className = 'md-panel md-panel-empty';
  el.innerHTML = `<div class="md-placeholder">Click a state to see its projects<br><span class="md-hint">Hover a pin for details</span></div>`;
}

function mdRenderDetailPanel(id) {
  const el = document.getElementById('mdDetailPanel');
  if (!el) return;
  const list = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : [];
  const p = list.find(x => x.id === id);
  if (!p) { mdRenderEmptyPanel(); return; }
  const sentiment = mdSentimentOf(p);
  const location = [p.county ? p.county + ' County' : null, p.state || null]
    .filter(Boolean).join(', ');
  el.className = 'md-panel md-panel-filled';
  el.innerHTML = `
    <div class="md-panel-head">
      <div class="md-panel-head-top">
        <div class="md-panel-name">${p.featured ? '✶ ' : ''}${p.name}</div>
        <button class="md-close" type="button" aria-label="Close"
          onclick="mdViewFips ? mdRenderStateProjList(mdViewFips) : mdClearSelection()">✕</button>
      </div>
      <div class="md-panel-location">${location}</div>
      ${p.company ? `<div class="md-panel-sub">${p.company}</div>` : ''}
    </div>
    <div class="md-panel-badges">
      <span class="badge b-${sentiment}">${p.status || sentiment}</span>
    </div>
    <div class="md-panel-metrics">
      <div class="md-metric"><div class="md-ml">Investment</div><div class="md-mv">${mdFmtMoney(p.investmentB)}</div></div>
      <div class="md-metric"><div class="md-ml">Capacity</div><div class="md-mv">${mdFmtMw(p.capacityMw)}</div></div>
      <div class="md-metric"><div class="md-ml">Acreage</div><div class="md-mv">${mdFmtAcres(p.acreage)}</div></div>
    </div>
    ${p.communityActionDetails ? `
      <div class="md-panel-row">
        <div class="md-panel-row-label">Community action</div>
        <div class="md-panel-row-text">${p.communityActionDetails}</div>
      </div>` : ''}
    ${p.developerAction ? `
      <div class="md-panel-row">
        <div class="md-panel-row-label">Developer action</div>
        <div class="md-panel-row-text">${p.developerAction}</div>
      </div>` : ''}
    <div class="md-panel-cta">
      <button type="button" class="md-link" onclick="mdOpenFullRecord('${p.id.replace(/'/g, "\\'")}')">
        View full record in database →
      </button>
    </div>
  `;
}

// Show list of state projects in the sidebar panel
function mdRenderStateProjList(fips) {
  const el = document.getElementById('mdDetailPanel');
  if (!el) return;
  const abbr = MD_FIPS_TO_ABBR[fips] || '';
  const stateName = MD_FIPS_TO_FULL[fips] || abbr;
  const list = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : [];
  const stateProjects = list.filter(p => p.state === abbr && p.lat != null && p.lng != null);

  if (!stateProjects.length) {
    el.className = 'md-panel md-panel-empty';
    el.innerHTML = `<div class="md-placeholder">No mapped projects for ${stateName}</div>`;
    return;
  }

  el.className = 'md-panel md-panel-filled';
  el.innerHTML = `
    <div class="md-panel-head" style="margin-bottom:10px;">
      <div class="md-panel-head-top">
        <div class="md-panel-name">${stateName} — ${stateProjects.length} project${stateProjects.length === 1 ? '' : 's'}</div>
        <button class="md-close" type="button" onclick="mdClearSelection()">✕</button>
      </div>
    </div>
    <div class="md-state-proj-list">
      ${stateProjects.map(p => {
        const s = mdSentimentOf(p);
        return `
          <div class="md-state-proj-card" onclick="mdSelectPin('${p.id.replace(/'/g,"\\'")}')">
            <div class="md-tip-name">${p.name}</div>
            ${p.county ? `<div class="md-tip-sub">${p.county} County, ${abbr}</div>` : ''}
            ${p.company ? `<div class="md-tip-sub">${p.company}</div>` : ''}
            <div class="md-tip-row">
              <span class="badge b-${s}">${p.status || s}</span>
              <span class="md-tip-stat">${mdFmtMw(p.capacityMw)}</span>
              <span class="md-tip-stat">${mdFmtMoney(p.investmentB)}</span>
            </div>
          </div>`;
      }).join('')}
    </div>
  `;
}

function mdOpenFullRecord(id) {
  if (typeof window.switchTabById === 'function') window.switchTabById('database');
  if (typeof window.dbOpenProject === 'function') window.dbOpenProject(id);
}

// ── zoom helpers ──────────────────────────────────────────────────────
function mdBuildFullViewProj(allStates) {
  const features = allStates.filter(s => MD_FOCUS_FIPS.has(String(s.id).padStart(2,'0')));
  mdFullViewProj = d3.geoMercator().fitExtent(
    [[26,26],[MD_W-26,MD_H-26]],
    { type:'FeatureCollection', features }
  );
  mdFullViewPath = d3.geoPath(mdFullViewProj);
}

function mdGetZoomTransform(fips) {
  if (!mdFullViewPath || !mdUsAtlas) return null;
  const allStates = topojson.feature(mdUsAtlas, mdUsAtlas.objects.states).features;
  const f = allStates.find(s => String(s.id).padStart(2,'0') === fips);
  if (!f) return null;
  const bounds = mdFullViewPath.bounds(f);
  const dx = bounds[1][0] - bounds[0][0];
  const dy = bounds[1][1] - bounds[0][1];
  const cx = (bounds[0][0] + bounds[1][0]) / 2;
  const cy = (bounds[0][1] + bounds[1][1]) / 2;
  const scale = Math.min((MD_W - 60) / dx, (MD_H - 60) / dy) * 0.82;
  return { scale, tx: MD_W / 2 - scale * cx, ty: MD_H / 2 - scale * cy };
}

// ── back button ───────────────────────────────────────────────────────
function mdShowBackBtn(show) {
  let btn = document.getElementById('mdMapBack');
  if (!btn) {
    const wrap = document.getElementById('mdMapWrap');
    if (!wrap) return;
    btn = document.createElement('button');
    btn.id = 'mdMapBack';
    btn.type = 'button';
    btn.textContent = '← All states';
    btn.style.cssText =
      'position:absolute;top:10px;left:12px;background:var(--surface);' +
      'color:var(--text);border:1px solid var(--border);border-radius:6px;' +
      'padding:5px 11px;font-size:12px;font-family:inherit;cursor:pointer;' +
      'box-shadow:0 1px 2px rgba(0,0,0,0.04);z-index:3;';
    btn.onclick = () => mdGoToFullView();
    wrap.appendChild(btn);
  }
  btn.style.display = show ? '' : 'none';
}

// ── drill in / back ───────────────────────────────────────────────────
function mdDrillIntoState(fips) {
  if (!MD_FOCUS_FIPS.has(fips) || mdIsAnimating) return;
  mdIsAnimating = true;
  mdSelectedId = null;
  mdClearPinRings();
  mdViewFips = fips;
  mdShowBackBtn(true);
  mdRenderMap(true);
  mdIsAnimating = false;
}

function mdGoToFullView() {
  if (mdIsAnimating) return;
  mdIsAnimating = true;
  mdViewFips = null;
  mdSelectedId = null;
  mdClearPinRings();
  mdShowBackBtn(false);
  mdRenderEmptyPanel();
  mdRenderMap(true);
  mdIsAnimating = false;
}

// ── main render ───────────────────────────────────────────────────────
function mdRenderMap(crossfade) {
  if (!mdUsAtlas) return;
  const svgEl = document.getElementById('mdMapSvg');
  if (!svgEl) return;
  const svg = d3.select(svgEl);

  // Keep old root alive during crossfade
  const oldRoot = svg.select('g.md-map-root');
  const root = svg.append('g').attr('class', 'md-map-root');
  if (crossfade) root.style('opacity', 0);

  const allStates   = topojson.feature(mdUsAtlas, mdUsAtlas.objects.states).features;
  const allCounties = topojson.feature(mdUsAtlas, mdUsAtlas.objects.counties).features;
  const focusFeatures = allStates.filter(s => MD_FOCUS_FIPS.has(String(s.id).padStart(2,'0')));

  if (!mdFullViewProj) mdBuildFullViewProj(allStates);

  // Choose projection for this view
  let targetFC;
  if (mdViewFips !== null) {
    const f = allStates.find(s => String(s.id).padStart(2,'0') === mdViewFips);
    targetFC = { type:'FeatureCollection', features: f ? [f] : [] };
  } else {
    targetFC = { type:'FeatureCollection', features: focusFeatures };
  }
  const proj = d3.geoMercator().fitExtent([[26,26],[MD_W-26,MD_H-26]], targetFC);
  const path = d3.geoPath(proj);

  if (crossfade && !oldRoot.empty()) {
    root.transition().duration(300).style('opacity', 1);
    oldRoot.transition().duration(300).style('opacity', 0)
      .on('end', function () { d3.select(this).remove(); });
  } else {
    oldRoot.remove();
  }

  // ── background states (faded) ───────────────────────────────────────
  root.append('g').attr('class','md-bg-states')
    .selectAll('path').data(allStates).join('path')
    .attr('d', path)
    .attr('fill', '#eae6dc')
    .attr('stroke', '#bdbab3')
    .attr('stroke-width', 0.5)
    .attr('pointer-events', 'none');

  if (mdViewFips !== null) {
    // ── drilled state: show counties ─────────────────────────────────
    const stateCounties = allCounties.filter(c =>
      String(c.id).padStart(5,'0').startsWith(mdViewFips)
    );
    root.selectAll('path.county').data(stateCounties).join('path')
      .attr('class','county').attr('d', path)
      .attr('fill', '#f3efe4').attr('stroke', '#a5a39a').attr('stroke-width', 0.4);

    const stateFeature = allStates.find(s => String(s.id).padStart(2,'0') === mdViewFips);
    if (stateFeature) {
      root.append('path').datum(stateFeature).attr('d', path)
        .attr('fill', 'none').attr('stroke', '#3c3c39').attr('stroke-width', 1.5)
        .attr('pointer-events', 'none');
    }

    const stateName = MD_FIPS_TO_FULL[mdViewFips] || '';
    root.append('text').attr('class','md-state-title md-state-title-stroke')
      .attr('x', MD_W / 2).attr('y', 44).attr('text-anchor','middle').text(stateName);
    root.append('text').attr('class','md-state-title')
      .attr('x', MD_W / 2).attr('y', 44).attr('text-anchor','middle').text(stateName);

    // Background click → go back
    root.insert('rect', ':first-child')
      .attr('width', MD_W).attr('height', MD_H)
      .attr('fill', 'transparent').style('cursor','default')
      .on('click', () => { if (!mdIsAnimating) mdGoToFullView(); });

  } else {
    // ── full 5-state view ─────────────────────────────────────────────

    // Shared highlight functions using fips key
    function setHighlight(fips) {
      if (mdHoveredFips === fips) return;
      mdHoveredFips = fips;
      root.selectAll('path.state')
        .attr('fill',         d => String(d.id).padStart(2,'0') === fips ? '#dde8f5' : '#f3efe4')
        .attr('stroke',       d => String(d.id).padStart(2,'0') === fips ? '#1a3a5c' : '#6f6e68')
        .attr('stroke-width', d => String(d.id).padStart(2,'0') === fips ? 1.5 : 0.9);
    }
    function clearHighlight() {
      mdHoveredFips = null;
      root.selectAll('path.state')
        .attr('fill','#f3efe4').attr('stroke','#6f6e68').attr('stroke-width', 0.9);
    }

    root.selectAll('path.state').data(focusFeatures).join('path')
      .attr('class', d => 'state fips-' + String(d.id).padStart(2,'0'))
      .attr('d', path)
      .attr('fill', '#f3efe4').attr('stroke','#6f6e68').attr('stroke-width', 0.9)
      .style('cursor','pointer')
      .on('mouseover', (e, d) => setHighlight(String(d.id).padStart(2,'0')))
      .on('mouseout',  ()      => clearHighlight())
      .on('click',     (e, d) => {
        const fips = String(d.id).padStart(2,'0');
        mdRenderStateProjList(fips);
        mdDrillIntoState(fips);
      });

    MD_STATE_LABELS.forEach(s => {
      const xy = proj([s.lng, s.lat]);
      if (!xy) return;
      root.append('text').attr('class','md-state-label')
        .attr('x', xy[0]).attr('y', xy[1])
        .attr('text-anchor', s.anchor || 'middle')
        .attr('font-size', s.size || 18)
        .attr('font-weight', 600)
        .attr('stroke', 'rgba(255,255,255,0.7)')
        .attr('stroke-width', 3)
        .attr('paint-order', 'stroke')
        .style('cursor','pointer')
        .on('mouseover', () => setHighlight(s.fips))
        .on('mouseout',  () => clearHighlight())
        .on('click',     () => {
          mdRenderStateProjList(s.fips);
          mdDrillIntoState(s.fips);
        })
        .text(s.text);
    });
  }

  // ── pins (visible in both views) ──────────────────────────────────
  const projectsList = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : [];
  let visible = projectsList.filter(p => p.lat != null && p.lng != null);
  if (mdViewFips !== null) {
    const abbr = MD_FIPS_TO_ABBR[mdViewFips];
    visible = visible.filter(p => p.state === abbr);
  }

  const drilled  = mdViewFips !== null;
  const pinR     = drilled ? 8  : 5;
  const ringR    = drilled ? 12 : 8;
  const labelFs  = 14;
  const labelLH  = 18;
  const labelPad = 8;  // gap between pin edge and label
  const labelCharW = labelFs * 0.54;
  const margin   = 6;  // min distance from SVG edge

  // Compute pin screen positions
  const pins = [];
  visible.forEach(p => {
    const xy = proj([p.lng, p.lat]);
    if (!xy) return;
    pins.push({ p, x: xy[0], y: xy[1] });
  });

  const leaderLayer = root.append('g').attr('class','md-leader-layer');

  if (drilled) {
    // ── label placement ───────────────────────────────────────────────
    // Other pins' circles are blocked zones (labels shouldn't land on them)
    const placed = [];

    function overlaps(box, others) {
      return others.some(o =>
        box.left   < o.right  && box.right  > o.left &&
        box.top    < o.bottom && box.bottom > o.top
      );
    }


    pins.forEach((pin, i) => {
      // Try both sides at each displacement level, minimising distance from pin
      // Only avoid already-placed labels (not other pin circles — offset already clears them)
      let result = null;
      const candidates = [
        ['right', 0], ['right', -labelLH], ['right', labelLH], ['right', -labelLH*2], ['right', labelLH*2],
        ['left',  0], ['left',  -labelLH], ['left',  labelLH], ['left',  -labelLH*2], ['left',  labelLH*2],
      ];
      outer: for (const [side, dy] of candidates) {
          const labelW = Math.min(220, pin.p.name.length * labelCharW + 6);
          const lx = side === 'right'
            ? pin.x + pinR + labelPad
            : pin.x - pinR - labelPad - labelW;
          if (lx < margin || lx + labelW > MD_W - margin) continue;
          const ly = pin.y + dy;
          if (ly - labelLH/2 < margin || ly + labelLH/2 > MD_H - margin) continue;
          const box = { left:lx, right:lx+labelW, top:ly-labelLH/2, bottom:ly+labelLH/2 };
          if (!overlaps(box, placed)) {
            result = { lx, ly, labelW, box };
            break outer;
          }
      }
      if (!result) {
        const labelW = Math.min(220, labelText(pin.p.name).length * labelCharW + 6);
        const lx = Math.min(pin.x + pinR + labelPad, MD_W - labelW - margin);
        result = { lx, ly: pin.y, labelW, box: { left:lx, right:lx+labelW, top:pin.y-labelLH/2, bottom:pin.y+labelLH/2 } };
      }
      placed.push(result.box);
      pin.labelX  = result.lx;
      pin.labelY  = result.ly;
      pin.labelW  = result.labelW;
      pin.flipped = result.lx < pin.x;
    });
  }

  pins.forEach(pin => {
    const { p, x, y } = pin;
    const sentiment = mdSentimentOf(p);

    if (drilled && Math.abs(pin.labelY - y) > 4) {
      const leaderLabelX = pin.flipped ? x - pinR - labelPad : pin.labelX;
      leaderLayer.append('path').attr('class','md-leader')
        .attr('d', `M ${x} ${y} L ${leaderLabelX} ${pin.labelY}`);
    }

    const g = root.append('g').attr('class','md-pin').attr('id','mdPin-' + p.id)
      .attr('transform', `translate(${x},${y})`)
      .style('cursor','pointer')
      .on('mouseenter', () => mdRenderDetailPanel(p.id))
      .on('mouseleave', () => {
        if (mdSelectedId) {
          mdRenderDetailPanel(mdSelectedId);
        } else if (mdViewFips) {
          mdRenderStateProjList(mdViewFips);
        } else {
          mdRenderEmptyPanel();
        }
      })
      .on('click', e => { e.stopPropagation(); mdSelectPin(p.id); });

    g.append('circle').attr('id','mdRing-' + p.id)
      .attr('r', ringR).attr('fill','none').attr('stroke','none');
    g.append('circle').attr('r', pinR)
      .attr('fill', MD_PIN_COLORS[sentiment] || '#5f5e5a')
      .attr('stroke','#fff').attr('stroke-width', drilled ? 2 : 1.5);

    // Restore ring if this pin was selected before re-render
    if (mdSelectedId === p.id) {
      g.select('#mdRing-' + p.id)
        .attr('stroke','#1a3a5c').attr('stroke-width','2.5');
    }

    if (drilled) {
      // For flipped (left-side) labels use text-anchor:end so text grows leftward, never encroaching on the pin
      const textAnchor = pin.flipped ? 'end' : 'start';
      const textX = pin.flipped ? pin.x - pinR - labelPad : pin.labelX;
      root.append('text').attr('class','md-pin-label')
        .attr('x', textX).attr('y', pin.labelY + 5)
        .attr('text-anchor', textAnchor)
        .attr('font-size', labelFs).attr('font-weight', 500)
        .attr('font-family','inherit').attr('fill','#1a1a18')
        .attr('stroke','#ffffff').attr('stroke-width', 4)
        .attr('paint-order','stroke')
        .style('cursor','pointer')
        .on('mouseenter', () => mdRenderDetailPanel(p.id))
        .on('mouseleave', () => {
          if (mdSelectedId) {
            mdRenderDetailPanel(mdSelectedId);
          } else if (mdViewFips) {
            mdRenderStateProjList(mdViewFips);
          } else {
            mdRenderEmptyPanel();
          }
        })
        .on('click', e => { e.stopPropagation(); mdSelectPin(p.id); })
        .text(p.name);
    }
  });
}

// ── load topology, then render ────────────────────────────────────────
d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json').then(us => {
  mdUsAtlas = us;
  mdShowBackBtn(false);
  mdRenderMap(false);
});

mdRenderEmptyPanel();
