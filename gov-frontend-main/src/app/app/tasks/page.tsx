'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ClipboardCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search,
  MoreVertical,
  Calendar as CalendarIcon,
  ShieldCheck,
  Activity,
  Trash2,
  Lock,
  KeyRound,
  RefreshCcw,
  X,
  Eye,
  User,
  Building2,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { dashboardTasks } from '@/lib/data';

type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
type TaskPriority = 'Low' | 'Medium' | 'High';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  department: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  relatedService?: string;
}

const INITIAL_TASKS: Task[] = dashboardTasks.map(t => ({
  ...t,
  priority: t.priority as TaskPriority,
  status: t.status as TaskStatus,
  relatedService: t.title
}));

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Archive Access State
  const [isArchiveAccessOpen, setIsArchiveAccessOpen] = useState(false);
  const [archiveStep, setArchiveStep] = useState<'loading' | 'setup' | 'login' | 'authorized' | 'reset'>('loading');
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    const savedPass = localStorage.getItem('gov_tasks_archive_pass');
    setStoredPassword(savedPass);
    setArchiveStep(savedPass ? 'login' : 'setup');
  }, []);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status === 'Overdue').length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, filterStatus, filterPriority, searchQuery]);

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask: Task = {
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      assignedTo: formData.get('assignTo') as string,
      department: 'General', 
      dueDate: formData.get('dueDate') as string,
      priority: formData.get('priority') as TaskPriority,
      status: 'Pending',
      relatedService: formData.get('service') as string,
    };
    setTasks([newTask, ...tasks]);
    setIsCreateOpen(false);
    toast({
      title: "Task Initialized",
      description: `Workflow "${newTask.id}" has been officially registered.`,
      action: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    });
  };

  const updateTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    toast({
      title: "Status Updated",
      description: `Task status transitioned to ${newStatus}.`,
    });
  };

  const handleArchiveTask = (task: Task) => {
    setTasks(prev => prev.filter(t => t.id !== task.id));
    setArchivedTasks(prev => [task, ...prev]);
    toast({
      variant: "destructive",
      title: "Workflow Archived",
      description: `Task "${task.id}" has been moved to the official archive.`,
      action: <Trash2 className="h-4 w-4 text-white" />
    });
  };

  const handleUnarchiveTask = (task: Task) => {
    setArchivedTasks(prev => prev.filter(t => t.id !== task.id));
    setTasks(prev => [task, ...prev]);
    toast({
      title: "Workflow Restored",
      description: `Task "${task.id}" has been moved back to the active log.`,
      action: <RefreshCcw className="h-4 w-4 text-primary" />
    });
  };

  const handleSetupPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (setupPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords do not match" });
      return;
    }
    if (setupPassword.length < 4) {
      toast({ variant: "destructive", title: "Password must be at least 4 characters" });
      return;
    }
    localStorage.setItem('gov_tasks_archive_pass', setupPassword);
    setStoredPassword(setupPassword);
    setArchiveStep('authorized');
    toast({ title: "Passcode Established", description: "Your tasks vault key has been secured." });
  };

  const handleLoginArchive = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === storedPassword) {
      setArchiveStep('authorized');
    } else {
      toast({ variant: "destructive", title: "Access Denied", description: "Invalid administrative credentials." });
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem('gov_tasks_archive_pass');
    setStoredPassword(null);
    setArchiveStep('setup');
    setSetupPassword('');
    setConfirmPassword('');
    toast({ title: "Vault Reset", description: "The tasks archive access key has been cleared." });
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return 'text-red-700 font-black';
      case 'Medium': return 'text-amber-700 font-bold';
      case 'Low': return 'text-emerald-700 font-bold';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-stagger-fade-in">
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="w-fit h-8 px-2 font-bold text-muted-foreground hover:text-primary hover:bg-primary/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Workflow Authority</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary">Task Management</h1>
            <p className="text-muted-foreground text-base mt-2">Manage, assign, and officially track all inter-departmental workflows.</p>
          </div>
          <div className="flex gap-4">
            <Dialog open={isArchiveAccessOpen} onOpenChange={(open) => {
              setIsArchiveAccessOpen(open);
              if (!open) {
                setInputPassword('');
                setArchiveStep(storedPassword ? 'login' : 'setup');
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-md border-2 border-primary/20 text-primary h-12 font-bold px-6 hover:bg-primary/5">
                  <Trash2 className="mr-2 h-5 w-5" /> View Archived Tasks
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] rounded-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-extrabold text-primary flex items-center gap-2">
                    <Lock className="h-6 w-6 text-accent" /> {archiveStep === 'setup' ? 'Establish Vault Key' : 'Secure Tasks Archive'}
                  </DialogTitle>
                  <DialogDescription className="font-medium text-muted-foreground">
                    {archiveStep === 'setup' 
                      ? 'First-time setup required. Establish a secure administrative passcode for the tasks archive.'
                      : 'Restricted area. Authentication required to view archived official workflows.'}
                  </DialogDescription>
                </DialogHeader>

                {archiveStep === 'setup' && (
                  <form onSubmit={handleSetupPassword} className="space-y-6 py-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="setup-pass" className="font-bold">New Passcode</Label>
                        <Input 
                          id="setup-pass" 
                          type="password" 
                          placeholder="Establish secure key" 
                          required 
                          value={setupPassword}
                          onChange={(e) => setSetupPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-pass" className="font-bold">Confirm Passcode</Label>
                        <Input 
                          id="confirm-pass" 
                          type="password" 
                          placeholder="Verify secure key" 
                          required 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 font-extrabold">Establish Secure Access</Button>
                  </form>
                )}

                {archiveStep === 'login' && (
                  <form onSubmit={handleLoginArchive} className="space-y-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="login-pass" className="font-bold text-slate-700 flex items-center gap-2">
                        <KeyRound className="h-4 w-4" /> Administrative Passcode
                      </Label>
                      <Input 
                        id="login-pass" 
                        type="password" 
                        placeholder="Enter decryption key" 
                        required 
                        className="h-12 text-center text-lg tracking-widest"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button type="submit" className="w-full h-12 font-extrabold text-lg">
                        Authorize Access
                      </Button>
                      <Button 
                        variant="ghost" 
                        type="button" 
                        className="text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => setArchiveStep('reset')}
                      >
                        Reset Vault Credentials
                      </Button>
                    </div>
                  </form>
                )}

                {archiveStep === 'authorized' && (
                  <div className="py-4">
                    <div className="bg-slate-50 border rounded-md p-4 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-800 uppercase tracking-tight">Decryption Successful</span>
                      </div>
                      <Badge className="bg-primary">{archivedTasks.length} Workflows</Badge>
                    </div>
                    <ScrollArea className="h-[350px] rounded-md border">
                      <Table>
                        <TableHeader className="bg-slate-50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="text-[10px] font-black uppercase">Ref ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase">Task Action</TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-right">Operations</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {archivedTasks.length > 0 ? (
                            archivedTasks.map((task) => (
                              <TableRow key={task.id}>
                                <TableCell className="font-mono text-xs font-bold">{task.id}</TableCell>
                                <TableCell className="text-xs font-extrabold">{task.title}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleUnarchiveTask(task)}
                                    className="h-8 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5"
                                  >
                                    <RefreshCcw className="mr-2 h-3 w-3" /> Restore
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-12 text-muted-foreground italic font-medium">
                                No archived tasks found in the vault.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-md shadow-lg shadow-primary/10 px-8 h-12 font-bold text-base">
                  <Plus className="mr-2 h-5 w-5" /> New Action Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px] rounded-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-extrabold text-primary">New Task Entry</DialogTitle>
                  <DialogDescription className="font-medium text-muted-foreground">
                    Assign a formal administrative task to an official or department.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-bold text-slate-700">Official Title</Label>
                    <Input id="title" name="title" placeholder="e.g. Policy Evaluation Request" required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-bold text-slate-700">Detailed Context</Label>
                    <Textarea id="description" name="description" placeholder="Provide necessary context..." rows={4} className="resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignTo" className="font-bold text-slate-700">Assigned To</Label>
                      <Input id="assignTo" name="assignTo" placeholder="Department/Officer" required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="font-bold text-slate-700">Deadline</Label>
                      <Input id="dueDate" name="dueDate" type="date" required className="h-11" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="font-bold text-slate-700">Priority Level</Label>
                      <Select name="priority" defaultValue="Medium">
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low (Administrative)</SelectItem>
                          <SelectItem value="Medium">Medium (Operational)</SelectItem>
                          <SelectItem value="High">High (Immediate Action)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service" className="font-bold text-slate-700">Related Dept.</Label>
                      <Input id="service" name="service" placeholder="e.g. Finance" className="h-11" />
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full h-12 font-extrabold text-lg">Initialize Task Workflow</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
        {[
          { label: 'Total Tasks', value: stats.total, icon: ClipboardCheck, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
          { label: 'Active', value: stats.inProgress, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Verified', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((item) => (
          <Card key={item.label} className="rounded-md border-slate-200 shadow-sm border group">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className={cn("p-4 rounded-md transition-all duration-300", item.bg, "group-hover:scale-110", item.color)}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-3xl font-extrabold text-slate-800">{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Task List */}
      <Card className="rounded-md shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b py-6 px-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <CardTitle className="text-2xl font-extrabold text-primary">Master Task Log</CardTitle>
            <div className="flex flex-wrap gap-3">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  placeholder="Search by ID, title, or assignee..." 
                  className="pl-10 h-11 rounded-md border-slate-200 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px] h-11 rounded-md border-slate-200 shadow-sm font-bold">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Official Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[160px] h-11 rounded-md border-slate-200 shadow-sm font-bold">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Priority Rank</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100/50 hover:bg-slate-100/50 border-b">
                <TableHead className="w-[140px] font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Workflow ID</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Official Action</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Assigned Official</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Audit Date</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Priority</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Log Status</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-slate-50 transition-colors border-b last:border-0 group cursor-pointer" onClick={() => setSelectedTask(task)}>
                    <TableCell className="font-mono text-xs font-black text-primary px-8 py-6">{task.id}</TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-800 text-base">{task.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px] font-medium">{task.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary shadow-sm">
                          {task.assignedTo.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-700">{task.assignedTo}</p>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{task.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center text-xs font-bold gap-2 text-slate-600">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground/60" />
                        {task.dueDate}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <span className={cn("text-xs uppercase tracking-widest", getPriorityColor(task.priority))}>
                        {task.priority}
                      </span>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <Badge variant="outline" className={cn("rounded-sm px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm", getStatusColor(task.status))}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8 py-6" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-200 transition-colors">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 font-bold shadow-xl rounded-md border-slate-200">
                          <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'In Progress')} className="cursor-pointer py-2">
                            <Activity className="h-4 w-4 mr-2" /> Transition to In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateTaskStatus(task.id, 'Completed')} className="cursor-pointer text-emerald-600 font-black py-2">
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Officially Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveTask(task)} className="text-destructive font-black cursor-pointer py-2">
                            <Trash2 className="h-4 w-4 mr-2" /> Archive Workflow
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center text-muted-foreground font-bold italic">
                    No departmental tasks found matching the official criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Task Detail Card Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-md p-0 overflow-hidden border-none shadow-2xl">
          {selectedTask && (
            <div className="flex flex-col">
              <div className="h-2 w-full bg-primary" />
              <div className="p-8 space-y-8 bg-white">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Badge className={cn("rounded-sm px-3 py-1 font-black uppercase tracking-widest shadow-sm", getStatusColor(selectedTask.status))}>
                      {selectedTask.status}
                    </Badge>
                    <h2 className="text-3xl font-black text-primary tracking-tight leading-tight">{selectedTask.title}</h2>
                    <p className="font-mono text-xs font-bold text-muted-foreground">REF ID: {selectedTask.id}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)} className="rounded-full h-8 w-8 hover:bg-slate-100">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y py-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-sm">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assigned Official</p>
                        <p className="text-base font-extrabold text-slate-800">{selectedTask.assignedTo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-sm">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</p>
                        <p className="text-base font-extrabold text-slate-800">{selectedTask.department}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-sm">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Deadline Date</p>
                        <p className="text-base font-extrabold text-slate-800">{selectedTask.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-sm">
                        <ShieldCheck className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                           <ShieldCheck className="h-3 w-3" /> Priority Rank
                        </p>
                        <p className={cn("text-base font-extrabold uppercase", getPriorityColor(selectedTask.priority))}>
                          {selectedTask.priority}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Eye className="h-3 w-3" /> Detailed Workflow Narrative
                  </p>
                  <p className="text-base text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-6 rounded-md border border-slate-100">
                    {selectedTask.description}
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    className="flex-1 h-12 font-extrabold text-base"
                    onClick={() => {
                      updateTaskStatus(selectedTask.id, 'Completed');
                      setSelectedTask(null);
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Verified Completion
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 font-extrabold text-base border-2"
                    onClick={() => {
                      handleArchiveTask(selectedTask);
                      setSelectedTask(null);
                    }}
                  >
                    <Trash2 className="mr-2 h-5 w-5" /> Formal Archive
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
