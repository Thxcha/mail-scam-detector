import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Paper, Snackbar, Alert, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AuthPage() {
    const [input, setInput] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => setOpenSnackbar(false);

    const handleScan = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/users/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_input: input.trim() }),
            });

            if (!response.ok) throw new Error("API Error: " + response.statusText);

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
        <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}>
            <Grid container spacing={3} maxWidth="md" justifyContent="center">

                {/* Main Content Section */}
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ padding: 4, borderRadius: 2, backgroundColor: "white", textAlign: "center" }}>

                        {/* Title & Subtitle */}
                        <Typography variant="h4" fontWeight="700" gutterBottom>
                            Mail Scam Detector
                        </Typography>
                        <Typography variant="body2" color="gray" gutterBottom>
                            Place text for scam message scanning.
                        </Typography>

                        {/* Input Section */}
                        <Box sx={{ position: "relative", maxHeight: 200, overflowY: "auto", mt: 2 }}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={6}
                                variant="outlined"
                                placeholder="Enter your text here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                sx={{ pr: "50px" ,"&.MuiOutlinedInput-root":
                                    {paddingRight: "50px",},
                                }} 
                            />
                            {input.length > 0 && (
                                <IconButton
                                    sx={{
                                        position: "absolute",
                                        right: 20, // Adjusts the position
                                        top: 27,
                                        transform:"translateY(-50%)",
                                        backgroundColor: "#F5F5F5",
                                        "&:hover": { backgroundColor: "#E0E0E0" }
                                    }}
                                    onClick={() => setInput("")}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>

                        {/* Character Counter */}
                        <Typography variant="caption" display="block" sx={{ mt: 1, color: "gray" }}>
                            {input.length} characters
                        </Typography>

                        {/* Scan Button */}
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: "black",
                                color: "white",
                                borderRadius: "8px",
                                marginTop: "16px",
                                "&:hover": { backgroundColor: "#333" }
                            }}
                            onClick={handleScan}
                        >
                            SCAN
                        </Button>

                        {/* How to Use Section */}
                        <Grid item xs={12} sx={{ mt: 4 }}>
                            <Typography variant="h4" fontWeight="700" textAlign="center">
                                How To Use Mail Scam Detector
                            </Typography>
                        </Grid>

                        {/* Two-Column Layout */}
                        <Grid container spacing={3} alignItems="center" justifyContent="center">
                            {/*1 Left: Screenshot Box */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: "center", border: "2px solid black", borderRadius: "8px" }}>
                                    <img src="/your-screenshot-image.png" alt="Mail Scam Detector" style={{ width: "100%", borderRadius: "8px" }} />
                                </Paper>
                            </Grid>

                            {/*1 Right: Steps */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ padding: 3, borderRadius: "8px" }}>
                                    <Typography variant="h5" fontWeight="700">
                                        1️ Paste Email Scam Message
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Whether it’s an article, blog post, or any piece of writing, simply input the content and let StealthWriter do the magic.
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/*2 Left: Screenshot Box */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ padding: 3, borderRadius: "8px" }}>
                                    <Typography variant="h5" fontWeight="700">
                                        2 Paste Email Scam Message
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Whether it’s an article, blog post, or any piece of writing, simply input the content and let StealthWriter do the magic.
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/*2 Right: Steps */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: "center", border: "2px solid black", borderRadius: "8px" }}>
                                    <img src="/your-screenshot-image.png" alt="Mail Scam Detector" style={{ width: "100%", borderRadius: "8px" }} />
                                </Paper>
                            </Grid>

                            {/*3 Left: Screenshot Box */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ padding: 3, textAlign: "center", border: "2px solid black", borderRadius: "8px" }}>
                                    <img src="/your-screenshot-image.png" alt="Mail Scam Detector" style={{ width: "100%", borderRadius: "8px" }} />
                                </Paper>
                            </Grid>

                            {/*3 Right: Steps */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ padding: 3, borderRadius: "8px" }}>
                                    <Typography variant="h5" fontWeight="700">
                                        3 Paste Email Scam Message
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Whether it’s an article, blog post, or any piece of writing, simply input the content and let StealthWriter do the magic.
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                    </Paper>

                </Grid>
            </Grid>


            {/* Snackbar Notifications */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box >
    );
}
