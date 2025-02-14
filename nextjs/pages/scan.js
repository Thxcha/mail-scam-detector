import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Snackbar, Alert } from '@mui/material';


export default function AuthPage() {
 const [loginEmail, setLoginEmail] = useState('');
 const [loginPassword, setLoginPassword] = useState('');
 const [registerName, setRegisterName] = useState('');
 const [registerEmail, setRegisterEmail] = useState('');
 const [registerPassword, setRegisterPassword] = useState('');
 const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
 const [openSnackbar, setOpenSnackbar] = useState(false);
 const [snackbarMessage, setSnackbarMessage] = useState('');
 const [snackbarSeverity, setSnackbarSeverity] = useState('success');
 const [input, setInput] = useState('');


const handleSnackbarClose = () => {
   setOpenSnackbar(false);
 };


const handleScan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/predict', {
        method: 'Get',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_input: input
        }),
      });
      setSnackbarMessage(response);
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
 



 return (
   <Grid container spacing={2} style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
    {/* Login Section */}
    <Grid item xs={12} sm={6}>
       <Paper elevation={3} style={{ padding: '20px' }}>
         <Typography variant="h5" gutterBottom>
           Login
         </Typography>
         <form onSubmit={handleScan}>
           <TextField
             fullWidth
             label="Text"
             variant="outlined"
             margin="normal"
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
           />
           <Button variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }} type="submit">
             scan
           </Button>
         </form>
       </Paper>
     </Grid>
    {/* Snackbar for notifications */}
     <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
       <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
       </Alert>
     </Snackbar>
   </Grid>
 );
}