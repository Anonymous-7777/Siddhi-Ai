import { useState, useEffect, useCallback } from 'react';
import { apiService, Beneficiary } from '@/lib/apiService';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: number;
  loan_amnt: number;
  grade: string;
  purpose: string;
  annual_inc: number;
  initial_fico_score: number;
  home_ownership: string;
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Check if query is a number (ID search)
      const isIdSearch = /^\d+$/.test(query.trim());
      
      if (isIdSearch) {
        // Direct ID search
        try {
          const beneficiary = await apiService.getBeneficiary(parseInt(query));
          setSearchResults([beneficiary]);
        } catch (error) {
          // If ID not found, try text search
          const results = await apiService.searchBeneficiaries({
            query: query,
            page: 1,
            page_size: 10
          });
          setSearchResults(results.results);
        }
      } else {
        // Text search
        const results = await apiService.searchBeneficiaries({
          query: query,
          page: 1,
          page_size: 10
        });
        setSearchResults(results.results);
      }
      
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  const selectResult = useCallback((beneficiaryId: number) => {
    navigate(`/beneficiary/${beneficiaryId}`);
    setShowResults(false);
    setSearchQuery('');
  }, [navigate]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    selectResult,
    clearSearch
  };
};