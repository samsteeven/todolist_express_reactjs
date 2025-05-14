// src/types/index.ts
export type User = {
  _id: string;
  username: string;
  email: string;
  token?: string;
};

export type Todo = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  favorite: boolean;
  reminderDate: string | null;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
};