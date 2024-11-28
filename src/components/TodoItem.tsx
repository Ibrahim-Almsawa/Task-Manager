import React from 'react';
import { Trash2, Edit, Check, X } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border-l-4 ${
      todo.completed ? 'border-green-500' : 'border-blue-500'
    } mb-3 hover:shadow-md transition-shadow`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`p-2 rounded-full ${
            todo.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
          } hover:bg-opacity-80`}
        >
          {todo.completed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
        
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${
            todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-gray-600 text-sm mt-1">{todo.description}</p>
          )}
          {todo.dueDate && (
            <p className="text-sm text-gray-500 mt-1">
              Due: {new Date(todo.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(todo)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}