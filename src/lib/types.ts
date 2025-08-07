
export type TaskType = 'personal' | 'home' | 'work' | 'couple' | 'study' | 'club';

export type Task = {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  dueDate?: string;
  type: TaskType;
  parentId?: string;
};
