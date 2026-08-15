/* ============================================================
   AURA LUXE Parfums — Express Checkout Page Logic Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Cart Management & Storage ---
  let cart = [];
  try {
    const stored = localStorage.getItem('aura_cart');
    if (stored) {
      cart = JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not read cart from localStorage', e);
  }

  // If cart is empty (e.g. direct visit), initialize with default luxury signature product
  if (!cart || cart.length === 0) {
    cart = [
      {
        id: 'oud-royale',
        title: 'Oud Royale Eau de Parfum',
        price: 19999,
        image: './images/hero.png',
        size: '50ml Signature Edition',
        quantity: 1
      }
    ];
    saveCart();
  }

  function saveCart() {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }

  // --- 2. DOM Elements ---
  const itemsWrapper = document.getElementById('checkout-items-wrapper');
  const itemsCountBadge = document.getElementById('summary-items-count');
  const subtotalDisplay = document.getElementById('subtotal-display');
  const discountCalcRow = document.getElementById('discount-calc-row');
  const discountDisplay = document.getElementById('discount-display');
  const totalPayDisplay = document.getElementById('total-pay-display');
  const submitBtnTotal = document.getElementById('submit-btn-total');
  
  const promoInput = document.getElementById('promo-input');
  const promoApplyBtn = document.getElementById('promo-apply-btn');
  const promoSuccessAlert = document.getElementById('promo-success-alert');
  const quickApplyCode = document.getElementById('quick-apply-code');

  const checkoutForm = document.getElementById('express-checkout-form');
  const checkoutLayoutGrid = document.getElementById('checkout-layout-grid');
  const orderConfirmedView = document.getElementById('order-confirmed-view');

  const confirmOrderId = document.getElementById('confirm-order-id');
  const confirmPaymentStatus = document.getElementById('confirm-payment-status');
  const confirmRecipient = document.getElementById('confirm-recipient');
  const confirmTotalAmount = document.getElementById('confirm-total-amount');

  let appliedDiscountPct = 0;

  // --- 3. Render Items & Update Financials ---
  function updateSummaryUI() {
    if (!itemsWrapper) return;

    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (itemsCountBadge) {
      itemsCountBadge.textContent = `${totalQty} item${totalQty === 1 ? '' : 's'}`;
    }

    if (cart.length === 0) {
      itemsWrapper.innerHTML = `
        <div style="text-align: center; padding: 30px 10px; color: var(--text-muted);">
          Your cart is currently empty.
          <div style="margin-top: 12px;">
            <a href="index.html" class="btn btn-secondary" style="font-size: 0.8rem; padding: 8px 16px;">
              Explore Fragrances
            </a>
          </div>
        </div>
      `;
      if (subtotalDisplay) subtotalDisplay.textContent = '₹0';
      if (totalPayDisplay) totalPayDisplay.textContent = '₹0';
      if (submitBtnTotal) submitBtnTotal.textContent = '₹0';
      return;
    }

    let subtotal = 0;
    itemsWrapper.innerHTML = '';

    cart.forEach((item, index) => {
      const itemSub = item.price * item.quantity;
      subtotal += itemSub;

      const itemCard = document.createElement('div');
      itemCard.className = 'checkout-item-card';
      itemCard.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="chk-item-thumbnail">
        <div class="chk-item-details">
          <div class="chk-item-name" title="${item.title}">${item.title}</div>
          <div class="chk-item-variant">${item.size || '50ml'}</div>
          <div class="chk-item-qty-actions">
            <button type="button" class="chk-mini-btn dec-btn" data-index="${index}" aria-label="Decrease Quantity">−</button>
            <span class="chk-qty-num">${item.quantity}</span>
            <button type="button" class="chk-mini-btn inc-btn" data-index="${index}" aria-label="Increase Quantity">+</button>
          </div>
        </div>
        <div class="chk-item-price-col">
          <span class="chk-item-price-val">₹${itemSub.toLocaleString('en-IN')}</span>
        </div>
      `;
      itemsWrapper.appendChild(itemCard);
    });

    // Quantity modifiers
    itemsWrapper.querySelectorAll('.inc-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        cart[idx].quantity += 1;
        saveCart();
        updateSummaryUI();
      });
    });

    itemsWrapper.querySelectorAll('.dec-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        if (cart[idx].quantity > 1) {
          cart[idx].quantity -= 1;
        } else {
          cart.splice(idx, 1);
        }
        saveCart();
        updateSummaryUI();
      });
    });

    // Calculations
    const discountAmount = Math.round(subtotal * (appliedDiscountPct / 100));
    const finalTotal = Math.max(0, subtotal - discountAmount);

    if (subtotalDisplay) subtotalDisplay.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    
    if (discountAmount > 0) {
      if (discountCalcRow) discountCalcRow.classList.remove('hidden');
      if (discountDisplay) discountDisplay.textContent = `-₹${discountAmount.toLocaleString('en-IN')}`;
    } else {
      if (discountCalcRow) discountCalcRow.classList.add('hidden');
    }

    if (totalPayDisplay) totalPayDisplay.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;
    if (submitBtnTotal) submitBtnTotal.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;
  }

  updateSummaryUI();

  // --- 4. Payment Selection Interaction ---
  const payCards = document.querySelectorAll('.pay-method-card');
  payCards.forEach(card => {
    card.addEventListener('click', () => {
      payCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // --- 5. Promo Code Engine ---
  function applyPromo(code) {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();

    if (cleanCode === 'AURA15') {
      appliedDiscountPct = 15;
      if (promoSuccessAlert) promoSuccessAlert.classList.remove('hidden');
      updateSummaryUI();
      showToast('VIP Promo Code AURA15 Applied! 15% OFF', '🎉');
    } else {
      showToast('Invalid promo code. Use AURA15 for 15% off.', '⚠️');
    }
  }

  if (promoApplyBtn && promoInput) {
    promoApplyBtn.addEventListener('click', () => {
      applyPromo(promoInput.value);
    });

    promoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromo(promoInput.value);
      }
    });
  }

  if (quickApplyCode) {
    quickApplyCode.parentElement.addEventListener('click', () => {
      if (promoInput) promoInput.value = 'AURA15';
      applyPromo('AURA15');
    });
  }

  // --- 6. Form Submission & Royal Confirmation Screen ---
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        showToast('Your shopping bag is empty! Add a fragrance first.', '⚠️');
        return;
      }

      const nameVal = document.getElementById('chk-name')?.value.trim() || 'Valued Patron';
      const cityVal = document.getElementById('chk-city')?.value.trim() || 'India';
      const selectedPayment = document.querySelector('input[name="payment_method"]:checked');
      const paymentMethodVal = selectedPayment ? selectedPayment.value : 'UPI Instant';
      
      const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const discountAmount = Math.round(subtotal * (appliedDiscountPct / 100));
      const finalTotal = Math.max(0, subtotal - discountAmount);

      const randomOrderId = `AL-${Math.floor(100000 + Math.random() * 900000)}`;

      if (confirmOrderId) confirmOrderId.textContent = `#${randomOrderId}`;
      if (confirmRecipient) confirmRecipient.textContent = `${nameVal} (${cityVal})`;
      if (confirmTotalAmount) confirmTotalAmount.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;

      if (confirmPaymentStatus) {
        if (paymentMethodVal.includes('Cash')) {
          confirmPaymentStatus.textContent = 'Pay on Delivery (Cash/UPI) 💵';
          confirmPaymentStatus.style.color = '#F39C12';
        } else {
          confirmPaymentStatus.textContent = `Paid via ${paymentMethodVal} ⚡`;
          confirmPaymentStatus.style.color = '#2ECC71';
        }
      }

      // Hide form & summary grid, reveal full-page royal confirmation card
      if (checkoutLayoutGrid) checkoutLayoutGrid.classList.add('hidden');
      if (orderConfirmedView) orderConfirmedView.classList.remove('hidden');

      // Clear Cart
      cart = [];
      saveCart();

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      showToast('Order confirmed with master perfumers!', '👑');
    });
  }

  // --- 7. Toast Notification System ---
  function showToast(message, icon = '✨') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
      background: rgba(22, 17, 32, 0.95);
      border: 1px solid var(--border-gold);
      color: var(--text-main);
      padding: 12px 20px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.88rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      margin-bottom: 10px;
      animation: toastIn 0.3s ease forwards;
    `;
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

});
