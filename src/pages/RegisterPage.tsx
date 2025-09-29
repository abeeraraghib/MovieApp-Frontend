import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await registerUser(name, email, password);
      if (res.id) {
        alert("Account successfully created!");
        navigate("/login");
      } else {
        alert(res.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, bgcolor: "#222", color: "white" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleRegistration}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{ sx: { color: "white" } }}
            InputLabelProps={{ sx: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
              },
            }}
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ sx: { color: "white" } }}
            InputLabelProps={{ sx: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ sx: { color: "white" } }}
            InputLabelProps={{ sx: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
              },
            }}
          />
          <Button type="submit" variant="contained" size="large" color="error">
            Register
          </Button>
          <Button
            variant="text"
            color="error"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
