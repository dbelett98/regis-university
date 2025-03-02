// public/js/logout.js
document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    localStorage.removeItem('token');
    window.location.href = '../html/landing-page.html'; 
});
