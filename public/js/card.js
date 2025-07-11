let count = 1;
document.querySelector('.increase').addEventListener('click', () => {
  count++;
  document.querySelector('.count').innerText = count;
});
document.querySelector('.decrease').addEventListener('click', () => {
  if (count > 1) count--;
  document.querySelector('.count').innerText = count;
});
document.querySelector('#addToCart').addEventListener('click', () => {
  fetch('/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_Id: 1, product_Id: 1, count })
  }).then(res => res.json()).then(data => alert('Savatga qo‘shildi'));
});