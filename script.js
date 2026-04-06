// ============================================
//  ЭЛИТРИЭЛТ — MAIN SCRIPT
// ============================================

// --- STATE ---
let currentPage = 'home';
let favorites = JSON.parse(localStorage.getItem('fav') || '[]');
let currentProperty = null;
let catalogPage = 1;
const ITEMS_PER_PAGE = 6;

// Filters state
let filters = { deal: 'buy', city: 'all', district: 'all', type: 'all', rooms: 'all', priceMin: '', priceMax: '', areaMin: '', areaMax: '', floorMin: '', floorMax: '', parking: false, terrace: false, metro: false, gated: false };
let currentSort = 'date';
let viewMode = 'grid';
let filteredProps = [...PROPERTIES];

// ============================================
// NAVIGATION
// ============================================
function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page-' + name);
    if (el) { el.classList.add('active'); currentPage = name; }
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.page === name);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (name === 'catalog') renderCatalog();
    if (name === 'mortgage') calcMortgage();
    if (name === 'districts') renderDistrictsPage();
}

document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', e => { e.preventDefault(); showPage(l.dataset.page); });
});

document.addEventListener('click', e => {
    const nav = e.target.closest('[data-page-nav]');
    if (nav) { e.preventDefault(); showPage(nav.dataset.pageNav); }
});

// ============================================
// TOAST
// ============================================
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// ============================================
// FAVORITES
// ============================================
function saveFav() { localStorage.setItem('fav', JSON.stringify(favorites)); }

function toggleFav(id) {
    const idx = favorites.indexOf(id);
    if (idx > -1) { favorites.splice(idx, 1); showToast('Удалено из избранного'); }
    else { favorites.push(id); showToast('Добавлено в избранное'); }
    saveFav();
    document.getElementById('favCount').textContent = favorites.length;
    document.querySelectorAll(`.pc-fav[data-id="${id}"]`).forEach(b => b.classList.toggle('active', favorites.includes(id)));
}

document.getElementById('favBtn').addEventListener('click', () => {
    filteredProps = PROPERTIES.filter(p => favorites.includes(p.id));
    if (!filteredProps.length) { showToast('В избранном пока нет объектов'); return; }
    showPage('catalog'); renderCatalog();
});

// ============================================
// FORMAT HELPERS
// ============================================
function fmtPrice(v) {
    if (v >= 1000000) return (v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1) + ' млн ₽';
    return v.toLocaleString('ru') + ' ₽';
}
function fmtNum(v) { return Number(v).toLocaleString('ru'); }

// ============================================
// PROPERTY CARD
// ============================================
function buildCard(p) {
    const isFav = favorites.includes(p.id);
    const badgesHTML = [
        p.isNew ? '<span class="pc-badge new">Новостройка</span>' : '',
        p.isHot ? '<span class="pc-badge hot">🔥 Горячее</span>' : '',
        `<span class="pc-badge">${p.districtName}</span>`
    ].join('');

    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = `
        <div class="pc-img" style="background-image:url('${p.img}')">
            <div class="pc-badges">${badgesHTML}</div>
            <button class="pc-fav ${isFav ? 'active' : ''}" data-id="${p.id}" title="В избранное">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
        </div>
        <div class="pc-body">
            <div class="pc-price">${fmtPrice(p.price)}</div>
            <div class="pc-price-m2">${fmtNum(p.priceM2)} ₽/м²</div>
            <div class="pc-title">${p.title}</div>
            <div class="pc-address">📍 ${p.address}</div>
            <div class="pc-props">
                <div class="pc-prop"><strong>${p.rooms}</strong>&nbsp;комн.</div>
                <div class="pc-prop"><strong>${p.area}</strong>&nbsp;м²</div>
                <div class="pc-prop"><strong>${p.floor}</strong>/${p.totalFloors}&nbsp;эт.</div>
                ${p.hasParking ? '<div class="pc-prop">🚗 Паркинг</div>' : ''}
                ${p.nearMetro ? '<div class="pc-prop">🚇 Метро</div>' : ''}
            </div>
        </div>
    `;

    card.querySelector('.pc-fav').addEventListener('click', e => { e.stopPropagation(); toggleFav(p.id); });
    card.addEventListener('click', () => openPropertyModal(p));
    return card;
}

