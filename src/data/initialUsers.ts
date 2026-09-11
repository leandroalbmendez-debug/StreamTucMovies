import { v4 as uuidv4 } from "uuid";
import type { User } from "../types/User";

export const initialUsers: User[] = [
  {
    id: uuidv4(),
    email: "admin@streamtuc.com",
    password: "Admin123",
    username: "Administrator",
    role: "admin",
    plan: "premium",
    favorites: [],
    comments: [],
  },
  {
    id: uuidv4(),
    email: "lucasfacdef@gmail.com",
    password: "Lucas123",
    username: "Lucas Lencina",
    role: "client",
    plan: "free",
    favorites: [1, 3],
    comments: [
      {
        page: "Series",
        text: "Me gusta mucho esta serie",
      },
    ],
  },
];
