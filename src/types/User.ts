export interface Comment {
  page: string;
  text: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  role: "admin" | "client";
  plan: "free" | "premium";
  favorites: number[];
  comments: Comment[];
}