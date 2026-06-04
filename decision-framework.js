/* ══════════════════════════════════════════
   DECISION FRAMEWORK, live leverage meter
══════════════════════════════════════════ */
const DF_FACTORS = [
  { id:'resource', name:'Resource constraints',
    q:'How constrained are local infrastructure and natural resources?',
    labels:['Low constraints','Moderate constraints','Severe constraints'],
    ctx:'This combines grid and water pressure in one place. Projects move more smoothly when the local grid can absorb load without major upgrades and when water systems can support cooling demand without straining nearby users.',
    weight:0.32, polarity:'pressure'
  },
  { id:'economic', name:'Economic impact',
    q:'How strong are the local economic benefits relative to the costs?',
    labels:['Strong net local benefits','Mixed tradeoffs','Weak local payoff'],
    ctx:'The key question is not whether the project creates value in the abstract, but whether local residents see enough tax base, jobs, and infrastructure support to justify the added burden. Strong local benefits can lower political pressure.',
    weight:0.22, polarity:'benefit'
  },
  { id:'sentiment', name:'Community sentiment',
    q:'What is the current community reaction?',
    labels:['Positive or neutral','Mixed','Actively opposed'],
    ctx:'Kingsboro and Tarboro, same developer and same county, diverged because the local response diverged. Where opposition hardens early, elected officials become much less willing to approve without major concessions.',
    weight:0.20, polarity:'pressure'
  },
  { id:'land', name:'Land use compatibility',
    q:'How well does the project fit local zoning intent and surrounding land uses?',
    labels:['Strong fit','Questionable fit','Poor fit'],
    ctx:'Projects that align with the comprehensive plan, buffer residential areas, and match the site context are easier to defend. Residential adjacency and conflict with local land use plans sharply increase risk.',
    weight:0.16, polarity:'pressure'
  },
  { id:'promises', name:'Developer commitments',
    q:'How binding and specific are the developer\'s promises?',
    labels:['Written and enforceable','Partial or still vague','Minimal or nonbinding'],
    ctx:'Binding commitments on grid upgrades, water use, noise, community benefits, and mitigation matter far more than general promises. Specificity and enforceability reduce pressure because they give local officials something concrete to defend.',
    weight:0.10, polarity:'benefit'
  }
];

const DF_RESULTS = {
  1: { key:'k1', posture:'Approve',
       sub:'Conditions look relatively favorable. Approval is still strongest when it comes with enforceable protections.',
       caseNote:'This outcome sits closest to Kingsboro, where the project moved forward with limited local resistance and fewer obvious site conflicts.',
       actions:[
         'Require enforceable commitments on noise, lighting, and water use before final approval',
         'Lock in any developer-funded grid or substation upgrades in writing',
         'Tie approval to a clear construction and mitigation timeline',
         'Publish a simple public benefits summary covering jobs, tax revenue, and local infrastructure support',
         'Set up a public reporting process so commitments remain visible after approval'
       ] },
  2: { key:'k2', posture:'Conditional approval - seek protections',
       sub:'The project may be workable, but only with stronger safeguards and a clearer public case for approval.',
       caseNote:'This outcome sits closest to Tarboro, where site-specific concerns and community scrutiny made approval difficult without much stronger protections.',
       actions:[
         'Commission an independent grid and water impact review before any vote',
         'Negotiate binding conditions tied to setbacks, noise, water limits, and visual buffering',
         'Require a clearer accounting of who pays for infrastructure upgrades',
         'Phase approval so later buildout depends on meeting early mitigation benchmarks',
         'Press the developer to convert headline promises into written obligations'
       ] },
  3: { key:'k3', posture:'Pause and organize first',
       sub:'Pressure is high and the current proposal appears poorly situated or poorly justified. Slow the process before momentum hardens.',
       caseNote:'This outcome sits closest to Balico, where severe resource and land use concerns, combined with public opposition, pushed the project toward withdrawal.',
       actions:[
         'Consider a temporary pause or moratorium while impacts are studied',
         'Request independent technical review on grid load, water demand, and site compatibility',
         'Document inconsistencies between developer claims and local planning documents',
         'Build a public record around concrete local costs, not just generalized concern',
         'Engage county and state officials early so local objections translate into formal leverage'
       ] }
};

// dfState: slider values (0-100)
// polarity 'pressure': higher slider = more pressure = higher score (toward Pause)
// polarity 'benefit':  higher slider = stronger benefit = LOWER score (toward Approve)
// So for 'benefit' factors, labels[0] is best (low pressure), labels[2] is worst.
const dfState = { resource:50, economic:50, sentiment:50, land:50, promises:50 };
const dfTouched = { resource:false, economic:false, sentiment:false, land:false, promises:false };

function dfAllTouched() {
  return DF_FACTORS.every(f => dfTouched[f.id]);
}

