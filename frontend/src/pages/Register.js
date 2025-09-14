import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import useAuth from '../hooks/useAuth';
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateName,
  validateConfirmPassword
} from '../utils/validation';
import './Register.css';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      
      if (message.includes('email')) {
        setError('email', { message });
      } else if (message.includes('username')) {
        setError('username', { message });
      } else {
        setError('root', { message });
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <i className="fas fa-dove register-logo" />
          <h1>Create your account</h1>
          <p>Join SafeTweet today and start connecting with others.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          {errors.root && (
            <div className="error-message global-error">
              <i className="fas fa-exclamation-circle" />
              {errors.root.message}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className={errors.name ? 'input-error' : ''}
                {...register('name', {
                  required: 'Full name is required',
                  validate: (value) => validateName(value),
                })}
              />
              {errors.name && (
                <span className="error-message">{errors.name.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                className={errors.username ? 'input-error' : ''}
                {...register('username', {
                  required: 'Username is required',
                  validate: (value) => validateUsername(value),
                })}
              />
              {errors.username && (
                <span className="error-message">{errors.username.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
              {...register('email', {
                required: 'Email is required',
                validate: (value) => validateEmail(value),
              })}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className={errors.password ? 'input-error' : ''}
                {...register('password', {
                  required: 'Password is required',
                  validate: (value) => validatePassword(value),
                })}
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'input-error' : ''}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => validateConfirmPassword(password, value),
                })}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('terms', {
                  required: 'You must accept the terms and conditions',
                })}
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="link">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <span className="error-message">{errors.terms.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="register-features">
        <div className="feature">
          <i className="fas fa-shield-alt" />
          <h3>Safe Environment</h3>
          <p>Advanced content moderation ensures a positive experience</p>
        </div>
        <div className="feature">
          <i className="fas fa-users" />
          <h3>Join Community</h3>
          <p>Connect with like-minded people around the world</p>
        </div>
        <div className="feature">
          <i className="fas fa-rocket" />
          <h3>Get Started</h3>
          <p>Quick and easy registration process</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
