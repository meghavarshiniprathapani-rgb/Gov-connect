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

export default function ResourceAllocationPage() {
  const router = useRouter();
  const [allocationId, setAllocationId] = useState<string | null>(null);
  const [resourceType, setResourceType] = useState<string>('budget');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, this would handle form submission to a backend here.
    const newAllocationId = `ALLOC-${Date.now()}`;
    setAllocationId(newAllocationId);
  };

  const getAmountLabel = () => {
    switch (resourceType) {
      case 'budget':
        return 'Amount (INR)';
      case 'staff':
        return 'Number of Staff';
      case 'equipment':
        return 'Quantity';
      default:
        return 'Quantity or Amount';
    }
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
            Resource Allocation Request
          </CardTitle>
          <CardDescription>
            Request budget, manpower, or equipment for your department's projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allocationId ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold text-primary">Request Submitted Successfully!</h3>
              <p className="mt-2 text-muted-foreground">Your Allocation ID is:</p>
              <p className="mt-1 text-2xl font-bold text-accent">{allocationId}</p>
              <p className="mt-4 text-sm text-muted-foreground">Your request has been forwarded to the Finance department for review. The current status is "Pending".</p>
              <Button onClick={() => setAllocationId(null)} className="mt-6">Create Another Request</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="from-department">Requesting Department</Label>
                <Select name="from-department" required defaultValue="Admin">
                  <SelectTrigger id="from-department">
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
                <p className="text-xs text-muted-foreground">This would typically be auto-filled based on your login.</p>
              </div>

              <div className="space-y-2">
                <Label>Resource Type</Label>
                <RadioGroup
                  defaultValue="budget"
                  className="flex gap-6"
                  name="resource-type"
                  onValueChange={setResourceType}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="budget" id="budget" />
                    <Label htmlFor="budget">Budget</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="staff" id="staff" />
                    <Label htmlFor="staff">Staff</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equipment" id="equipment" />
                    <Label htmlFor="equipment">Equipment</Label>
                  </div>
                </RadioGroup>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    name="project-name"
                    placeholder="e.g., Digital India Initiative Phase 2"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity-amount">{getAmountLabel()}</Label>
                  <Input
                    id="quantity-amount"
                    name="quantity-amount"
                    type="number"
                    placeholder={resourceType === 'budget' ? '500000' : '10'}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification"
                  name="justification"
                  placeholder="Explain why this resource is needed and how it will be used..."
                  required
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                  <Label htmlFor="attachment">Supporting Document (Optional)</Label>
                  <div className="flex items-center justify-center w-full">
                      <Label htmlFor="attachment" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX (MAX. 5MB)</p>
                          </div>
                          <Input id="attachment" type="file" className="hidden" />
                      </Label>
                  </div> 
              </div>

              <Button type="submit" className="w-full">
                Submit Request to Finance
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
