import React, { useState } from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { Todo } from './types/todo';
import { ListTodo } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { t, i18n } = useTranslation();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const changeLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
    setDirection(newLanguage === 'ar' ? 'rtl' : 'ltr');
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${direction}`} dir={direction}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ListTodo className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Task Manager')}</h1>
          <p className="mt-2 text-gray-600">{t('Organize your tasks efficiently')}</p>
          <button onClick={changeLanguage} className="flex items-center">
            <FaGlobe className="mr-2" />
            {i18n.language === 'en' ? 'Arabic' : 'English'}
          </button>
        </div>

        <div className="space-y-8">
          <TodoForm
            onSubmit={(title, description, dueDate) => {
              if (editingTodo) {
                updateTodo(editingTodo.id, { title, description, dueDate });
                setEditingTodo(null);
              } else {
                addTodo(title, description, dueDate);
              }
            }}
          />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('Your Tasks')}</h2>
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;