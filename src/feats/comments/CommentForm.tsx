import { useState, type FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';

interface Props {
  onSubmit: (author: string, text: string, rating?: number) => void;
}

export function CommentForm({ onSubmit }: Props) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    onSubmit(author.trim(), text.trim(), rating || undefined);
    setAuthor('');
    setText('');
    setRating(0);
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-2">
        <Form.Control
          placeholder="Tu nombre"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Escribe tu comentario..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={0}>Sin calificación</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} ⭐</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Button type="submit" variant="primary">
        Publicar comentario
      </Button>
    </Form>
  );
}