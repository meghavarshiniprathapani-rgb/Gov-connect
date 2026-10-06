'use server';

import {
  aiPoweredServiceSearch,
  type AiPoweredServiceSearchOutput,
} from '@/ai/flows/ai-powered-service-search-flow';
import { citizenServices, departmentalServices } from '@/lib/data';

export async function handleSearch(
  formData: FormData
): Promise<AiPoweredServiceSearchOutput> {
  const searchQuery = formData.get('searchQuery') as string;

  if (!searchQuery || searchQuery.trim() === '') {
    return { results: [] };
  }

  const queryText = searchQuery.trim();

  // Map local data to match the AI flow's expected input schema
  const allAvailableServices = [
    ...citizenServices.map(s => ({ ...s, type: 'citizen' as const })),
    ...departmentalServices.map(s => ({ ...s, type: 'departmental' as const }))
  ];

  try {
    const response = await aiPoweredServiceSearch({ 
      searchQuery: queryText,
      availableServices: allAvailableServices
    });
    
    if (!response || !response.results) {
      return { results: [] };
    }

    return response;
  } catch (error) {
    // If AI search fails (e.g. quota, network), fallback to a basic keyword search
    console.error('AI search failed, using fallback search:', error);
    
    const lowerQuery = queryText.toLowerCase();
    const fallbackResults = allAvailableServices
      .filter(s => 
        s.title.toLowerCase().includes(lowerQuery) || 
        s.description.toLowerCase().includes(lowerQuery) ||
        s.department.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5);

    return { results: fallbackResults };
  }
}
