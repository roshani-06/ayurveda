let ALL_REMEDIES = [];

if (typeof flaskRemedies !== 'undefined' && flaskRemedies.length > 0) {
  const iconMap = {
    digestion: '🫁',
    diabetes: '🩸',
    stress: '🧠',
    skin: '✨',
    respiratory: '🌬️',
    joints: '🦴',
    immunity: '🛡️',
    heart: '❤️'
  };
  const iconClassMap = {
    digestion: 'ic-a',
    diabetes: 'ic-g',
    stress: 'ic-t',
    skin: 'ic-b',
    respiratory: 'ic-g',
    joints: 'ic-a',
    immunity: 'ic-t',
    heart: 'ic-p'
  };
  const tagClassMap = {
    digestion: 'rt-a',
    diabetes: 'rt-g',
    stress: 'rt-t',
    skin: 'rt-b',
    respiratory: 'rt-g',
    joints: 'rt-a',
    immunity: 'rt-t',
    heart: 'rt-p'
  };
  ALL_REMEDIES = flaskRemedies.map(r => ({
    id: r.id,
    disease: r.disease,
    herb: r.herb_name,
    icon: iconMap[r.category] || '🌿',
    iconClass: iconClassMap[r.category] || 'ic-a',
    category: r.category,
    dosha: r.dosha_type,
    difficulty: r.difficulty,
    desc: r.preparation || r.title,
    tags: [r.category, r.dosha_type],
    tagClass: tagClassMap[r.category] || 'rt-a',
    time: r.prep_time_min + ' min'
  }));}

let currentCategory = 'all';
let searchQuery = '';
let selectedDoshas = [];
let selectedDiff = null;
let sortMode = 'default';
let visibleCount = 12;

