export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  time: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface TodoFormData {
  title: string;
  description: string;
  dueDate: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}