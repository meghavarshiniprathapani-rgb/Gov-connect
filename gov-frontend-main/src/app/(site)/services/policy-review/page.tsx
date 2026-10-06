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

export default function PolicyReviewPage() {
  const router = useRouter();
  const [policyId, setPolicyId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, this would submit to a backend.
    const newPolicyId = `POLICY-${Date.now()}`;
    setPolicyId(newPolicyId);
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
            Policy Review
          </CardTitle>
          <CardDescription>
            Submit a new policy or an amendment for legal evaluation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {policyId ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold text-primary">Request Submitted Successfully!</h3>
              <p className="mt-2 text-muted-foreground">Your Policy ID is:</p>
              <p className="mt-1 text-2xl font-bold text-accent">{policyId}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Your request has been sent to the Legal department for review. The current status is "Pending Review".
              </p>
              <Button onClick={() => setPolicyId(null)} className="mt-6">Submit Another Policy</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="policy-title">Policy Title</Label>
                <Input
                  id="policy-title"
                  name="policy-title"
                  placeholder="e.g., Work From Home Policy"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select name="department" required>
                    <SelectTrigger id="department">
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
                 <div className="space-y-2">
                    <Label>Policy Type</Label>
                    <RadioGroup defaultValue="new" className="flex gap-6 pt-2" name="policy-type">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new">New Policy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="amendment" id="amendment" />
                        <Label htmlFor="amendment">Amendment</Label>
                      </div>
                    </RadioGroup>
                  </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide a brief summary and justification for the new policy or amendment."
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="policy-doc">Policy Document</Label>
                <div className="flex items-center justify-center w-full">
                    <Label htmlFor="policy-doc" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PDF, DOCX (MAX. 10MB)</p>
                        </div>
                        <Input id="policy-doc" name="policy-doc" type="file" className="hidden" required />
                    </Label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Submit for Legal Review
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
