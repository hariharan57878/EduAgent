export const validateProfileUpdate = (data) => {
  const { weeklyAvailability, experienceLevel, targetOutcome, targetRole } = data;
  const errors = [];

  if (weeklyAvailability !== undefined && (typeof weeklyAvailability !== 'number' || weeklyAvailability < 1)) {
    errors.push({ field: 'weeklyAvailability', message: 'Availability must be a number greater than 0' });
  }

  const validLevels = ['beginner', 'intermediate', 'advanced'];
  if (experienceLevel && !validLevels.includes(experienceLevel.toLowerCase())) {
    errors.push({ field: 'experienceLevel', message: 'Invalid experience level' });
  }

  const validOutcomes = ['job', 'skill', 'certification', 'hobby'];
  if (targetOutcome && !validOutcomes.includes(targetOutcome.toLowerCase())) {
    errors.push({ field: 'targetOutcome', message: 'Invalid target outcome' });
  }

  if (targetRole && (typeof targetRole !== 'string' || targetRole.trim().length === 0)) {
    errors.push({ field: 'targetRole', message: 'Target role must be a string' });
  }

  if (errors.length > 0) {
    const error = new Error('Validation Failed');
    error.status = 400;
    error.details = errors;
    throw error;
  }

  return data;
};
