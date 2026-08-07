/* ==========================================
   AURA LUXE Parfums — Interactive JS Engine
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Product Database ---
  const products = [
    {
      id: 'elixir-nuit',
      title: 'Élixir Nuit',
      price: 16500,
      category: 'oriental',
      categoryLabel: 'ORIENTAL & WARM',
      rating: '4.9 ★ (142 reviews)',
      image: './images/elixir_nuit.png',
      description: 'A regal evening elixir that drapes your skin in Kashmir saffron, pure rose attar and warm Mysore sandalwood. Unapologetic Indian luxury in a single drop.',
      topNotes: ['Kashmir Saffron', 'Pink Pepper', 'Bergamot Zest'],
      heartNotes: ['Kannauj Rose Attar', 'Jasmine Sambac', 'Orris Butter'],
      baseNotes: ['Mysore Sandalwood', 'Ambergris', 'Madagascar Vanilla'],
      longevity: '12+ Hours',
      sillage: 92
    },
    {
      id: 'fleur-soie',
      title: 'Fleur de Soie',
      price: 14999,
      category: 'floral',
      categoryLabel: 'FLORAL CHYPRES',
      rating: '4.8 ★ (98 reviews)',
      image: './images/fleur_soie.png',
      description: 'An ethereal tapestry of Kannauj silk jasmine, Rajasthan May rose, and Kashmiri musk. Soft as a Banarasi silk sari resting on warm skin.',
      topNotes: ['Alphonso Mango Blossom', 'Neroli Essence', 'Mandarin Blossom'],
      heartNotes: ['Kannauj Silk Jasmine', 'Rajasthan Rose de Mai', 'Peony Accord'],
      baseNotes: ['Kashmiri White Musk', 'Sandalwood', 'Golden Amber'],
      longevity: '10 Hours',
      sillage: 82
    },
    {
      id: 'verdant-aura',
      title: 'Verdant Aura',
      price: 13500,
      category: 'fresh',
      categoryLabel: 'FRESH BOTANICAL',
      rating: '4.9 ★ (116 reviews)',
      image: './images/verdant_aura.png',
      description: 'The exhilarating crispness of a Darjeeling hillside after monsoon rain. First-flush green tea blended with crushed tulsi leaf and earthy vetiver.',
      topNotes: ['Darjeeling First Flush Tea', 'Crushed Tulsi', 'Kaffir Lime'],
      heartNotes: ['Kerala Jasmine', 'Lily of the Valley', 'Galbanum'],
      baseNotes: ['Indian Vetiver', 'Nilgiri Cedarwood', 'Oakmoss'],
      longevity: '9 Hours',
      sillage: 78
    },
    {
      id: 'oud-royale',
      title: 'Oud Royale',
      price: 19999,
      category: 'woody',
      categoryLabel: 'RARE OUD & AMBER',
      rating: '5.0 ★ (210 reviews)',
      image: './images/hero.png',
      description: 'The crown jewel of our archive. Aged Assam Agarwood blended with smoked cardamom, pure bakhoor resin, and Rajput amber — a fragrance for Maharajas.',
      topNotes: ['Smoked Cardamom', 'Nutmeg', 'Saffron Zest'],
      heartNotes: ['Assam Agarwood (Oud)', 'Bakhoor Incense', 'Myrrh'],
      baseNotes: ['Golden Rajput Amber', 'Tonka Bean', 'Leather Accord'],
      longevity: '14+ Hours',
      sillage: 96
    }
  ];

  // Cart State
  let cart = [];

  // --- 2. Render Product Catalog ---
  const productGrid = document.getElementById('product-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('search-input');

  function renderProducts(items) {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    if (items.length === 0) {
      productGrid.innerHTML = `<div class="empty-cart-msg" style="grid-column: 1/-1;">No fragrances match your search criteria.</div>`;
      return;
    }

    items.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = `product-card reveal reveal-scale stagger-${(index % 4) + 1}`;
      card.innerHTML = `
        <span class="product-tag">${product.categoryLabel}</span>
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.title}" class="product-img">
          <button class="quickview-btn" data-id="${product.id}">Quick View 👁️</button>
        </div>
        <div class="product-info">
          <div class="product-header-row">
            <h3 class="product-title">${product.title}</h3>
            <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
          </div>
          <p class="product-notes-preview">${product.topNotes.slice(0, 2).join(' • ')}</p>
          <div class="product-rating">${product.rating}</div>
          <div class="product-actions">
            <button class="btn btn-primary btn-block add-to-cart-btn" data-id="${product.id}">
              <span>Add to Cart</span> 🛒
            </button>
          </div>
        </div>
      `;
      productGrid.appendChild(card);
    });

    // Observe newly rendered cards for scroll reveal
    if (window.revealObserver) {
      document.querySelectorAll('.product-card.reveal').forEach(el => window.revealObserver.observe(el));
    }

    // Attach event listeners for rendered cards
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        addToCart(id);
      });
    });

    document.querySelectorAll('.quickview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openQuickViewModal(id);
      });
    });
  }

  renderProducts(products);

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      if (filter === 'all') {
        renderProducts(products);
      } else {
        const filtered = products.filter(p => p.category === filter);
        renderProducts(filtered);
      }
    });
  });

  // Search input filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const matched = products.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.categoryLabel.toLowerCase().includes(term) ||
        p.topNotes.some(n => n.toLowerCase().includes(term)) ||
        p.baseNotes.some(n => n.toLowerCase().includes(term))
      );
      renderProducts(matched);
    });
  }



  // --- 5. Bespoke Olfactory Lab / Scent Blender ---
  const sliderCitrus = document.getElementById('slider-citrus');
  const sliderFloral = document.getElementById('slider-floral');
  const sliderWoody = document.getElementById('slider-woody');
  const sliderAmber = document.getElementById('slider-amber');

  const valCitrus = document.getElementById('val-citrus');
  const valFloral = document.getElementById('val-floral');
  const valWoody = document.getElementById('val-woody');
  const valAmber = document.getElementById('val-amber');

  const blendTitle = document.getElementById('custom-blend-title');
  const blendDesc = document.getElementById('custom-blend-desc');
  const bottleAura = document.getElementById('custom-bottle-aura');
  const bottleBody = document.getElementById('bottle-body');
  const customNameInput = document.getElementById('custom-scent-name');
  const bottleLabelText = document.getElementById('bottle-label-text');
  const addCustomBlendBtn = document.getElementById('add-custom-blend-btn');

  function updateOlfactoryLab() {
    if (!sliderCitrus) return;

    const cVal = parseInt(sliderCitrus.value);
    const fVal = parseInt(sliderFloral.value);
    const wVal = parseInt(sliderWoody.value);
    const aVal = parseInt(sliderAmber.value);

    valCitrus.textContent = `${cVal}%`;
    valFloral.textContent = `${fVal}%`;
    valWoody.textContent = `${wVal}%`;
    valAmber.textContent = `${aVal}%`;

    // Dynamic Title & Color Blend
    const maxVal = Math.max(cVal, fVal, wVal, aVal);
    let title = "Harmonious Bespoke Blend";
    let auraColor = "rgba(212, 175, 55, 0.4)";
    let bottleColor = "rgba(212, 175, 55, 0.15)";

    if (maxVal === cVal) {
      title = "Radiant Citrus & Fresh Spark";
      auraColor = "rgba(243, 229, 171, 0.6)";
      bottleColor = "rgba(243, 229, 171, 0.25)";
    } else if (maxVal === fVal) {
      title = "Velvet Floral & Rose Bouquet";
      auraColor = "rgba(232, 195, 195, 0.6)";
      bottleColor = "rgba(232, 195, 195, 0.25)";
    } else if (maxVal === wVal) {
      title = "Deep Woody & Sandalwood Accord";
      auraColor = "rgba(166, 130, 24, 0.6)";
      bottleColor = "rgba(166, 130, 24, 0.3)";
    } else if (maxVal === aVal) {
      title = "Warm Amber & Bourbon Vanilla Glow";
      auraColor = "rgba(230, 126, 34, 0.6)";
      bottleColor = "rgba(230, 126, 34, 0.25)";
    }

    if (blendTitle) blendTitle.textContent = title;
    if (bottleAura) bottleAura.style.background = `radial-gradient(circle, ${auraColor} 0%, rgba(0,0,0,0) 70%)`;
    if (bottleBody) bottleBody.style.backgroundColor = bottleColor;
  }

  [sliderCitrus, sliderFloral, sliderWoody, sliderAmber].forEach(s => {
    if (s) s.addEventListener('input', updateOlfactoryLab);
  });

  if (customNameInput) {
    customNameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim() || 'My Signature Blend';
      if (bottleLabelText) bottleLabelText.textContent = val;
    });
  }

  if (addCustomBlendBtn) {
    addCustomBlendBtn.addEventListener('click', () => {
      const customName = customNameInput ? customNameInput.value.trim() || 'My Signature Blend' : 'Custom Scent';
      const customItem = {
        id: `custom-${Date.now()}`,
        title: `Bespoke: ${customName}`,
        price: 18500,
        image: './images/hero.png',
        size: '50ml Custom Edition',
        quantity: 1
      };

      cart.push(customItem);
      updateCartUI();
      openCartDrawer();
      showToast(`Custom blend "${customName}" added to cart!`, '🧪');
    });
  }

  // --- 6. Shopping Cart & Drawer Engine ---
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartCountBadge = document.getElementById('cart-count');
  const cartDrawerCount = document.getElementById('cart-drawer-count');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const checkoutBtn = document.getElementById('checkout-btn');

  function openCartDrawer() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  function addToCart(productId, size = '50ml', priceMult = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const adjustedPrice = Math.round(product.price * priceMult);
    const existingIndex = cart.findIndex(item => item.id === productId && item.size === size);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: adjustedPrice,
        image: product.image,
        size: size,
        quantity: 1
      });
    }

    updateCartUI();
    openCartDrawer();
    showToast(`Added ${product.title} (${size}) to your cart!`, '🛒');
  }

  function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (cartCountBadge) cartCountBadge.textContent = totalItems;
    if (cartDrawerCount) cartDrawerCount.textContent = totalItems;

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<div class="empty-cart-msg">Your shopping cart is currently empty.</div>`;
      if (cartSubtotalVal) cartSubtotalVal.textContent = '₹0';
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
      subtotal += item.price * item.quantity;
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title} (${item.size})</div>
          <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
          <div class="cart-item-qty">
            <button class="qty-btn dec-btn" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn inc-btn" data-index="${index}">+</button>
            <button class="cart-item-remove remove-btn" data-index="${index}">Remove</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    if (cartSubtotalVal) cartSubtotalVal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

    // Quantity controls
    document.querySelectorAll('.inc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        cart[idx].quantity += 1;
        updateCartUI();
      });
    });

    document.querySelectorAll('.dec-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        if (cart[idx].quantity > 1) {
          cart[idx].quantity -= 1;
        } else {
          cart.splice(idx, 1);
        }
        updateCartUI();
      });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        cart.splice(idx, 1);
        updateCartUI();
      });
    });
  }

  // --- 7. E-Commerce Checkout & Order Confirmation Engine ---
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutCloseBtn = document.getElementById('checkout-close-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutItemsList = document.getElementById('checkout-items-list');
  const chkSubtotal = document.getElementById('chk-subtotal');
  const chkDiscountRow = document.getElementById('chk-discount-row');
  const chkDiscount = document.getElementById('chk-discount');
  const chkFinalTotal = document.getElementById('chk-final-total');
  const chkBtnPrice = document.getElementById('chk-btn-price');
  const chkPromoCode = document.getElementById('chk-promo-code');
  const applyPromoBtn = document.getElementById('apply-promo-btn');

  const orderSuccessModal = document.getElementById('order-success-modal');
  const successOrderId = document.getElementById('success-order-id');
  const successPaymentStatus = document.getElementById('success-payment-status');
  const successDoneBtn = document.getElementById('success-done-btn');

  let appliedDiscountPct = 0;

  function updateCheckoutSummary() {
    if (!checkoutItemsList) return;

    let subtotal = 0;
    checkoutItemsList.innerHTML = '';

    cart.forEach(item => {
      const itemSub = item.price * item.quantity;
      subtotal += itemSub;

      const itemEl = document.createElement('div');
      itemEl.className = 'chk-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="chk-item-img">
        <div class="chk-item-info">
          <div class="chk-item-title">${item.title} <span class="chk-item-qty">x${item.quantity}</span></div>
          <div class="chk-item-size">${item.size}</div>
        </div>
        <div class="chk-item-price">₹${itemSub.toLocaleString('en-IN')}</div>
      `;
      checkoutItemsList.appendChild(itemEl);
    });

    const discountAmount = Math.round(subtotal * (appliedDiscountPct / 100));
    const finalTotal = Math.max(0, subtotal - discountAmount);

    if (chkSubtotal) chkSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    
    if (discountAmount > 0) {
      if (chkDiscountRow) chkDiscountRow.classList.remove('hidden');
      if (chkDiscount) chkDiscount.textContent = `-₹${discountAmount.toLocaleString('en-IN')}`;
    } else {
      if (chkDiscountRow) chkDiscountRow.classList.add('hidden');
    }

    if (chkFinalTotal) chkFinalTotal.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;
    if (chkBtnPrice) chkBtnPrice.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;
  }

  function openCheckoutModal() {
    updateCheckoutSummary();
    if (checkoutModal) checkoutModal.classList.add('open');
  }

  function closeCheckoutModal() {
    if (checkoutModal) checkoutModal.classList.remove('open');
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty! Add fragrances first.', '⚠️');
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }

  if (checkoutCloseBtn) {
    checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
  }

  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckoutModal();
    });
  }

  // Payment Option Cards selection
  const paymentCards = document.querySelectorAll('.payment-option-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Apply Promo Code
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
      const code = chkPromoCode ? chkPromoCode.value.trim().toUpperCase() : '';
      if (code === 'AURA15') {
        appliedDiscountPct = 15;
        updateCheckoutSummary();
        showToast('Promo code AURA15 applied! 15% OFF', '🎉');
      } else if (code) {
        showToast('Invalid promo code. Try AURA15', '⚠️');
      }
    });
  }

  // Checkout Form Submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
      const paymentMethodVal = selectedPayment ? selectedPayment.value : 'UPI Instant';
      
      const randomOrderId = `AL-${Math.floor(100000 + Math.random() * 900000)}`;

      if (successOrderId) successOrderId.textContent = `#${randomOrderId}`;
      if (successPaymentStatus) {
        if (paymentMethodVal.includes('Cash')) {
          successPaymentStatus.textContent = 'Pay on Delivery 💵';
          successPaymentStatus.className = 'detail-val yellow';
        } else {
          successPaymentStatus.textContent = `Paid via ${paymentMethodVal} ⚡`;
          successPaymentStatus.className = 'detail-val green';
        }
      }

      closeCheckoutModal();
      
      // Open success modal
      if (orderSuccessModal) orderSuccessModal.classList.add('open');

      // Reset cart
      cart = [];
      appliedDiscountPct = 0;
      if (chkPromoCode) chkPromoCode.value = '';
      updateCartUI();
    });
  }

  if (successDoneBtn) {
    successDoneBtn.addEventListener('click', () => {
      if (orderSuccessModal) orderSuccessModal.classList.remove('open');
    });
  }

  // --- 7. Quick View Modal ---
  const modalOverlay = document.getElementById('quickview-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalRating = document.getElementById('modal-rating');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalTopNotes = document.getElementById('modal-top-notes');
  const modalHeartNotes = document.getElementById('modal-heart-notes');
  const modalBaseNotes = document.getElementById('modal-base-notes');
  const modalAddBtn = document.getElementById('modal-add-cart-btn');
  const sizeBtns = document.querySelectorAll('.size-btn');

  let activeModalProductId = null;
  let activeSize = '50ml';
  let activePriceMult = 1;

  function openQuickViewModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    activeModalProductId = productId;
    activeSize = '50ml';
    activePriceMult = 1;

    sizeBtns.forEach(b => {
      b.classList.remove('active');
      if (b.getAttribute('data-size') === '50ml') b.classList.add('active');
    });

    if (modalImg) modalImg.src = product.image;
    if (modalCategory) modalCategory.textContent = product.categoryLabel;
    if (modalTitle) modalTitle.textContent = product.title;
    if (modalRating) modalRating.innerHTML = `${product.rating}`;
    if (modalPrice) modalPrice.textContent = `₹${product.price.toLocaleString('en-IN')}`;
    if (modalDesc) modalDesc.textContent = product.description;

    if (modalTopNotes) modalTopNotes.textContent = product.topNotes.join(', ');
    if (modalHeartNotes) modalHeartNotes.textContent = product.heartNotes.join(', ');
    if (modalBaseNotes) modalBaseNotes.textContent = product.baseNotes.join(', ');

    if (modalOverlay) modalOverlay.classList.add('open');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      if (modalOverlay) modalOverlay.classList.remove('open');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });
  }

  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSize = btn.getAttribute('data-size');
      activePriceMult = parseFloat(btn.getAttribute('data-price-mult'));

      const product = products.find(p => p.id === activeModalProductId);
      if (product && modalPrice) {
        modalPrice.textContent = `₹${Math.round(product.price * activePriceMult).toLocaleString('en-IN')}`;
      }
    });
  });

  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      if (activeModalProductId) {
        addToCart(activeModalProductId, activeSize, activePriceMult);
        if (modalOverlay) modalOverlay.classList.remove('open');
      }
    });
  }

  // --- 8. Toast Notifications ---
  function showToast(message, icon = '✨') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- 9. Newsletter VIP Form ---
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success-msg');
  const copyCodeBtn = document.getElementById('copy-code-btn');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.style.display = 'none';
      if (newsletterSuccess) newsletterSuccess.classList.remove('hidden');
      showToast('VIP Subscription confirmed! Use code AURA15 for 15% off.', '🎁');
    });
  }

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('AURA15');
      showToast('Promo code AURA15 copied to clipboard!', '📋');
    });
  }

  // --- 10. Scroll Animations & Scroll Engine ---
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Reveal Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  window.revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animating in for performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Attach observer to all elements with class .reveal
  document.querySelectorAll('.reveal').forEach(element => {
    window.revealObserver.observe(element);
  });

  // Scroll event handler for top progress bar, back-to-top button, & active nav link
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 1. Update top scroll progress bar
    if (progressBar && scrollHeight > 0) {
      const scrollPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      progressBar.style.width = `${scrollPercent}%`;
    }

    // 2. Toggle Back-to-Top Button Visibility
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // 3. Update Active Header Link on Scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Back to Top Click Action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 11. Hero Canvas Scroll Video Animation Engine ---
  const heroSection = document.getElementById('hero');
  const heroCanvas = document.getElementById('hero-scroll-canvas');

  if (heroCanvas && heroSection) {
    const ctx = heroCanvas.getContext('2d');
    const totalFrames = 70;
    const frames = [];
    let imagesLoaded = 0;

    function resizeCanvas() {
      heroCanvas.width = window.innerWidth;
      heroCanvas.height = window.innerHeight;
      renderHeroFrame();
    }

    function drawCoverImage(img) {
      if (!ctx || !img || !img.complete || img.naturalWidth === 0) return;
      
      const cw = heroCanvas.width;
      const ch = heroCanvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const nx = (cw - nw) / 2;
      const ny = (ch - nh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, nx, ny, nw, nh);
    }

    function renderHeroFrame() {
      const rect = heroSection.getBoundingClientRect();
      const scrollTrackHeight = heroSection.offsetHeight - window.innerHeight;
      if (scrollTrackHeight <= 0) return;

      let progress = -rect.top / scrollTrackHeight;
      progress = Math.min(1, Math.max(0, progress));

      const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));

      if (frames[frameIndex] && frames[frameIndex].complete) {
        drawCoverImage(frames[frameIndex]);
      }
    }

    // Preload all 70 frames from ./images/animation/
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const pad = String(i).padStart(3, '0');
      img.src = `./images/animation/ezgif-frame-${pad}.jpg`;
      img.onload = () => {
        imagesLoaded++;
        if (i === 1 || imagesLoaded === totalFrames) {
          resizeCanvas();
          renderHeroFrame();
        }
      };
      frames.push(img);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', () => {
      requestAnimationFrame(renderHeroFrame);
    });

    resizeCanvas();
  }

});



