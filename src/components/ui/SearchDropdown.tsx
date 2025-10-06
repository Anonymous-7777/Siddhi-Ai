import { Search, User, DollarSign, Home, CreditCard, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/useSearch";

interface SearchDropdownProps {
  className?: string;
  placeholder?: string;
}

export function SearchDropdown({ 
  className = "", 
  placeholder = "Search by ID, purpose, or loan details..." 
}: SearchDropdownProps) {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    selectResult,
    clearSearch
  } = useSearch();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-red-100 text-red-800',
      'F': 'bg-red-200 text-red-900',
      'G': 'bg-red-300 text-red-900'
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setShowResults(true);
          }}
          className="pl-10 bg-secondary/50 border-input focus-visible:ring-primary"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border">
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 hover:bg-secondary cursor-pointer border-b border-border last:border-b-0"
                onClick={() => selectResult(result.id)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">ID: {result.id}</span>
                      <Badge variant="outline" className={getGradeColor(result.grade)}>
                        Grade {result.grade}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{formatCurrency(result.loan_amnt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Home className="w-3 h-3" />
                        <span>{result.home_ownership}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-3 h-3" />
                        <span>{result.initial_fico_score}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      Purpose: {result.purpose}
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-xs text-muted-foreground ml-2">
                  <div>Income</div>
                  <div className="font-medium">{formatCurrency(result.annual_inc)}</div>
                </div>
              </div>
            ))}
            
            {searchResults.length === 10 && (
              <div className="p-3 text-center text-xs text-muted-foreground border-t">
                Showing first 10 results. Be more specific for better results.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showResults && searchResults.length === 0 && searchQuery.trim() && !isSearching && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border">
          <CardContent className="p-4 text-center text-sm text-muted-foreground">
            No beneficiaries found for "{searchQuery}"
          </CardContent>
        </Card>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}