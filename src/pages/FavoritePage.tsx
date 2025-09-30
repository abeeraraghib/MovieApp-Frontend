import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { fetchFavoritesByUser, removeFavorite } from "../api";

interface Movie {
  id: number;
  title: string;
  description?: string;
  posterUrl: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  // Current logged-in user ID from localStorage
  const currentUserId = Number(localStorage.getItem("userId"));

  // Load favorites from backend
  const loadFavorites = async () => {
    const idToFetch = userId ? Number(userId) : currentUserId;
    if (!idToFetch) return;

    setLoading(true);
    try {
      const data: Movie[] = await fetchFavoritesByUser(idToFetch);
      setFavorites(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  // Remove a favorite with optimistic UI update
  const handleRemoveFavorite = async (movieId: number) => {
    const idToModify = userId ? Number(userId) : currentUserId;
    if (!idToModify) return;

    // Optimistic update
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));

    try {
      await removeFavorite(idToModify, movieId);
    } catch (err) {
      console.error(err);
      alert("Failed to remove favorite");
      loadFavorites(); // fallback if API fails
    }
  };

  if (loading)
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress color="error" />
      </Container>
    );

  return (
    <Container sx={{ mt: 8 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <Typography color="white" variant="h4">
          {userId ? `Favorites of User ${userId}` : "My Favorites"}
        </Typography>
      </Stack>

      {favorites.length === 0 ? (
        <Typography color="white">
          {userId
            ? "This user has no favorites."
            : "You have no favorites yet."}
        </Typography>
      ) : (
        <Stack spacing={3}>
          {favorites.map((movie) => (
            <Card
              key={`fav-${movie.id}`}
              sx={{ bgcolor: "#222", color: "white" }}
            >
              <CardMedia
                component="img"
                sx={{ height: 500, width: 400, objectFit: "cover" }}
                image={movie.posterUrl || "/fallback-poster.jpg"}
                alt={movie.title}
              />
              <CardContent>
                <Typography variant="h6">{movie.title}</Typography>
                <Typography variant="body2">
                  {movie.description || "No description"}...
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  {!userId && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveFavorite(movie.id)}
                    >
                      Remove
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    View
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
