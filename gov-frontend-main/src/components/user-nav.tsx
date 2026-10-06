'use client';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { LogOut, User, Bell, Check, MailOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { dashboardNotifications } from '@/lib/data';
import { cn } from '@/lib/utils';

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();
  const [userName, setUserName] = useState('Admin Official');
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const loadNotifications = () => {
    const stored = localStorage.getItem('gov_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      setNotifications(dashboardNotifications);
      localStorage.setItem('gov_notifications', JSON.stringify(dashboardNotifications));
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem('gov_user_name');
    if (storedName) {
      setUserName(storedName);
    }

    loadNotifications();

    // Listen for custom notification events from other components
    const handleNotify = () => loadNotifications();
    window.addEventListener('gov_notification_added', handleNotify);
    window.addEventListener('storage', handleNotify);

    return () => {
      window.removeEventListener('gov_notification_added', handleNotify);
      window.removeEventListener('storage', handleNotify);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('gov_session_token');
    
    toast({
      title: "Session Terminated",
      description: "You have been securely logged out of the administrative portal.",
    });

    router.push('/');
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('gov_notifications', JSON.stringify(updated));
    toast({
      title: "Notifications Updated",
      description: "All official alerts have been marked as read.",
    });
  };

  const toggleReadStatus = (id: number) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    );
    setNotifications(updated);
    localStorage.setItem('gov_notifications', JSON.stringify(updated));
    
    const target = updated.find(n => n.id === id);
    toast({
      title: "Status Updated",
      description: `Alert marked as ${target?.read ? 'read' : 'unread'}.`,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/5">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-accent shadow-sm animate-pulse" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 rounded-xl shadow-2xl border-slate-200 overflow-hidden" align="end">
          <div className="p-4 bg-slate-50/50 border-b flex items-center justify-between">
            <h4 className="text-sm font-black text-primary uppercase tracking-widest leading-none">Official Alerts</h4>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent hover:bg-accent/5"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </div>
          <ScrollArea className="h-[300px]">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={cn(
                      "p-4 hover:bg-slate-50 transition-colors flex gap-3 items-start relative group",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "mt-1.5 h-2 w-2 rounded-full shrink-0",
                      n.read ? "bg-slate-300" : "bg-accent"
                    )} />
                    <div className="flex-1 space-y-1">
                      <p className={cn("text-xs leading-relaxed pr-8", !n.read ? "font-bold text-slate-800" : "text-muted-foreground")}>
                        {n.message}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
                        {n.time}
                      </p>
                    </div>
                    {/* Individual Toggle Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 absolute right-3 top-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReadStatus(n.id);
                      }}
                      title={n.read ? "Mark as unread" : "Mark as read"}
                    >
                      {n.read ? (
                        <Bell className="h-3 w-3 text-accent" />
                      ) : (
                        <Check className="h-3 w-3 text-primary" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <Bell className="h-10 w-10 text-muted-foreground/10 mb-4" />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No active alerts</p>
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/10 shadow-sm overflow-hidden p-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/5 text-primary font-bold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 font-bold border-slate-200 shadow-xl rounded-xl" align="end" forceMount>
          <DropdownMenuLabel className="font-normal p-4 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs">
                {getInitials(userName)}
              </div>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-black text-primary leading-none">{userName}</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Official Personnel</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="p-1">
            <DropdownMenuItem asChild className="py-2.5 cursor-pointer gap-2 focus:bg-primary/5">
              <Link href="/app/profile">
                <User className="h-4 w-4 text-primary" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive py-2.5 cursor-pointer gap-2 font-black">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
