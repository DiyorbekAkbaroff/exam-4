// To'lov sahifasi funksiyalari

// Mahsulot narxlari va miqdorlari
let productPrices = {};
let productQuantities = {};

// Sahifa yuklanganda mahsulot ma'lumotlarini yuklash
document.addEventListener('DOMContentLoaded', () => {
    // Mahsulot narxlarini va miqdorlarini yuklash
    const orderItems = document.querySelectorAll('.order-item');
    orderItems.forEach(item => {
        const productId = item.dataset.productId;
        const priceElement = item.querySelector('.item-price');
        const quantityField = item.querySelector('.quantity-field');
        
        if (priceElement && quantityField) {
            const price = parseFloat(priceElement.textContent.replace('$', '').replace(',', ''));
            const quantity = parseInt(quantityField.value);
            
            productPrices[productId] = price;
            productQuantities[productId] = quantity;
        }
    });
    
    updateTotals();
});

// Miqdorni o'zgartirish
function changeQuantity(productId, change) {
    const quantityField = document.querySelector(`[data-product-id="${productId}"] .quantity-field`);
    if (quantityField) {
        let newQuantity = parseInt(quantityField.value) + change;
        newQuantity = Math.max(1, Math.min(10, newQuantity)); // 1-10 oralig'ida
        quantityField.value = newQuantity;
        updateQuantity(productId, newQuantity);
    }
}

// Miqdorni yangilash
function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
    } else if (newQuantity > 10) {
        newQuantity = 10;
    }
    
    productQuantities[productId] = newQuantity;
    
    // Mahsulot jami narxini yangilash
    const totalElement = document.getElementById(`total-${productId}`);
    if (totalElement && productPrices[productId]) {
        const total = productPrices[productId] * newQuantity;
        totalElement.textContent = `$${total.toLocaleString()}`;
    }
    
    // Savatchani yangilash
    updateCartQuantity(productId, newQuantity);
    
    // Umumiy summani yangilash
    updateTotals();
}

// Savatchani yangilash
async function updateCartQuantity(productId, quantity) {
    try {
        await fetch('/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_Id: window.userId,
                product_Id: productId,
                count: quantity
            })
        });
    } catch (error) {
        console.error('Savatchani yangilashda xatolik:', error);
    }
}

// Umumiy summani yangilash
function updateTotals() {
    let subtotal = 0;
    
    Object.keys(productPrices).forEach(productId => {
        const price = productPrices[productId];
        const quantity = productQuantities[productId] || 1;
        subtotal += price * quantity;
    });
    
    const deliveryFee = 5;
    const finalTotal = subtotal + deliveryFee;
    
    // UI ni yangilash
    const subtotalElement = document.getElementById('subtotal');
    const finalTotalElement = document.getElementById('final-total');
    
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
    }
    
    if (finalTotalElement) {
        finalTotalElement.textContent = `$${finalTotal.toLocaleString()}`;
    }
}

async function processPayment() {
    const submitBtn = document.querySelector('.btn-primary');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Loading holatini ko'rsatish
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
    
    try {
        // Forma ma'lumotlarini olish
        const formData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            comment: document.getElementById('comment').value,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
        };
        
        // Ma'lumotlarni tekshirish
        if (!formData.fullName || !formData.phone || !formData.address) {
            throw new Error('Barcha majburiy maydonlarni to\'ldiring');
        }
        
        // To'lovni amalga oshirish
        const response = await fetch('/api/orders/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('Buyurtma muvaffaqiyatli yaratildi! Naqd pul bilan to\'lov qilishingiz mumkin.', 'success');
            
            // Savatchani tozalash
            await clearCart();
            
            // Bosh sahifaga o'tish
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        } else {
            throw new Error(result.message || 'Buyurtma yaratishda xatolik yuz berdi');
        }
        
    } catch (error) {
        showToast(error.message, 'error');
        
        // Loading holatini olib tashlash
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

async function clearCart() {
    try {
        await fetch('/api/cart/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Savatchani tozalashda xatolik:', error);
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Telefon raqam formati
document.getElementById('phone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('998')) {
        value = '+' + value;
    } else if (value.startsWith('0')) {
        value = '+998' + value.substring(1);
    } else if (value.length > 0 && !value.startsWith('+')) {
        value = '+998' + value;
    }
    
    e.target.value = value;
});

// Global funksiyalarni qo'shish
window.processPayment = processPayment;
window.changeQuantity = changeQuantity;
window.updateQuantity = updateQuantity; 