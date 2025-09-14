import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validation';
import './Login.css';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      await login(data);
      toast.success('Logged in successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError('root', { message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      await login({
        email: 'demo@example.com',
        password: 'demopassword'
      });
      toast.success('Demo login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <i className="fas fa-dove login-logo" />
          <h1>Sign in to SafeTweet</h1>
          <p>Welcome back! Please sign in to your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {errors.root && (
            <div className="error-message global-error">
              <i className="fas fa-exclamation-circle" />
              {errors.root.message}
            </div>
          )}

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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
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

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" {...register('rememberMe')} />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              'Sign in'
            )}
          </button>

          <div className="demo-section">
            <p className="divider">or</p>
            <button
              type="button"
              className="demo-button"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                'Try Demo Account'
              )}
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="login-features">
        <div className="feature">
          <i className="fas fa-shield-alt" />
          <h3>Content Moderation</h3>
          <p>AI-powered content moderation keeps the platform safe</p>
        </div>
        <div className="feature">
          <i className="fas fa-globe" />
          <h3>Global Community</h3>
          <p>Connect with people from around the world</p>
        </div>
        <div className="feature">
          <i className="fas fa-bolt" />
          <h3>Lightning Fast</h3>
          <p>Real-time updates and seamless experience</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
