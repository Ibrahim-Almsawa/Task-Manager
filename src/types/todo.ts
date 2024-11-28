export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export type TodoFormData = Omit<Todo, 'id' | 'completed' | 'createdAt'>;