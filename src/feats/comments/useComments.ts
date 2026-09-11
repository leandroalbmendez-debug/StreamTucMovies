import { useLocalStorage } from '@uidotdev/usehooks';
import { v4 as uuidv4 } from 'uuid';
import type { Comment } from './types';

export function useComments(movieId: string) {
  const [allComments, setAllComments] = useLocalStorage<Comment[]>('comments', []);

  const comments = allComments
    .filter((c) => c.movieId === movieId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const addComment = (author: string, text: string, rating?: number) => {
    const newComment: Comment = {
      id: uuidv4(),
      movieId,
      author,
      text,
      rating,
      createdAt: new Date().toISOString(),
    };
    setAllComments((prev) => [...prev, newComment]);
  };

  const deleteComment = (id: string) => {
    setAllComments((prev) => prev.filter((c) => c.id !== id));
  };

  return { comments, addComment, deleteComment };
}