'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Logo } from './logo';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import PillNav from './pill-nav';
import { UserNav } from './user-nav';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Check for mock session token on mount and pathname changes
    const checkAuth = () => {
      const token = localStorage.getItem('gov_session_token');
      setIsAuth(!!token);
    };

    checkAuth();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Listen for storage events (e.g., from other tabs or manual changes)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuth);
    };
  }, [pathname]);
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/app/dashboard', label: 'Dashboard' },
    { href: '/app/communication', label: 'Communication' },
    { href: '/app/tasks', label: 'Tasks' },
    { href: '/app/documents', label: 'Documents' },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-white transition-all",
      isScrolled && "shadow-md"
    )}>
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="flex flex-1 items-center justify-start">
            <Logo />
        </div>
        
        <div className="flex-none flex items-center justify-center">
          <PillNav 
            items={navLinks} 
            activeHref={pathname} 
          />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {isAuth ? (
            <UserNav />
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors hidden md:block">
                Login
              </Link>
              <Button asChild size="sm" className="font-bold">
                <Link href="/register">Signup</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
