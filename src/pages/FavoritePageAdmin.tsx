import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFavoritesByUser } from "../api";

interface Movie {
  id: number;
  title: string;
  description?: string;
  posterUrl: string;
}

export default function FavoritesPageAdmin() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const data: Movie[] = await fetchFavoritesByUser(Number(userId));
        setFavorites(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [userId]);

  if (loading) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress color="error" />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 8 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <Typography color="white" variant="h4">
          Favorites of User {userId}
        </Typography>
      </Stack>

      {favorites.length === 0 ? (
        <Typography color="white">This user has no favorites.</Typography>
      ) : (
        <Stack spacing={3}>
          {favorites.map((movie) => (
            <Card
              key={`fav-${movie.id}`}
              sx={{
                width: 200,
                bgcolor: "#222",
                color: "white",
              }}
            >
              <CardMedia
                component="img"
                sx={{ height: 300, objectFit: "cover" }}
                image={movie.posterUrl || "/fallback-poster.jpg"}
                alt={movie.title}
              />
              <CardContent>
                <Typography variant="h6">{movie.title}</Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  {movie.description || "No description"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
