import React, { useState, useEffect } from 'react';

function Dashboard() {
 const [rooms, setRooms] = useState([]);
 const [newRoomName, setNewRoomName] = useState('');
 const [newRoomDescription, setNewRoomDescription] = useState('');
 const [message, setMessage] = useState('');

 useEffect(() => {
    fetchRooms();
 }, []);

 const fetchRooms = () => {
    fetch('http://127.0.0.1:5000/fetch-rooms')
      .then(response => response.json())
      .then(data => {
        setRooms(data.rooms);
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
    fetchRooms(); // Refresh rooms list after creating a new room
  } catch (error) {
    console.error('Error creating room:', error);
    setMessage('Failed to create room. Please try again.'); // Set error message
  }
};

//  const createRoom = () => {
//     fetch('http://127.0.0.1:5000/create-room', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ name: newRoomName, description: newRoomDescription }),
//     })
//       .then(response => response.json())
//       .then(data => {
//         setMessage(data.message); // Update message state with success message
//         setNewRoomName('');
//         setNewRoomDescription('');
//         fetchRooms(); // Refresh rooms list after creating a new room
//       })
//       .catch(error => {
//         console.error('Error creating room:', error);
//       });
//  };

 return (
    <div>
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
      <ul>
        {rooms.map(room => (
          <li key={room.id}>
            <span>{room.name}</span>
            {/* Implement join room functionality */}
          </li>
        ))}
      </ul>
    </div>
 );
}

export default Dashboard;
