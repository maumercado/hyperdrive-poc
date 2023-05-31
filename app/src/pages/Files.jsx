import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, List, ListItem, ListItemText, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios({
          method: 'get',
          url: `http://${window.location.hostname}:3001/files`,
        });
        setFiles(response.data.files);
      } catch (err) {
        setError('An error occurred while fetching the files');
      }
    };

    fetchFiles();
  }, []);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(null);
  };

  const handleBack = () => {
    navigate(-1);
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
    ><Button
      startIcon={<ArrowBackIcon />}
      onClick={handleBack}
      sx={{ position: 'absolute', left: 15, top: 15 }}
    >
        Back
      </Button>
      <Typography variant="h4" gutterBottom>
        File List
      </Typography>
      {files.length > 0 ? (
        <List>
          {files.map((file) => (
            <ListItem key={file.name}>
              <ListItemText primary={file.name} secondary={file.metadata} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" gutterBottom>
          No files found
        </Typography>
      )}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="error" elevation={6} variant="filled">
          {error}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default FilesPage;
