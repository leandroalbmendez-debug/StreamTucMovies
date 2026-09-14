export interface Comment {
  id: string;
  movieId: string;
  author: string;
  text: string;
  rating?: number; // opcional, 1-5 estrellas
  createdAt: string; // ISO date
}