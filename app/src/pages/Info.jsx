import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const InfoPage = () => {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios({
          method: 'get',
          url: `http://${window.location.hostname}:3001/info`,
        });
        setInfo(response.data);
      } catch (err) {
        setError('An error occurred while fetching the info');
      }
    };

    fetchInfo();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(null);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(info.key);
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
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ position: 'absolute', left: 15, top: 15 }}
      >
        Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Info Page
      </Typography>
      {info ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Key: {info.key}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleCopy}>
            Copy Key
          </Button>
        </Box>
      ) : (
        <Typography variant="body1" gutterBottom>
          Loading...
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

export default InfoPage;
