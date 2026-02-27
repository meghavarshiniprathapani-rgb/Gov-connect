'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [designation, setDesignation] = useState('');

  const validatePassword = (pass: string) => {
    const missing = [];
    if (pass.length < 6) missing.push("at least 6 characters");
    if (!/[a-zA-Z]/.test(pass)) missing.push("at least one letter");
    if (!/[0-9]/.test(pass)) missing.push("at least one digit");
    if (!/[^a-zA-Z0-9]/.test(pass)) missing.push("at least one special symbol");
    return missing;
  };

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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const missingRequirements = validatePassword(password);
    if (missingRequirements.length > 0) {
      toast({
        variant: "destructive",
        title: "Security Requirement Not Met",
        description: `Your password must be: ${missingRequirements.join(", ")}.`,
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('gov_registered_email', email.toLowerCase());
      localStorage.setItem('gov_registered_password', password);
      localStorage.setItem('gov_user_name', `${firstName} ${lastName}`);
      localStorage.setItem('gov_user_designation', designation || 'Citizen Representative');
      localStorage.setItem('gov_session_token', 'AUTHORIZED_' + Date.now());

      toast({
        title: "Registration Successful",
        description: "Your official profile has been established. Redirecting to your dashboard.",
      });

      addNotification(`System: New official profile established for ${firstName} ${lastName}.`);

      router.push('/app/dashboard');
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-4 self-start font-bold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      <Card className="border-border shadow-md overflow-hidden">
        <div className="h-1.5 w-full bg-accent" />
        <CardHeader className="space-y-1 text-center bg-slate-50/50 pb-8 pt-8 border-b">
          <div className="flex justify-center mb-0">
            <div className="bg-accent/10 p-4 rounded-full border border-accent/5">
              <ShieldCheck className="h-10 w-10 text-accent" />
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4 pt-8">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first-name" className="font-bold text-slate-700">First Name</Label>
                    <Input 
                      id="first-name" 
                      placeholder="John" 
                      required 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last-name" className="font-bold text-slate-700">Last Name</Label>
                    <Input 
                      id="last-name" 
                      placeholder="Doe" 
                      required 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-slate-700">Official Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="officer@gov.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-type" className="font-bold text-slate-700">Designation Type</Label>
              <Select onValueChange={setDesignation} required>
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Citizen Representative">Citizen Representative</SelectItem>
                  <SelectItem value="Department Official">Department Official</SelectItem>
                  <SelectItem value="System Administrator">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" title="Password" className="font-bold text-slate-700">Create Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full font-black h-12 text-base shadow-lg shadow-accent/20 mt-4 bg-accent hover:bg-accent/90" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying Identity...
                </>
              ) : 'Signup'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex-col gap-6 text-center pb-8 pt-4">
          <p className="text-sm text-muted-foreground font-medium">
            Already registered?{' '}
            <Link href="/login" className="font-black text-primary hover:underline">
              Login to Portal
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
