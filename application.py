import os

from flask import Flask, render_template, request, redirect, flash, jsonify
from flask_socketio import SocketIO, emit

from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = ['General']
messages = []

@app.route('/')
def index():
    return render_template('index.html', channels=channels)

@app.route('/new_channel', methods=["POST"])
def new_channel():
    """
    Add channel to list if not already present
    """

    if request.form.get('channel') not in channels:
        channels.append(request.form.get("channel"))

    else:
        flash('Channel already exists!')

    return redirect('/')

@app.route('/messages', methods=['POST'])
def channel():
    """
    Show messages for currently selected page
    """

    # Get start and end point for posts to generate.
    start = int(request.form.get("start") or 0)
    end = int(request.form.get("end") or (start + 9))

    # Get channel selection
    channel = request.form.get('channel')
    
    # Select messages for current channel
    channel_messages = [message for message in messages if message['channel'] == channel]

    # Only save most recent 100 messages in server side memory
    while len(channel_messages) > 100:
        channel_messages.pop()

    return jsonify(channel_messages)


@socketio.on('new message')
def new_message(data):
    """
    Add new message to list and emit message data to client
    """
    global messages
    timestamp = datetime.now().strftime('%c')
    data['timestamp'] = timestamp
    messages.append(data)
    emit('post message', data, broadcast=True)

@socketio.on('delete message')
def delete_message(data):
    """
    Delete user message
    """
    global messages
    
    # Delete message with corresponding username and timestamp
    for message in messages:
        if message['username'] == data['username'] and message['timestamp'] == data['timestamp']:
            messages.remove(message)