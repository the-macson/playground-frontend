'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Link } from '@nextui-org/react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Fingerprint } from 'lucide-react';
import { register, setToken, setRole, isLoggedIn } from '@/services/authService';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const Router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      Router.push('/');
    }
  }, [Router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    if (!form.name) newErrors.name = 'Full Name is required';
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    register(form)
      .then(({ data }) => {
        setToken(data.authtoken);
        setRole(data.role);
        Router.push('/');
      })
      .catch((err) => {
        console.error(err);
        setError({ submission: err.response?.data?.message || 'Registration failed. Please try again.' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden'>
      {/* Background Orbs */}
      <div className='absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none'></div>
      <div className='absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none'></div>

      <div className='w-full max-w-xl z-10 space-y-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-4xl font-black tracking-tighter font-heading text-white uppercase italic'>
            CREATE <span className='text-sky-400'>IDENTITY</span>
          </h1>
          <p className='text-default-500 font-mono text-xs tracking-widest uppercase'>
            Join the elite circle of coders
          </p>
        </div>

        <Card className='glass-dark border-white/5 p-8 shadow-2xl'>
          <form onSubmit={handleSubmit} className='space-y-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                name='name'
                label='Full Name'
                labelPlacement='outside'
                placeholder='John Doe'
                variant='bordered'
                isInvalid={!!error.name}
                errorMessage={error.name}
                startContent={<User size={18} className='text-default-400' />}
                classNames={{
                  label: 'text-white font-bold uppercase text-[10px] tracking-widest mb-2',
                  inputWrapper: 'bg-white/5 border-white/10 group-data-[focus=true]:border-sky-400/50',
                }}
                onChange={handleChange}
              />
              <Input
                name='username'
                label='Username'
                labelPlacement='outside'
                placeholder='johndoe_99'
                variant='bordered'
                isInvalid={!!error.username}
                errorMessage={error.username}
                startContent={<Fingerprint size={18} className='text-default-400' />}
                classNames={{
                  label: 'text-white font-bold uppercase text-[10px] tracking-widest mb-2',
                  inputWrapper: 'bg-white/5 border-white/10 group-data-[focus=true]:border-sky-400/50',
                }}
                onChange={handleChange}
              />
            </div>

            <Input
              type='email'
              name='email'
              label='Email Address'
              labelPlacement='outside'
              placeholder='john@example.com'
              variant='bordered'
              isInvalid={!!error.email}
              errorMessage={error.email}
              startContent={<Mail size={18} className='text-default-400' />}
              classNames={{
                label: 'text-white font-bold uppercase text-[10px] tracking-widest mb-2',
                inputWrapper: 'bg-white/5 border-white/10 group-data-[focus=true]:border-sky-400/50',
              }}
              onChange={handleChange}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Input
                type={showPassword ? 'text' : 'password'}
                name='password'
                label='Password'
                labelPlacement='outside'
                placeholder='••••••••'
                variant='bordered'
                isInvalid={!!error.password}
                errorMessage={error.password}
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
              <Input
                type={showPassword ? 'text' : 'password'}
                name='confirmPassword'
                label='Confirm Password'
                labelPlacement='outside'
                placeholder='••••••••'
                variant='bordered'
                isInvalid={!!error.confirmPassword}
                errorMessage={error.confirmPassword}
                startContent={<Lock size={18} className='text-default-400' />}
                classNames={{
                  label: 'text-white font-bold uppercase text-[10px] tracking-widest mb-2',
                  inputWrapper: 'bg-white/5 border-white/10 group-data-[focus=true]:border-sky-400/50',
                }}
                onChange={handleChange}
              />
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
              startContent={!loading && <UserPlus size={18} />}
            >
              Initialize Account
            </Button>

            <p className='text-center text-default-500 text-xs'>
              Already a user?{' '}
              <Link
                href='/login'
                className='text-sky-400 font-bold uppercase tracking-widest text-[11px] ml-1 hover:underline'
                onClick={(e) => {
                  e.preventDefault();
                  Router.push('/login');
                }}
              >
                Sign In
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
