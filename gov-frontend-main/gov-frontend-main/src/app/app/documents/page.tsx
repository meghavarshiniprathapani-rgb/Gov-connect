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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Upload, 
  Search, 
  Folder, 
  Download, 
  History, 
  Lock, 
  MoreVertical,
  Plus,
  Filter,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  ShieldCheck,
  X,
  CheckCircle2,
  Share2,
  Trash2,
  Edit,
  KeyRound,
  RefreshCcw,
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

type DocCategory = 'Policy' | 'Report' | 'Finance' | 'Legal' | 'Technical' | 'General';
type AccessLevel = 'Restricted' | 'Department Only' | 'Shared' | 'Public';

interface DocumentVersion {
  version: string;
  updatedBy: string;
  date: string;
  notes: string;
}

interface Document {
  id: string;
  title: string;
  category: DocCategory;
  uploadedBy: string;
  department: string;
  date: string;
  fileType: string;
  accessLevel: AccessLevel;
  description: string;
  versions: DocumentVersion[];
}

const DEPARTMENTS = ['Finance', 'Legal', 'Admin', 'IT', 'Health', 'Transport'];
const CATEGORIES: DocCategory[] = ['Policy', 'Report', 'Finance', 'Legal', 'Technical', 'General'];

const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'DOC-9001',
    title: 'Q3 Financial Audit Report',
    category: 'Finance',
    uploadedBy: 'Arjun Mehta',
    department: 'Finance',
    date: '2024-03-10',
    fileType: 'PDF',
    accessLevel: 'Restricted',
    description: 'Internal audit report for the third quarter of 2023.',
    versions: [
      { version: 'v1.1', updatedBy: 'Arjun Mehta', date: '2024-03-10', notes: 'Final signed copy' },
      { version: 'v1.0', updatedBy: 'Arjun Mehta', date: '2024-03-05', notes: 'Initial draft' },
    ]
  },
  {
    id: 'DOC-9002',
    title: 'New WFH Policy Draft',
    category: 'Policy',
    uploadedBy: 'Sanjay Gupta',
    department: 'Legal',
    date: '2024-03-12',
    fileType: 'DOCX',
    accessLevel: 'Department Only',
    description: 'Proposed amendments to the remote work policy.',
    versions: [
      { version: 'v2.0', updatedBy: 'Sanjay Gupta', date: '2024-03-12', notes: 'Legal review updates' }
    ]
  },
  {
    id: 'DOC-9003',
    title: 'Infrastructure Blueprint 2024',
    category: 'Technical',
    uploadedBy: 'Priya Sharma',
    department: 'IT',
    date: '2024-02-28',
    fileType: 'PDF',
    accessLevel: 'Shared',
    description: 'Cloud infrastructure migration plans for the upcoming fiscal year.',
    versions: [
      { version: 'v1.0', updatedBy: 'Priya Sharma', date: '2024-02-28', notes: 'Initial release' }
    ]
  }
];

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [archivedDocuments, setArchivedDocuments] = useState<Document[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Archive Access State
  const [isArchiveAccessOpen, setIsArchiveAccessOpen] = useState(false);
  const [archiveStep, setArchiveStep] = useState<'loading' | 'setup' | 'login' | 'authorized' | 'reset'>('loading');
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [selectedDocVersions, setSelectedDocVersions] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [accessLevelFilter, setAccessLevelFilter] = useState<string>('all');

  const { toast } = useToast();

  useEffect(() => {
    const savedPass = localStorage.getItem('gov_archive_pass');
    setStoredPassword(savedPass);
    setArchiveStep(savedPass ? 'login' : 'setup');
  }, []);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesFolder = activeFolder === 'All' || doc.department === activeFolder || (activeFolder === 'Shared' && doc.accessLevel === 'Shared');
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
      const matchesAccess = accessLevelFilter === 'all' || doc.accessLevel === accessLevelFilter;
      
      return matchesFolder && matchesSearch && matchesCategory && matchesAccess;
    });
  }, [documents, activeFolder, searchQuery, categoryFilter, accessLevelFilter]);

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    
    setTimeout(() => {
      const formData = new FormData(e.currentTarget);
      const title = (formData.get('title') as string) || 'Untitled Document';
      const category = (formData.get('category') as DocCategory) || 'General';
      const department = (formData.get('department') as string) || 'Admin';
      const accessLevel = (formData.get('accessLevel') as AccessLevel) || 'Department Only';
      const description = (formData.get('description') as string) || 'No description provided.';

      if (editingDoc) {
        setDocuments(docs => docs.map(d => d.id === editingDoc.id ? {
          ...d,
          title,
          category,
          department,
          accessLevel,
          description,
          versions: [
            { 
              version: `v${(parseFloat(d.versions[0].version.replace('v', '')) + 0.1).toFixed(1)}`,
              updatedBy: 'Official Staff',
              date: new Date().toISOString().split('T')[0],
              notes: 'Metadata updated'
            },
            ...d.versions
          ]
        } : d));
        
        toast({
          title: "Update Successful",
          description: `Metadata for "${title}" has been officially updated.`,
          action: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        });
      } else {
        const newDoc: Document = {
          id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
          title,
          category,
          uploadedBy: 'Official Staff',
          department,
          date: new Date().toISOString().split('T')[0],
          fileType: 'PDF',
          accessLevel,
          description,
          versions: [{ 
            version: 'v1.0', 
            updatedBy: 'Official Staff', 
            date: new Date().toISOString().split('T')[0], 
            notes: 'Initial Upload' 
          }]
        };
        setDocuments(prev => [newDoc, ...prev]);
        toast({
          title: "Upload Successful",
          description: `"${newDoc.title}" has been added to the repository.`,
          action: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        });
      }
      
      setIsUploading(false);
      setIsUploadOpen(false);
      setEditingDoc(null);
    }, 1200);
  };

  const handleDownload = (docTitle: string) => {
    toast({
      title: "Download Initiated",
      description: `Preparing "${docTitle}" for secure download...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Ready to Download",
        description: `Your encrypted file is ready.`,
      });
    }, 1000);
  };

  const handleEditMetadata = (doc: Document) => {
    setEditingDoc(doc);
    setIsUploadOpen(true);
  };

  const handleShare = (doc: Document) => {
    toast({
      title: "Authorization Requested",
      description: `A secure share link for "${doc.title}" has been generated and sent for authorization.`,
      action: <Share2 className="h-4 w-4 text-primary" />
    });
  };

  const handleArchive = (doc: Document) => {
    setDocuments(docs => docs.filter(d => d.id !== doc.id));
    setArchivedDocuments(prev => [doc, ...prev]);
    toast({
      variant: "destructive",
      title: "Record Archived",
      description: `"${doc.title}" has been moved to the official archive.`,
      action: <Trash2 className="h-4 w-4 text-white" />
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
    localStorage.setItem('gov_archive_pass', setupPassword);
    setStoredPassword(setupPassword);
    setArchiveStep('authorized');
    toast({ title: "Passcode Established", description: "Your archive access key has been secured." });
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
    localStorage.removeItem('gov_archive_pass');
    setStoredPassword(null);
    setArchiveStep('setup');
    setSetupPassword('');
    setConfirmPassword('');
    toast({ title: "Vault Reset", description: "The archive access key has been cleared." });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setAccessLevelFilter('all');
    setActiveFolder('All');
  };

  const getFileIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF': return <FileText className="h-4 w-4 text-red-600" />;
      case 'DOCX': return <FileCode className="h-4 w-4 text-blue-600" />;
      case 'XLSX': return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
      default: return <FileArchive className="h-4 w-4 text-amber-600" />;
    }
  };

  const hasActiveFilters = useMemo(() => searchQuery !== '' || categoryFilter !== 'all' || accessLevelFilter !== 'all', [searchQuery, categoryFilter, accessLevelFilter]);

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
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">Information Repository</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary">Document Management</h1>
            <p className="text-muted-foreground text-base mt-2">
              Secure storage and retrieval system for official government records.
            </p>
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
                  <Trash2 className="mr-2 h-5 w-5" /> View Archive
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] rounded-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-extrabold text-primary flex items-center gap-2">
                    <Lock className="h-6 w-6 text-accent" /> {archiveStep === 'setup' ? 'Establish Vault Key' : 'Secure Archive Access'}
                  </DialogTitle>
                  <DialogDescription className="font-medium text-muted-foreground">
                    {archiveStep === 'setup' 
                      ? 'First-time setup required. Establish a secure administrative passcode for the document archive.'
                      : 'Restricted area. Authentication required to view archived official records.'}
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
                      <div className="flex items-center gap-4">
                        <Badge className="bg-primary">{archivedDocuments.length} Records</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setArchiveStep('login')}>
                           <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-[350px] rounded-md border">
                      <Table>
                        <TableHeader className="bg-slate-50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="text-[10px] font-black uppercase">Ref ID</TableHead>
                            <TableHead className="text-[10px] font-black uppercase">Document</TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-right">Archived Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {archivedDocuments.length > 0 ? (
                            archivedDocuments.map((doc) => (
                              <TableRow key={doc.id}>
                                <TableCell className="font-mono text-xs font-bold">{doc.id}</TableCell>
                                <TableCell className="text-xs font-extrabold">{doc.title}</TableCell>
                                <TableCell className="text-xs text-right text-muted-foreground">{doc.date}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-12 text-muted-foreground italic font-medium">
                                No records found in the archive vault.
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

            <Dialog open={isUploadOpen} onOpenChange={(open) => {
              setIsUploadOpen(open);
              if (!open) setEditingDoc(null);
            }}>
              <DialogTrigger asChild>
                <Button className="rounded-md shadow-lg shadow-primary/10 px-8 h-12 font-bold text-base">
                  <Upload className="mr-2 h-5 w-5" /> Store New Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-extrabold text-primary">
                    {editingDoc ? 'Edit Metadata' : 'Upload Document'}
                  </DialogTitle>
                  <DialogDescription className="font-medium text-muted-foreground">
                    {editingDoc ? 'Modify official metadata for the selected record.' : 'Assign a formal record to the secure departmental repository.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-bold text-slate-700">Official Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      placeholder="e.g. Q3 Financial Report" 
                      required 
                      className="h-11" 
                      defaultValue={editingDoc?.title || ''}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="font-bold text-slate-700">Category</Label>
                      <Select name="category" defaultValue={editingDoc?.category || "General"}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="font-bold text-slate-700">Primary Dept.</Label>
                      <Select name="department" defaultValue={editingDoc?.department || "Admin"}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEPARTMENTS.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessLevel" className="font-bold text-slate-700">Access Level</Label>
                    <Select name="accessLevel" defaultValue={editingDoc?.accessLevel || "Department Only"}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Restricted">Restricted (Admin Only)</SelectItem>
                        <SelectItem value="Department Only">Department Only</SelectItem>
                        <SelectItem value="Shared">Shared Across Departments</SelectItem>
                        <SelectItem value="Public">Public (Internal Portal)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-bold text-slate-700">Record Abstract</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Brief context or summary..." 
                      className="resize-none" 
                      rows={3} 
                      defaultValue={editingDoc?.description || ''}
                    />
                  </div>
                  
                  {!editingDoc && (
                    <div className="border-2 border-dashed rounded-md p-8 text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors border-slate-200">
                      <Plus className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
                      <p className="text-sm font-bold text-slate-700">Select File from Device</p>
                      <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">PDF, DOCX, XLSX (MAX. 50MB)</p>
                    </div>
                  )}

                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full h-12 font-extrabold text-lg" disabled={isUploading}>
                      {isUploading ? 'Securing Data...' : (editingDoc ? 'Commit Official Metadata Changes' : 'Finalize Record Submission')}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Folders Navigation */}
        <div className="space-y-6">
          <Card className="rounded-md border-slate-200 shadow-sm overflow-hidden border">
            <CardHeader className="bg-slate-50/50 border-b pb-3 pt-4 px-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                <Folder className="h-4 w-4" /> Department Folders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                {['All', 'Finance', 'Legal', 'Admin', 'IT', 'Shared'].map(folder => (
                  <button
                    key={folder}
                    onClick={() => setActiveFolder(folder)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-bold transition-all",
                      activeFolder === folder 
                        ? "bg-primary text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <Folder className={cn("h-4 w-4", activeFolder === folder ? "text-white" : "text-primary/60")} />
                    {folder}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md border-slate-200 shadow-sm bg-accent/5 p-5 border">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="h-5 w-5 text-accent" />
              <h4 className="font-black text-xs uppercase tracking-widest text-primary">Security Protocol</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              All official records are stored with AES-256 encryption. Every access event is logged for security audit compliance.
            </p>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="rounded-md shadow-sm border-slate-200 overflow-hidden border">
            <CardHeader className="border-b bg-slate-50/50 py-6 px-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <Input 
                    placeholder="Search records by ID, title, or keywords..." 
                    className="pl-10 h-11 rounded-md border-slate-200 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters} className="h-11 px-4 text-slate-500 hover:text-red-600 font-bold text-xs uppercase tracking-widest">
                      <X className="mr-2 h-4 w-4" /> Clear
                    </Button>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-11 rounded-md border-2 border-primary/20 text-primary font-bold px-6 hover:bg-primary/5">
                        <Filter className="mr-2 h-4 w-4" /> Advanced Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-5 rounded-md shadow-xl border-slate-200" align="end">
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filter by Category</Label>
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Records</SelectItem>
                              {CATEGORIES.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security Access</Label>
                          <Select value={accessLevelFilter} onValueChange={setAccessLevelFilter}>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="All Levels" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Access Levels</SelectItem>
                              <SelectItem value="Restricted">Restricted</SelectItem>
                              <SelectItem value="Department Only">Department Only</SelectItem>
                              <SelectItem value="Shared">Shared</SelectItem>
                              <SelectItem value="Public">Public</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full font-bold" onClick={clearFilters} variant="outline">Reset All</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100/50 hover:bg-slate-100/50 border-b">
                    <TableHead className="w-[140px] font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Serial No.</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Official Record</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Author</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Access Level</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Log Date</TableHead>
                    <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-primary h-14 px-8">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-slate-50 transition-colors border-b last:border-0 group">
                        <TableCell className="font-mono text-xs font-black text-primary px-8 py-6">{doc.id}</TableCell>
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded bg-slate-100 group-hover:bg-white transition-colors border border-slate-200">
                              {getFileIcon(doc.fileType)}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-800 text-sm">{doc.title}</p>
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">{doc.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-6">
                          <div>
                            <p className="text-sm font-extrabold text-slate-700">{doc.uploadedBy}</p>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{doc.department}</p>
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-6">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "rounded-sm text-[10px] font-black px-4 py-1.5 uppercase tracking-widest shadow-sm",
                              doc.accessLevel === 'Restricted' ? "border-red-200 bg-red-50 text-red-700" :
                              doc.accessLevel === 'Department Only' ? "border-blue-200 bg-blue-50 text-blue-700" :
                              "border-emerald-200 bg-emerald-50 text-emerald-700"
                            )}
                          >
                            {doc.accessLevel === 'Restricted' && <Lock className="h-3 w-3 mr-1.5" />}
                            {doc.accessLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-6 text-xs font-bold text-slate-600 uppercase">
                          {doc.date}
                        </TableCell>
                        <TableCell className="text-right px-8 py-6">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 hover:bg-slate-200" 
                              onClick={() => setSelectedDocVersions(doc)}
                              title="View History"
                            >
                              <History className="h-5 w-5 text-slate-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 hover:bg-primary/10 group/dl" 
                              onClick={() => handleDownload(doc.title)}
                              title="Download Secure Copy"
                            >
                              <Download className="h-5 w-5 text-primary group-hover/dl:scale-110 transition-transform" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-200">
                                  <MoreVertical className="h-5 w-5 text-slate-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-64 font-bold rounded-md shadow-xl border-slate-200">
                                <DropdownMenuItem 
                                  className="cursor-pointer py-2 px-3 gap-2"
                                  onClick={() => handleEditMetadata(doc)}
                                >
                                  <Edit className="h-4 w-4 text-primary" />
                                  Edit Official Metadata
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer py-2 px-3 gap-2"
                                  onClick={() => handleShare(doc)}
                                >
                                  <Share2 className="h-4 w-4 text-accent" />
                                  Share with Authorization
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer py-2 px-3 gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 font-black"
                                  onClick={() => handleArchive(doc)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Archive Record
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center text-muted-foreground font-bold italic">
                        No official records found matching the specified criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Version History Dialog */}
      <Dialog open={!!selectedDocVersions} onOpenChange={(open) => !open && setSelectedDocVersions(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-primary">
              <History className="h-6 w-6 text-accent" /> Revision Log
            </DialogTitle>
            <DialogDescription className="font-medium">
              Official revision history for <span className="text-primary font-bold">"{selectedDocVersions?.title}"</span>
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[350px] mt-6 pr-4">
            <div className="space-y-6">
              {selectedDocVersions?.versions.map((v, i) => (
                <div key={`${v.version}-${i}`} className="relative pl-8 pb-4 border-l-2 border-slate-100 last:border-0 last:pb-0">
                  <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-white border-4 border-primary shadow-sm" />
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="font-black text-[10px] uppercase tracking-widest bg-primary/5 text-primary border-primary/20">{v.version}</Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{v.date}</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-700">{v.updatedBy}</p>
                  <p className="text-xs text-muted-foreground mt-2 italic bg-slate-50 p-3 rounded-sm border border-slate-100 leading-relaxed">
                    "{v.notes}"
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-8">
            <Button variant="outline" className="w-full font-bold h-11" onClick={() => setSelectedDocVersions(null)}>Return to Dashboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
