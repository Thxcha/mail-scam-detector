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
    <Box sx={{backgroundColor:"#F5F5F5",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding: 4}}>
      <Grid container spacing={3} maxWidth="md" justifyContent="center">

      {/*Main Content Section*/ }
        <Grid 
          item xs = {12}>
          <Paper
            elevation ={2}
            sx={{padding: 4,
            borderRadius:2,
            backgroundColor:"white",
            textAlign:"center"}}>

      {/* Title & Subtitle */}
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Mail Scam Detector
          </Typography>
          <Typography variant="body2" color="gray" gutterBottom >
            Place text for scam message scanning.
          </Typography>

        {/* Input Box Container */}
        <Box sx ={{position:"relative",maxHeight:200, overflowY: "auto", mt: 2 }}>
          {/* Text Input Box with Delete Icon */}
            <Box sx={{ position: "relative" ,maxHeight:200,overflowY:"auto"}}>
              <TextField
                fullWidth
                multiline
                minRows={6}
                variant="outlined"
                placeholder="Enter your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                sx={{
                    maxHeight:200,
                    overflowY: "auto"
                  
                }}
              />
              {/* Bin (Delete) Icon */}
              {input.length > 0 && (
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    backgroungColor:"#f5f5f5","&:hover":
                    {backgroungColor:"#e0e0e0"}
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
          <Button 
            variant="contained" 
            sx={{ backgroundColor: "black", color: "white",borderRadius:"8px",marginTop:"16px","&:hover": { backgroundColor: "#333" } }} 
            fullWidth 
            style={{ marginTop: '16px' }} 
            type="submit"
            >
            SCAN
        </Button>
            </form>
        
          </Paper>
        </Grid>  
    </Grid>

        {/* Snackbar Notifications */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>zzzzzzzzzz
    </Box>
  );
}