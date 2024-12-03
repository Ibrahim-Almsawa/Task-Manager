import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Tag, AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TodoFormData } from '../types/todo';

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  initialData?: TodoFormData | null;
  isDark?: boolean;
}

export function TodoForm({ onSubmit, initialData, isDark = false }: TodoFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    dueDate: '',
    time: '',
    priority: 'medium',
    tags: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TodoFormData, string>>>({});
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate || '',
        time: initialData.time || '',
        priority: initialData.priority || 'medium',
        tags: initialData.tags || [],
      });
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      time: '',
      priority: 'medium',
      tags: [],
    });
    setTagInput('');
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TodoFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('Title is required');
    } else if (formData.title.length > 100) {
      newErrors.title = t('Title must be less than 100 characters');
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = t('Description must be less than 500 characters');
    }

    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.dueDate);
      if (selectedDate < today) {
        newErrors.dueDate = t('Due date cannot be in the past');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        id: initialData?.id, // Pass the id if we're editing
      });
      if (!initialData) { // Only reset if we're not editing
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const inputClassName = `w-full px-4 py-2 rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 ${
    isDark
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
  }`;

  const labelClassName = `block text-sm font-medium mb-1 ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className={labelClassName}>
          {t('Title')} *
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, title: e.target.value }));
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            className={`${inputClassName} ${errors.title ? 'border-red-500' : ''}`}
            placeholder={t('Enter task title')}
          />
          {errors.title && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-1"
            >
              <div className="flex items-center text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.title}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          {t('Description')}
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className={`${inputClassName} resize-none h-24`}
          placeholder={t('Enter task description')}
        />
        <div className={`text-right text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {formData.description.length}/500
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className={labelClassName}>
            {t('Due Date')}
          </label>
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className={`${inputClassName} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="time" className={labelClassName}>
            {t('Time')}
          </label>
          <div className="relative">
            <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className={`${inputClassName} pl-10`}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="priority" className={labelClassName}>
          {t('Priority')}
        </label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TodoFormData['priority'] }))}
          className={inputClassName}
        >
          <option value="low">{t('Low')}</option>
          <option value="medium">{t('Medium')}</option>
          <option value="high">{t('High')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className={labelClassName}>
          {t('Tags')}
        </label>
        <div className="relative">
          <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            className={`${inputClassName} pl-10`}
            placeholder={t('Add tags (press Enter to add)')}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <AnimatePresence>
            {formData.tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                  isDark
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? t('Saving...') : initialData ? t('Update Task') : t('Add Task')}
        </motion.button>
      </div>
    </form>
  );
}