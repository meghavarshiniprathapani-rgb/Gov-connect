'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Textarea } from '@/components/ui/textarea';
import { departments } from '@/lib/data';
import { Upload, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function BudgetApprovalPage() {
  const router = useRouter();
  const [requestId, setRequestId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newRequestId = `BUDGET-${Date.now()}`;
    setRequestId(newRequestId);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 bg-primary/5 px-4 py-1 rounded-full border border-primary/10">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Departmental Service</span>
        </div>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
          Project Budget Approval
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Official departmental portal for submitting and tracking project budget evaluations.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-8 flex justify-start">
        <Button 
          variant="outline" 
          onClick={() => router.push('/services')} 
          className="font-bold bg-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto border-border shadow-md rounded-md overflow-hidden bg-white">
        <div className="h-2 bg-primary w-full" />
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-xl font-bold text-primary">
            Application Form
          </CardTitle>
          <CardDescription>
            Please provide accurate project details for financial review.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          {requestId ? (
            <div className="text-center p-12 bg-emerald-50 rounded-md border border-emerald-100">
              <h3 className="text-2xl font-extrabold text-emerald-800">Request Submitted Successfully!</h3>
              <p className="mt-3 text-emerald-700 font-medium">Your Budget Request ID is:</p>
              <p className="mt-2 text-3xl font-black text-primary font-mono bg-white inline-block px-4 py-2 rounded border border-emerald-200 shadow-sm">{requestId}</p>
              <p className="mt-6 text-sm text-emerald-600 leading-relaxed max-w-sm mx-auto">
                Your request has been officially recorded and queued for review by the Finance and Legal departments.
              </p>
              <Button onClick={() => setRequestId(null)} className="mt-8 font-bold">Submit Another Budget</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="project-name" className="text-sm font-bold text-primary">Project Name</Label>
                <Input
                  id="project-name"
                  name="project-name"
                  placeholder="e.g., National Digital Library Initiative"
                  required
                  className="bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="department" className="text-sm font-bold text-primary">Department</Label>
                  <Select name="department" required>
                    <SelectTrigger id="department" className="bg-white">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.name} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="total-cost" className="text-sm font-bold text-primary">Estimated Total Cost (INR)</Label>
                  <Input
                    id="total-cost"
                    name="total-cost"
                    type="number"
                    placeholder="e.g., 1500000"
                    required
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="budget-breakdown" className="text-sm font-bold text-primary">Budget Breakdown</Label>
                <Textarea
                  id="budget-breakdown"
                  name="budget-breakdown"
                  placeholder="Provide a detailed breakdown of costs (e.g., Personnel: 500000, Technology: 700000)"
                  required
                  rows={5}
                  className="bg-white"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="proposal-doc" className="text-sm font-bold text-primary">Proposal Document</Label>
                <div className="flex items-center justify-center w-full">
                    <Label htmlFor="proposal-doc" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors border-slate-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-4 text-primary opacity-50" />
                            <p className="mb-2 text-sm font-bold text-primary">Click to upload proposal</p>
                            <p className="text-xs text-muted-foreground">PDF or DOCX (MAX. 10MB)</p>
                        </div>
                        <Input id="proposal-doc" name="proposal-doc" type="file" className="hidden" required />
                    </Label>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/10">
                  Submit Official Request for Approval
                </Button>
                <p className="text-[10px] text-center mt-4 text-muted-foreground uppercase tracking-widest font-bold">
                  All submissions are logged and archived for auditing purposes
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