function getFilteredRemedies() {
  let list = [...ALL_REMEDIES];
  if (currentCategory !== 'all') list = list.filter(r => r.category === currentCategory);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(r =>
      r.disease.toLowerCase().includes(q) ||
      r.herb.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (selectedDoshas.length) list = list.filter(r => selectedDoshas.includes(r.dosha) || r.dosha === 'all');
  if (selectedDiff) list = list.filter(r => r.difficulty === selectedDiff);
  if (sortMode === 'name') list.sort((a,b) => a.disease.localeCompare(b.disease));
  if (sortMode === 'easy') {
    const order = {easy:0,moderate:1,advanced:2};
    list.sort((a,b) => order[a.difficulty] - order[b.difficulty]);
  }
  return list;
}

function diffClass(d) {
  return d === 'easy' ? 'di-easy' : d === 'moderate' ? 'di-moderate' : 'di-advanced';
}
function doshaClass(d) {
  return d === 'vata' ? 'db-v' : d === 'pitta' ? 'db-p' : d === 'kapha' ? 'db-k' : 'db-a';
}
function doshaLabel(d) {
  return d === 'vata' ? '🍃 Vata' : d === 'pitta' ? '🔥 Pitta' : d === 'kapha' ? '💧 Kapha' : '✨ All Doshas';
}
function stars(r) {
  const full = Math.floor(r), half = (r % 1 >= 0.5) ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

function renderRemedies() {
  const list = getFilteredRemedies();
  const grid = document.getElementById('remedies-grid');
  const toShow = list.slice(0, visibleCount);
  document.getElementById('result-count').innerHTML = `<strong>${list.length}</strong> remedies found`;
  document.getElementById('load-more-wrap').style.display = list.length > visibleCount ? 'block' : 'none';

  if (!list.length) {
    grid.innerHTML = `<div class="no-results">
      <div class="no-results-icon">🌿</div>
      <h3>No remedies found</h3>
      <p>Try a different search term or clear some filters.</p>
    </div>`;
    return;
  }

  grid.innerHTML = toShow.map((r, i) => `
    <div class="remedy-card" style="animation-delay:${i * 0.04}s">
      <div class="remedy-card-top">
        <div class="remedy-icon-wrap ${r.iconClass}">${r.icon}</div>
        <div class="remedy-title-area">
          <div class="remedy-disease">${r.disease}</div>
          <div class="remedy-herb">${r.herb}</div>
        </div>
        </div>
      <div class="remedy-body">
        <div class="remedy-desc">${r.desc}</div>
        <div class="remedy-tags">${r.tags.map(t => `<span class="rtag ${r.tagClass}">${t}</span>`).join('')}</div>
        <div class="remedy-meta">
          <span class="meta-dot"></span>
          <span class="meta-dot"></span>
          <span class="meta-item">⏱ ${r.time}</span>
        </div>
      </div>
      <div class="remedy-footer">
        <div style="display:flex;gap:6px;align-items:center">
          <span class="dosha-badge ${doshaClass(r.dosha)}">${doshaLabel(r.dosha)}</span>
          <span class="diff-indicator ${diffClass(r.difficulty)}">${r.difficulty}</span>
        </div>
        <button class="view-btn" onclick="openRemedy(${r.id})">View remedy →</button>
      </div>
    </div>
  `).join('');

  renderActiveFilters();
}

function renderActiveFilters() {
  const wrap = document.getElementById('active-filters');
  const chips = [];
  if (currentCategory !== 'all') chips.push({label: '🗂 ' + currentCategory, key:'cat'});
  selectedDoshas.forEach(d => chips.push({label: doshaLabel(d), key:'dosha-'+d}));
  if (selectedDiff) chips.push({label: '⚡ ' + selectedDiff, key:'diff'});
  if (searchQuery) chips.push({label: '🔍 "' + searchQuery + '"', key:'search'});
  wrap.innerHTML = chips.map(c => `
    <span class="filter-chip">${c.label}
      <button onclick="removeFilter('${c.key}')">✕</button>
    </span>`).join('');
}

function removeFilter(key) {
  if (key === 'cat') { currentCategory = 'all'; document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all')); }
  else if (key.startsWith('dosha-')) { const d = key.split('-')[1]; selectedDoshas = selectedDoshas.filter(x => x !== d); document.querySelectorAll('.dosha-check input').forEach(i => { if (i.value === d) i.checked = false; }); }
  else if (key === 'diff') { selectedDiff = null; document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active')); }
  else if (key === 'search') { searchQuery = ''; document.getElementById('main-search-input').value = ''; document.getElementById('clear-btn').classList.remove('visible'); }
  renderRemedies();
}

function handleSearch(val) {
  searchQuery = val.trim();
  document.getElementById('clear-btn').classList.toggle('visible', !!searchQuery);
  visibleCount = 12;
  renderRemedies();
}

function clearSearch() {
  searchQuery = '';
  document.getElementById('main-search-input').value = '';
  document.getElementById('clear-btn').classList.remove('visible');
  renderRemedies();
}

function setCategory(el, cat) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  visibleCount = 12;
  renderRemedies();
}

function updateFilters() {
  selectedDoshas = [...document.querySelectorAll('.dosha-check input:checked')].map(i => i.value);
  visibleCount = 12;
  renderRemedies();
}

function toggleDiff(el, diff) {
  if (selectedDiff === diff) { selectedDiff = null; el.classList.remove('active'); }
  else {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    selectedDiff = diff; el.classList.add('active');
  }
  visibleCount = 12;
  renderRemedies();
}

function handleSort(val) {
  sortMode = val;
  renderRemedies();
}

function resetAllFilters() {
  currentCategory = 'all'; searchQuery = ''; selectedDoshas = []; selectedDiff = null; sortMode = 'default'; visibleCount = 12;
  document.getElementById('main-search-input').value = '';
  document.getElementById('clear-btn').classList.remove('visible');
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'all'));
  document.querySelectorAll('.dosha-check input').forEach(i => i.checked = false);
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  renderRemedies();
}

function loadMore() { visibleCount += 8; renderRemedies(); }

function openRemedy(id) {
  const r = ALL_REMEDIES.find(x => x.id === id);
  if (!r) return;

  const diffLabel  = { easy: 'Easy', moderate: 'Moderate', advanced: 'Advanced' }[r.difficulty] || r.difficulty;
  const diffColor  = { easy: '#2a7a2a', moderate: '#b07000', advanced: '#c03030' }[r.difficulty] || '#555';
  const doshaLabel = r.dosha === 'vata' ? '🍃 Vata' : r.dosha === 'pitta' ? '🔥 Pitta' : r.dosha === 'kapha' ? '💧 Kapha' : '✨ All Doshas';

  const tagsHtml = (r.tags && r.tags.length)
    ? r.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')
    : '';

  const benefitsHtml = r.benefits
    ? `<div class="modal-section">
        <div class="modal-section-title">✅ Benefits</div>
        <p>${r.benefits}</p>
       </div>`
    : '';

  const cautionHtml = r.caution
    ? `<div class="modal-section">
        <div class="modal-caution"><strong>⚠️ Caution</strong>${r.caution}</div>
       </div>`
    : '';

  document.getElementById('remedy-modal-content').innerHTML = `
    <div class="modal-header">
      <div class="modal-icon-wrap ${r.iconClass || ''}">${r.icon || '🌿'}</div>
      <div class="modal-title-area">
        <div class="modal-disease">${r.disease}</div>
        <div class="modal-herb">${r.herb}</div>
        <div class="modal-meta">
          <span style="background:#eef7ee;color:#2a6a2a;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500">${doshaLabel}</span>
          <span style="background:#f5f5f5;color:${diffColor};padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase">${diffLabel}</span>
          <span style="font-size:12px;color:#888">⏱ ${r.time || (r.prep_time_min + ' min')}</span>
        </div>
      </div>
      <button class="modal-close" onclick="closeModal()" title="Close">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-stats">
        <div class="modal-stat">
          <div class="modal-stat-val">${r.time || (r.prep_time_min + ' min')}</div>
          <div class="modal-stat-lbl">Prep Time</div>
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">📋 Preparation</div>
        <p>${r.desc || r.preparation || ''}</p>
      </div>
      ${benefitsHtml}
      ${cautionHtml}
      ${tagsHtml ? `<div class="modal-section"><div class="modal-section-title">🏷 Tags</div><div class="modal-tags">${tagsHtml}</div></div>` : ''}
    </div>
  `;

  document.getElementById('remedy-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('remedy-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on overlay background click or Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function toggleBookmark(btn, id) {
  btn.classList.toggle('saved');
  const saved = btn.classList.contains('saved');
  let bookmarks = JSON.parse(localStorage.getItem('ayur-bookmarks') || '[]');
  if (saved) bookmarks.push(id); else bookmarks = bookmarks.filter(x => x !== id);
  localStorage.setItem('ayur-bookmarks', JSON.stringify(bookmarks));
}

// Restore bookmarks from localStorage
function restoreBookmarks() {
  try {
    const bookmarks = JSON.parse(localStorage.getItem('ayur-bookmarks') || '[]');
    return bookmarks;
  } catch { return []; }
}

// Handle URL parameters for initial category
const urlParams = new URLSearchParams(window.location.search);
const cat = urlParams.get('cat');
if (cat && ['all', 'digestion', 'diabetes', 'stress', 'skin', 'respiratory', 'joints', 'immunity', 'heart'].includes(cat)) {
  currentCategory = cat;
}

renderRemedies();

// Set active category button after render
if (cat) {
  setTimeout(() => {
    const btn = document.querySelector(`[data-cat="${cat}"]`);
    if (btn) {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }, 10);
}