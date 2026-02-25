export const validateRoadmapInput = (data) => {
  const { role, targetRole, experienceLevel, weeklyAvailability } = data;
  const errors = [];

  const finalRole = targetRole || role;

  if (!finalRole || typeof finalRole !== 'string' || finalRole.trim().length === 0) {
    errors.push({ field: 'targetRole', message: 'Target role is required' });
  }

  if (weeklyAvailability !== undefined && (typeof weeklyAvailability !== 'number' || weeklyAvailability < 1)) {
    errors.push({ field: 'weeklyAvailability', message: 'Invalid availability' });
  }

  if (errors.length > 0) {
    const error = new Error('Validation Failed');
    error.status = 400;
    error.code = 'VALIDATION_ERROR';
    error.details = errors;
    throw error;
  }

  return {
    ...data,
    targetRole: finalRole.trim()
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
