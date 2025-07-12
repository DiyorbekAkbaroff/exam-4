// Bookmarks page specific functionality
async function removeBookmark(productId) {
    if (!window.userId) {
        showToast('Please login to manage bookmarks', 'error');
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
            // Remove the product card from the DOM
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                productCard.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    productCard.remove();
                    
                    // Check if no more bookmarks
                    const remainingCards = document.querySelectorAll('.product-card');
                    if (remainingCards.length === 0) {
                        location.reload(); // Reload to show empty state
                    }
                }, 300);
            }
            showToast('Removed from bookmarks!', 'success');
        } else {
            showToast(result.message || 'Failed to remove bookmark', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
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

// Add fadeOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// Make functions globally available
window.removeBookmark = removeBookmark;
