import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Activity,
  Clock,
  Network,
  Building2,
  FileCheck,
  BarChart3,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { departments } from '@/lib/data';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');
  const featuredDepartments = departments.slice(0, 8);

  const infrastructureFeatures = [
    {
      icon: ShieldCheck,
      title: "Secure Infrastructure",
      desc: "Built with secure authentication and encrypted data handling."
    },
    {
      icon: Activity,
      title: "Transparent Workflow",
      desc: "Every request is tracked with real-time status updates."
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      desc: "Monitor applications and approvals instantly."
    },
    {
      icon: Network,
      title: "Inter-Department Integration",
      desc: "Seamless coordination between government departments."
    }
  ];

  const statistics = [
    {
      icon: Building2,
      value: "25+",
      label: "Departments Connected",
    },
    {
      icon: FileCheck,
      value: "10,000+",
      label: "Requests Processed",
    },
    {
      icon: BarChart3,
      value: "98%",
      label: "Transparency Rate",
    },
    {
      icon: Globe,
      value: "24/7",
      label: "Digital Access",
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-border py-12 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
            <div className="space-y-8 max-w-2xl lg:pl-12">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary leading-[1.1]">
                  Unified Governance & <br /> <span className="text-foreground">Service Delivery</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  GovConnect provides a secure, transparent, and authoritative infrastructure for all 
                  inter-departmental operations and citizen-centric digital services.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="font-bold shadow-lg shadow-primary/20 h-14 px-8 text-lg"
                  asChild
                >
                  <Link href="/services">
                    Explore Services <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold h-14 px-8 text-lg border-2"
                  asChild
                >
                  <Link href="/register">
                    Create Account
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-muted-foreground/60 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Official Verification</span>
                </div>
              </div>
            </div>
            <div className="relative">
              {heroImage && (
                <div className="relative overflow-hidden rounded-md shadow-2xl border-4 border-slate-50 bg-white p-2">
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={800}
                    height={500}
                    priority
                    className="object-cover w-full rounded-sm animate-zoom-out"
                    data-ai-hint={heroImage.imageHint}
                  />
                </div>
              )}
              {/* Decorative sovereign elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 rounded-full -z-10 blur-2xl" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full -z-10 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Highlight Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
              Official Digital Infrastructure
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Leveraging established technology standards to deliver public services with integrity, 
              security, and absolute transparency.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {infrastructureFeatures.map((feature, idx) => (
              <Card key={idx} className="rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white group animate-zoom-out">
                <CardHeader>
                  <div className="bg-primary/5 group-hover:bg-primary/10 transition-colors rounded-md w-14 h-14 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight text-primary mb-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-slate-50 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {statistics.map((stat, idx) => (
              <div key={idx} className="space-y-4 animate-zoom-out">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary mb-2">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Departments Grid Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
              Member Departments
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seamless inter-departmental collaboration across all critical government sectors.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {featuredDepartments.map((dept, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-md p-10 flex flex-col items-center justify-center border border-slate-100 group hover:bg-slate-50 hover:border-accent hover:shadow-xl transition-all duration-500 animate-zoom-out"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <dept.icon className="w-12 h-12 text-primary group-hover:text-accent transition-colors" />
                </div>
                <span className="font-extrabold text-foreground text-center text-sm tracking-widest uppercase">
                  {dept.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Button variant="outline" className="font-extrabold h-14 px-10 text-lg border-2 border-primary" asChild>
              <Link href="/services">View All Government Services <ChevronRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
