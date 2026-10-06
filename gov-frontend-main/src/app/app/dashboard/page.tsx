'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  FileBarChart,
  Loader2,
  ArrowLeft,
  X,
  User,
  Building2,
  Calendar as CalendarIcon,
  Eye,
  ArrowRight
} from 'lucide-react';
import { 
  dashboardApplications, 
  dashboardTasks 
} from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const CHART_DATA = [
  { name: '2020', value: 3200 },
  { name: '2021', value: 4500 },
  { name: '2022', value: 5800 },
  { name: '2023', value: 7200 },
  { name: '2024', value: 8900 },
  { name: '2025', value: 10500 },
];

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const stats = useMemo(() => [
    { label: 'Pending Requests', value: '24', icon: Clock, color: 'text-amber-600', trend: '+4% this week' },
    { label: 'Completed Actions', value: '142', icon: CheckCircle2, color: 'text-emerald-600', trend: '+12% this week' },
    { label: 'Department Active', value: '18', icon: Users, color: 'text-primary', trend: 'Stable' },
    { label: 'SLA Adherence', value: '98.2%', icon: Activity, color: 'text-accent', trend: '+1.2%' },
  ], []);

  const tasksPreview = useMemo(() => dashboardTasks.slice(0, 4), []);

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

  const handleGenerateReport = () => {
    setIsGenerating(true);
    toast({
      title: "Report Generation Initiated",
      description: "Compiling official departmental data into a secure administrative summary.",
    });
    
    addNotification("Report Generation Initiated: Compiling official departmental data.");

    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated Successfully",
        description: "Official Performance Report for FY 2024 is now available in your document vault.",
        action: (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">Download</Badge>
        ),
      });
      addNotification("Report Generated Successfully: Official Performance Report for FY 2024 is ready.");
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-700 font-black';
      case 'Medium': return 'text-amber-700 font-bold';
      case 'Low': return 'text-emerald-700 font-bold';
      default: return 'text-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-8 animate-stagger-fade-in">
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="w-fit h-8 px-2 font-bold text-muted-foreground hover:text-primary hover:bg-primary/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Departmental Intelligence</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-primary">ERP Dashboard</h2>
            <p className="text-muted-foreground text-base mt-2">Centralized administrative monitoring and high-priority departmental workflows.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              className="font-bold shadow-lg shadow-primary/10 h-11"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Generate Official Report'
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border border-slate-200 shadow-sm group hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="h-1 w-full bg-slate-50 group-hover:bg-primary transition-colors" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-4xl font-extrabold text-primary">{stat.value}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50">
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                    </div>
                    <span className="text-xs text-emerald-700 font-bold">{stat.trend}</span>
                  </div>
                </div>
                <div className="p-4 rounded-md bg-slate-50 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <stat.icon className={cn("h-7 w-7", stat.color, "group-hover:text-white")} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-slate-50/50">
            <div>
              <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                <FileBarChart className="w-5 h-5 text-accent" />
                Annual Processing Performance
              </CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Application volume processed across the fiscal years</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white border-primary/20 text-primary font-bold">2024</Badge>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {CHART_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1E3A8A' : '#C9A227'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="border-b pb-4 bg-slate-50/50">
            <CardTitle className="text-xl font-bold text-primary">Priority Actions</CardTitle>
            <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Critical workflows requiring immediate administrative attention</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {tasksPreview.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="flex items-center gap-4 p-4 rounded-md border border-slate-100 bg-white hover:border-primary/30 hover:bg-slate-50/50 transition-all group cursor-pointer"
              >
                <div className="p-3 rounded-sm bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                  <AlertCircle className={cn("h-5 w-5", task.completed ? 'text-muted-foreground' : 'text-accent')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-base font-bold truncate text-foreground", task.completed && "line-through text-muted-foreground/60")}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{task.department}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Official Issue</span>
                  </div>
                </div>
                <div className="text-right border-l pl-4 flex flex-col items-end">
                  <p className="text-[10px] font-black text-muted-foreground/60 uppercase whitespace-nowrap mb-0.5">Due</p>
                  <p className="text-[11px] font-extrabold text-primary mb-2">{task.dueDate}</p>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">
                    View <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" className="w-full font-extrabold border-2 hover:bg-primary/5" asChild>
                <Link href="/app/tasks">Open Full Task Manager</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4 bg-slate-50/50">
            <div>
              <CardTitle className="text-xl font-bold text-primary">Active Application Workflows</CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Formal tracking and status of all incoming departmental application streams</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-extrabold text-primary hover:bg-primary/5 px-4 h-9 rounded-md border border-slate-200" asChild>
              <Link href="/app/documents">
                Access Full Archive <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/50 border-b">
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-12 px-6">Reference ID</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-12 px-6">Assigned Entity</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-12 px-6">Initiated Date</TableHead>
                  <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-primary h-12 px-6">Official Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardApplications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-slate-50 transition-colors border-b last:border-0">
                    <TableCell className="font-mono text-xs font-black text-primary px-6 py-5">{app.id}</TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{app.service}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-bold px-6 py-5 tracking-tight uppercase">{app.date}</TableCell>
                    <TableCell className="text-right px-6 py-5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-sm text-[10px] font-black px-4 py-1.5 uppercase tracking-widest shadow-sm",
                          app.status === 'Approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 
                          app.status === 'In Progress' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                          'border-red-200 bg-red-50 text-red-700'
                        )}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

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
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority Rank</p>
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
                      toast({
                        title: "Action Initiated",
                        description: `Navigating to Task Manager for: ${selectedTask.id}`,
                      });
                      router.push('/app/tasks');
                    }}
                  >
                    Manage Workflow <ArrowRight className="ml-2 h-4 w-4" />
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
