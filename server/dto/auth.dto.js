export const validateSignupInput = (data) => {
  const { username, email, password } = data;
  const errors = [];

  if (!username || username.length < 3) errors.push({ field: 'username', message: 'Min 3 chars' });
  if (!email || !email.includes('@')) errors.push({ field: 'email', message: 'Invalid email' });
  if (!password || password.length < 6) errors.push({ field: 'password', message: 'Min 6 chars' });

  if (errors.length > 0) {
    const error = new Error('Validation Failed');
    error.status = 400;
    error.details = errors;
    throw error;
  }
  return data;
};

export const validateLoginInput = (data) => {
  const { email, password } = data;
  const errors = [];

  if (!email) errors.push({ field: 'email', message: 'Email required' });
  if (!password) errors.push({ field: 'password', message: 'Password required' });

  if (errors.length > 0) {
    const error = new Error('Validation Failed');
    error.status = 400;
    error.details = errors;
    throw error;
  }
  return data;
};
