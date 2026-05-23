export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 5) return 'Password must be at least 5 characters';
  return null;
};

export const validateName = (name) => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 3) return 'Name must be at least 3 characters';
  return null;
};

export const validateNoteTitle = (title) => {
  if (!title.trim()) return 'Title is required';
  if (title.trim().length < 3) return 'Title must be at least 3 characters';
  return null;
};

export const validateNoteDescription = (description) => {
  if (!description.trim()) return 'Description is required';
  if (description.trim().length < 5) return 'Description must be at least 5 characters';
  return null;
};

export const validateForm = (fields, validators) => {
  const errors = {};
  for (const [key, validator] of Object.entries(validators)) {
    const error = validator(fields[key]);
    if (error) errors[key] = error;
  }
  return errors;
};
