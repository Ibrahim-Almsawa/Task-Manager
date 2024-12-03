import { useState, useEffect } from 'react';
import { Todo, TodoFormData } from '../types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (formData: TodoFormData) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      time: formData.time,
      priority: formData.priority,
      tags: formData.tags,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: string, formData: Partial<TodoFormData>) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              ...formData,
              updatedAt: new Date().toISOString(),
            }
          : todo
      )
    );
  };

  return { todos, addTodo, toggleTodo, deleteTodo, updateTodo };
}