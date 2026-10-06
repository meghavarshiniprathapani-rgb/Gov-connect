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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { departments } from '@/lib/data';
import { Upload, ArrowLeft } from 'lucide-react';

export default function InterDepartmentRequestPage() {
  const router = useRouter();
  const [requestId, setRequestId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, you would handle form submission to a backend here.
    const newRequestId = `REQ-${Date.now()}`;
    setRequestId(newRequestId);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/services')} 
          className="hover:bg-primary/5 text-primary font-bold"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Button>
      </div>
      <Card className="max-w-3xl mx-auto border-border shadow-sm rounded-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Inter-Department Request
          </CardTitle>
          <CardDescription>
            Use this form to send a formal request to another department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requestId ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold text-primary">Request Submitted Successfully!</h3>
              <p className="mt-2 text-muted-foreground">Your Request ID is:</p>
              <p className="mt-1 text-2xl font-bold text-accent">{requestId}</p>
              <p className="mt-4 text-sm text-muted-foreground">You can use this ID to track the status of your request on the dashboard. The current status is "Pending".</p>
              <Button onClick={() => setRequestId(null)} className="mt-6">Create Another Request</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="from-department">From Department</Label>
                  <Select name="from-department" required>
                    <SelectTrigger id="from-department">
                      <SelectValue placeholder="Select originating department" />
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
                <div className="space-y-2">
                  <Label htmlFor="to-department">To Department</Label>
                  <Select name="to-department" required>
                    <SelectTrigger id="to-department">
                      <SelectValue placeholder="Select destination department" />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="e.g., Request for Q2 Financial Data"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide a detailed description of your request..."
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <RadioGroup
                  defaultValue="medium"
                  className="flex gap-6"
                  name="priority"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                  <Label htmlFor="attachment">Attachment (Optional)</Label>
                  <div className="flex items-center justify-center w-full">
                      <Label htmlFor="attachment" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PDF, DOCX, PNG, JPG (MAX. 5MB)</p>
                          </div>
                          <Input id="attachment" type="file" className="hidden" />
                      </Label>
                  </div> 
              </div>

              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
