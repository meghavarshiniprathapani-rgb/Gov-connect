
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader2, ShieldCheck } from 'lucide-react';

/**
 * AppLayout provides the protected administrative layout.
 * It implements a mock authentication check using local storage to simulate 
 * official session management for the prototype.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for mock session token
    const token = localStorage.getItem('gov_session_token');
    
    // Brief artificial delay to simulate security check
    const timeout = setTimeout(() => {
      if (!token) {
        setIsAuthorized(false);
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [router]);

  // Loading state during security verification
  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-6 max-w-sm text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-primary animate-spin opacity-20" />
            <ShieldCheck className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Security Verification</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
              Validating administrative session with the secure central repository...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If not authorized, don't show the children while the router handles the redirect
  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="py-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
