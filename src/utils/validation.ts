import type { NewGoalForm, NewTaskForm, SettingsForm } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateGoalForm = (form: NewGoalForm): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!form.name.trim()) {
    errors.push({ field: 'name', message: 'Goal name is required' });
  } else if (form.name.length > 100) {
    errors.push({ field: 'name', message: 'Goal name must be less than 100 characters' });
  }

  if (form.startDate && form.dueDate) {
    const start = new Date(form.startDate);
    const due = new Date(form.dueDate);
    if (due < start) {
      errors.push({ field: 'dueDate', message: 'Due date must be after start date' });
    }
  }

  return errors;
};

export const validateTaskForm = (form: NewTaskForm): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!form.title.trim()) {
    errors.push({ field: 'title', message: 'Task name is required' });
  } else if (form.title.length > 50) {
    errors.push({ field: 'title', message: 'Task name must be less than 50 characters' });
  }

  if (form.startTime && form.endTime) {
    if (form.endTime <= form.startTime) {
      errors.push({ field: 'endTime', message: 'End time must be after start time' });
    }
  }

  return errors;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateSettingsForm = (form: SettingsForm): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!form.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!validateEmail(form.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email' });
  }

  return errors;
};
