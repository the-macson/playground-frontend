'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Link, Checkbox } from '@nextui-org/react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { login, setToken, setRole, isLoggedIn } from '../../../services/authService';
import { useRouter } from 'next/navigation';

export default function Login() {
  const Router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      if (isLoggedIn('admin')) {
        Router.push('/admin/problem');
      } else {
        Router.push('/');
      }
    }
  }, [Router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for the field being changed
    if (error[e.target.name]) {
      const newErrors = { ...error };
      delete newErrors[e.target.name];
      delete newErrors.submission;
      setError(newErrors);
    }
  };

  const toggleVisibility = () => setShowPassword(!showPassword);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    login(form)
      .then((res) => {
        setToken(res.data.authtoken);
        setRole(res.data.role);
        Router.push('/');
      })
      .catch((err) => {
        console.error(err);
        setError({ submission: 'Invalid email or password' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden'>
      {/* Background Orbs */}
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none'></div>
      <div className='absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none'></div>

      <div className='w-full max-w-md z-10 space-y-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-4xl font-black tracking-tighter font-heading text-white'>
            WELCOME <span className='text-sky-400'>BACK</span>
          </h1>
          <p className='text-default-500 font-mono text-xs tracking-widest uppercase'>
            Sign in to continue your journey
          </p>
        </div>

        <Card className='glass-dark border-white/5 p-8 shadow-2xl'>
          <form onSubmit={handleSubmit} className='space-y-10'>
            <Input
              type='email'
              name='email'
              label='Email Address'
              labelPlacement='outside'
              placeholder='Enter your email'
              variant='bordered'
              color={error.email ? 'danger' : 'default'}
              errorMessage={error.email}
              isInvalid={!!error.email}
              startContent={<Mail size={18} className='text-default-400' />}
              classNames={{
                label: 'text-white font-bold uppercase text-[10px] tracking-widest mb-2',
                inputWrapper: 'bg-white/5 border-white/10 group-data-[focus=true]:border-sky-400/50',
              }}
              onChange={handleChange}
            />

            <div className='space-y-1'>
              <Input
                type={showPassword ? 'text' : 'password'}
                name='password'
                label='Password'
                labelPlacement='outside'
                placeholder='••••••••'
                variant='bordered'
                color={error.password ? 'danger' : 'default'}
                errorMessage={error.password}
                isInvalid={!!error.password}
                startContent={<Lock size={18} className='text-default-400' />}
                endContent={
                  <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                    {showPassword ? (
                      <EyeOff size={20} className='text-default-400' />
                    ) : (
                      <Eye size={20} className='text-default-400' />
                    )}
                  </button>
                }
                classNames={{
                  label: 'text-white font-bold uppercase text-[10px] tracking-widest mb-2',
                  inputWrapper: 'bg-white/5 border-white/10 group-data-[focus=true]:border-sky-400/50',
                }}
                onChange={handleChange}
              />
              <div className='flex justify-end pt-1'>
                <Link
                  href='#'
                  className='text-[10px] font-bold uppercase tracking-widest text-sky-400/60 hover:text-sky-400 transition-colors'
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error.submission && (
              <p className='text-danger text-xs text-center font-bold font-mono uppercase tracking-tight bg-danger/10 py-2 rounded-lg border border-danger/20 italic'>
                {error.submission}
              </p>
            )}

            <Button
              type='submit'
              color='primary'
              variant='shadow'
              isLoading={loading}
              className='w-full bg-gradient-to-r from-sky-500 to-blue-600 font-black tracking-widest uppercase py-6'
              startContent={!loading && <LogIn size={18} />}
            >
              Sign In
            </Button>

            <p className='text-center text-default-500 text-xs'>
              {"Don't have an account? "}
              <Link
                href='/signup'
                className='text-sky-400 font-bold uppercase tracking-widest text-[11px] ml-1 hover:underline'
                onClick={(e) => {
                  e.preventDefault();
                  Router.push('/signup');
                }}
              >
                Sign Up
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