function dfBucket(f, v) {
  // For both polarities, bucket 0=favorable, 1=mixed, 2=unfavorable
  // 'pressure': low v = favorable (bucket 0), high v = unfavorable (bucket 2)
  // 'benefit':  high v = unfavorable (bucket 2), low v = favorable (bucket 0)
  // The labels array is always [favorable, mixed, unfavorable]
  if (f.polarity === 'benefit') {
    // Invert: high slider value = bad (weak benefit)
    return v < 33 ? 0 : v < 67 ? 1 : 2;
  } else {
    // pressure: high slider = more pressure = unfavorable
    return v < 33 ? 0 : v < 67 ? 1 : 2;
  }
}

function dfScoreContribution(f, v) {
  const normalized = v / 100;
  if (f.polarity === 'benefit') {
    // Higher v = weaker benefit = more pressure → higher score
    return normalized * f.weight;
  } else {
    // Higher v = more pressure → higher score
    return normalized * f.weight;
  }
}

function dfRender() {
  const host = document.getElementById('dfFactors');
  if (!host) return;
  host.innerHTML = DF_FACTORS.map(f => `
    <div class="df-factor">
      <div class="df-factor-head">
        <div class="df-factor-title">
          <span class="df-factor-name">${f.name}</span>
          <span class="df-info-wrap">
            <span class="df-info-btn" tabindex="0" aria-label="More context about ${f.name}">i</span>
            <span class="df-ctx">${f.ctx}</span>
          </span>
        </div>
        <span class="df-factor-val hidden" id="dfVal-${f.id}"></span>
      </div>
      <div class="df-factor-q">${f.q}</div>
      <input type="range" class="df-slider" min="0" max="100" value="${dfState[f.id]}" id="dfSl-${f.id}" oninput="dfUpdate('${f.id}', this.value)">
      <div class="df-scale-row"><span>${f.labels[0]}</span><span>${f.labels[1]}</span><span>${f.labels[2]}</span></div>
    </div>`).join('');
  dfRecalc();
}

function dfUpdateVal(id, v) {
  const f = DF_FACTORS.find(x => x.id === id);
  const b = dfBucket(f, parseInt(v));
  const el = document.getElementById('dfVal-' + id);
  if (!el) return;
  el.textContent = f.labels[b];
  // Color: bucket 0 = green (v1), 1 = yellow (v2), 2 = red (v3)
  el.className = 'df-factor-val v' + (b + 1) + (dfTouched[id] ? '' : ' hidden');
}

function dfUpdate(id, v) {
  dfTouched[id] = true;
  dfState[id] = parseInt(v, 10);
  dfUpdateVal(id, v);
  dfRecalc();
}

function dfRecalc() {
  const score = Math.round(DF_FACTORS.reduce((acc, f) => acc + dfScoreContribution(f, dfState[f.id]), 0) * 100);
  const pointer = document.getElementById('dfPointer');
  const scoreEl = document.getElementById('dfScore');
  if (!pointer || !scoreEl) return;
  scoreEl.textContent = score;
  pointer.style.left = score + '%';

  const k = score < 34 ? 1 : score < 67 ? 2 : 3;
  const r = DF_RESULTS[k];

  const allDone = dfAllTouched();

  // Show/hide result panel
  const resultEl = document.getElementById('dfResult');
  if (resultEl) resultEl.classList.toggle('df-hidden', !allDone);

  // Update pending message
  const pendingEl = document.getElementById('dfPending');
  if (pendingEl) {
    if (allDone) {
      pendingEl.style.display = 'none';
    } else {
      const remaining = DF_FACTORS.filter(f => !dfTouched[f.id]).length;
      pendingEl.style.display = '';
      pendingEl.textContent = remaining === 1 ? '1 more slider to go' : `Move all ${remaining} remaining sliders to reveal results`;
    }
  }

  if (allDone) {
    document.getElementById('dfPosture').textContent = r.posture;
    document.getElementById('dfPostureSub').textContent = r.sub;
  }

  ['dfZ1','dfZ2','dfZ3'].forEach((z,i) => {
    document.getElementById(z).classList.toggle('dim', (i + 1) !== k);
  });

  const rh = document.getElementById('dfRH');
  rh.className = 'df-result-head ' + r.key;
  const rht = document.getElementById('dfRHText');
  rht.className = r.key;
  rht.textContent = r.posture;
  document.getElementById('dfCaseNote').textContent = r.caseNote;
  document.getElementById('dfActions').innerHTML = r.actions.map(a => '<li>' + a + '</li>').join('');
}

function dfReset() {
  DF_FACTORS.forEach(f => {
    dfState[f.id] = 50;
    dfTouched[f.id] = false;
    const sl = document.getElementById('dfSl-' + f.id);
    if (sl) sl.value = 50;
  });
  document.getElementById('dfPosture').textContent = 'Move the sliders to start';
  document.getElementById('dfPostureSub').textContent = 'Drag the sliders below to describe your situation. The meter updates live.';
  const pendingEl = document.getElementById('dfPending');
  if (pendingEl) { pendingEl.style.display = ''; pendingEl.textContent = 'Move all 5 sliders to reveal results'; }
  DF_FACTORS.forEach(f => dfUpdateVal(f.id, 50));
  dfRecalc();
}

dfRender();
