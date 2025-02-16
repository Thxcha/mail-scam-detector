import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Snackbar, Alert, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ height: "100vh", textAlign: "center" }}
    >
      {/* Title & Subtitle */}
      <Typography variant="h3" gutterBottom>
          Mail Scam Detector
      </Typography>
      <Typography variant="body1" gutterBottom style={{ maxWidth: "600px" }}>
        Place text for spam message scanning.
      </Typography>

      {/* Input Box Container */}
      <Paper elevation={2} sx={{ width: "60%", padding: "20px", position: "relative" }}>
        <form onSubmit={handleScan}>
        {/* Text Input Box with Delete Icon */}
          <Box sx={{ position: "relative" }}>
            <TextField
              fullWidth
              multiline
              minRows={6}
              variant="outlined"
              placeholder="Enter your text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  pr: "40px", // Space for delete icon
                },
                overflow: "auto",
              }}
            />
            {/* Bin (Delete) Icon */}
            {input.length > 0 && (
              <IconButton
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                onClick={() => setInput("")}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

        {/* Word & Character Counter */}
        <Typography variant="caption" display="block" align="left" sx={{ mt: 1, color: "gray" }}>
          {input.length} characters 
        </Typography>

        {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" type="submit">
            Scan
            </Button>
          </Box>
          </form>
      </Paper>

      {/* Snackbar Notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}