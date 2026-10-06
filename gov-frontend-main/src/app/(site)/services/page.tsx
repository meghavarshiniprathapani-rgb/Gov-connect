'use client';

import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceCard } from '@/components/service-card';
import { citizenServices, departmentalServices } from '@/lib/data';
import SearchServices from '@/components/search-services';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ServicesPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 h-8 px-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-primary">
          Government Services
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-2 max-w-3xl mx-auto">
          Find, apply for, and track government services for citizens and
          departments. Or use our AI-powered search to find what you need.
        </p>
      </div>
      
      <SearchServices />

      <Tabs defaultValue="citizen" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto">
          <TabsTrigger value="citizen">Citizen Services</TabsTrigger>
          <TabsTrigger value="departmental">Departmental Services</TabsTrigger>
        </TabsList>
        <TabsContent value="citizen">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {citizenServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="departmental">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {departmentalServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
