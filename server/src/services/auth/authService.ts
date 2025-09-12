import { User } from '@prisma/client';
import { AuthUtils } from '../../utils/auth.js';
import { prisma } from '../../utils/prisma.js';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
  };
  token?: string;
  refreshToken?: string;
  isTemporaryPassword?: boolean;
  error?: string;
  errors?: string[];
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<AuthResult> {
    try {
      // Validate input
      const usernameValidation = AuthUtils.validateUsername(data.username);
      if (!usernameValidation.valid) {
        return {
          success: false,
          errors: usernameValidation.errors
        };
      }

      if (!AuthUtils.validateEmail(data.email)) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      const passwordValidation = AuthUtils.validatePassword(data.password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          errors: passwordValidation.errors
        };
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: data.username },
            { email: data.email }
          ]
        }
      });

      if (existingUser) {
        return {
          success: false,
          error: existingUser.username === data.username 
            ? 'Username already taken' 
            : 'Email already registered'
        };
      }

      // Hash password
      const hashedPassword = await AuthUtils.hashPassword(data.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          role: 'PLAYER',
          isActive: true
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        email: user.email
      };

      const token = AuthUtils.generateAccessToken(tokenPayload);
      const refreshToken = AuthUtils.generateRefreshToken(tokenPayload);

      return {
        success: true,
        user,
        token,
        refreshToken
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Internal server error during registration'
      };
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginData): Promise<AuthResult> {
    try {
      // Find user by username or email (using raw query to access isTemporaryPassword)
      const users = await prisma.$queryRaw<any[]>`
        SELECT * FROM users 
        WHERE username = ${data.username} OR email = ${data.username}
        LIMIT 1
      `;
      
      const user = users[0] || null;

      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is disabled'
        };
      }

      // Verify password
      const isValidPassword = await AuthUtils.verifyPassword(data.password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        email: user.email
      };

      const token = AuthUtils.generateAccessToken(tokenPayload);
      const refreshToken = AuthUtils.generateRefreshToken(tokenPayload);

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
        token,
        refreshToken,
        isTemporaryPassword: user.isTemporaryPassword
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Internal server error during login'
      };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<AuthResult> {
    try {
      const decoded = AuthUtils.verifyToken(refreshToken);
      
      // Verify user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });

      if (!user || !user.isActive) {
        return {
          success: false,
          error: 'User not found or inactive'
        };
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        email: user.email
      };

      const newToken = AuthUtils.generateAccessToken(tokenPayload);
      const newRefreshToken = AuthUtils.generateRefreshToken(tokenPayload);

      return {
        success: true,
        user,
        token: newToken,
        refreshToken: newRefreshToken
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Invalid or expired refresh token'
      };
    }
  }

  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<AuthResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLogin: true
        }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt
        }
      };

    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  /**
   * Change password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      // Validate new password
      const passwordValidation = AuthUtils.validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return {
          success: false,
          errors: passwordValidation.errors
        };
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Verify current password
      const isValidPassword = await AuthUtils.verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }

      // Hash new password
      const hashedPassword = await AuthUtils.hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      });

      return {
        success: true
      };

    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  /**
   * Reset password with temporary password
   */
  static async resetPassword(email: string, tempPassword: string): Promise<AuthResult> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found with this email'
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is disabled'
        };
      }

      // Hash temporary password
      const hashedTempPassword = await AuthUtils.hashPassword(tempPassword);

      // Update user with temporary password and mark it as temporary
      await prisma.$queryRaw`
        UPDATE users 
        SET password = ${hashedTempPassword}, 
            "isTemporaryPassword" = true, 
            "updatedAt" = NOW()
        WHERE id = ${user.id}
      `;

      return {
        success: true
      };

    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  /**
   * Update temporary password with permanent password
   */
  static async updateTempPassword(userId: string, currentTempPassword: string, newPassword: string): Promise<AuthResult> {
    try {
      console.log('🔐 UpdateTempPassword called:', { userId, currentTempPassword, newPassword });

      // Validate new password
      const passwordValidation = AuthUtils.validatePassword(newPassword);
      if (!passwordValidation.valid) {
        console.log('❌ Password validation failed:', passwordValidation.errors);
        return {
          success: false,
          errors: passwordValidation.errors
        };
      }

      // Get user with raw query to access isTemporaryPassword
      const users = await prisma.$queryRaw<any[]>`
        SELECT * FROM users WHERE id = ${userId} LIMIT 1
      `;
      
      const user = users[0];
      console.log('👤 User found:', { 
        id: user?.id, 
        username: user?.username, 
        isTemporaryPassword: user?.isTemporaryPassword,
        hasPassword: !!user?.password 
      });

      if (!user) {
        console.log('❌ User not found');
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Verify current temporary password
      const isValidPassword = await AuthUtils.verifyPassword(currentTempPassword, user.password);
      console.log('🔑 Password verification:', { isValidPassword, currentTempPassword });
      
      if (!isValidPassword) {
        console.log('❌ Current temporary password is incorrect');
        return {
          success: false,
          error: 'Current temporary password is incorrect'
        };
      }

      // Check if user actually has a temporary password
      if (!user.isTemporaryPassword) {
        console.log('❌ User does not have a temporary password flag');
        return {
          success: false,
          error: 'User does not have a temporary password'
        };
      }

      // Hash new password
      const hashedPassword = await AuthUtils.hashPassword(newPassword);
      console.log('🔐 New password hashed successfully');

      // Update password and remove temporary flag
      await prisma.$queryRaw`
        UPDATE users 
        SET password = ${hashedPassword}, 
            "isTemporaryPassword" = false, 
            "updatedAt" = NOW()
        WHERE id = ${userId}
      `;

      console.log('✅ Password updated successfully');
      return {
        success: true
      };

    } catch (error) {
      console.error('❌ Update temp password error:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }
}
