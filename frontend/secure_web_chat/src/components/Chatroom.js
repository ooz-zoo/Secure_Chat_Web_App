import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import CryptoJS from 'crypto-js';

const Chatroom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [storedNickname, setNickname] = useState('');
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    // Fetch user's nickname and email from local storage
    const fetchUserInfo = () => {
      const storedNickname = localStorage.getItem('nickname');
      setNickname(storedNickname);
      console.log('Fetched nickname from local storage:', storedNickname);
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchSecretKey = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-secret-key');
        if (response.ok) {
          const data = await response.json();
          setSecretKey(data.secretKey);
          console.log('Secret Key received:', data.secretKey); // Log the secret key to the console
        } else {
          throw new Error('Failed to fetch secret key');
        }
      } catch (error) {
        console.error('Error fetching secret key:', error);
      }
    };
  
    fetchSecretKey();
  }, []);
  
  const decryptMessage = (encryptedMessage, key, iv) => {
    try {
      const decipher = CryptoJS.AES.decrypt(encryptedMessage, key, { iv: CryptoJS.enc.Hex.parse(iv) });
      if (decipher.sigBytes < 0) {
        return ''; // Return empty string for invalid decryption
      }
      // Convert the decrypted data to plaintext (UTF-8 encoding)
      const plaintext = decipher.toString(CryptoJS.enc.Utf8);
      return plaintext;
    } catch (error) {
      console.error('Error decrypting message:', error);
      return ''; // Return empty string for decryption errors
    }
  };
  
  
// Define fetchMessages function
const fetchMessages = useCallback(async () => {
  try {
    const response = await fetch(`http://localhost:5000/fetch-messages/${roomId}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Received data:', data); // Log the received data
      const decryptedMessages = data.messages.map(message => {
        console.log('Encrypted message:', message.message); // Log the encrypted message
        console.log('IV:', message.iv); // Log the IV
        const decryptedMessage = decryptMessage(message.message, secretKey, message.iv);
        console.log('Decrypted message:', decryptedMessage); // Log the decrypted message
        return { ...message, message: decryptedMessage };
      });
      setMessages(decryptedMessages);
    } else {
      throw new Error('Failed to fetch messages');
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}, [roomId, secretKey]);


// UseEffect hook to fetch messages
useEffect(() => {
  fetchMessages();
  const interval = setInterval(fetchMessages, 15000);
  return () => clearInterval(interval);
}, [fetchMessages, roomId]);

  const sendMessage = useCallback(async () => {
    try {
      const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV
      const encryptedMessage = CryptoJS.AES.encrypt(newMessage, secretKey, { iv: iv }).toString();
      
      const ivHex = CryptoJS.enc.Hex.stringify(iv); // Convert IV to hexadecimal string
      console.log('secretkey:', secretKey)
      console.log('Encrypted message:', encryptedMessage);
      console.log('IV:', ivHex);
      const response = await fetch(`http://localhost:5000/send-message/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: encryptedMessage,
          sender: storedNickname,
          iv: ivHex, // Send the IV to the server
          // secretKey: secretKey // Send the secret key to the server
        }),
      });
      if (response.ok) {
        console.log('Message sent successfully');
        setNewMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [roomId, newMessage, storedNickname, secretKey]);

  return (
    <div className="chat-container">
      <h2 className="chat-title">Chat Room</h2>
      <div className="message-container">
      {messages.slice().reverse().map((message, index) => (
        <div key={index} className={`message ${message.sender === storedNickname ? 'sent' : 'received'}`}>
          <div className="sender">{message.sender === storedNickname ? 'You' : message.sender}</div>
          <div className="message-content">{message.message}</div>
        </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default Chatroom;
