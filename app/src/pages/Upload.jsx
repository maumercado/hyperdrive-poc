import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const { drive } = useParams();

  const onFileChange = event => {
    setSelectedFile(event.target.files.item(0));
  };

  const onDescriptionChange = event => {
    setDescription(event.target.value);
  };

  const onFileUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData();

    formData.append('description', description);
    formData.append(
      'file',
      selectedFile,
      selectedFile.name
    );

    console.log(description, 'description')

    try {
      await axios({
        method: 'post',
        url: `http://${window.location.hostname}:3001/${drive}/upload`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMessage('File uploaded successfully!');
    } catch (error) {
      console.error(error);
      setError('Error uploading file. Please try again.');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="container">
      <h1>Upload your File to {drive}</h1>
      {error && <p>{error}</p>}
      <form>
        <input type="file" onChange={onFileChange} />
        <input type="text" placeholder="Description" onChange={onDescriptionChange} value={description} />
        <button onLoad={() => setLoading(true)} onClick={onFileUpload}>Upload!</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default UploadPage;
