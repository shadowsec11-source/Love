from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
import json
import base64

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
MESSAGES_FILE = 'messages.json'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize messages file
if not os.path.exists(MESSAGES_FILE):
    with open(MESSAGES_FILE, 'w') as f:
        json.dump([], f)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/upload-photo', methods=['POST'])
def upload_photo():
    """Handle photo uploads"""
    if 'photo' not in request.files:
        return jsonify({'error': 'No photo provided'}), 400

    file = request.files['photo']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Save file
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    return jsonify({
        'success': True,
        'filename': filename,
        'url': f'/static/uploads/{filename}'
    })


@app.route('/api/messages', methods=['GET', 'POST'])
def handle_messages():
    """Get or add love messages"""
    if request.method == 'GET':
        with open(MESSAGES_FILE, 'r') as f:
            messages = json.load(f)
        return jsonify(messages)

    elif request.method == 'POST':
        data = request.json
        with open(MESSAGES_FILE, 'r') as f:
            messages = json.load(f)

        new_message = {
            'id': len(messages) + 1,
            'text': data.get('text', ''),
            'timestamp': datetime.now().isoformat(),
            'type': data.get('type', 'love')
        }
        messages.append(new_message)

        with open(MESSAGES_FILE, 'w') as f:
            json.dump(messages, f, indent=2)

        return jsonify(new_message)


@app.route('/api/photos', methods=['GET'])
def get_photos():
    """Get list of uploaded photos"""
    photos = []
    if os.path.exists(UPLOAD_FOLDER):
        for filename in os.listdir(UPLOAD_FOLDER):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                photos.append({
                    'filename': filename,
                    'url': f'/static/uploads/{filename}'
                })
    return jsonify(photos)


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get relationship stats"""
    # Calculate days together (customize this date!)
    start_date = datetime(2024, 1, 1)  # CHANGE THIS to your actual start date
    days_together = (datetime.now() - start_date).days

    with open(MESSAGES_FILE, 'r') as f:
        messages = json.load(f)

    photo_count = len([f for f in os.listdir(UPLOAD_FOLDER)
                       if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp'))])

    return jsonify({
        'days_together': days_together,
        'messages_sent': len(messages),
        'photos_shared': photo_count,
        'love_level': min(100, days_together // 10 + photo_count * 5 + len(messages) * 3)
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)