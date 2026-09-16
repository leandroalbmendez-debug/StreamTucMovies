import { useLocalStorage } from '@uidotdev/usehooks';
import { v4 as uuidv4 } from 'uuid';
import type { Comment } from '../../types/comment';
import type { User } from '../../types/User';

export function useComments(movieId: string, loggedUser: User | null) {
  const [allComments, setAllComments] = useLocalStorage<Comment[]>('comments', []);

  const comments = allComments
    .filter((c) => c.movieId === movieId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const addComment = (author: string, text: string, rating?: number) => {
    const newComment: Comment = {
      id: uuidv4(),
      movieId,
      authorId: loggedUser?.id,
      author,
      text,
      rating,
      createdAt: new Date().toISOString(),
    };
    setAllComments((prev) => [...prev, newComment]);
  };

  const isOwnComment = (comment: Comment) => {
    if (!loggedUser) return false;
    return comment.authorId === loggedUser.id ||
      (!comment.authorId && comment.author === loggedUser.username);
  };

  // Solo el autor puede editar (a diferencia de borrar, el admin no edita ajenos)
  const canEdit = (comment: Comment) => isOwnComment(comment);

  const canDelete = (comment: Comment) => {
    if (!loggedUser) return false;
    if (loggedUser.role === 'admin') return true;
    return isOwnComment(comment);
  };

  const updateComment = (id: string, text: string, rating?: number) => {
    setAllComments((prev) => prev.map((comment) => {
      if (comment.id !== id || !canEdit(comment)) return comment;
      return { ...comment, text, rating, updatedAt: new Date().toISOString() };
    }));
  };

  const deleteComment = (id: string) => {
    setAllComments((prev) => prev.filter((comment) => {
      return comment.id !== id || !canDelete(comment);
    }));
  };

  return { comments, addComment, canEdit, canDelete, updateComment, deleteComment };
}