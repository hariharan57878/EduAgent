export const validateRoadmapInput = (data) => {
  const { role, interests } = data;
  const errors = [];

  if (!role || typeof role !== 'string' || role.trim().length === 0) {
    errors.push({ field: 'role', message: 'Role is required and must be a non-empty string' });
  }

  if (interests && !Array.isArray(interests)) {
    errors.push({ field: 'interests', message: 'Interests must be an array of strings' });
  }

  if (errors.length > 0) {
    const error = new Error('Validation Failed');
    error.status = 400;
    error.code = 'VALIDATION_ERROR';
    error.details = errors;
    throw error;
  }

  return {
    role: role.trim(),
    interests: interests ? interests.map(i => i.trim()) : []
  };
};

export const validateSaveRoadmapInput = (data) => {
  const { title, role, phases } = data;
  const errors = [];

  if (!title) errors.push({ field: 'title', message: 'Title is required' });
  if (!role) errors.push({ field: 'role', message: 'Role is required' });
  if (!phases || !Array.isArray(phases)) errors.push({ field: 'phases', message: 'Phases must be an array' });

  if (errors.length > 0) {
    const error = new Error('Validation Failed');
    error.status = 400;
    error.code = 'VALIDATION_ERROR';
    error.details = errors;
    throw error;
  }

  return data;
};
