document.addEventListener('DOMContentLoaded', () => {

    // Disable form by default
    document.querySelector('#channel-submit').disabled = true;
    
    // Enable when there is text to send
    document.querySelector('#new-channel').onkeyup = () => {
        if (document.querySelector('#new-channel').value.length > 0)
            document.querySelector('#channel-submit').disabled = false;
        else
            document.querySelector('#channel-submit').disabled = true;
    }
})