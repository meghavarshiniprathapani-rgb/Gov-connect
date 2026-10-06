'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Send, 
  Search, 
  Bell, 
  Megaphone, 
  MessageSquare, 
  Pin, 
  MoreVertical,
  Users,
  Paperclip,
  Smile,
  ArrowLeft,
  Search as SearchIcon,
  Archive,
  BellOff,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

interface Thread {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  type: 'department' | 'group' | 'announcement';
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'Finance': [
    { id: '1', sender: 'Arjun Mehta', senderRole: 'Finance Head', content: 'Has the Q3 budget been finalized yet?', timestamp: '10:30 AM', isMe: false },
    { id: '2', sender: 'System', senderRole: 'Admin', content: 'Yes, it was approved by the Legal department this morning.', timestamp: '10:35 AM', isMe: true },
    { id: '3', sender: 'Arjun Mehta', senderRole: 'Finance Head', content: 'Great. Please share the final document in the shared folder.', timestamp: '10:40 AM', isMe: false },
  ],
  'IT Support': [
    { id: '1', sender: 'IT Team', senderRole: 'Technical Support', content: 'Network maintenance scheduled for tonight at 11 PM.', timestamp: '09:00 AM', isMe: false },
    { id: '2', sender: 'You', senderRole: 'User', content: 'Will it affect the database servers?', timestamp: '09:15 AM', isMe: true },
  ]
};

const MOCK_THREADS: Thread[] = [
  { id: 'Finance', name: 'Finance Department', lastMessage: 'Great. Please share the final document...', time: '10:40 AM', unreadCount: 2, type: 'department' },
  { id: 'IT Support', name: 'IT Support Team', lastMessage: 'Will it affect the database servers?', time: '09:15 AM', unreadCount: 0, type: 'department' },
  { id: 'Legal', name: 'Legal Review Group', lastMessage: 'Policy amendment drafted.', time: 'Yesterday', unreadCount: 5, type: 'group' },
  { id: 'Admin', name: 'General Announcements', lastMessage: 'New WFH guidelines posted.', time: '2 days ago', unreadCount: 0, type: 'announcement' },
];