// ============================================
// HOME PAGE
// ============================================
function renderHome() {
    // Hot cards (first 4)
    const grid = document.getElementById('hotCardsGrid');
    grid.innerHTML = '';
    PROPERTIES.filter(p => p.isHot).slice(0, 4).forEach(p => grid.appendChild(buildCard(p)));

    // Districts
    const dg = document.getElementById('districtsHomeGrid');
    dg.innerHTML = '';
    const allDist = [...DISTRICTS.moscow, ...DISTRICTS.spb];
    allDist.forEach(d => {
        const el = document.createElement('div');
        el.className = 'district-chip';
        el.innerHTML = `
            <div class="dc-img" style="background-image:url('${d.img}')"></div>
            <div class="dc-label">
                <div class="dc-name">${d.name}</div>
                <div class="dc-count">${d.count} объектов</div>
            </div>
        `;
        el.addEventListener('click', () => { filters.district = d.id; showPage('catalog'); });
        dg.appendChild(el);
    });

    // Newbuilds
    const ng = document.getElementById('newbuildsGrid');
    ng.innerHTML = '';
    NEWBUILDS.forEach(nb => {
        const el = document.createElement('div');
        el.className = 'nb-card';
        el.innerHTML = `
            <div class="nb-img" style="background-image:url('${nb.img}')"></div>
            <div class="nb-body">
                <div class="nb-badge">${nb.badge}</div>
                <div class="nb-name">${nb.name}</div>
                <div class="nb-price">от ${fmtPrice(nb.priceFrom)}</div>
                <div class="nb-detail">${nb.district} • ${nb.detail}</div>
            </div>
        `;
        el.addEventListener('click', () => { filters.deal = 'new'; showPage('catalog'); });
        ng.appendChild(el);
    });

    document.getElementById('favCount').textContent = favorites.length;
}

// ============================================
// HERO SEARCH
// ============================================
document.querySelectorAll('.s-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.s-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

document.querySelectorAll('.room-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.room-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

document.getElementById('heroSearchBtn').addEventListener('click', () => {
    const city = document.getElementById('heroCity').value === 'Москва' ? 'moscow' : 'spb';
    const priceMax = document.getElementById('heroPrice').value;
    const activeRooms = document.querySelector('.room-btn.active')?.dataset.rooms || 'any';
    const activeTab = document.querySelector('.s-tab.active')?.dataset.type || 'buy';

    filters = { ...filters, city, deal: activeTab, rooms: activeRooms === 'any' ? 'all' : activeRooms, priceMax };
    filteredProps = applyFiltersToData();
    showPage('catalog');
});

// ============================================
// CATALOG
// ============================================
function populateDistrictFilter() {
    const sel = document.getElementById('filterDistrict');
    sel.innerHTML = '<option value="all">Все районы</option>';
    const cityVal = document.getElementById('filterCity').value;
    const list = cityVal === 'moscow' ? DISTRICTS.moscow : cityVal === 'spb' ? DISTRICTS.spb : [...DISTRICTS.moscow, ...DISTRICTS.spb];
    list.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id; opt.textContent = d.name;
        sel.appendChild(opt);
    });
}

document.getElementById('filterCity').addEventListener('change', populateDistrictFilter);
populateDistrictFilter();

document.querySelectorAll('.rf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.rf-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filters.rooms = btn.dataset.r;
    });
});

document.querySelectorAll('input[name="deal"]').forEach(r => {
    r.addEventListener('change', () => { filters.deal = r.value; });
});

document.getElementById('applyFilters').addEventListener('click', () => {
    filters.city = document.getElementById('filterCity').value;
    filters.district = document.getElementById('filterDistrict').value;
    filters.type = document.getElementById('filterPropertyType').value;
    filters.priceMin = document.getElementById('priceMin').value;
    filters.priceMax = document.getElementById('priceMax').value;
    filters.areaMin = document.getElementById('areaMin').value;
    filters.areaMax = document.getElementById('areaMax').value;
    filters.floorMin = document.getElementById('floorMin').value;
    filters.floorMax = document.getElementById('floorMax').value;
    filters.parking = document.getElementById('fHasParking').checked;
    filters.terrace = document.getElementById('fHasTerrace').checked;
    filters.metro = document.getElementById('fNearMetro').checked;
    filters.gated = document.getElementById('fGated').checked;
    filteredProps = applyFiltersToData();
    catalogPage = 1;
    renderCatalog();
});

