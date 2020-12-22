document.addEventListener('DOMContentLoaded', () => {
    
    // Set default channel to general
    if (!localStorage.getItem('channel'))
        localStorage.setItem('channel', 'General');
    
    document.querySelector('#msgs-head').innerHTML = localStorage.getItem('channel');
    
    // Each button should set local storage for channel and reload the page
    document.querySelectorAll('.channel').forEach(button => {
        button.onclick = () => {
            const selection = button.dataset.channel;
            localStorage.setItem('channel', selection);
            location.reload();
        };
    });
})

