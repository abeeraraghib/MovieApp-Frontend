import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import MovieDetailsPage from "./pages/user/MovieDetails";
import AdminPage from "./pages/admin/Admin";
import FavoritesPageAdmin from "./pages/admin/FavoritePageAdmin";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home/:userId" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/movie/:id" element={<MovieDetailsPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/favorites/:userId" element={<FavoritesPageAdmin />} />
    </Routes>
  );
}

export default App;