document.getElementById('resetFilters').addEventListener('click', () => {
    filters = { deal: 'buy', city: 'all', district: 'all', type: 'all', rooms: 'all', priceMin: '', priceMax: '', areaMin: '', areaMax: '', floorMin: '', floorMax: '', parking: false, terrace: false, metro: false, gated: false };
    document.querySelectorAll('input[name="deal"]')[0].checked = true;
    document.getElementById('filterCity').value = 'all';
    document.getElementById('filterDistrict').value = 'all';
    document.getElementById('filterPropertyType').value = 'all';
    ['priceMin','priceMax','areaMin','areaMax','floorMin','floorMax'].forEach(id => document.getElementById(id).value = '');
    ['fHasParking','fHasTerrace','fNearMetro','fGated'].forEach(id => document.getElementById(id).checked = false);
    document.querySelectorAll('.rf-btn').forEach(b => b.classList.toggle('active', b.dataset.r === 'all'));
    filteredProps = [...PROPERTIES]; catalogPage = 1; renderCatalog();
});

function applyFiltersToData() {
    return PROPERTIES.filter(p => {
        if (filters.deal !== 'all' && p.deal !== filters.deal && !(filters.deal === 'new' && p.isNew)) return false;
        if (filters.city !== 'all' && p.city !== filters.city) return false;
        if (filters.district !== 'all' && p.district !== filters.district) return false;
        if (filters.type !== 'all' && p.type !== filters.type) return false;
        if (filters.rooms !== 'all') {
            const r = parseInt(filters.rooms);
            if (r === 4 && p.rooms < 4) return false;
            if (r < 4 && p.rooms !== r) return false;
        }
        if (filters.priceMin && p.price < Number(filters.priceMin)) return false;
        if (filters.priceMax && p.price > Number(filters.priceMax)) return false;
        if (filters.areaMin && p.area < Number(filters.areaMin)) return false;
        if (filters.areaMax && p.area > Number(filters.areaMax)) return false;
        if (filters.floorMin && p.floor < Number(filters.floorMin)) return false;
        if (filters.floorMax && p.floor > Number(filters.floorMax)) return false;
        if (filters.parking && !p.hasParking) return false;
        if (filters.terrace && !p.hasTerrace) return false;
        if (filters.metro && !p.nearMetro) return false;
        if (filters.gated && !p.isGated) return false;
        return true;
    });
}

function sortProps(arr) {
    const sorted = [...arr];
    if (currentSort === 'price-asc') sorted.sort((a,b) => a.price - b.price);
    else if (currentSort === 'price-desc') sorted.sort((a,b) => b.price - a.price);
    else if (currentSort === 'area-desc') sorted.sort((a,b) => b.area - a.area);
    else sorted.sort((a,b) => b.id - a.id);
    return sorted;
}

function renderCatalog() {
    const sorted = sortProps(filteredProps);
    const total = sorted.length;
    const pages = Math.ceil(total / ITEMS_PER_PAGE);
    const start = (catalogPage - 1) * ITEMS_PER_PAGE;
    const slice = sorted.slice(start, start + ITEMS_PER_PAGE);

    document.getElementById('catalogCount').textContent = `Найдено ${total} объектов`;

    const results = document.getElementById('catalogResults');
    results.innerHTML = '';
    results.className = 'catalog-results' + (viewMode === 'list' ? ' list-view' : '');
    if (!slice.length) {
        results.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#999"><h3>Объекты не найдены</h3><p>Попробуйте изменить параметры фильтра</p></div>';
    } else {
        slice.forEach(p => results.appendChild(buildCard(p)));
    }

    // Pagination
    const pg = document.getElementById('pagination');
    pg.innerHTML = '';
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.className = 'pg-btn' + (i === catalogPage ? ' active' : '');
        btn.textContent = i;
        btn.addEventListener('click', () => { catalogPage = i; renderCatalog(); window.scrollTo({top: 64, behavior: 'smooth'}); });
        pg.appendChild(btn);
    }
}

document.getElementById('sortSelect').addEventListener('change', e => { currentSort = e.target.value; catalogPage = 1; renderCatalog(); });

document.getElementById('viewGrid').addEventListener('click', () => {
    viewMode = 'grid';
    document.getElementById('viewGrid').classList.add('active');
    document.getElementById('viewList').classList.remove('active');
    renderCatalog();
});
document.getElementById('viewList').addEventListener('click', () => {
    viewMode = 'list';
    document.getElementById('viewList').classList.add('active');
    document.getElementById('viewGrid').classList.remove('active');
    renderCatalog();
});

