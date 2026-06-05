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
  function statusBadgeClass(s) {
    if (!s) return 'b-Empty';
    if (/complete/i.test(s))               return 'b-Positive';
    if (/cancel|withdraw|denied/i.test(s)) return 'b-Cancelled';
    if (/delay|scaled/i.test(s))           return 'b-Delayed';
    return 'b-Neutral';
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
    render();
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
  function chipRow(key, values, activeArr) {
    return values.map(v => {
      const on = activeArr.includes(v);
      return `<button class="db-chip-btn${on?' active':''}" data-filter="${key}" data-value="${esc(v)}">${esc(v)}</button>`;
    }).join('');
  }

  // ── browse view ────────────────────────────────────────────────────
  function renderBrowse(mount) {
    const allReal = PROJECTS.filter(p => !p.stub);
    const list    = applySort(applyFilters(PROJECTS));

    const stateOpts   = uniqueValues('state');
    const statusOpts  = uniqueValues('status');
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
        <table class="db-table">
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
          <tbody>
            ${list.length === 0
              ? `<tr><td colspan="8" class="db-empty-state">No projects match these filters.</td></tr>`
              : list.map(rowHtml).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Search input
    const searchInput = mount.querySelector('.db-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        dbState.filters.search = e.target.value;
        render();
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
      render();
    });

    // Column sort
    mount.querySelectorAll('thead th[data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.col;
        if (dbState.sort.col === col) dbState.sort.dir = dbState.sort.dir === 'asc' ? 'desc' : 'asc';
        else { dbState.sort.col = col; dbState.sort.dir = 'asc'; }
        render();
      });
    });

    // Row click → detail
    mount.querySelectorAll('tbody tr[data-id]').forEach(tr => {
      tr.addEventListener('click', () => {
        dbState.detailId = tr.dataset.id;
        render();
      });
    });
  }

  function headerCell(col, label) {
    const active = dbState.sort.col === col;
    const dir    = dbState.sort.dir;
    const ind = active
      ? `<span class="db-sort-ind active">${dir === 'asc' ? '↑' : '↓'}</span>`
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
    // Only navigate among non-stub projects
    const realProjects = PROJECTS.filter(p => !p.stub);
    const idx = realProjects.findIndex(p => p.id === dbState.detailId);
    const p   = idx >= 0 ? realProjects[idx] : null;

    if (!p) {
      mount.innerHTML = `
        <a class="db-back-link" data-action="back">← All projects</a>
        <div class="db-stub-state"><div class="db-big">Project not found</div></div>
      `;
      mount.querySelector('[data-action="back"]').addEventListener('click', () => { dbState.detailId = null; render(); });
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
            const loc = [place, p.communities ? esc(p.communities) : ''].filter(Boolean).join(' · ');
            return loc ? `<div class="db-detail-location">${loc}</div>` : '';
          })()}
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
    if (back) back.addEventListener('click', () => { dbState.detailId = null; render(); });
    const pv = mount.querySelector('[data-action="prev"]');
    if (pv && prev) pv.addEventListener('click', () => { dbState.detailId = prev.id; render(); });
    const nx = mount.querySelector('[data-action="next"]');
    if (nx && next) nx.addEventListener('click', () => { dbState.detailId = next.id; render(); });

    if (p.lat != null && p.lng != null) initLeaflet(p);
  }

  // ── MapLibre detail map (OpenFreeMap tiles) ───────────────────────
  let _activeLeaflet = null;
  function initLeaflet(p) {
    if (typeof maplibregl === 'undefined') return;
    requestAnimationFrame(() => {
      const el = document.getElementById('dbLeaflet-' + p.id);
      if (!el) return;
      if (_activeLeaflet) { try { _activeLeaflet.remove(); } catch (e) {} _activeLeaflet = null; }
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
      });
      _activeLeaflet = map;
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
      ${p.energySources ? `<div class="db-metric db-full"><div class="db-ml">Energy sources</div><div class="db-mv text">${esc(p.energySources)}</div></div>` : ''}
      ${p.monthRecorded ? `<div class="db-metric"><div class="db-ml">Month recorded</div><div class="db-mv text">${esc(p.monthRecorded)}</div></div>` : ''}
    `;

    const hasCoords = p.lat != null && p.lng != null;
    const mapId = 'dbLeaflet-' + p.id;
    const precisionLabel = p.coordsPrecision === 'parcel' ? 'Approx. parcel'
                         : p.coordsPrecision === 'town'   ? 'Town vicinity'
                         : p.coordsPrecision === 'county' ? 'County area'
                         : 'Site location';
    const mapHtml = hasCoords ? `
      <div class="db-map-col">
        <div class="db-map-box">
          <div class="db-leaflet" id="${mapId}"></div>
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
           <div class="db-timeline-rail"></div>
           ${p.timeline.map((e, i) => {
             const filled = i === p.timeline.length - 1 ? 'filled' : '';
             const src = resolveSourceUrl(e.source, p);
             return `
               <div class="db-te">
                 <div class="db-te-date">${fmtDate(e.date) || '—'}</div>
                 <div class="db-te-dot ${filled}"><div></div></div>
                 <div class="db-te-body">
                   <div class="db-te-label">${esc(e.label || 'Event')}${e.isProposal ? '<span class="db-te-proposal-tag">proposal</span>':''}</div>
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
          <div class="db-section-label">TIMELINE</div>
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

  // External hooks
  window.dbOpenProject = function (id) {
    dbState.detailId = id;
    render();
  };
  window.dbGoHome = function () {
    dbState.detailId = null;
    render();
  };

  // ── init ───────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
