import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress, Snackbar, TextField, Link as MuiLink } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [description, setDescription] = useState('');


  const resetForm = () => {
    setSelectedFile(null);
    setDescription('');
  };


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleUpload = async (e) => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }
    e.preventDefault()
    const formData = new FormData();

    formData.append('description', description);
    formData.append(
      'file',
      selectedFile,
      selectedFile.name
    );

    setLoading(true);
    try {
      await axios({
        method: 'post',
        url: `http://${window.location.hostname}:3001/upload`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      resetForm();
    } catch (err) {
      setError('An error occurred while uploading the file');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(null);
    setSuccess(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.paper',
        p: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Upload File
      </Typography>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > :not(style)': { m: 1 },
        }}
      >
        <input
          accept="*/*"
          style={{ display: 'none' }}
          id="contained-button-file"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span">
            Select File
          </Button>
        </label>
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={handleDescriptionChange}
        />
        {selectedFile && (
          <Typography variant="body1" gutterBottom>
            {selectedFile.name}
          </Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleUpload} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </Box>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="error" elevation={6} variant="filled">
          {error}
        </MuiAlert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="success" elevation={6} variant="filled">
          File successfully uploaded
        </MuiAlert>
      </Snackbar>
      <Box sx={{ mt: 2 }}>
        <MuiLink component={Link} to="/files" underline="hover">
          See the list of uploaded files
        </MuiLink>
      </Box>
      <Box sx={{ mt: 2 }}>
        <MuiLink component={Link} to="/info" underline="hover">
          See the key for the hyperdrive so you can check the files using  holepunch/drives CLI
        </MuiLink>
      </Box>
    </Box>
  );
};

export default UploadPage;