// ============================================
// PROPERTY MODAL
// ============================================
function openPropertyModal(p) {
    currentProperty = p;
    document.getElementById('pmGallery').style.backgroundImage = `url('${p.img}')`;
    document.getElementById('pmBadge').textContent = p.isNew ? 'Новостройка' : (p.isHot ? '🔥 Горячее предложение' : 'Вторичный рынок');
    document.getElementById('pmTitle').textContent = p.title;
    document.getElementById('pmAddress').textContent = '📍 ' + p.address;
    document.getElementById('pmPrice').textContent = fmtPrice(p.price);
    document.getElementById('pmAgent').textContent = p.agent;

    document.getElementById('pmSpecs').innerHTML = `
        <div class="pm-spec"><strong>${p.rooms}</strong><span>Комнат</span></div>
        <div class="pm-spec"><strong>${p.area} м²</strong><span>Площадь</span></div>
        <div class="pm-spec"><strong>${p.floor}/${p.totalFloors}</strong><span>Этаж</span></div>
        <div class="pm-spec"><strong>${fmtNum(p.priceM2)} ₽</strong><span>за м²</span></div>
        <div class="pm-spec"><strong>${p.city === 'moscow' ? 'Москва' : 'СПб'}</strong><span>Город</span></div>
    `;

    document.getElementById('pmDesc').textContent = p.desc;
    document.getElementById('pmFeatures').innerHTML = p.features.map(f => `<span class="pm-feat">${f}</span>`).join('');

    const monthly = calcMonthlyPaymentRaw(p.price * 0.8, 10.5, 15);
    document.getElementById('pmMortgageHint').innerHTML = `💳 При ипотеке с взносом 20%:<br>~<strong>${fmtPrice(monthly)}</strong>/месяц (ставка 10.5%, 15 лет)`;

    const favBtn = document.getElementById('pmFavBtn');
    favBtn.onclick = () => { toggleFav(p.id); favBtn.innerHTML = favorites.includes(p.id)
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> В избранном'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> В избранное';
    };

    document.getElementById('pmCallBtn').onclick = () => showToast('📞 Звонок... +7 (800) 555-35-35');
    document.getElementById('pmBookBtn').onclick = () => openViewingModal(p);

    document.getElementById('propertyModal').classList.add('open');
    document.body.style.overflow = 'hidden';
}

document.getElementById('pmClose').addEventListener('click', closePropertyModal);
document.getElementById('propertyModal').addEventListener('click', e => { if (e.target === document.getElementById('propertyModal')) closePropertyModal(); });

function closePropertyModal() {
    document.getElementById('propertyModal').classList.remove('open');
    document.body.style.overflow = '';
}

// ============================================
// VIEWING MODAL
// ============================================
function openViewingModal(p) {
    document.getElementById('vmPropName').textContent = p.title + ', ' + p.address;
    document.getElementById('viewingForm').reset();
    document.getElementById('vmSuccess').classList.remove('show');
    document.getElementById('viewingModal').classList.add('open');
}

document.getElementById('vmClose').addEventListener('click', () => document.getElementById('viewingModal').classList.remove('open'));
document.getElementById('viewingModal').addEventListener('click', e => { if (e.target === document.getElementById('viewingModal')) document.getElementById('viewingModal').classList.remove('open'); });

document.getElementById('viewingForm').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('vmSuccess').classList.add('show');
    setTimeout(() => { document.getElementById('viewingModal').classList.remove('open'); }, 2000);
});

// ============================================
// MORTGAGE MODAL (from button)
// ============================================
document.getElementById('applyMortgageBtn').addEventListener('click', () => {
    document.getElementById('mortgageForm').reset();
    document.getElementById('mmSuccess').classList.remove('show');
    document.getElementById('mortgageModal').classList.add('open');
});
document.getElementById('mmClose').addEventListener('click', () => document.getElementById('mortgageModal').classList.remove('open'));
document.getElementById('mortgageModal').addEventListener('click', e => { if (e.target === document.getElementById('mortgageModal')) document.getElementById('mortgageModal').classList.remove('open'); });
document.getElementById('mortgageForm').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('mmSuccess').classList.add('show');
});

