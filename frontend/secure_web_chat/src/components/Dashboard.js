import React, { useState, useEffect } from 'react';
import '../App.css'; // Import CSS for styling

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms(); // Fetch rooms when component mounts
    const interval = setInterval(fetchRooms, 215000); // Poll rooms every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchRooms = () => {
    fetch('http://127.0.0.1:5000/fetch-rooms')
      .then(response => response.json())
      .then(data => {
        setRooms(data.rooms.map(room => ({
          ...room,
          joined: false, // Add joined property
        })));
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  };

  const createRoom = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newRoomName, description: newRoomDescription }),
      });

      const data = await response.json();
      setMessage(data.message); // Update message state with success message
      setNewRoomName('');
      setNewRoomDescription('');
    } catch (error) {
      console.error('Error creating room:', error);
      setMessage('Failed to create room. Please try again.'); // Set error message
    }
  };

  const toggleRoomDetails = (roomId) => {
    setSelectedRoom(selectedRoom === roomId ? null : roomId);
  };

  const joinRoom = (roomId) => {
    // Navigate to the ChatRoom component with the roomId as a URL parameter
    window.location.href = `/chat-room/${roomId}`;
  };

  return (
    <div className="dashboard-container">
      <h2>Create New Room</h2>
      <input
        type="text"
        placeholder="Room Name"
        value={newRoomName}
        onChange={e => setNewRoomName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Room Description"
        value={newRoomDescription}
        onChange={e => setNewRoomDescription(e.target.value)}
      />
      <button onClick={createRoom}>Create Room</button>
      <p>{message}</p> {/* Display the message here */}

      <h2>Rooms</h2>
      <div className="rooms-container">
        {rooms.map(room => (
          <div key={room.id} className="room-container">
            <div className="room-header" onClick={() => toggleRoomDetails(room.id)}>
              <span className="room-name">{room.name}</span>
              {selectedRoom === room.id && (
                <button className="join-button" onClick={() => joinRoom(room.id)}>
                 Join
                </button>
              )}
            </div>
            {selectedRoom === room.id && (
              <div className="room-details">
                <p>{room.description}</p>
                <p>Created at: {room.created_at}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
