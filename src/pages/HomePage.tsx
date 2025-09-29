import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Card,
  CardMedia,
  IconButton,
  TextField,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { fetchMovies } from "../api";

interface Movie {
  id: number;
  title: string;
  posterUrl?: string;
  releaseYear: number;
}

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchMovies()
      .then(setMovies)
      .catch((err) => {
        console.error("Failed to fetch movies:", err);
        setMovies([]);
      });
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    const results = movies.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const addToFavorites = (movie: Movie) => {
    if (favorites.find((fav) => fav.id === movie.id)) {
      alert("Already in favorites!");
      return;
    }
    setFavorites([...favorites, movie]);
    alert(`${movie.title} added to favorites!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const displayedMovies = searchResults.length > 0 ? searchResults : movies;

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "black", mb: 3 }}
        elevation={0}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "red",
              fontFamily: "Bebas Neue, sans-serif",
              letterSpacing: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            MovieFlix
          </Typography>

          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List sx={{ width: 200 }}>
          {!role && (
            <>
              <ListItemButton onClick={() => navigate("/login")}>
                <ListItemText primary="Login" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate("/register")}>
                <ListItemText primary="Register" />
              </ListItemButton>
            </>
          )}
          {role === "ADMIN" && (
            <>
              <ListItemButton onClick={() => navigate("/admin")}>
                <ListItemText primary="Admin Panel" />
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          )}
          {role === "USER" && (
            <>
              <ListItemButton onClick={() => navigate("/favorites")}>
                <ListItemText primary="Favorites" />
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>

      <Container>
        <Box display="flex" gap={2} mb={3}>
          <TextField
            fullWidth
            label="Search for a movie"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
              },
            }}
          />
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (!query.trim()) {
                alert("Please enter a movie name before searching!");
                return;
              }
              handleSearch();
            }}
          >
            Search
          </Button>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={2}>
          {displayedMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  width: 200,
                  cursor: "pointer",
                  opacity: 0.9,
                  transition:
                    "transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.08)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
                    opacity: 1,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.posterUrl || "/fallback-poster.jpg"}
                  alt={movie.title}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.4)" },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToFavorites(movie);
                  }}
                >
                  <FavoriteBorderIcon sx={{ color: "white" }} />
                </IconButton>
                <Typography
                  variant="subtitle1"
                  sx={{ p: 1, background: "black", color: "white" }}
                >
                  {movie.title} ({movie.releaseYear})
                </Typography>
              </Card>
            </Link>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
