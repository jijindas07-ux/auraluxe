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

  // Cart State (Persisted in localStorage across pages)
  let cart = [];
  try {
    const savedCart = localStorage.getItem('aura_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (e) {
    console.warn('Could not read cart from localStorage', e);
  }

  function saveCart() {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }

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
        const card = e.currentTarget.closest('.product-card');
        const img = card ? card.querySelector('.product-img') : e.currentTarget;
        addToCart(id, '50ml', 1, img || e.currentTarget);
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

      // Trigger smooth fly-to-cart animation (No cart drawer pop-up, no toast message)
      const bottleSource = bottleBody || addCustomBlendBtn;
      animateFlyToCart(bottleSource, customItem.image);
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

  // --- Fly-to-Cart Animation Helper ---
  function animateFlyToCart(sourceEl, imgSrc) {
    const targetCartBtn = document.getElementById('cart-toggle-btn');
    if (!targetCartBtn) return;

    let startRect;
    if (sourceEl && typeof sourceEl.getBoundingClientRect === 'function') {
      startRect = sourceEl.getBoundingClientRect();
    } else {
      startRect = {
        left: window.innerWidth / 2 - 50,
        top: window.innerHeight / 2 - 50,
        width: 100,
        height: 100
      };
    }

    const targetRect = targetCartBtn.getBoundingClientRect();

    const flyingEl = document.createElement('img');
    flyingEl.className = 'flying-cart-item';
    flyingEl.src = imgSrc || './images/hero.png';

    const initWidth = Math.max(40, Math.min(startRect.width, 160));
    const initHeight = Math.max(40, Math.min(startRect.height, 160));
    flyingEl.style.left = `${startRect.left + (startRect.width - initWidth) / 2}px`;
    flyingEl.style.top = `${startRect.top + (startRect.height - initHeight) / 2}px`;
    flyingEl.style.width = `${initWidth}px`;
    flyingEl.style.height = `${initHeight}px`;

    document.body.appendChild(flyingEl);

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const deltaX = targetX - startX;
    const deltaY = targetY - startY;

    const animation = flyingEl.animate(
      [
        {
          transform: 'translate(0, 0) scale(1) rotate(0deg)',
          opacity: 1,
          filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.8))'
        },
        {
          transform: `translate(${deltaX * 0.45}px, ${deltaY * 0.3 - 50}px) scale(0.7) rotate(12deg)`,
          opacity: 0.95,
          offset: 0.55
        },
        {
          transform: `translate(${deltaX}px, ${deltaY}px) scale(0.18) rotate(25deg)`,
          opacity: 0.1
        }
      ],
      {
        duration: 750,
        easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
        fill: 'forwards'
      }
    );

    animation.onfinish = () => {
      flyingEl.remove();

      targetCartBtn.classList.remove('bounce');
      void targetCartBtn.offsetWidth;
      targetCartBtn.classList.add('bounce');

      if (cartCountBadge) {
        cartCountBadge.classList.remove('bump');
        void cartCountBadge.offsetWidth;
        cartCountBadge.classList.add('bump');
      }

      setTimeout(() => {
        targetCartBtn.classList.remove('bounce');
        if (cartCountBadge) cartCountBadge.classList.remove('bump');
      }, 500);
    };
  }

  function addToCart(productId, size = '50ml', priceMult = 1, sourceEl = null) {
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

    // Smooth fly-to-cart animation without side drawer pop-up or toast message
    let flySource = sourceEl;
    if (!flySource) {
      const cardBtn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
      if (cardBtn) {
        const card = cardBtn.closest('.product-card');
        flySource = card ? card.querySelector('.product-img') : cardBtn;
      }
    }
    animateFlyToCart(flySource, product.image);

    saveCart();
    updateCartUI();
  }

  function updateCartUI() {
    saveCart();
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
          <div class="cart-item-title">${item.title} (${item.size || '50ml'})</div>
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

  // Navigate to Dedicated Express Checkout Page
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty! Add fragrances first.', '⚠️');
        return;
      }
      saveCart();
      window.location.href = 'checkout.html';
    });
  }

  // Initial cart UI population
  updateCartUI();

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
        addToCart(activeModalProductId, activeSize, activePriceMult, modalImg || modalAddBtn);
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
  const mainHeader = document.getElementById('main-header');
  let rafScheduled = false;

  function onScroll() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // 1. Update top scroll progress bar
      if (progressBar && scrollHeight > 0) {
        const scrollPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        progressBar.style.width = `${scrollPercent}%`;
      }

      // 2. Toggle header scrolled state (transparent at top, opaque when scrolled)
      if (mainHeader) {
        if (scrollTop > 20) {
          mainHeader.classList.add('scrolled');
        } else {
          mainHeader.classList.remove('scrolled');
        }
      }

      // 3. Toggle Back-to-Top Button Visibility
      if (backToTopBtn) {
        if (scrollTop > 350) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      // 4. Update Active Header Link on Scroll
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
  }

  window.addEventListener('scroll', onScroll, { passive: true });

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
    const ctx = heroCanvas.getContext('2d', { alpha: false }); // alpha:false = faster compositing
    const totalFrames = 70;
    const frames = [];
    let imagesLoaded = 0;
    let canvasRafId = null;
    let lastFrameIndex = -1;

    function resizeCanvas() {
      heroCanvas.width = window.innerWidth;
      heroCanvas.height = window.innerHeight;
      lastFrameIndex = -1; // force redraw
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

      ctx.drawImage(img, nx, ny, nw, nh);
    }

    function renderHeroFrame() {
      const rect = heroSection.getBoundingClientRect();
      const scrollTrackHeight = heroSection.offsetHeight - window.innerHeight;
      if (scrollTrackHeight <= 0) return;

      let progress = -rect.top / scrollTrackHeight;
      progress = Math.min(1, Math.max(0, progress));

      const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));

      // Only redraw if frame actually changed
      if (frameIndex === lastFrameIndex) return;
      lastFrameIndex = frameIndex;

      if (frames[frameIndex] && frames[frameIndex].complete && frames[frameIndex].naturalWidth > 0) {
        ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        drawCoverImage(frames[frameIndex]);
      }
    }

    // Schedule canvas paint on scroll using passive listener + RAF
    function scheduleCanvasPaint() {
      if (canvasRafId) return; // already scheduled
      canvasRafId = requestAnimationFrame(() => {
        canvasRafId = null;
        renderHeroFrame();
      });
    }

    // Preload frames — prioritize first 10 frames for fast start
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const pad = String(i).padStart(3, '0');
      img.src = `./images/animation/ezgif-frame-${pad}.jpg`;
      img.decoding = 'async';
      img.onload = () => {
        imagesLoaded++;
        if (i === 1) {
          resizeCanvas();
          renderHeroFrame();
        } else if (imagesLoaded === totalFrames) {
          renderHeroFrame();
        }
      };
      frames.push(img);
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', scheduleCanvasPaint, { passive: true });

    resizeCanvas();
  }

});



