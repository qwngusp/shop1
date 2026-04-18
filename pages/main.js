// ===== MAIN PAGE =====

const MainPage = (() => {
  let products = [];

  const COUPONS = [
    { id: 'C001', label: '5%', name: '첫 구매 환영 쿠폰', desc: '전 상품 5% 할인', expire: '2026.12.31', minOrder: '제한없음', downloaded: false },
    { id: 'C002', label: '3,000원', name: '3만원 이상 구매 쿠폰', desc: '3만원 이상 구매 시 3,000원 할인', expire: '2026.12.31', minOrder: '30,000원 이상', downloaded: false },
    { id: 'C003', label: '10%', name: '건강기능식품 특별 쿠폰', desc: '건강기능식품 10% 할인', expire: '2026.06.30', minOrder: '20,000원 이상', downloaded: false },
  ];

  const getDownloadedIds = () => {
    try { return JSON.parse(sessionStorage.getItem('downloaded_coupons') || '[]'); } catch { return []; }
  };

  const saveDownloaded = (id) => {
    const ids = getDownloadedIds();
    if (!ids.includes(id)) { ids.push(id); sessionStorage.setItem('downloaded_coupons', JSON.stringify(ids)); }
  };

  const init = async () => {
    if (products.length === 0) {
      try {
        const res = await fetch('data/products.json');
        products = await res.json();
      } catch(e) { products = []; }
    }

    render();
    Router.updateCartBadge();
  };

  const render = () => {
    const page = document.getElementById('page-main');
    const hot = products.filter(p => p.discountRate >= 38).slice(0, 4);
    const today = products.slice(10, 14);
    const downloaded = getDownloadedIds();

    page.innerHTML = `
      <!-- 헤더 -->
      <div class="main-header">
        <span class="main-header__logo">ShopLab</span>
        <button class="header__action" onclick="Router.navigate('cart')" style="margin-left:auto;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/><line x1="3" y1="6" x2="21" y2="6" stroke="#111" stroke-width="1.8"/><path d="M16 10a4 4 0 01-8 0" stroke="#111" stroke-width="1.8"/></svg>
          <span class="badge" id="cart-badge" style="display:none;">0</span>
        </button>
      </div>

      <!-- 검색바 -->
      <div class="main-search" onclick="Router.navigate('list')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#999" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#999" stroke-width="2" stroke-linecap="round"/></svg>
        <span class="main-search__placeholder">검색</span>
      </div>

      <!-- 탭 네비 -->
      <div class="main-tabs">
        <button class="main-tab" onclick="Router.navigate('list')">
          <span class="main-tab__icon">♡</span>
          <span>즐겨찾기</span>
        </button>
        <button class="main-tab" onclick="Router.navigate('list')">
          <span class="main-tab__icon">🕐</span>
          <span>기록</span>
        </button>
        <button class="main-tab" onclick="Router.navigate('list')">
          <span class="main-tab__icon">👤</span>
          <span>팔로잉</span>
        </button>
        <button class="main-tab" onclick="Router.navigate('list')">
          <span class="main-tab__icon">📋</span>
          <span>주문</span>
        </button>
      </div>

      <!-- 쿠폰 배너 -->
      <div class="coupon-banner" id="coupon-banner-btn">
        <div class="coupon-banner__inner">
          <div class="coupon-banner__gift">🎁</div>
          <div class="coupon-banner__text">
            <p class="coupon-banner__title">쿠폰이 도착했습니다!</p>
            <p class="coupon-banner__amount">최대 <strong>-16,000원</strong></p>
          </div>
          <div class="coupon-banner__cta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 15l-7-7M12 15l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            쿠폰받기
          </div>
        </div>
        <div class="coupon-banner__dots">
          <span class="dot active"></span><span class="dot"></span><span class="dot"></span>
        </div>
      </div>

      <!-- 인기 상품 섹션 -->
      <div class="main-section">
        <div class="main-section__header">
          <span class="main-section__title">지금 제일 잘 나가는 상품</span>
          <button class="main-section__more" onclick="Router.navigate('list')">›</button>
        </div>
        <div class="main-hot-scroll">
          ${hot.map(p => `
            <div class="main-hot-card" data-id="${p.id}">
              <div class="main-hot-card__img">
                <img src="${p.image}" alt="${p.name}"
                  onerror="this.parentNode.style.background='#f0f0f0';this.style.display='none';" />
              </div>
              <p class="main-hot-card__discount">${p.discountRate}%</p>
              <p class="main-hot-card__price">${p.discountedPrice.toLocaleString()}원</p>
              <p class="main-hot-card__name">${p.name.slice(0,10)}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 기획전 섹션 -->
      <div class="main-section">
        <div class="main-section__header">
          <span class="main-section__title">기획전</span>
          <button class="main-section__more" onclick="Router.navigate('list')">›</button>
        </div>
        <div class="main-banner-grid">
          <div class="main-banner-card main-banner-card--left" onclick="Router.navigate('list')">
            <div class="main-banner-card__bg" style="background:linear-gradient(135deg,#e8f4e8,#c8e6c9);"></div>
            <p class="main-banner-card__sub">지금 가장 핫한</p>
            <p class="main-banner-card__title">라이트한 불철<br>식단관리</p>
          </div>
          <div class="main-banner-card main-banner-card--right" onclick="Router.navigate('list')">
            <div class="main-banner-card__bg" style="background:linear-gradient(135deg,#f5f5f0,#e8e8e0);"></div>
            <p class="main-banner-card__sub">지더라도 상쾌한</p>
            <p class="main-banner-card__title">센토 치약</p>
          </div>
        </div>
      </div>

      <!-- 오늘의 특가 섹션 -->
      <div class="main-section" style="padding-bottom:24px;">
        <div class="main-section__header">
          <span class="main-section__title">오늘의 특가</span>
          <button class="main-section__more" onclick="Router.navigate('list')">›</button>
        </div>
        <div class="main-hot-scroll">
          ${today.map(p => `
            <div class="main-hot-card" data-id="${p.id}">
              <div class="main-hot-card__img">
                <img src="${p.image}" alt="${p.name}"
                  onerror="this.parentNode.style.background='#f0f0f0';this.style.display='none';" />
              </div>
              <p class="main-hot-card__discount">${p.discountRate}%</p>
              <p class="main-hot-card__price">${p.discountedPrice.toLocaleString()}원</p>
              <p class="main-hot-card__name">${p.name.slice(0,10)}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 쿠폰 바텀시트 오버레이 -->
      <div class="overlay" id="main-overlay" onclick="MainPage.closeCouponSheet()"></div>

      <!-- 쿠폰 바텀시트 -->
      <div class="bottom-sheet" id="main-coupon-sheet">
        <div class="bottom-sheet__handle"></div>
        <div class="coupon-sheet-header">
          <div>
            <h3>받을 수 있는 쿠폰</h3>
            <p style="font-size:13px;color:#999;margin-top:2px;">총 ${COUPONS.length}장</p>
          </div>
          <button onclick="MainPage.closeCouponSheet()" style="font-size:22px;color:#999;width:36px;height:36px;">✕</button>
        </div>
        <div class="coupon-download-list" id="main-coupon-list">
          ${COUPONS.map(c => {
            const isDl = downloaded.includes(c.id);
            return `
            <div class="coupon-dl-item">
              <div class="coupon-dl-item__left">
                <span class="coupon-dl-item__amount">${c.label} 할인</span>
                <span class="coupon-dl-item__name">${c.name}</span>
                <span class="coupon-dl-item__desc">${c.desc}</span>
                <span class="coupon-dl-item__expire">유효기간 ~${c.expire} · 최소주문 ${c.minOrder}</span>
              </div>
              <button class="coupon-dl-btn ${isDl ? 'downloaded' : ''}"
                onclick="MainPage.downloadCoupon('${c.id}')"
                id="main-coupon-btn-${c.id}">
                ${isDl ? '다운완료' : '받기'}
              </button>
            </div>`;
          }).join('')}
        </div>
        <div style="padding:16px;">
          <button class="btn btn-primary" onclick="MainPage.closeCouponSheet()">확인</button>
        </div>
      </div>
    `;

    // 이벤트 바인딩
    document.getElementById('coupon-banner-btn').addEventListener('click', openCouponSheet);

    // 상품 카드 클릭
    page.querySelectorAll('.main-hot-card[data-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        Logger.logClick(id);
        Router.navigate('detail', { id });
      });
    });
  };

  const openCouponSheet = () => {
    document.getElementById('main-overlay').classList.add('show');
    document.getElementById('main-coupon-sheet').classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeCouponSheet = () => {
    document.getElementById('main-overlay').classList.remove('show');
    document.getElementById('main-coupon-sheet').classList.remove('show');
    document.body.style.overflow = '';
  };

  const downloadCoupon = (couponId) => {
    const ids = getDownloadedIds();
    if (ids.includes(couponId)) return;

    saveDownloaded(couponId);

    // 쿠폰 state에도 저장 (마지막 받은 걸 적용)
    const coupon = COUPONS.find(c => c.id === couponId);
    if (coupon) State.applyCoupon({ ...coupon, label: coupon.label + ' 할인' });

    const btn = document.getElementById(`main-coupon-btn-${couponId}`);
    if (btn) {
      btn.textContent = '다운완료';
      btn.classList.add('downloaded');
    }
    Utils.showToast(`${coupon?.label} 할인 쿠폰을 받았습니다! 🎉`);
  };

  const getCoupons = () => COUPONS;

  return { init, closeCouponSheet, downloadCoupon, getCoupons };
})();
