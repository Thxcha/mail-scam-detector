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
    <Box sx={{ backgroundColor: "#F5F5F5", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 4 }}>

      {/* SCAN SECTION */}
      <Grid container spacing={3} maxWidth="md" justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h3" fontWeight="700" textAlign="center" gutterBottom>
            Mail Scam Detector
          </Typography>

          <Typography variant="body1" color="gray" textAlign="center" sx={{ marginBottom: 3 }}>
            Place text for scam message scanning.
          </Typography>

          <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, backgroundColor: "white", textAlign: "center", boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}>

            {/* Input Box */}
            <Box
              sx={{
                position: "relative",
                maxWidth: 800,
                minHeight: 200,
                border: "2px solid #ddd",  //  Outer border stays
                borderRadius: "12px",
                backgroundColor: "white",
                padding: 2,
                overflow: "hidden",
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your text here..."
                style={{
                  width: "100%",
                  minHeight: "180px",
                  maxHeight: "250px",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  border: "none",  // Removes default textarea border
                  outline: "none", //  Prevents focus outline
                  padding: "12px",
                  resize: "none",  //  Disables manual resizing
                  overflowY: "auto",  //  Enables vertical scrolling
                  backgroundColor: "transparent",
                  fontFamily: "inherit",
                }}
              />

              {/* Clear Button */}
              {input.length > 0 && (
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 15,
                    top: 15,
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
            <Typography variant="caption" sx={{ mt: 1, color: "gray", textAlign: "left", display: "block" }}>
              {input.length} characters
            </Typography>

            {/* Scan Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "30px",
                marginTop: "16px",
                "&:hover": { backgroundColor: "#333" },
              }}
              onClick={handleScan}
            >
              SCAN NOW
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* HOW TO USE SECTION */}
      <Box sx={{ width: "100%", backgroundColor: "#FAFAFA", padding: "60px 0", marginTop: 8 }}>
        <Typography variant="h3" fontWeight="700" textAlign="center" sx={{ marginBottom: 5 }}>
          How To Use Mail Scam Detector
        </Typography>

        {steps.map((step, index) => (
          <StepCard key={index} step={step} index={index} />
        ))}
      </Box>

      {/* Snackbar Notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Steps Data
const steps = [
  {
    title: "Paste Your Message",
    description: "Copy and paste the suspicious email or message you received.",
    image: "/your-screenshot-image.png",
  },
  {
    title: "Click Scan",
    description: "Press the scan button to analyze the message for scam indicators.",
    image: "/your-screenshot-image.png",
  },
  {
    title: "Get Your Results",
    description: "The AI will detect if the message contains any scam patterns.",
    image: "/your-screenshot-image.png",
  }
];

// Reusable Step Component
const StepCard = ({ step, index }) => {
  return (
    <Grid container spacing={3} alignItems="center" justifyContent="center" maxWidth="lg" sx={{ marginBottom: 6 }}>
      {index % 2 === 0 ? (
        <>
          <StepImage image={step.image} />
          <StepText title={step.title} description={step.description} />
        </>
      ) : (
        <>
          <StepText title={step.title} description={step.description} />
          <StepImage image={step.image} />
        </>
      )}
    </Grid>
  );
};

const StepText = ({ title, description }) => (
  <Grid item xs={12} md={4}>
    <Typography variant="h5" fontWeight="700">{title}</Typography>
    <Typography variant="body1" sx={{ mt: 1 }}>{description}</Typography>
  </Grid>
);

const StepImage = ({ image }) => (
  <Grid item xs={12} md={6}>
    <img src={image} alt="Step Image" style={{ width: "100%", maxWidth: "500px", borderRadius: "8px" }} />
  </Grid>
);