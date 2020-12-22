document.addEventListener('DOMContentLoaded', () => {

    var selection = 'General';

    // Set default channel to selection
    if (!localStorage.getItem('channel'))
        localStorage.setItem('channel', selection);
    else
        selection = localStorage.getItem('channel')

    // Set head of messages section to stored channel
    document.querySelector('#msgs-head').innerHTML = localStorage.getItem('channel');

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, emit selection
    socket.on('connect', () => {
        socket.emit('channel select', {'selection': selection});
    });

    // When response is broadcasted ensure user is viewing correct page
    socket.on('selected channel', data => {
        if (document.querySelector('#msgs-head').innerHTML != data.selection)
            location.reload;
    });
});