import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import React from 'react';

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => React.createElement('div', {}, children),
}));

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('TC-001: User Registration', () => {
  let mockPrisma: any;
  let mockSignIn: jest.Mock;
  let mockHash: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma = new PrismaClient();
    mockSignIn = jest.fn();
    mockHash = require('bcryptjs').hash as jest.Mock;
    
    // Mock useSession to return unauthenticated state
    (require('next-auth/react').useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
  });

  describe('TC-001-01: Email-based User Registration', () => {
    it('should register a new user with valid email and password', async () => {
      // Arrange
      const testUser = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null); // User doesn't exist
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: testUser.email,
        name: testUser.name,
        role: 'USER',
        createdAt: new Date(),
      });
      mockHash.mockResolvedValue('hashedPassword123');

      // Act - Simulate registration API call
      const registrationResult = await registerUser(testUser, mockPrisma, mockHash);

      // Assert
      expect(registrationResult.success).toBe(true);
      expect(registrationResult.user.email).toBe(testUser.email);
      expect(registrationResult.user.role).toBe('USER');
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: testUser.email,
          name: testUser.name,
          passwordHash: 'hashedPassword123',
          role: 'USER',
        },
      });
    });

    it('should reject registration with invalid email format', async () => {
      // Arrange
      const invalidUser = {
        email: 'invalid-email',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      // Act
      const registrationResult = await registerUser(invalidUser, mockPrisma, mockHash);

      // Assert
      expect(registrationResult.success).toBe(false);
      expect(registrationResult.error).toContain('Invalid email format');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject registration with weak password', async () => {
      // Arrange
      const weakPasswordUser = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
      };

      // Act
      const registrationResult = await registerUser(weakPasswordUser, mockPrisma, mockHash);

      // Assert
      expect(registrationResult.success).toBe(false);
      expect(registrationResult.error).toContain('Password must be at least 8 characters');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should reject registration with existing email', async () => {
      // Arrange
      const existingUser = {
        email: 'existing@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing-user-123',
        email: existingUser.email,
      });

      // Act
      const registrationResult = await registerUser(existingUser, mockPrisma, mockHash);

      // Assert
      expect(registrationResult.success).toBe(false);
      expect(registrationResult.error).toContain('Email already registered');
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('TC-001-02: OAuth User Registration (Google)', () => {
    it('should register user via Google OAuth', async () => {
      // Arrange
      const googleUser = {
        email: 'googleuser@gmail.com',
        name: 'Google User',
        provider: 'google',
        providerId: 'google-123',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'oauth-user-123',
        email: googleUser.email,
        name: googleUser.name,
        role: 'USER',
        createdAt: new Date(),
      });

      // Act
      const registrationResult = await registerOAuthUser(googleUser, mockPrisma);

      // Assert
      expect(registrationResult.success).toBe(true);
      expect(registrationResult.user.email).toBe(googleUser.email);
      expect(registrationResult.user.provider).toBe('google');
    });

    it('should link existing user account to OAuth provider', async () => {
      // Arrange
      const existingUser = {
        email: 'existing@gmail.com',
        name: 'Existing User',
        provider: 'google',
        providerId: 'google-456',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing-user-123',
        email: existingUser.email,
        name: existingUser.name,
        role: 'USER',
      });

      mockPrisma.user.update.mockResolvedValue({
        id: 'existing-user-123',
        email: existingUser.email,
        name: existingUser.name,
        role: 'USER',
        provider: 'google',
        providerId: 'google-456',
      });

      // Act
      const registrationResult = await registerOAuthUser(existingUser, mockPrisma);

      // Assert
      expect(registrationResult.success).toBe(true);
      expect(registrationResult.user.id).toBe('existing-user-123');
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });
  });

  describe('TC-001-03: Registration Form Validation', () => {
    it('should validate required fields', async () => {
      // Arrange
      const incompleteUser = {
        email: '',
        password: '',
        name: '',
      };

      // Act
      const validationResult = validateRegistrationForm(incompleteUser);

      // Assert
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors).toContain('Email is required');
      expect(validationResult.errors).toContain('Password is required');
      expect(validationResult.errors).toContain('Name is required');
    });

    it('should validate email format', async () => {
      // Arrange
      const invalidEmails = [
        'test',
        'test@',
        '@example.com',
        'test..test@example.com',
        'test@example..com',
      ];

      // Act & Assert
      invalidEmails.forEach(email => {
        const validationResult = validateRegistrationForm({
          email,
          password: 'SecurePassword123!',
          name: 'Test User',
        });
        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors).toContain('Invalid email format');
      });
    });

    it('should validate password strength', async () => {
      // Arrange
      const weakPasswords = [
        '123',
        'password',
        'Password',
        'Password1',
        'pass',
      ];

      // Act & Assert
      weakPasswords.forEach(password => {
        const validationResult = validateRegistrationForm({
          email: 'test@example.com',
          password,
          name: 'Test User',
        });
        expect(validationResult.isValid).toBe(false);
        expect(validationResult.errors).toContain('Password must be at least 8 characters');
      });
    });
  });

  describe('TC-001-04: Registration Security', () => {
    it('should hash passwords before storing', async () => {
      // Arrange
      const testUser = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      mockHash.mockResolvedValue('hashedPassword123');
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: testUser.email,
        name: testUser.name,
        role: 'USER',
      });

      // Act
      await registerUser(testUser, mockPrisma, mockHash);

      // Assert
      expect(mockHash).toHaveBeenCalledWith(testUser.password, 12);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          passwordHash: 'hashedPassword123',
        }),
      });
    });

    it('should not store plain text passwords', async () => {
      // Arrange
      const testUser = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: testUser.email,
        name: testUser.name,
        role: 'USER',
      });

      // Act
      await registerUser(testUser, mockPrisma, mockHash);

      // Assert
      expect(mockPrisma.user.create).not.toHaveBeenCalledWith({
        data: expect.objectContaining({
          password: testUser.password,
        }),
      });
    });
  });

  describe('TC-001-05: Registration Response', () => {
    it('should return user data without sensitive information', async () => {
      // Arrange
      const testUser = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: testUser.email,
        name: testUser.name,
        role: 'USER',
        passwordHash: 'hashedPassword123',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const registrationResult = await registerUser(testUser, mockPrisma, mockHash);

      // Assert
      expect(registrationResult.user).not.toHaveProperty('password');
      expect(registrationResult.user).not.toHaveProperty('passwordHash');
      expect(registrationResult.user).toHaveProperty('id');
      expect(registrationResult.user).toHaveProperty('email');
      expect(registrationResult.user).toHaveProperty('name');
      expect(registrationResult.user).toHaveProperty('role');
    });
  });
});

