// import React, {useState, useEffect} from 'react'

// function App() {

//   const [message, setMessage] = useState('')

//   useEffect(() => {

//     fetch('http://127.0.0.1:5000/hello')
//     .then((response) => response.text())
//     .then((data) => {
//       setMessage(data);
//       console.log(data);
//     });
//   },[]);

//   return (
//     <div>
//       <h1>{message}</h1>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Chatroom from './components/Chatroom';
import './App.css';

import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat-room/:roomId" element={<Chatroom />} />
      </Routes>
    </Router>
  );
}

export default App;