// ============================================
// MORTGAGE CALCULATOR
// ============================================
function calcMonthlyPaymentRaw(principal, ratePercent, termYears) {
    const r = ratePercent / 100 / 12;
    const n = termYears * 12;
    if (r === 0) return principal / n;
    return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

function calcMortgage() {
    const cost = Number(document.getElementById('propCost').value);
    const dp = Number(document.getElementById('downPayment').value) / 100;
    const rate = Number(document.getElementById('rate').value);
    const term = Number(document.getElementById('term').value);

    const downAmt = Math.round(cost * dp);
    const loan = cost - downAmt;
    const monthly = calcMonthlyPaymentRaw(loan, rate, term);
    const totalPay = monthly * term * 12;
    const overPay = totalPay - loan;

    document.getElementById('downPaymentVal').textContent = `${Math.round(dp*100)}% — ${fmtPrice(downAmt)}`;
    document.getElementById('propCostVal').textContent = fmtPrice(cost);
    document.getElementById('rateVal').textContent = rate.toFixed(1) + '%';
    document.getElementById('termVal').textContent = term + ' лет';
    document.getElementById('monthlyPayment').textContent = fmtPrice(Math.round(monthly));
    document.getElementById('loanAmount').textContent = fmtPrice(loan);
    document.getElementById('overpayment').textContent = fmtPrice(Math.round(overPay));
    document.getElementById('totalPay').textContent = fmtPrice(Math.round(totalPay));

    drawDoughnut(loan, overPay);
}

['propCost','downPayment','rate','term'].forEach(id => {
    document.getElementById(id).addEventListener('input', calcMortgage);
});

document.querySelectorAll('.bank-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.bank-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('rate').value = btn.dataset.rate;
        document.getElementById('selectedBank').textContent = btn.dataset.bank;
        calcMortgage();
    });
});

// ============================================
// DOUGHNUT CHART (canvas, no library)
// ============================================
function drawDoughnut(principal, overpay) {
    const canvas = document.getElementById('mortgageChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const total = principal + overpay;
    const ratio = principal / total;
    const cx = 100, cy = 100, r = 80, lineW = 30;

    ctx.clearRect(0, 0, 200, 200);

    // Overpay
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + (1-ratio)*2*Math.PI);
    ctx.strokeStyle = '#FBBC04';
    ctx.lineWidth = lineW;
    ctx.stroke();

    // Principal
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI/2 + (1-ratio)*2*Math.PI, -Math.PI/2 + 2*Math.PI);
    ctx.strokeStyle = '#D93025';
    ctx.lineWidth = lineW;
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#2d2d2d';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(ratio*100) + '%', cx, cy - 6);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('основной долг', cx, cy + 10);
}

// ============================================
// DISTRICTS PAGE
// ============================================
function renderDistrictsPage() {
    const grid = document.getElementById('districtsPageGrid');
    grid.innerHTML = '';
    const all = [...DISTRICTS.moscow, ...DISTRICTS.spb];
    all.forEach(d => {
        const city = DISTRICTS.moscow.includes(d) ? 'Москва' : 'Санкт-Петербург';
        const avgM = Math.round(d.avg / 1000000);
        const el = document.createElement('div');
        el.className = 'dp-card';
        el.innerHTML = `
            <div class="dp-img" style="background-image:url('${d.img}')">
                <div class="dp-img-label">
                    <strong>${d.name}</strong>
                    <span>${city}</span>
                </div>
            </div>
            <div class="dp-body">
                <p>${d.desc}</p>
                <div class="dp-stats">
                    <div class="dp-stat"><strong>${d.count}</strong><span>объектов</span></div>
                    <div class="dp-stat"><strong>от ${avgM} млн</strong><span>средняя цена</span></div>
                </div>
            </div>
        `;
        el.addEventListener('click', () => { filters.district = d.id; showPage('catalog'); });
        grid.appendChild(el);
    });
}

// ============================================
// CONTACT FORM (about page)
// ============================================
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('cfSuccess').classList.add('show');
    e.target.reset();
});

// ============================================
// POST AD BUTTON
// ============================================
document.getElementById('postAdBtn').addEventListener('click', () => {
    showPage('about');
    setTimeout(() => {
        document.getElementById('about-contacts')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
});

// ============================================
// INIT
// ============================================
renderHome();
filteredProps = [...PROPERTIES];
