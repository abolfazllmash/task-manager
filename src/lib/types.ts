export type Task = {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  dueDate?: string;
};
