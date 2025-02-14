import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Snackbar, Alert } from '@mui/material';

export default function AuthPage() {
  const [input, setInput] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch("/api/users/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_input: input.trim() }), // FIXED: Must match FastAPI model
        });

        if (!response.ok) {
            throw new Error("API Error: " + response.statusText);
        }

        const data = await response.json();

        setSnackbarMessage(data);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    } catch (error) {
        setSnackbarMessage(`Error: ${error.message}`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
    }
};


  return (
    <Grid container spacing={2} style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      {/* Input Form */}
      <Grid item xs={12} sm={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Mail Scam Detector
          </Typography>
          <form onSubmit={handleScan}>
            <TextField
              fullWidth
              label="Enter text"
              variant="outlined"
              margin="normal"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }} type="submit">
              Scan
            </Button>
          </form>
        </Paper>
      </Grid>

      {/* Snackbar Notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}