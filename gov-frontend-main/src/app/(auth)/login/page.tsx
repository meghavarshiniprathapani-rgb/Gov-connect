'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    localStorage.removeItem('gov_session_token');
  }, []);

  const addNotification = (message: string) => {
    const stored = localStorage.getItem('gov_notifications');
    const notifications = stored ? JSON.parse(stored) : [];
    const newNotif = {
      id: Date.now(),
      message,
      time: 'Just now',
      read: false
    };
    localStorage.setItem('gov_notifications', JSON.stringify([newNotif, ...notifications]));
    window.dispatchEvent(new Event('gov_notification_added'));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const MOCK_EMAIL = 'admin@gov.in';
    const MOCK_PASSWORD = 'password123';
    const REGISTERED_EMAIL = localStorage.getItem('gov_registered_email');
    const REGISTERED_PASSWORD = localStorage.getItem('gov_registered_password');

    setTimeout(() => {
      const inputEmail = email.toLowerCase();
      const isAdminMatch = inputEmail === MOCK_EMAIL && password === MOCK_PASSWORD;
      const isRegisteredMatch = REGISTERED_EMAIL && inputEmail === REGISTERED_EMAIL && password === REGISTERED_PASSWORD;

      if (isAdminMatch || isRegisteredMatch) {
        localStorage.setItem('gov_session_token', 'AUTHORIZED_' + Date.now());
        
        toast({
          title: "Access Authorized",
          description: `Welcome back, ${isAdminMatch ? 'Officer' : 'Representative'}. Redirecting to your secure portal.`,
        });

        addNotification(`Security: Authorized access detected for ${inputEmail}.`);
        
        router.push('/app/dashboard');
      } else {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: "The provided credentials do not match our official records. Please verify and try again.",
        });
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-4 self-start font-bold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      <Card className="border-border shadow-md overflow-hidden">
        <div className="h-1.5 w-full bg-primary" />
        <CardHeader className="space-y-1 text-center bg-slate-50/50 pb-8 pt-8 border-b">
          <div className="flex justify-center mb-4">
             <div className="bg-primary/10 p-4 rounded-full border border-primary/5">
                <ShieldAlert className="h-10 w-10 text-primary" />
             </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-primary tracking-tight">Official Portal Login</CardTitle>
          <CardDescription className="font-medium text-muted-foreground max-w-[300px] mx-auto pt-2">
            Secure administrative access for government officials and authorized representatives.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 pt-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-slate-700">Official Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="officer@gov.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" title="Password" className="font-bold text-slate-700">Access Password</Label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">
                  Recovery Mode
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-slate-200"
              />
            </div>
            <Button type="submit" className="w-full font-black h-12 text-base shadow-lg shadow-primary/20 mt-4" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying Identity...
                </>
              ) : 'Authorize Access'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex-col gap-6 text-center pb-8 pt-4">
          <p className="text-xs text-muted-foreground font-medium">
            New official?{' '}
            <Link href="/register" className="font-black text-primary hover:underline">
              Register New Profile
            </Link>
          </p>
          <div className="pt-6 border-t w-full">
             <div className="flex items-center justify-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em]">
                    Sovereign Data Infrastructure
                </p>
             </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
