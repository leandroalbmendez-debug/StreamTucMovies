export interface Comment {
  id: string;
  movieId: string;
  authorId?: string;
  author: string;
  text: string;
  rating?: number; // opcional, 1-10
  createdAt: string; // ISO date
  updatedAt?: string; // ISO date, presente si el comentario fue editado
  hidden?: boolean; // true si un admin lo ocultó
}