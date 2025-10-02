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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchMovies,
  fetchMoviesByGenre,
  addFavorite,
  fetchFavoritesByUser,
  removeFavorite,
} from "../api";

interface Movie {
  id: number;
  title: string;
  posterUrl?: string;
  releaseYear: number;
}

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [loginPopup, setLoginPopup] = useState(false);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchMovies()
      .then(setMovies)
      .catch((err) => {
        console.error("Failed to fetch movies:", err);
        setMovies([]);
      });
  }, []);

  useEffect(() => {
    if (userId) {
      fetchFavoritesByUser(Number(userId))
        .then(setFavorites)
        .catch((err) => console.error("Failed to fetch favorites:", err));
    }
  }, [userId]);

  const handleSearch = () => {
    if (!query.trim()) return;
    const results = movies.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setIsFiltering(true);
  };

  const handleGenre = async (genre: string) => {
    setSelectedGenre(genre);
    setIsFiltering(true);
    if (!genre) {
      const allMovies = await fetchMovies();
      setSearchResults(allMovies);
      setIsFiltering(false);
    } else {
      const data = await fetchMoviesByGenre(genre);
      setSearchResults(data);
    }
  };

  const handleAddToFavorites = async (movie: Movie) => {
    if (!userId) {
      alert("Please log in to add favorites");
      return;
    }
    if (favorites.find((fav) => fav.id === movie.id)) {
      alert("Already in favorites!");
      return;
    }
    try {
      await addFavorite(Number(userId), movie.id);
      setFavorites([...favorites, movie]);
      alert(`${movie.title} added to favorites!`);
    } catch (err) {
      console.error(err);
      alert("Failed to add favorite.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  useEffect(() => {
    if (!userId || !role) {
      setLoginPopup(true);
    }
  }, [userId, role]);

  const displayedMovies = isFiltering ? searchResults : movies;

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: "black", mb: 3 }}>
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
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
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

        <Box mb={3}>
          {role === "USER" && (
            <Button
              variant="contained"
              color="error"
              onClick={() => setShowFavs(!showFavs)}
            >
              {showFavs ? "Hide Favorites" : "My Favorites"}
            </Button>
          )}
          <Button
            onClick={() => setShowGenres(!showGenres)}
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
          >
            Genres
          </Button>
          {showGenres && (
            <Box display="flex" flexDirection="column" mt={1}>
              {["Action", "Horror", "Comedy", "Fantasy", "Adventure"].map(
                (genre) => (
                  <Button
                    key={genre}
                    onClick={() => handleGenre(genre)}
                    sx={{
                      justifyContent: "flex-start",
                      backgroundColor:
                        selectedGenre === genre ? "red" : "transparent",
                      color: selectedGenre === genre ? "white" : "white",
                      "&:hover": {
                        backgroundColor:
                          selectedGenre === genre
                            ? "darkred"
                            : "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    {genre}
                  </Button>
                )
              )}
              <Button
                onClick={() => handleGenre("")}
                variant={selectedGenre === "" ? "contained" : "outlined"}
                color="error"
              >
                Clear
              </Button>
            </Box>
          )}
        </Box>

        {showFavs && favorites.length > 0 && (
          <Box mb={4}>
            <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
              My Favorites
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {favorites.map((movie) => (
                <Card
                  key={movie.id}
                  sx={{
                    width: 140,
                    height: 210,
                    position: "relative",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={movie.posterUrl || "/fallback-poster.jpg"}
                    alt={movie.title}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.4)" },
                    }}
                    onClick={async () => {
                      try {
                        await removeFavorite(Number(userId), movie.id);
                        setFavorites(
                          favorites.filter((fav) => fav.id !== movie.id)
                        );
                        alert(`${movie.title} removed from favorites`);
                      } catch (err) {
                        console.error(err);
                        alert("Failed to remove favorite.");
                      }
                    }}
                  >
                    <DeleteIcon sx={{ color: "red" }} />
                  </IconButton>

                  <Typography
                    variant="body2"
                    sx={{ p: 1, background: "black", color: "white" }}
                  >
                    {movie.title}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        <Box display="flex" flexWrap="wrap" gap={2}>
          {displayedMovies.length === 0 ? (
            <Typography color="white" variant="h6">
              No movies found
            </Typography>
          ) : (
            displayedMovies.map((movie) => {
              const isFavorite = favorites.some((fav) => fav.id === movie.id);

              return (
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
                      onClick={async () => {
                        if (!userId) {
                          alert("Please log in first!");
                          return;
                        }

                        if (isFavorite) {
                          try {
                            await removeFavorite(Number(userId), movie.id);
                            setFavorites(
                              favorites.filter((fav) => fav.id !== movie.id)
                            );
                            alert(`${movie.title} removed from favorites`);
                          } catch (err) {
                            console.error(err);
                            alert("Failed to remove favorite.");
                          }
                        } else {
                          handleAddToFavorites(movie);
                        }
                      }}
                    >
                      {isFavorite ? (
                        <DeleteIcon sx={{ color: "red" }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ color: "white" }} />
                      )}
                    </IconButton>

                    <Typography
                      variant="subtitle1"
                      sx={{ p: 1, background: "black", color: "white" }}
                    >
                      {movie.title} ({movie.releaseYear})
                    </Typography>
                  </Card>
                </Link>
              );
            })
          )}
        </Box>
        <Dialog
          open={loginPopup}
          onClose={() => {
            setLoginPopup(false);
            navigate("/login");
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>Login Required</DialogTitle>
          <DialogContent>
            <Typography>You need to log in first to view this page.</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setLoginPopup(false);
                navigate("/login");
              }}
              color="error"
              variant="contained"
            >
              Go to Login
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default HomePage;
