document.addEventListener('DOMContentLoaded', () => {
    console.log('Main JS loaded');
    
    // Initialize bookmarks
    initializeBookmarks();
});

// Global functions for bookmarks and direct purchase
async function buyNow(productId) {
    if (!window.userId) {
        showToast('Iltimos, avval tizimga kiring', 'error');
        return;
    }
    
    try {
        // Mahsulotni to'g'ridan-to'g'ri savatchaga qo'shish (1 dona)
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_Id: window.userId,
                product_Id: productId,
                count: 1
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('To\'lov sahifasiga o\'tmoqda...', 'success');
            // To'lov sahifasiga o'tish
            setTimeout(() => {
                window.location.href = '/payment';
            }, 1000);
        } else {
            showToast(result.message || 'Xatolik yuz berdi', 'error');
        }
    } catch (error) {
        showToast('Tarmoq xatosi. Iltimos, qaytadan urinib ko\'ring.', 'error');
    }
}

async function toggleBookmark(productId) {
    if (!window.userId) {
        showToast('Iltimos, avval tizimga kiring', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/bookmark', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_Id: window.userId,
                product_Id: productId
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            const bookmarkBtn = document.querySelector(`[data-product-id="${productId}"] .bookmark-btn`);
            const icon = bookmarkBtn.querySelector('.bookmark-icon');
            
            if (icon.textContent === '🤍') {
                icon.textContent = '❤️';
                showToast('Bookmarkga qo\'shildi!', 'success');
            } else {
                icon.textContent = '🤍';
                showToast('Bookmarkdan olib tashlandi!', 'info');
            }
        } else {
            showToast(result.message || 'Bookmark yangilashda xatolik', 'error');
        }
    } catch (error) {
        showToast('Tarmoq xatosi. Iltimos, qaytadan urinib ko\'ring.', 'error');
    }
}

async function initializeBookmarks() {
    if (!window.userId) return;
    
    try {
        const response = await fetch(`/api/bookmark/${window.userId}`);
        const bookmarks = await response.json();
        
        bookmarks.forEach(bookmark => {
            const bookmarkBtn = document.querySelector(`[data-product-id="${bookmark.product_Id}"] .bookmark-btn`);
            if (bookmarkBtn) {
                const icon = bookmarkBtn.querySelector('.bookmark-icon');
                icon.textContent = '❤️';
            }
        });
    } catch (error) {
        console.error('Bookmarklarni yuklashda xatolik:', error);
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

// Make functions globally available
window.buyNow = buyNow;
window.toggleBookmark = toggleBookmark;
