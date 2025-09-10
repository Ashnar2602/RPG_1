import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
}

export class AuthUtils {
  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate access token
   */
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload as any, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'rpg-server'
    });
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload as any, JWT_SECRET, { 
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'rpg-server'
    });
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET, { issuer: 'rpg-server' }) as JWTPayload;
  }

  /**
   * Generate secure random string for session tokens
   */
  static generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate username format
   */
  static validateUsername(username: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (username.length > 20) {
      errors.push('Username must be less than 20 characters');
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }
    
    if (/^[0-9]/.test(username)) {
      errors.push('Username cannot start with a number');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
