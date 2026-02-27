'use client';

import Link from 'next/link';
import { 
  FileText, 
  Car, 
  Landmark, 
  Users, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Ship, 
  Building2, 
  Zap,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const IconRegistry: Record<string, any> = {
  FileText,
  Car,
  Landmark,
  Users,
  Home,
  GraduationCap,
  Briefcase,
  Ship,
  Building2,
  Zap
};

type ServiceCardProps = {
  title: string;
  description: string;
  department: string;
  departmentIconName: string;
  link: string;
  className?: string;
};

export function ServiceCard({
  title,
  description,
  department,
  departmentIconName,
  link,
  className
}: ServiceCardProps) {
  const Icon = IconRegistry[departmentIconName] || HelpCircle;

  return (
    <Card className={cn("flex flex-col rounded-md shadow-sm border-border hover:border-accent hover:shadow-md transition-all duration-300", className)}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-lg font-bold text-primary">{title}</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1.5 whitespace-nowrap rounded-sm border-primary/20 bg-primary/5 text-primary">
                <Icon className="w-3 h-3" />
                {department}
            </Badge>
        </div>
        <CardDescription className="pt-3 text-muted-foreground leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Button asChild variant="outline" className="w-full font-bold">
          <Link href={link}>
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
