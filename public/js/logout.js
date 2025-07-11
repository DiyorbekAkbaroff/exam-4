document.querySelector('#logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    location.href = '/login.html';
  });