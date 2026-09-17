export interface Comment {
  id: string;
  movieId: string;
  authorId?: string;
  author: string;
  text: string;
  rating?: number; // opcional, 1-10
  createdAt: string; // ISO date
  updatedAt?: string;
  hidden?: boolean;
}