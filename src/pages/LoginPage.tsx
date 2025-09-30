import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);

      if (res.access_token) {
        // Save token, role, and userId
        localStorage.setItem("token", res.access_token);

        if (res.role) {
          localStorage.setItem("role", res.role);
        }

        if (res.userId) {
          localStorage.setItem("userId", res.userId);

          alert("Login successful!");

          // Redirect based on role
          if (res.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate(`/home/${res.userId}`);
          }
        } else {
          alert("User ID missing from response!");
        }
      } else {
        alert(res.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, bgcolor: "#222", color: "white" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
          <Button type="submit" variant="contained" color="error" size="large">
            Login
          </Button>
          <Button
            variant="text"
            color="error"
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
