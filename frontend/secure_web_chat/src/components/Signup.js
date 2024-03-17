// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

// function Signup() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const validateEmail = () => {
//     // Regular expression for email validation
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailPattern.test(email);
//   };

//   const validatePassword = () => {
//     // Check if password is at least 8 characters long
//     return password.length >= 8;
//   };

//   const handleSignup = () => {
//     if (!validateEmail()) {
//       setMessage('Please enter a valid email address.');
//       return;
//     }

//     if (!validatePassword()) {
//       setMessage('Password must be at least 8 characters long.');
//       return;
//     }

//     fetch('http://127.0.0.1:5000/signup', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, email, password }),
//     })
//       .then(response => response.json())
//       .then(data => {
//         setMessage(data.message);
//         setUsername('');
//         setEmail('');
//         setPassword('');
//         // Redirect to login page after successful signup
//         window.location.href = '/login';
//       })
//       .catch(error => {
//         setMessage('Error: ' + error.message);
//       });
//   };

//   return (
//     <div className="container">
//       <div className="form">
//         <h1>Signup</h1>
//         <div className="input-container">
//           <FontAwesomeIcon icon={faUser} className="username-icon" />
//           <input 
//             type="text" 
//             placeholder="Username" 
//             value={username} 
//             onChange={e => setUsername(e.target.value)} 
//             className="username-input" 
//           />
//         </div>
//         <div className="input-container">
//           <FontAwesomeIcon icon={faEnvelope} className="email-icon" />
//           <input 
//             type="text" 
//             placeholder="Email" 
//             value={email} 
//             onChange={e => setEmail(e.target.value)} 
//             className="email-input" 
//           />
//         </div>
//         <div className="input-container">
//           <FontAwesomeIcon icon={faLock} className="lock-icon" />
//           <input 
//             type="password" 
//             placeholder="Password" 
//             value={password} 
//             onChange={e => setPassword(e.target.value)} 
//             className="password-input" 
//           />
//         </div>
//         <div className="button-container">
//           <input type="submit" value="Signup" onClick={handleSignup} />
//         </div>
//         <p className="error">{message}</p>
//         <p>Already have an account? <Link to="/login">Login</Link></p>
//       </div>
//     </div>
//   );
// }

// export default Signup;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

function Signup() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = () => {
    return password.length >= 8;
  };

  const handleSignup = () => {
    if (!validateEmail()) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (!validatePassword()) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    fetch('http://127.0.0.1:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname, email, password }),
    })
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setNickname('');
        setEmail('');
        setPassword('');
        window.location.href = '/login';
      })
      .catch(error => {
        setMessage('Error: ' + error.message);
      });
  };

  return (
    <div className="container">
      <div className="form">
        <h1>Signup</h1>
        <div className="input-container">
          <FontAwesomeIcon icon={faUser} className="username-icon" />
          <input 
            type="text" 
            placeholder="Nickname" 
            value={nickname} 
            onChange={e => setNickname(e.target.value)} 
            className="username-input" 
          />
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faEnvelope} className="email-icon" />
          <input 
            type="text" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="email-input" 
          />
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="lock-icon" />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="password-input" 
          />
        </div>
        <div className="button-container">
          <input type="submit" value="Signup" onClick={handleSignup} />
        </div>
        <p className="error">{message}</p>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Signup;