// Helper functions for testing
async function registerUser(
  userData: {
    email: string;
    password: string;
    name: string;
  },
  prisma: any,
  hashFn: jest.Mock
) {
  // Validate input
  const validation = validateRegistrationForm(userData);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(', '),
    };
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    return {
      success: false,
      error: 'Email already registered',
    };
  }

  // Hash password
  const hashedPassword = await hashFn(userData.password, 12);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      passwordHash: hashedPassword,
      role: 'USER',
    },
  });

  // Return user without sensitive data
  const { passwordHash, ...userWithoutPassword } = newUser;
  return {
    success: true,
    user: userWithoutPassword,
  };
}

async function registerOAuthUser(
  userData: {
    email: string;
    name: string;
    provider: string;
    providerId: string;
  },
  prisma: any
) {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    // Link existing user to OAuth provider
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        provider: userData.provider,
        providerId: userData.providerId,
      },
    });
    return {
      success: true,
      user: updatedUser,
    };
  }

  // Create new OAuth user
  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      provider: userData.provider,
      providerId: userData.providerId,
      role: 'USER',
    },
  });

  return {
    success: true,
    user: newUser,
  };
}

function validateRegistrationForm(userData: {
  email: string;
  password: string;
  name: string;
}) {
  const errors: string[] = [];

  // Required fields
  if (!userData.email) errors.push('Email is required');
  if (!userData.password) errors.push('Password is required');
  if (!userData.name) errors.push('Name is required');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (userData.email && !emailRegex.test(userData.email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (userData.password && userData.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}