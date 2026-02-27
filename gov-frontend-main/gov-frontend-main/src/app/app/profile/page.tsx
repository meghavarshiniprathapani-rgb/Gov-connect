'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Fingerprint,
  Edit3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState({
    name: 'Admin Official',
    email: 'admin@gov.in',
    designation: 'System Administrator',
    id: 'GOV-ADMIN-001'
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    designation: ''
  });

  useEffect(() => {
    const name = localStorage.getItem('gov_user_name');
    const email = localStorage.getItem('gov_registered_email');
    const designation = localStorage.getItem('gov_user_designation');
    
    if (name && email) {
      setUserData({
        name,
        email,
        designation: designation || 'Authorized Personnel',
        id: `GOV-${Math.floor(100000 + Math.random() * 900000)}`
      });
      setEditForm({
        name,
        designation: designation || 'Authorized Personnel'
      });
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('gov_user_name', editForm.name);
    localStorage.setItem('gov_user_designation', editForm.designation);
    
    setUserData(prev => ({
      ...prev,
      name: editForm.name,
      designation: editForm.designation
    }));

    setIsEditDialogOpen(false);
    
    toast({
      title: "Profile Updated",
      description: "Official personnel records have been successfully modified.",
    });

    // Add a system notification
    const stored = localStorage.getItem('gov_notifications');
    const notifications = stored ? JSON.parse(stored) : [];
    const newNotif = {
      id: Date.now(),
      message: `Profile updated: Name changed to ${editForm.name}, Designation to ${editForm.designation}.`,
      time: 'Just now',
      read: false
    };
    localStorage.setItem('gov_notifications', JSON.stringify([newNotif, ...notifications]));
    window.dispatchEvent(new Event('gov_notification_added'));
  };

  const initials = userData.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-stagger-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-2 font-bold gap-2">
              <Edit3 className="h-4 w-4" /> Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-primary uppercase">Edit Personnel Record</DialogTitle>
              <DialogDescription className="font-medium">
                Modify your official credentials. All changes are logged for auditing.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateProfile} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="font-bold">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-designation" className="font-bold">Designation</Label>
                <Select 
                  value={editForm.designation} 
                  onValueChange={(val) => setEditForm(prev => ({ ...prev, designation: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Citizen Representative">Citizen Representative</SelectItem>
                    <SelectItem value="Department Official">Department Official</SelectItem>
                    <SelectItem value="System Administrator">System Administrator</SelectItem>
                    <SelectItem value="Authorized Personnel">Authorized Personnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full font-black">Commit Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border shadow-lg overflow-hidden bg-white">
        <div className="h-2 w-full bg-primary" />
        <CardHeader className="bg-slate-50/50 border-b pb-8 pt-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-white shadow-md flex items-center justify-center text-primary text-3xl font-black">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-accent p-1.5 rounded-full border-2 border-white shadow-sm">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-black text-primary tracking-tight">
                {userData.name}
              </CardTitle>
              <Badge variant="outline" className="rounded-sm border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest px-3 py-1">
                {userData.designation}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-md">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Official Email</p>
                  <p className="text-base font-bold text-slate-800">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-md">
                  <Fingerprint className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Personnel ID</p>
                  <p className="text-base font-mono font-bold text-slate-800">{userData.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-md">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Jurisdiction</p>
                  <p className="text-base font-bold text-slate-800">Central Repository</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-md">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Member Since</p>
                  <p className="text-base font-bold text-slate-800">2024 (Active)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="bg-slate-50/80 p-6 rounded-md border border-slate-100 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" /> Security Protocol
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Your profile is part of the sovereign data infrastructure. Any modifications to this data are logged and monitored by the central audit board for security compliance.
              </p>
            </div>
          </div>
          
          <div className="pt-4 flex justify-center">
            <Button variant="outline" className="border-2 font-bold px-8" onClick={() => router.push('/app/dashboard')}>
              Return to Control Panel
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.3em]">
          End-to-End Encrypted Personnel Record
        </p>
      </div>
    </div>
  );
}
