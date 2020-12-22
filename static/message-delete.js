document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    // When connected, configure delete button
    socket.on('connect', () => {
        setInterval(deleteMessage, 500);
    });

    function deleteMessage() {
        document.querySelectorAll('.message').forEach(div => {

            // Display delete button if message posted by current user
            if (div.children[0].innerHTML == `Posted by: ${localStorage.getItem('username')}`)
                div.children[2].children[1].style.display = 'block';
            
            // When delete button clicked, emit 'delete message' and remove from DOM
            div.children[2].children[1].onclick = () => {
                const username = localStorage.getItem('username');
                const timestamp = div.children[2].children[0].innerHTML;
                socket.emit('delete message', {'username': username, 'timestamp': timestamp});
                div.remove();
            };
        });
    };
});