import * as authService from '../services/authService.js';
import { validateSignupInput, validateLoginInput } from '../dto/auth.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const signup = asyncHandler(async (req, res) => {
  const validatedData = validateSignupInput(req.body);
  const user = await authService.signup(validatedData);
  const token = authService.generateToken(user.id);
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
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
      stats: user.stats
    }
  });
});
