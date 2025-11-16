// Authentication utilities for RentDirect
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    verification_status: user.verification_status
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware to check authentication
export const requireAuth = (handler) => {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Get fresh user data
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication error' });
    }
  };
};

// Middleware to check specific roles
export const requireRole = (roles) => {
  return (handler) => {
    return requireAuth(async (req, res) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return handler(req, res);
    });
  };
};

// Middleware to check verification status
export const requireVerified = (handler) => {
  return requireAuth(async (req, res) => {
    if (req.user.verification_status !== 'verified') {
      return res.status(403).json({ 
        error: 'Account not verified',
        verification_status: req.user.verification_status 
      });
    }
    return handler(req, res);
  });
};

// Register new user
export const registerUser = async (userData) => {
  const { email, phone, password, role, first_name, last_name, referral_code } = userData;

  // Check if user already exists
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Find referrer if referral code provided
  let referred_by = null;
  if (referral_code) {
    const referrer = await UserModel.findById(parseInt(referral_code));
    if (referrer && referrer.role === 'marketer') {
      referred_by = referrer.id;
    }
  }

  // Hash password
  const password_hash = await hashPassword(password);

  // Create user
  const user = await UserModel.create({
    email,
    phone,
    password_hash,
    role,
    first_name,
    last_name,
    referred_by
  });

  // Generate token
  const token = generateToken(user);

  return { user: { ...user, password_hash: undefined }, token };
};

// Login user
export const loginUser = async (email, password) => {
  // Find user
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user);

  return { user: { ...user, password_hash: undefined }, token };
};

// Generate referral code for marketers
export const generateReferralCode = (marketerId) => {
  return `REF${marketerId.toString().padStart(6, '0')}`;
};

// Validate Nigerian phone number
export const validateNigerianPhone = (phone) => {
  const nigerianPhoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
  return nigerianPhoneRegex.test(phone.replace(/\s+/g, ''));
};

// Format Nigerian phone number
export const formatNigerianPhone = (phone) => {
  const cleaned = phone.replace(/\s+/g, '').replace(/^\+?234/, '');
  if (cleaned.startsWith('0')) {
    return '+234' + cleaned.substring(1);
  }
  return '+234' + cleaned;
};

// Validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  requireAuth,
  requireRole,
  requireVerified,
  registerUser,
  loginUser,
  generateReferralCode,
  validateNigerianPhone,
  formatNigerianPhone,
  validateEmail,
  validatePassword
};
