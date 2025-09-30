import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  fetchMovies,
  addMovie,
  deleteMovie,
  updateMovie,
  fetchUsers,
  updateUser,
  deleteUser,
} from "../api";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
interface Movie {
  id: number;
  title: string;
  posterUrl?: string;
  description?: string;
  genre?: string;
  releaseYear: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AdminPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [poster, setPoster] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | "">("");
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editMovieId, setEditMovieId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<"movie" | "user" | null>(null);

  const navigate = useNavigate();

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await fetchMovies();
      setMovies(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    loadMovies();
    loadUsers();
  }, []);

  const handleAddOrUpdateMovie = async () => {
    if (!title || !releaseYear) {
      alert("Title and release year are required");
      return;
    }

    const movieData = {
      title,
      posterUrl: poster,
      description,
      genre,
      releaseYear,
    };

    try {
      if (editMovieId) {
        await updateMovie(editMovieId, movieData);
        alert("Movie updated successfully!");
        setEditMovieId(null);
      } else {
        await addMovie(movieData);
        alert("Movie added successfully!");
      }
      setTitle("");
      setPoster("");
      setGenre("");
      setDescription("");
      setReleaseYear("");
      loadMovies();
    } catch (err) {
      console.error(err);
      alert("Failed to save movie");
    }
  };

  const handleDeleteClick = (id: number, type: "movie" | "user") => {
    setDeleteId(id);
    setDeleteType(type);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteId || !deleteType) return;
    try {
      if (deleteType === "movie") {
        await deleteMovie(deleteId);
        alert("Movie deleted successfully!");
        loadMovies();
      } else if (deleteType === "user") {
        await deleteUser(deleteId);
        alert("User deleted successfully!");
        loadUsers();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
      setDeleteType(null);
    }
  };

  const handleEditMovie = (movie: Movie) => {
    setEditMovieId(movie.id);
    setTitle(movie.title);
    setPoster(movie.posterUrl || "");
    setGenre(movie.genre || "");
    setDescription(movie.description || "");
    setReleaseYear(movie.releaseYear);
  };

  const handleUpdateUser = async (user: User) => {
    const newRole = prompt("Enter new role (USER or ADMIN):", user.role);
    if (!newRole) return;
    try {
      await updateUser(user.id, { ...user, role: newRole });
      alert("User updated successfully!");
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  const handleViewUserFavorites = (userId: number) => {
    navigate(`/favorites/${userId}`);
  };

  return (
    <Container sx={{ mt: 5, color: "white" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
      >
        Admin Dashboard
      </Typography>

      <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
        <KeyboardBackspaceIcon />
      </IconButton>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        centered
        sx={{ mb: 3, color: "white" }}
        textColor="inherit"
        indicatorColor="secondary"
      >
        <Tab label="Movies" />
        <Tab label="Users" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Stack direction="row" spacing={2} mb={3}>
            <TextField
              label="Movie Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Poster URL"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Release Year"
              type="number"
              value={releaseYear}
              onChange={(e) =>
                setReleaseYear(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleAddOrUpdateMovie}
            >
              {editMovieId ? "Update" : "Add"}
            </Button>
          </Stack>

          {loading ? (
            <CircularProgress />
          ) : (
            <Stack spacing={2}>
              {movies.map((movie) => (
                <Card
                  key={movie.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#1e1e1e",
                    color: "white",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={movie.posterUrl || "/fallback-poster.jpg"}
                    alt={movie.title}
                    sx={{ width: 100, borderRadius: 2 }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6">{movie.title}</Typography>
                    <Typography variant="body2">
                      Genre: {movie.genre || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      Release: {movie.releaseYear}
                    </Typography>
                    <Typography variant="body2">
                      {movie.description || "No description"}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Button
                        variant="outlined"
                        color="info"
                        onClick={() => handleEditMovie(movie)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(movie.id, "movie")}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Registered Users
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: "white" }} />
          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      color="info"
                      onClick={() => handleUpdateUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(user.id, "user")}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleViewUserFavorites(user.id)}
                    >
                      Favorites
                    </Button>
                  </Stack>
                }
              >
                <ListItemText
                  primary={`${user.name} (${user.email})`}
                  secondary={`Role: ${user.role}`}
                  primaryTypographyProps={{ style: { color: "white" } }}
                  secondaryTypographyProps={{ style: { color: "gray" } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {deleteType === "movie" ? "Delete Movie" : "Delete User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {deleteType}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;
