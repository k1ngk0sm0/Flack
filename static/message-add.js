document.addEventListener('DOMContentLoaded', () => {
     
    // Configure button for opening
    document.querySelector('#msg-open').onclick = () => {

        // Show form when open button is clicked
        document.getElementById("myForm").style.display = "block";

        // Autofocus on open
        document.getElementById('msg-body').focus();
    };

    // Do not allow user to send empty form
    document.querySelector('#msg-send').disabled = true;
    document.querySelector('#msg-body').onkeyup = () => {
        if (document.querySelector("#msg-body").value.length > 0)
            document.querySelector('#msg-send').disabled = false;
        else
            document.querySelector('#msg-send').disabled = true;
    };

    // Send message when enter key is pressed
    document.getElementById("msg-body")
        .addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("msg-send").click();
        }
    });
    
    // Configure button for closing
    document.querySelector('#msg-cancel').onclick = () => {

        // Hide message form
        document.getElementById("myForm").style.display = "none";
    };

    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    // When connecte4d, configure send button
    socket.on('connect', () => {
        
        // Send button should emit a 'new message' event
        document.querySelector('#msg-send').onclick = () => {
            const message = document.querySelector('#msg-body').value;
            const username = localStorage.getItem('username');
            const channel = localStorage.getItem('channel');
            socket.emit('new message', {'username': username, 'message': message, 'channel': channel});
            document.getElementById("myForm").style.display = "none";
            document.querySelector('#msg-body').value = '';
        };
    });

    // When a message is posted
    socket.on('post message', data => {

        // Create message
        const div = document.createElement('div');
        div.className = 'container message';
        const postID = document.createElement('h6');
        postID.className = 'right';
        postID.innerHTML = `Posted by: ${data.username}`;
        div.append(postID);
        const message = document.createElement('p');
        message.innerHTML = data.message;
        div.append(message);
        const span = document.createElement('span')
        const timestamp = document.createElement('p');
        timestamp.className = 'time-left';
        timestamp.innerHTML = data.timestamp;
        span.append(timestamp);
        const delete_post = document.createElement('button');
        delete_post.className = 'delete right';
        delete_post.innerHTML = 'Delete';
        delete_post.style.display = 'none';
        span.append(delete_post);
        div.append(span);

        // Post to page in real time if currently stored in browser
        if (localStorage.getItem('channel') == data.channel)
            document.querySelector('#messages').appendChild(div);
    });
});