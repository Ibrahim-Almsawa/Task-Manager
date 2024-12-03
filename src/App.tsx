import React, { useState } from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { Todo } from './types/todo';
import { ListTodo, Moon, Sun, FolderSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { t, i18n } = useTranslation();
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormVisible(true);
  };

  const changeLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLanguage);
    setDirection(newLanguage === 'ar' ? 'rtl' : 'ltr');
  };

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-gray-900' : 'bg-gray-100'} ${direction}`} dir={direction}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ListTodo className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('Task Manager')}
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('Organize your tasks efficiently')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-white hover:bg-gray-100 text-gray-800 shadow-sm'
              }`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={changeLanguage}
              className={`p-2 rounded-full transition-colors ${
                isDark 
                  ? 'bg-gray-800 hover:bg-gray-700 text-blue-400' 
                  : 'bg-white hover:bg-gray-100 text-gray-800 shadow-sm'
              }`}
              aria-label={i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <FaGlobe className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('Your Tasks')}
            </h2>
            <button
              onClick={() => setIsFormVisible(prev => !prev)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-800 shadow-sm'
              }`}
            >
              {isFormVisible ? t('Hide Form') : t('Add Task')}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isFormVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md p-6`}>
                  <TodoForm
                    onSubmit={(formData) => {
                      if (editingTodo) {
                        updateTodo(editingTodo.id, formData);
                        setEditingTodo(null);
                      } else {
                        addTodo(formData);
                      }
                    }}
                    initialData={editingTodo}
                    isDark={isDark}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md p-6`}>
            {todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <FolderSearch className={`w-16 h-16 ${isDark ? 'text-gray-600' : 'text-gray-400'} mb-4`} />
                <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('No tasks yet')}
                </p>
                <p className={`mt-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {t('Add your first task to get started!')}
                </p>
              </motion.div>
            ) : (
              <TodoList
                todos={todos}
                onToggleComplete={toggleTodo}
                onDelete={deleteTodo}
                onEdit={handleEdit}
                isDark={isDark}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;