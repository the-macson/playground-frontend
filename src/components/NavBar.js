import React, { useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/authService';

export default function NavBar({ children, fullWidth = false }) {
  const Router = useRouter();
  const handleLogout = () => {
    logout();
    Router.push('/login');
  };
  const handleProblems = () => {
    Router.push('/problem');
  };

  return (
    <div className='min-height-screen'>
      <Navbar isBordered maxWidth='full' className='glass-dark border-b border-white/5 fixed top-0 z-50'>
        <NavbarBrand className='cursor-pointer' onClick={handleProblems}>
          <p className='font-bold text-inherit text-xl tracking-tight font-outfit uppercase'>
            PLAY<span className='text-sky-400'>GROUND</span>
          </p>
        </NavbarBrand>

        <NavbarContent className='hidden sm:flex gap-8' justify='center'>
          <NavbarItem>
            <Link
              className='text-foreground/80 hover:text-sky-400 font-medium transition-colors'
              href='#'
              onClick={(e) => {
                e.preventDefault();
                handleProblems();
              }}
            >
              Problems
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className='text-foreground/60 hover:text-sky-400 font-medium transition-colors'
              href='#'
              onClick={(e) => {
                e.preventDefault();
                Router.push('/profile');
              }}
            >
              Profile
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className='text-foreground/60 hover:text-sky-400 font-medium transition-colors'
              href='#'
              onClick={(e) => {
                e.preventDefault();
                Router.push('/leaderboard');
              }}
            >
              Leaderboard
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify='end'>
          <NavbarItem>
            <Button
              color='primary'
              variant='flat'
              className='bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 font-semibold'
              onClick={handleLogout}
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className={`pt-14 ${fullWidth ? 'w-full' : 'px-16 max-w-[1600px] mx-auto'}`}>{children}</div>
    </div>
  );
}
