'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { departments } from '@/lib/data';
import { Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CrossDeptTrainingPage() {
  const router = useRouter();
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTrainingId = `TRAIN-${Date.now()}`;
    setTrainingId(newTrainingId);
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
            Cross-Department Training
          </CardTitle>
          <CardDescription>
            Schedule a new training session for government departments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {trainingId ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold text-primary">Training Scheduled Successfully!</h3>
              <p className="mt-2 text-muted-foreground">Your Training ID is:</p>
              <p className="mt-1 text-2xl font-bold text-accent">{trainingId}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Notifications have been sent to the selected departments. You can track registrations on your dashboard.
              </p>
              <Button onClick={() => {
                setTrainingId(null);
                setDate(undefined);
              }} className="mt-6">Schedule Another Training</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="training-topic">Training Topic</Label>
                <Input
                  id="training-topic"
                  name="training-topic"
                  placeholder="e.g., Advanced Cybersecurity Measures"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="target-department">Target Department</Label>
                  <Select name="target-department" required>
                    <SelectTrigger id="target-department">
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.name} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Multi-department selection will be available soon.</p>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="trainer-name">Trainer Name</Label>
                  <Input
                    id="trainer-name"
                    name="trainer-name"
                    placeholder="e.g., Priya Kumar"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location / Online Link</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Conference Room 3 or https://meet.gov/xyz-abc"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide a brief overview of the training session, topics covered, and prerequisites."
                  required
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Schedule Training
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
