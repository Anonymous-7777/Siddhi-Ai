import { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Filter, Database, Loader2, RefreshCw, Wifi, WifiOff, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockBeneficiaries } from "@/data/mockBeneficiaries";
import { dummyUsers, userRiskScores, BeneficiaryData } from "@/data/dummyLoanData";
import { apiService, Beneficiary } from "@/lib/apiService";
import { useToast } from "@/components/ui/use-toast";

interface BeneficiaryDisplay {
  id: string;
  name: string;
  compositeScore: number;
  riskBand: string;
  financialState: string;
  loanAmount: number;
  region: string;
  purpose: string;
  rawData: BeneficiaryData;
}

export default function BeneficiaryExplorer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchText, setSearchText] = useState("");
  const [apiData, setApiData] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingApiData, setUsingApiData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [riskFilter, setRiskFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [beneficiaryData, setBeneficiaryData] = useState<BeneficiaryDisplay[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  const refreshData = () => {
    setCurrentPage(1);
    setSearchQuery("");
    setIsSearching(false);
    setForceRefresh(prev => prev + 1);
  };

  const searchBeneficiaries = async () => {
    if (!searchQuery.trim()) {
      refreshData();
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      
      if (usingApiData) {
        const result = await apiService.searchBeneficiaries({
          query: searchQuery,
          page: 1,
          page_size: pageSize
        });
        
        // Transform search results
        const searchTransformed: BeneficiaryDisplay[] = result.results.map((item: Beneficiary) => ({
          id: item.id.toString(),
          name: `Beneficiary ${item.id}`,
          compositeScore: item.initial_fico_score || 650,
          riskBand: item.grade || "C",
          financialState: item.is_defaulted === 1 ? "High Risk" : "Current",
          loanAmount: item.loan_amnt || 0,
          region: item.home_ownership || "RENT",
          purpose: (item.purpose || "debt_consolidation").replace(/_/g, " "),
          rawData: item as any
        }));
        
        setBeneficiaryData(searchTransformed);
        setTotalRecords(result.count);
        
        toast({
          title: "Search Results",
          description: `Found ${result.count} beneficiaries matching "${searchQuery}"`,
        });
      } else {
        // Client-side search for mock data
        const filtered = beneficiaryData.filter(beneficiary =>
          beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          beneficiary.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          beneficiary.purpose.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setBeneficiaryData(filtered);
        setTotalRecords(filtered.length);
      }
      
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search Failed",
        description: "Could not search beneficiaries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    refreshData();
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      await apiService.getHealth();
      
      // If health check passes, fetch actual data
      const result = await apiService.getBeneficiaries({
        page: 1,
        page_size: pageSize
      });
      
      setApiData(result.data);
      setTotalRecords(result.pagination.total_items);
      setUsingApiData(true);
      setCurrentPage(1);
      
      // Transform API data for AG Grid
      const apiTransformed: BeneficiaryDisplay[] = result.data.map((item: Beneficiary) => ({
        id: item.id.toString(),
        name: `Beneficiary ${item.id}`,
        compositeScore: item.initial_fico_score || 650,
        riskBand: item.grade || "C",
        financialState: item.is_defaulted === 1 ? "High Risk" : "Current",
        loanAmount: item.loan_amnt || 0,
        region: item.home_ownership || "RENT",
        purpose: (item.purpose || "debt_consolidation").replace(/_/g, " "),
        rawData: item as any
      }));
      
      setBeneficiaryData(apiTransformed);
      
      toast({
        title: "✅ Backend Connected Successfully",
        description: `Loaded ${result.pagination.total_items.toLocaleString()} records from database`,
      });
      
      // Force refresh to update the UI
      setForceRefresh(prev => prev + 1);
      
    } catch (error) {
      console.error('Connection test failed:', error);
      toast({
        title: "❌ Backend Unavailable",
        description: "Cannot connect to backend. Please start the server: python main.py",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const prepareFallbackData = () => {
    // Convert dummy loan data to beneficiary format as fallback
    const transformedData = dummyUsers
      .filter((user, index, self) => self.findIndex(u => u.id === user.id) === index) // Get unique users by ID
      .map(user => {
        const riskScore = userRiskScores[user.id];
        return {
          id: user.id,
          name: `Beneficiary ${user.id}`,
          compositeScore: riskScore ? riskScore.score : 50,
          riskBand: riskScore ? riskScore.band.split("-")[0] : "Medium",
          financialState: user.financial_state,
          loanAmount: user.loan_amnt,
          region: ["North", "South", "East", "West", "Central"][Math.floor(Math.random() * 5)],
          purpose: user.purpose.replace("_", " "),
          rawData: user
        };
      });
    
    setBeneficiaryData(transformedData);
    setTotalRecords(transformedData.length);
  };

  // Fetch API data - Primary data source
  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true);
      
      try {
        console.log(`🔍 Attempting to fetch page ${currentPage} from API...`);
        
        const result = await apiService.getBeneficiaries({
          page: currentPage,
          page_size: pageSize
        });
        
        console.log('✅ API data received:', result);
        
        setApiData(result.data);
        setTotalRecords(result.pagination.total_items);
        setUsingApiData(true);
        
        // Transform API data for AG Grid
        const apiTransformed: BeneficiaryDisplay[] = result.data.map((item: Beneficiary) => ({
          id: item.id.toString(),
          name: `Beneficiary ${item.id}`,
          compositeScore: item.initial_fico_score || 650,
          riskBand: item.grade || "C",
          financialState: item.is_defaulted === 1 ? "High Risk" : "Current",
          loanAmount: item.loan_amnt || 0,
          region: item.home_ownership || "RENT",
          purpose: (item.purpose || "debt_consolidation").replace(/_/g, " "),
          rawData: item as any
        }));
        
        setBeneficiaryData(apiTransformed);
        
        if (currentPage === 1) {
          toast({
            title: "🎉 Live Data Connected",
            description: `Successfully loaded ${result.pagination.total_items.toLocaleString()} records from database`,
          });
        }
        
      } catch (error) {
        console.error('❌ API connection failed:', error);
        setUsingApiData(false);
        
        // Fallback to mock data on first page only
        if (currentPage === 1) {
          prepareFallbackData();
          
          toast({
            title: "⚠️ Using Mock Data",
            description: "Backend unavailable - showing sample data. Check if backend server is running on port 8001.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, [currentPage, pageSize, forceRefresh]);

  const RiskBadge = ({ value }: { value: string }) => {
    const getRiskVariant = (risk: string) => {
      const lowerRisk = risk.toLowerCase();
      if (lowerRisk.includes("low") || lowerRisk === "a" || lowerRisk === "b") return "default";
      if (lowerRisk.includes("medium") || lowerRisk === "c") return "secondary";
      return "destructive";
    };
    return <Badge variant={getRiskVariant(value)}>{value}</Badge>;
  };

  const StateBadge = ({ value }: { value: string }) => {
    const getStateVariant = (state: string) => {
      switch (state.toLowerCase()) {
        case "stable":
        case "current": 
          return "default";
        case "stressed":
        case "high risk":
          return "destructive";
        case "crisis":
          return "destructive";
        default:
          return "secondary";
      }
    };
    return <Badge variant={getStateVariant(value)}>{value}</Badge>;
  };

  const ScoreCell = ({ value }: { value: number }) => {
    const getScoreColor = (score: number) => {
      if (score >= 700) return "bg-green-100 text-green-800";
      if (score >= 600) return "bg-yellow-100 text-yellow-800"; 
      return "bg-red-100 text-red-800";
    };
    
    return (
      <div className={`${getScoreColor(value)} px-3 py-1 rounded-md font-semibold inline-block`}>
        {value}
      </div>
    );
  };

  const columnDefs: ColDef[] = [
    { field: "id", headerName: "ID", width: 120, pinned: "left" },
    { field: "name", headerName: "Name", width: 180, pinned: "left" },
    { 
      field: "compositeScore", 
      headerName: "Composite Score", 
      width: 180,
      cellRenderer: (params: any) => <ScoreCell value={params.value} />
    },
    { 
      field: "riskBand", 
      headerName: "Risk Band", 
      width: 130,
      cellRenderer: (params: any) => <RiskBadge value={params.value} />
    },
    { 
      field: "financialState", 
      headerName: "Financial State", 
      width: 160,
      cellRenderer: (params: any) => <StateBadge value={params.value} />
    },
    { field: "loanAmount", headerName: "Loan Amount", width: 140, valueFormatter: (params) => `₹${params.value?.toLocaleString() || 0}` },
    { field: "region", headerName: "Home Ownership", width: 130 },
    { field: "purpose", headerName: "Purpose", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      cellRenderer: (params: any) => (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/beneficiary/${params.data.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ];

  const filteredData = useMemo(() => {
    // If using API search, don't filter client-side (data is already filtered)
    if (usingApiData && isSearching) {
      return beneficiaryData;
    }
    
    return beneficiaryData.filter(beneficiary => {
      const matchesRisk = riskFilter === "all" || beneficiary.riskBand.toLowerCase() === riskFilter;
      const matchesState = stateFilter === "all" || beneficiary.financialState === stateFilter;
      
      return matchesRisk && matchesState;
    });
  }, [riskFilter, stateFilter, beneficiaryData, usingApiData, isSearching]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">Beneficiary Explorer</h1>
            <Badge variant={usingApiData ? "default" : "secondary"}>
              {usingApiData ? (
                <>
                  <Database className="w-3 h-3 mr-1" />
                  Live Data ({totalRecords.toLocaleString()} total)
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Mock Data
                </>
              )}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {usingApiData ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {isSearching ? 'Show All' : 'Refresh'}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={testConnection}
                disabled={loading}
              >
                <Wifi className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Test Connection
              </Button>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          {usingApiData 
            ? (isSearching 
              ? `🔍 Search results for: "${searchQuery}" - ${totalRecords.toLocaleString()} found`
              : "✅ Real-time data from SQLite database - search, filter, and explore beneficiary records"
            )
            : "⚠️ Backend unavailable - showing sample data. Start backend: 'python main.py' on port 8001"
          }
        </p>
      </div>

      {!usingApiData && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center">
              <WifiOff className="w-5 h-5 mr-2" />
              Backend Connection Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-700">
            <p className="mb-3">
              The explorer is currently showing sample data. To view real beneficiary records:
            </p>
            <ol className="list-decimal list-inside space-y-1 mb-3">
              <li>Open a terminal in the project directory</li>
              <li>Run: <code className="bg-yellow-200 px-2 py-1 rounded">python main.py</code></li>
              <li>Verify the server starts on port 8001</li>
              <li>Click "Test Connection" above</li>
            </ol>
            <Button onClick={testConnection} size="sm" disabled={loading}>
              <Wifi className="w-4 h-4 mr-2" />
              Test Connection Now
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 flex gap-2">
              <Input
                placeholder="Search by ID, Name, Purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchBeneficiaries()}
                className="flex-1"
              />
              <Button
                onClick={searchBeneficiaries}
                disabled={isSearching || loading}
                size="default"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {(searchQuery || isSearching) && (
                <Button
                  onClick={clearSearch}
                  disabled={loading}
                  variant="outline"
                  size="default"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="a">Grade A</SelectItem>
                <SelectItem value="b">Grade B</SelectItem>
                <SelectItem value="c">Grade C</SelectItem>
                <SelectItem value="d">Grade D</SelectItem>
                <SelectItem value="e">Grade E</SelectItem>
                <SelectItem value="f">Grade F</SelectItem>
                <SelectItem value="g">Grade G</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Current">Current</SelectItem>
                <SelectItem value="High Risk">High Risk</SelectItem>
                <SelectItem value="Stable">Stable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="h-[600px] w-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading beneficiary data...</p>
              </div>
            </div>
          ) : (
            <div className="ag-theme-alpine h-[600px] w-full">
              <AgGridReact
                rowData={filteredData}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                  filter: true,
                }}
                animateRows={true}
                rowSelection="single"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {usingApiData && totalRecords > pageSize && !isSearching && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} records
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {Math.ceil(totalRecords / pageSize)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * pageSize >= totalRecords || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isSearching && totalRecords > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Search Results: {totalRecords.toLocaleString()} beneficiaries found for "{searchQuery}"
              </p>
              <Button onClick={clearSearch} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
