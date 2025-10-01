const BASE_URL = "http://localhost:5000";

// ---------- Auth ----------
export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role: "USER" }),
  });
  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

// ---------- Movies ----------
export const fetchMovies = async () => {
  const res = await fetch(`${BASE_URL}/movies/get-all-movies`);
  return res.json();
};

export const fetchMovieById = async (id: string | number) => {
  const res = await fetch(`${BASE_URL}/movies/findOne/${id}`);
  return res.json();
};

export const addMovie = async (movie: { title: string; posterUrl: string; genre: string; releaseYear: number; description?: string }) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/movies/movies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movie),
  });
  return res.json();
};

export const fetchMoviesByGenre = async (genre: string) => {
  const res = await fetch(`${BASE_URL}/movies/genres/${encodeURIComponent(genre)}`);
  return res.json();
};


export const updateMovie = async (id: number, movie: { title?: string; posterUrl?: string; genre?: string; releaseYear?: number; description?: string }) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/movies/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movie),
  });
  return res.json();
};

export const deleteMovie = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/movies/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ---------- Users ----------
export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users/get-all-users`);
  return res.json();
};

export const fetchUserById = async (id: number) => {
  const res = await fetch(`${BASE_URL}/users/find-one/${id}`);
  return res.json();
};

export const updateUser = async (id: number, user: { name?: string; email?: string; role?: string }) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/users/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });
  return res.json();
};

export const deleteUser = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/users/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// ---------- Favorites ----------

export const fetchFavoritesByUser = async (userId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/favorites/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json(); 
};

export const addFavorite = async (userId: number, movieId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/favorites/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, movieId }),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
};

export const removeFavorite = async (userId: number, movieId: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/favorites/remove`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` },
    body: JSON.stringify({ userId, movieId }),
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
};

export const getAllFavorites = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch all favorites");
  return res.json();
};

// ---------- Mail ----------
export const sendMail = async (to: string, subject: string, text: string) => {
  const res = await fetch(`${BASE_URL}/mail/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, text }),
  });
  if (!res.ok) throw new Error("Failed to send email");
  return res.json();
};