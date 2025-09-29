import { useEffect, useState } from "react";
import { fetchMovies, addMovie, deleteMovie } from "../api";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | "">("");

  useEffect(() => {
    fetchMovies().then(setMovies);
  }, []);

  const handleAdd = async () => {
    if (!title || !releaseYear) {
      alert("Title and Release Year are required!");
      return;
    }
    const movie = await addMovie({
      title,
      description,
      posterUrl,
      genre,
      releaseYear: Number(releaseYear),
    });
    setMovies([...movies, movie]);
    setTitle("");
    setPosterUrl("");
    setDescription("");
    setGenre("");
    setReleaseYear("");
  };

  const handleDelete = async (id: number) => {
    await deleteMovie(id);
    setMovies(movies.filter((m) => m.id !== id));
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Movies Dashboard
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Poster URL"
          value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <TextField
          label="Release Year"
          value={releaseYear}
          onChange={(e) => setReleaseYear(Number(e.target.value))}
          type="number"
        />
        <Button variant="contained" color="error" onClick={handleAdd}>
          Add
        </Button>
      </Stack>

      <Stack spacing={2}>
        {movies.map((movie) => (
          <Card key={movie.id} sx={{ display: "flex" }}>
            {movie.posterUrl && (
              <CardMedia
                component="img"
                image={movie.posterUrl}
                alt={movie.title}
                sx={{ width: 100 }}
              />
            )}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{movie.title}</Typography>
              <Typography variant="body2">{movie.description}</Typography>
              <Typography variant="body2">Genre: {movie.genre}</Typography>
              <Typography variant="body2">Year: {movie.releaseYear}</Typography>
              <Button color="error" onClick={() => handleDelete(movie.id)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