export default function CommunicationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeThreadId, setActiveThreadId] = useState<string>('Finance');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAlertsEnabled, setIsAlertsEnabled] = useState(true);
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = useMemo(() => 
    MOCK_THREADS.find(t => t.id === activeThreadId), 
  [activeThreadId]);

  const messages = useMemo(() => 
    localMessages[activeThreadId] || [], 
  [activeThreadId, localMessages]);

  const filteredThreads = useMemo(() => 
    MOCK_THREADS.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())),
  [searchQuery]);

  // Scroll to bottom whenever messages change or active thread changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, activeThreadId]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      senderRole: 'Department Official',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setLocalMessages(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), newMessage]
    }));

    setMessageInput('');
    
    toast({
      title: "Message Sent",
      description: "Your secure communication has been delivered to the department.",
    });
  };

  const handleToggleAlerts = () => {
    setIsAlertsEnabled(!isAlertsEnabled);
    toast({
      title: isAlertsEnabled ? "Alerts Silenced" : "Alerts Enabled",
      description: `Notifications for "${activeThread?.name}" have been ${isAlertsEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleArchiveThread = () => {
    toast({
      variant: "destructive",
      title: "Thread Archived",
      description: `The conversation "${activeThread?.name}" has been moved to secure storage.`,
    });
  };

  return (
    <div className="container mx-auto h-[calc(100vh-8rem)] min-h-[600px] py-6 px-4 animate-stagger-fade-in flex flex-col gap-4">
      <div className="flex-none">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 h-8 px-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full flex-1">
        {/* Left Sidebar: Threads & Announcements */}
        <Card className="md:col-span-4 lg:col-span-3 flex flex-col rounded-2xl shadow-sm border-none bg-white overflow-hidden">
          <Tabs defaultValue="messages" className="flex flex-col h-full">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Messages
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" /> Alerts
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="messages" className="flex-1 flex flex-col mt-0 overflow-hidden">
              <div className="p-4 bg-muted/30">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search chats..." 
                    className="pl-9 rounded-xl bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                  {filteredThreads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left",
                        activeThreadId === thread.id ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-muted"
                      )}
                    >
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback className="bg-accent/10 text-accent font-bold">
                          {thread.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-semibold text-sm truncate">{thread.name}</span>
                          <span className="text-[10px] text-muted-foreground">{thread.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                      </div>
                      {thread.unreadCount > 0 && (
                        <Badge className="ml-auto h-5 min-w-5 flex items-center justify-center rounded-full bg-accent">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="announcements" className="flex-1 flex flex-col mt-0 overflow-hidden">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {[
                    { id: 'a1', title: 'New Cybersecurity Guidelines', content: 'All employees must update their passwords by Friday.', department: 'IT', time: '1 hour ago', pinned: true },
                    { id: 'a2', title: 'Office Holiday Schedule', content: 'The office will be closed on March 25th for Holi.', department: 'HR', time: 'Yesterday', pinned: false },
                    { id: 'a3', title: 'Budget Planning Meeting', content: 'Q4 planning session scheduled for Monday.', department: 'Finance', time: '2 days ago', pinned: false },
                  ].map((ann) => (
                    <Card key={ann.id} className="p-4 rounded-xl border-none bg-muted/40 relative overflow-hidden group">
                      {ann.pinned && (
                        <div className="absolute top-2 right-2">
                          <Pin className="h-3 w-3 text-accent rotate-45" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px] py-0">{ann.department}</Badge>
                        <span className="text-[10px] text-muted-foreground">{ann.time}</span>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{ann.title}</h4>
                      <p className="text-xs text-muted-foreground">{ann.content}</p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Main Chat Area */}
        <Card className="md:col-span-8 lg:col-span-9 flex flex-col rounded-2xl shadow-sm border-none bg-white overflow-hidden h-full">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                      {activeThread.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-base leading-none">{activeThread.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs text-muted-foreground">Active Department</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-primary/5" title="View Members">
                        <Users className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold text-primary">
                          <UserCheck className="h-5 w-5 text-accent" /> Department Members
                        </DialogTitle>
                        <DialogDescription>
                          Authorized personnel currently assigned to {activeThread.name}.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {[
                          { name: 'Arjun Mehta', role: 'Head of Department', status: 'Online' },
                          { name: 'Priya Sharma', role: 'Technical Lead', status: 'Online' },
                          { name: 'Sanjay Gupta', role: 'Legal Advisor', status: 'Away' },
                          { name: 'Anjali Rao', role: 'Administrative Officer', status: 'Online' },
                        ].map((member, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border">
                                <AvatarFallback className="bg-primary/5 text-primary font-bold">{member.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{member.name}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{member.role}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-bold px-3 py-0.5 rounded-full",
                              member.status === 'Online' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"
                            )}>
                              {member.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("rounded-full h-10 w-10", !isAlertsEnabled && "text-muted-foreground/40")} 
                    onClick={handleToggleAlerts}
                    title={isAlertsEnabled ? "Silence Alerts" : "Enable Alerts"}
                  >
                    {isAlertsEnabled ? <Bell className="h-5 w-5 text-muted-foreground" /> : <BellOff className="h-5 w-5" />}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-slate-100">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 font-bold rounded-xl shadow-xl border-slate-100">
                      <DropdownMenuItem className="cursor-pointer py-2 px-3 gap-2">
                        <Pin className="h-4 w-4 text-accent" /> Pin Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer py-2 px-3 gap-2">
                        <SearchIcon className="h-4 w-4 text-primary" /> Search within Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer py-2 px-3 gap-2 text-destructive font-black focus:text-destructive focus:bg-destructive/10"
                        onClick={handleArchiveThread}
                      >
                        <Archive className="h-4 w-4" /> Archive Conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6 bg-slate-50/50">
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={cn(
                        "flex flex-col max-w-[80%]",
                        msg.isMe ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      {!msg.isMe && (
                        <span className="text-xs font-semibold text-muted-foreground mb-1 ml-1">
                          {msg.sender} • {msg.senderRole}
                        </span>
                      )}
                      <div 
                        className={cn(
                          "px-4 py-3 rounded-2xl text-sm shadow-sm",
                          msg.isMe 
                            ? "bg-primary text-white rounded-tr-none" 
                            : "bg-white border rounded-tl-none"
                        )}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-center my-8">
                    <div className="bg-accent/10 border border-accent/20 px-6 py-2 rounded-full flex items-center gap-2">
                      <Megaphone className="h-3.5 w-3.5 text-accent" />
                      <span className="text-[11px] font-medium text-accent">General Meeting started in Main Hall</span>
                    </div>
                  </div>
                  {/* Invisible element to anchor the scroll */}
                  <div ref={messagesEndRef} className="h-px w-full" />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2 bg-muted/40 rounded-2xl p-2 pr-3">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-white">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Input 
                    placeholder="Type a message..." 
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm h-9"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className="flex items-center gap-1 border-l pl-2">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-white">
                      <Smile className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="rounded-xl h-9 w-9 bg-primary shadow-lg shadow-primary/20"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  Messages are secure and encrypted. Press Enter to send.
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
              <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                <MessageSquare className="h-16 w-16 text-muted-foreground/20" />
              </div>
              <h3 className="text-xl font-bold mb-2">Select a Conversation</h3>
              <p className="text-muted-foreground max-w-sm">
                Choose a department or topic from the sidebar to start collaborating with your team.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
