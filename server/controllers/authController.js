import * as authService from '../services/authService.js';

export const signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    const token = authService.generateToken(user.id);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err.message);
    res.status(err.message === 'User already exists' ? 400 : 500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
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
  } catch (err) {
    console.error(err.message);
    res.status(err.message === 'Invalid Credentials' ? 400 : 500).json({ message: err.message });
  }
};
