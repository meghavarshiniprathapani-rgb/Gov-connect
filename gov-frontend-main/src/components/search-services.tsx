'use client';

import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/service-card';
import { Card, CardContent } from '@/components/ui/card';
import { handleSearch } from '@/actions/search';
import type { AiPoweredServiceSearchOutput } from '@/ai/flows/ai-powered-service-search-flow';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Search className="mr-2 h-4 w-4" />
      )}
      Search
    </Button>
  );
}

export default function SearchServices() {
  const [results, setResults] =
    useState<AiPoweredServiceSearchOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [query, setQuery] = useState('');

  const onSearch = async (formData: FormData) => {
    setError(null);
    setPending(true);
    setQuery(formData.get('searchQuery') as string);

    try {
      const searchResults = await handleSearch(formData);
      setResults(searchResults);
    } catch (e) {
      setError('An error occurred during the search. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="rounded-2xl shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <form action={onSearch} className="flex flex-col sm:flex-row gap-4">
            <Input
              name="searchQuery"
              type="text"
              placeholder="How can we help you today? e.g., 'Apply for passport'"
              className="flex-grow text-base"
              required
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      {pending && (
         <div className="text-center p-8">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary"/>
            <p className="mt-4 text-muted-foreground">Searching for services related to "{query}"...</p>
         </div>
      )}
      {error && (
        <div className="mt-8 text-center text-red-500">{error}</div>
      )}
      {results && !pending && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center">
            Search Results for "{query}"
          </h2>
          {results.results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {results.results.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  department={service.department}
                  departmentIconName={service.departmentIconName}
                  link={service.link}
                />
              ))}
            </div>
          ) : (
            <div className="text-center mt-8 p-8 bg-muted rounded-lg">
              <p className="text-lg text-muted-foreground">
                No official services found matching your query. Try rephrasing your search or browsing the categories below.
              </p>
            </div>
          )}
           <div className="text-center mt-8">
                <Button variant="outline" onClick={() => setResults(null)} className="rounded-2xl">Clear Search Results</Button>
            </div>
        </div>
      )}
    </div>
  );
}
