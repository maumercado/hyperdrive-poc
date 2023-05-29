import React, { useState } from 'react';
import axios from 'axios';

const CreateDrive = () => {
  const [username, setUsername] = useState(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const onUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const onSubmit = async (e) => {
    setError('');
    e.preventDefault()
    setUsername(e.target.value)

    try {
      const response = await axios({
        method: 'post',
        url: `http://${window.location.hostname}:3001/create-drive`,
        data: {
          username
        },
        headers: { 'Content-Type': 'application/json' }
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setError('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Create a Drive</h1>
      {error && <p>{error}</p>}
      <form>
        <input type="text" placeholder="username" onChange={onUsernameChange} value={username} />
        <button onClick={onSubmit}>Create drive for given username!</button>
      </form>
      {result && Object.keys(result).map((key) => {
        return (
          <p key={key}>{key}: {result[key]}</p>
        )
      })}
    </div>
  );
}

export default CreateDrive;
