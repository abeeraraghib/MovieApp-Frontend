import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieById } from "../api";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";

interface Movie {
  id: number;
  title: string;
  posterUrl?: string;
  description?: string;
  genre?: string;
  releaseYear: number;
}

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchMovieById(Number(id))
      .then(setMovie)
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  if (!movie)
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h6" color="error">
          Movie Not Found!
        </Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 5 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "#1e1e1e",
          color: "white",
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: { xs: "100%", md: 350 } }}
          image={movie.posterUrl || "/fallback-poster.jpg"}
          alt={movie.title}
        />
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Release Year: {movie.releaseYear}
          </Typography>
          <Typography variant="body1">
            {movie.description || "No description available."}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MovieDetails;
