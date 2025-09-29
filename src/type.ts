export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description?: string;
  vote_average?: number;
  releaseYear?: string;
  genre_ids?: number[];
  success?: boolean;
}

