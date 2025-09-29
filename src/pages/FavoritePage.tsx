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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFavoritesByUser, removeFavorite } from "../api";

interface Movie {
  id: number;
  title: string;
  description?: string;
  posterUrl: string;
}

interface Favorite {
  id: number;
  user: { id: number; name: string; email: string };
  movie: Movie;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();

  const loadFavorites = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await fetchFavoritesByUser(Number(userId));
      console.log("Favorites API response:", data);
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

  const handleRemoveFavorite = async (movieId: number) => {
    if (!userId) return;
    try {
      await removeFavorite(Number(userId), movieId);
      loadFavorites();
    } catch (err) {
      console.error(err);
      alert("Failed to remove favorite");
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
      <Typography variant="h4" gutterBottom>
        Favorites of User {userId}
      </Typography>
      {favorites.length === 0 ? (
        <Typography>No favorites yet.</Typography>
      ) : (
        <Stack spacing={3}>
          {favorites.map((fav, index) => (
            <Card key={index} sx={{ bgcolor: "#222", color: "white" }}>
              <CardMedia
                component="img"
                height="300"
                image={fav.movie?.posterUrl || "/fallback-poster.jpg"}
                alt={fav.movie?.title}
              />
              <CardContent>
                <Typography variant="h6">{fav.movie?.title}</Typography>
                <Typography variant="body2">
                  {fav.movie?.description || "No description"}...
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveFavorite(fav.movie.id)}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate(`/movie/${fav.movie.id}`)}
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
