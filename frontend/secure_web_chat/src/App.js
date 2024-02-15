import React, {useState, useEffect} from 'react'

function App() {

  const [message, setMessage] = useState('')

  useEffect(() => {

    fetch('http://127.0.0.1:5000/hello')
    .then((response) => response.text())
    .then((data) => {
      setMessage(data);
      console.log(data);
    });
  },[]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;