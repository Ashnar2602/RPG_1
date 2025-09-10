import { Request, Response } from 'express';
import { AuthService, RegisterData, LoginData } from '../../services/auth/authService.js';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as RegisterData;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required',
        code: 'MISSING_FIELDS'
      });
    }

    const result = await AuthService.register({ username, email, password });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        errors: result.errors,
        code: 'REGISTRATION_FAILED'
      });
    }

    // Don't include sensitive data in response
    const response = {
      success: true,
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      },
      message: 'Registration successful'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as LoginData;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required',
        code: 'MISSING_FIELDS'
      });
    }

    const result = await AuthService.login({ username, password });

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error,
        code: 'LOGIN_FAILED'
      });
    }

    const response = {
      success: true,
      data: {
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      },
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    console.error('Login controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: result.error,
        code: 'REFRESH_FAILED'
      });
    }

    const response = {
      success: true,
      data: {
        token: result.token,
        refreshToken: result.refreshToken
      },
      message: 'Token refreshed successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Refresh token controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

/**
 * Get user profile
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    const result = await AuthService.getProfile(req.user.id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
        code: 'PROFILE_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: { user: result.user },
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    console.error('Get profile controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required',
        code: 'MISSING_FIELDS'
      });
    }

    const result = await AuthService.changePassword(req.user.id, currentPassword, newPassword);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        errors: result.errors,
        code: 'PASSWORD_CHANGE_FAILED'
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};

/**
 * Logout user (client-side token removal)
 */
export const logout = async (req: Request, res: Response) => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // We could implement token blacklisting with Redis if needed
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'SERVER_ERROR'
    });
  }
};
