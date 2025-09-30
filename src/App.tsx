import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import MovieDetailsPage from "./pages/MovieDetails";
import AdminPage from "./pages/Admin";
import MoviesPage from "./pages/MoviesEditAdmin";
import FavoritesPage from "./pages/FavoritePage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home/:userId" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/movie/:id" element={<MovieDetailsPage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/favorites/:userId" element={<FavoritesPage />} />
    </Routes>
  );
}

export default App;
