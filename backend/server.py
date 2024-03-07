from flask import Flask, request, jsonify, url_for, redirect
import firebase_admin
from flask_cors import CORS
from firebase_admin import auth, credentials, firestore
from datetime import datetime


app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes
CORS(app)

cred = credentials.Certificate(r'C:\Users\admin\Downloads\chatfirebase.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        username = data.get('name')  # Extract username from request data

        try:
            # Create user in Firebase Authentication
            user = auth.create_user(email=email, password=password, display_name=username)
            
            # Verify user creation
            user_record = auth.get_user(user.uid)
            print('Successfully created user:', user_record.email)
            
            return jsonify({'message': 'User created successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    
    elif request.method == 'GET':
        # Handle GET request (e.g., render a signup form or provide information)
        return jsonify({'message': 'Signup page'}), 200
    
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
            return jsonify({'token': token.decode('utf-8')})
        except Exception as e:
            return jsonify({'error': 'Invalid email or password'}), 401
    
    elif request.method == 'GET':
        # Handle GET request (e.g., render a login form or provide information)
        return jsonify({'message': 'Login page'}), 200
    

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
  

@app.route('/create-room', methods=['GET'])
def handle_get_request():
    return jsonify({'error': 'Dashboard Page'}), 200

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

@app.route('/join-room/<room_id>', methods=['GET'])
def join_room(room_id):
    # Implement logic for joining room
    # For now, let's redirect to a welcome page
    return redirect(url_for('welcome', room_id=room_id))

@app.route('/welcome/<room_id>', methods=['GET'])
def welcome(room_id):
    # Render a welcome page or return a welcome message
    return jsonify({'message': f'Welcome to Room {room_id}'}), 200
 
if __name__ == '__main__':
    app.run(debug=True)
