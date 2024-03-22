import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

function Login({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          // Clear local storage only if a new user logs in
          if (localStorage.getItem('email') !== email) {
            localStorage.clear();
          }
          
          // Store email and nickname in localStorage
          localStorage.setItem('email', email);
          localStorage.setItem('nickname', data.final_nickname);

          setMessage('Login successful');
          setEmail('');
          setPassword('');
          // Redirect to dashboard on successful login
          window.location.href = '/dashboard';
        } else {
          setMessage('Invalid email or password');
        }
      })
      .catch(error => {
        setMessage('Error: ' + error.message);
      });
  };

  return (
    <div className="container">
      <div className="form">
        <h1>Login</h1>
        <div className="input-container">
          <FontAwesomeIcon icon={faEnvelope} className="email-icon" />
          <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="lock-icon" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <div className="button-container">
          <input type="submit" value="Login" onClick={handleLogin} />
        </div>
        <p className="error">{message}</p>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default Login;
