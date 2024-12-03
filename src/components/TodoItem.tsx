import React, { useState } from 'react';
import { Todo } from '../types/todo';
import { Calendar, Clock, Tag, Trash2, Edit2, CheckCircle, Circle, MoreVertical, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onToggleComplete: (id: string) => void;
}

export function TodoItem({ todo, onDelete, onEdit, onToggleComplete }: TodoItemProps) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: string | undefined) => {
    if (!priority) return 'bg-gray-100 text-gray-800';
    
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch {
      return date;
    }
  };

  const isOverdue = () => {
    if (!todo.dueDate || !todo.time) return false;
    try {
      const dueDate = new Date(`${todo.dueDate} ${todo.time}`);
      return dueDate < new Date() && !todo.completed;
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`todo-item-container ${todo.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''}`}
    >
      <div className="todo-item-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="todo-item-checkbox">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(todo.id);
            }}
            className="checkbox-btn"
          >
            {todo.completed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="todo-item-content">
          <h3 className={`todo-item-title ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title || t('Untitled Task')}
          </h3>
          
          <div className="todo-item-meta">
            {todo.dueDate && (
              <div className="todo-item-date">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(todo.dueDate)}</span>
              </div>
            )}
            {todo.time && (
              <div className="todo-item-time">
                <Clock className="w-4 h-4" />
                <span>{todo.time}</span>
              </div>
            )}
            {isOverdue() && (
              <div className="todo-item-overdue">
                <AlertCircle className="w-4 h-4" />
                <span>{t('Overdue')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="todo-item-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(todo);
            }}
            className="edit-btn"
            aria-label={t('Edit task')}
          >
            <Edit2 className="w-4 h-4 text-blue-500 hover:text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(todo.id);
            }}
            className="delete-btn"
            aria-label={t('Delete task')}
          >
            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="todo-item-details"
          >
            {todo.description && (
              <p className="todo-item-description">{todo.description}</p>
            )}
            {todo.tags && todo.tags.length > 0 && (
              <div className="todo-item-tags">
                {todo.tags.map((tag) => (
                  <span key={tag} className="todo-tag">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}