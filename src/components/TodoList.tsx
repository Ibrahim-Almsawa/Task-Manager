import React, { useState, useMemo } from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/todo';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, SortAsc, SortDesc, Calendar, CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

type SortOption = 'dueDate' | 'priority' | 'title' | 'createdAt';
type FilterOption = 'all' | 'active' | 'completed' | 'overdue';
type GroupOption = 'none' | 'priority' | 'dueDate';

export function TodoList({ todos, onToggleComplete, onDelete, onEdit }: TodoListProps) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [groupBy, setGroupBy] = useState<GroupOption>('none');

  const isOverdue = (todo: Todo) => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(`${todo.dueDate} ${todo.time || '23:59'}`) < new Date();
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        case 'overdue':
          return isOverdue(todo);
        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  const sortedTodos = useMemo(() => {
    return [...filteredTodos].sort((a, b) => {
      let compareResult = 0;
      switch (sortBy) {
        case 'dueDate':
          compareResult = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          compareResult = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
          break;
        case 'title':
          compareResult = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          compareResult = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  }, [filteredTodos, sortBy, sortDirection]);

  const groupedTodos = useMemo(() => {
    if (groupBy === 'none') return { '': sortedTodos };

    return sortedTodos.reduce((groups, todo) => {
      let key = '';
      if (groupBy === 'priority') {
        key = todo.priority || 'no priority';
      } else if (groupBy === 'dueDate') {
        if (!todo.dueDate) {
          key = 'no due date';
        } else {
          const today = new Date().toDateString();
          const dueDate = new Date(todo.dueDate).toDateString();
          if (dueDate === today) {
            key = 'today';
          } else if (new Date(dueDate) < new Date(today)) {
            key = 'overdue';
          } else {
            key = 'upcoming';
          }
        }
      }
      return {
        ...groups,
        [key]: [...(groups[key] || []), todo]
      };
    }, {} as Record<string, Todo[]>);
  }, [sortedTodos, groupBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleEdit = (todo: Todo) => {
    onEdit({
      ...todo,
      dueDate: todo.dueDate || '',
      time: todo.time || '',
      priority: todo.priority || 'medium',
      tags: todo.tags || []
    });
  };

  if (todos.length === 0) {
    return (
      <motion.div
        variants={emptyStateVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-4"
      >
        <CheckSquare className="w-16 h-16 stroke-1" />
        <p className="text-lg font-medium">{t('No tasks yet')}</p>
        <p className="text-sm">{t('Add your first task to get started!')}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="text-sm border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <option value="all">{t('All Tasks')}</option>
            <option value="active">{t('Active')}</option>
            <option value="completed">{t('Completed')}</option>
            <option value="overdue">{t('Overdue')}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <option value="dueDate">{t('Due Date')}</option>
            <option value="priority">{t('Priority')}</option>
            <option value="title">{t('Title')}</option>
            <option value="createdAt">{t('Created Date')}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupOption)}
            className="text-sm border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded-md"
          >
            <option value="none">{t('No Grouping')}</option>
            <option value="priority">{t('Group by Priority')}</option>
            <option value="dueDate">{t('Group by Due Date')}</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-500">
          {filteredTodos.length} {filteredTodos.length === 1 ? t('task') : t('tasks')}
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {Object.entries(groupedTodos).map(([group, groupTodos]) => (
          <motion.div key={group} className="space-y-4">
            {group && (
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t(group)}
              </h3>
            )}
            <AnimatePresence mode="popLayout">
              {groupTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onEdit={handleEdit}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}