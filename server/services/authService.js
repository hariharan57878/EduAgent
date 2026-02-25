import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signup = async (userData) => {
  const { username, email, password, preferences } = userData;

  let user = await User.findOne({ email });
  if (user) throw new Error('User already exists');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  user = new User({
    username,
    email,
    passwordHash,
    preferences
  });

  await user.save();
  return user;
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid Credentials');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Invalid Credentials');

  return user;
};

export const generateToken = (userId) => {
  const payload = {
    user: { id: userId }
  };

  return jwt.sign(
    payload,
    env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};
