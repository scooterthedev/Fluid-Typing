document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName') || 'Anonymous';
    const bestWpm = localStorage.getItem('bestWpm') || '0';
    const totalTests = localStorage.getItem('totalTests') || '0';

    document.getElementById('user-name').textContent = `User: ${userName}`;
    document.getElementById('best-wpm').textContent = `Best WPM: ${bestWpm}`;
    document.getElementById('total-tests').textContent = `Total Tests: ${totalTests}`;

    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}); 