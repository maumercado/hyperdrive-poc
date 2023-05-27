import React, { useState } from 'react';
import axios from 'axios';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const onFileChange = event => {
    setSelectedFile(event.target.files.item(0));
  };

  const onDescriptionChange = event => {
    setDescription(event.target.value);
  };

  const onFileUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData();

    formData.append(
      'file',
      selectedFile,
      selectedFile.name
    );
    formData.append('description', description);

    try {
      await axios({
        method: 'post',
        url: 'http://localhost:3001/upload',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('File uploaded successfully!');
    } catch (error) {
      console.error(error);
      setError('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Upload your File</h1>
      {error && <p>{error}</p>}
      <form>
        <input type="file" onChange={onFileChange} />
        <input type="text" placeholder="Description" onChange={onDescriptionChange} value={description} />
        <button onClick={onFileUpload}>Upload!</button>
      </form>
    </div>
  );
}

export default UploadPage;
