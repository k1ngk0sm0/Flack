document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('username'))
        localStorage.setItem('username', prompt('Enter your username:'))
})