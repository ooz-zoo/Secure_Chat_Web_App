from flask import Flask, request, jsonify, url_for, redirect, session
import firebase_admin
from flask_cors import CORS
from firebase_admin import auth, credentials, firestore, auth, initialize_app
from datetime import datetime
from Crypto.Cipher import AES
import base64
import secrets
import os
import requests
from Crypto.Util.Padding import pad, unpad



app = Flask(__name__)
CORS(app, supports_credentials=True)  # Enable CORS for all routes


cred = credentials.Certificate(r'C:\Users\admin\Downloads\testingcreds.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

#SIGNUP
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    nickname = data.get('nickname')

    # Validate input data
    if not email or not password or not nickname:
        return jsonify({'error': 'Email, password, and nickname are required'}), 400

    try:
        # Create user in Firebase Authentication
        user = auth.create_user(email=email, password=password)

        # Store additional user information in Firestore
        db.collection('users').document(user.uid).set({
            'email': email,
            'nickname': nickname
            # Add other user data as needed
        })

        return jsonify({'message': 'User created successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
    
# final_nickname = None  # Initialize the variable with None
@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        try:
            # Authenticate user using Firebase Authentication
            user = auth.get_user_by_email(email)
            user = auth.update_user(
                user.uid,
                password=password
            )
            token = auth.create_custom_token(user.uid)

            # Fetch user's nickname
            final_nickname = get_user_nickname(email)
            print('User email:', email)  # Print the email
            print('User nickname:', final_nickname)  # Print the nickname

            return jsonify({'token': token.decode('utf-8'), 'email': email, 'final_nickname': final_nickname}), 200
        except Exception as e:
            return jsonify({'error': 'Invalid email or password'}), 401
    
    elif request.method == 'GET':
        # Handle GET request (e.g., render a login form or provide information)
        return jsonify({'message': 'Login page'}), 200


def get_user_nickname(email):
    try:
        # Query Firestore collection 'users' for the user document with the given email
        user_ref = db.collection('users').where('email', '==', email).limit(1)
        user_doc = user_ref.get()
        
        # If user document found, extract the nickname field
        for doc in user_doc:
            final_nickname = doc.get('nickname')
            return final_nickname
        
        # If user not found or nickname field is missing, return None
        return None
    except Exception as e:
        print(f"Error fetching user's nickname: {e}")
        return None
 
# #ROOM-CREATION
@app.route('/create-room', methods=['POST'])
def create_room():
  data = request.get_json()
  room_name = data.get('name')
  room_description = data.get('description')

  # Validate data
  if not room_name or not room_description:
    return jsonify({'error': 'Invalid room details'}), 400

  # Prepare room data with timestamp
  new_room = {
      'name': room_name,
      'description': room_description,
      'created_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
  }

  # Save the room to Firestore
  try:
    doc_ref = db.collection('rooms').add(new_room)
    return (jsonify({'message': 'Room created successfully'}), 201) 
  except Exception as e:
    return jsonify({'error': str(e)}), 500
  

# @app.route('/create-room', methods=['GET'])
def handle_get_request():
    return jsonify({'error': 'Dashboard Page'}), 200

# #FETCHING ROOMS
@app.route('/fetch-rooms', methods=['GET'])
def fetch_rooms():
  try:
    rooms = []
    # Retrieve all rooms from Firestore
    room_data = db.collection('rooms').get()
    for doc in room_data:
      room_info = doc.to_dict()
      room_info['id'] = doc.id  # Add room id to room info
      rooms.append(room_info)
    return jsonify({'rooms': rooms}), 200
  except Exception as e:
    return jsonify({'error': str(e)}), 500


# #JOIN THE ROOM
@app.route('/join-room/<room_id>', methods=['GET'])
def join_room(room_id):
    # Implement logic for joining room
    # For now, let's redirect to a welcome page
    return redirect(url_for('send-message', room_id=room_id))

#WELCOME MESSAGE
@app.route('/welcome/<room_id>', methods=['GET'])
def welcome(room_id):
    # Render a welcome page or return a welcome message
    return jsonify({'message': f'Welcome to Room {room_id}'}), 200


# Send message endpoint
@app.route('/send-message/<room_id>', methods=['POST'])
def send_message(room_id):
    data = request.json
    encrypted_message = data.get('message')
    sender = data.get('sender')
    iv_hex = data.get('iv')

    try:
        if not encrypted_message or not sender or not iv_hex:
            return jsonify({'error': 'Encrypted message, sender, and IV are required'}), 400
        
        # Store encrypted message and IV in Firestore
        message_data = {
            'message': encrypted_message,
            'iv': iv_hex,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'room_id': room_id,
            'sender': sender
        }

        # Call the function to send message to Firestore
        send_message_to_firestore(room_id, message_data)
        # Instead of Firestore, you can use your database or storage solution here
        # For demonstration, let's just return the message data
        return jsonify({'message': message_data}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# # Function to send message to Firestore
def send_message_to_firestore(room_id, message):
    doc_ref = db.collection('rooms').document(room_id).collection('messages').add(message)


# Check if the secret key is already set in the environment
if 'secretKey' not in os.environ:
    # Generate a random secret key if not set
    secret_key = secrets.token_hex(16)  # Generate a 128-bit (16-byte) random key in hexadecimal format
    
    # Set the secret key as an environment variable
    os.environ['secretKey'] = secret_key

@app.route('/get-secret-key', methods=['GET'])
def get_secret_key():
    secret_key = os.environ.get('secretKey')
    print('Secret Key:', secret_key)
    return jsonify({'secretKey': secret_key}), 200


def fetch_messages_from_firestore(room_id):
    messages = []
    message_data = db.collection('rooms').document(room_id).collection('messages').order_by('timestamp', direction=firestore.Query.DESCENDING).get()
    for doc in message_data:
        message_info = doc.to_dict()
        message_info['id'] = doc.id

        
        messages.append(message_info)
    return messages
    

# # Fetch messages endpoint
@app.route('/fetch-messages/<room_id>', methods=['GET'])
def fetch_messages(room_id):
    try:
        messages = fetch_messages_from_firestore(room_id)
        return jsonify({'messages': messages}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

     
if __name__ == '__main__':
    app.run(debug=True)