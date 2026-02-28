import { MOCK_DEMO_USER } from '../config/demoData.js';

export const demoMiddleware = (req, res, next) => {
  const isDemo = req.header('X-DEMO-MODE') === 'true';

  if (isDemo) {
    req.isDemo = true;
    req.user = { id: MOCK_DEMO_USER._id }; // Static ID for demo

    // Block mutations in demo mode
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
      // Allow auth/login/signup to "succeed" or be handled specifically
      // but for most other routes, we want to return a success message without doing anything

      const bypassRoutes = [
        '/api/auth/login',
        '/api/auth/signup',
      ];

      if (!bypassRoutes.some(route => req.originalUrl.startsWith(route))) {
        // Mock success for mutations, but prevent DB writes
        return res.status(200).json({
          message: 'Demo Action: Simulated success.',
          isDemo: true,
          simulated: true
        });
      }
    }
  }

  next();
};
