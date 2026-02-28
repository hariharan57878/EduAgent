import * as authService from '../services/authService.js';
import { validateSignupInput, validateLoginInput } from '../dto/auth.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';

import { validateProfileUpdate } from '../dto/user.dto.js';
import User from '../models/User.js';
import { MOCK_DEMO_USER } from '../config/demoData.js';

export const signup = asyncHandler(async (req, res) => {
  const validatedData = validateSignupInput(req.body);
  const user = await authService.signup(validatedData);
  const token = authService.generateToken(user.id);
  res.json({ token, user: { id: user.id, username: user.username, email: user.email, preferences: user.preferences } });
});

export const login = asyncHandler(async (req, res) => {
  const validatedData = validateLoginInput(req.body);
  const user = await authService.login(validatedData.email, validatedData.password);
  const token = authService.generateToken(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      stats: user.stats,
      preferences: user.preferences
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  if (req.isDemo) {
    return res.json(MOCK_DEMO_USER);
  }
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const validatedData = validateProfileUpdate(req.body);
  const user = await authService.updateProfile(req.user.id, validatedData);
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    preferences: user.preferences
  });
});
