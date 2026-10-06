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

export default function ItSupportPage() {
  const router = useRouter();
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real application, this would submit to a backend.
    const newTicketId = `TICKET-${Date.now()}`;
    setTicketId(newTicketId);
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
            IT Support Ticket
          </CardTitle>
          <CardDescription>
            Report a technical issue to the IT department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ticketId ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold text-primary">Ticket Submitted Successfully!</h3>
              <p className="mt-2 text-muted-foreground">Your Ticket ID is:</p>
              <p className="mt-1 text-2xl font-bold text-accent">{ticketId}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Your ticket has been assigned to the IT team. You will be notified about the status updates.
              </p>
              <Button onClick={() => setTicketId(null)} className="mt-6">Submit Another Ticket</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label>Issue Type</Label>
                <RadioGroup
                  defaultValue="software"
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2"
                  name="issue-type"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hardware" id="hardware" />
                    <Label htmlFor="hardware">Hardware</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="software" id="software" />
                    <Label htmlFor="software">Software</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="network" id="network" />
                    <Label htmlFor="network">Network</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Issue Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please describe the issue in detail. Include any error messages you are seeing."
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <RadioGroup
                  defaultValue="medium"
                  className="flex gap-6 pt-2"
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
                <Label htmlFor="screenshot">Screenshot (Optional)</Label>
                <div className="flex items-center justify-center w-full">
                    <Label htmlFor="screenshot" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 2MB)</p>
                        </div>
                        <Input id="screenshot" name="screenshot" type="file" className="hidden" />
                    </Label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Submit Ticket
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
