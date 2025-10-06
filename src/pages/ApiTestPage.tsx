import { useState, useEffect } from 'react';
import { apiService } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, User, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApiTestPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [kpiData, setKpiData] = useState<any>(null);
  const [sampleBeneficiary, setSampleBeneficiary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test API health
      console.log('Testing API health...');
      const health = await apiService.getHealth();
      setHealthData(health);
      
      // Test KPI endpoint
      console.log('Testing KPI endpoint...');
      const kpis = await apiService.getKpiSummary();
      setKpiData(kpis);
      
      // Test specific beneficiary (try a common ID)
      console.log('Testing beneficiary endpoint...');
      try {
        const beneficiary = await apiService.getBeneficiary(100005941);
        setSampleBeneficiary(beneficiary);
      } catch (e) {
        console.log('ID 100005941 not found, trying to get any beneficiary...');
        const beneficiaries = await apiService.getBeneficiaries({ page: 1, page_size: 1 });
        if (beneficiaries.data && beneficiaries.data.length > 0) {
          setSampleBeneficiary(beneficiaries.data[0]);
        }
      }
      
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Testing API Connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Connection Test</h1>
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              API Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-red-500 mt-2">
              Make sure the backend server is running on http://localhost:8001
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Health Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Health Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            {healthData ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status:</span>
                  <Badge variant="default">{healthData.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database:</span>
                  <Badge variant={healthData.database_connected ? "default" : "destructive"}>
                    {healthData.database_connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Records:</span>
                  <span className="font-semibold">{healthData.total_records?.toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date(healthData.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Failed to load</p>
            )}
          </CardContent>
        </Card>

        {/* KPI Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              KPI Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kpiData ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Beneficiaries:</span>
                  <span className="font-semibold">{kpiData.overview.total_beneficiaries?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Credit:</span>
                  <span className="font-semibold">{kpiData.overview.avg_credit_score?.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Default Rate:</span>
                  <span className="font-semibold">{kpiData.overview.default_rate_percent?.toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Volume:</span>
                  <span className="font-semibold">₹{(kpiData.overview.total_loan_amount / 10000000)?.toFixed(1)}Cr</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Failed to load</p>
            )}
          </CardContent>
        </Card>

        {/* Sample Beneficiary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Sample Beneficiary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sampleBeneficiary ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">ID:</span>
                  <span className="font-semibold">{sampleBeneficiary.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Loan Amount:</span>
                  <span className="font-semibold">₹{sampleBeneficiary.loan_amnt?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Grade:</span>
                  <Badge variant="outline">{sampleBeneficiary.grade}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credit:</span>
                  <span className="font-semibold">{sampleBeneficiary.initial_fico_score}</span>
                </div>
                <Button asChild size="sm" className="w-full mt-3">
                  <Link to={`/beneficiary/${sampleBeneficiary.id}`}>
                    View Full Profile
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Failed to load</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints Status */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <Badge variant={healthData ? "default" : "destructive"}>
                /health
              </Badge>
              <p className="text-xs mt-1">{healthData ? "✅" : "❌"}</p>
            </div>
            <div className="text-center">
              <Badge variant={kpiData ? "default" : "destructive"}>
                /kpi_summary
              </Badge>
              <p className="text-xs mt-1">{kpiData ? "✅" : "❌"}</p>
            </div>
            <div className="text-center">
              <Badge variant={sampleBeneficiary ? "default" : "destructive"}>
                /beneficiary/{'{id}'}
              </Badge>
              <p className="text-xs mt-1">{sampleBeneficiary ? "✅" : "❌"}</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary">
                /beneficiaries
              </Badge>
              <p className="text-xs mt-1">Available</p>
            </div>
            <div className="text-center">
              <Badge variant="secondary">
                /search_beneficiaries
              </Badge>
              <p className="text-xs mt-1">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1. Backend Server:</strong> Make sure it's running on http://localhost:8001</p>
            <p><strong>2. API Documentation:</strong> Visit http://localhost:8001/docs</p>
            <p><strong>3. Search Test:</strong> Use the header search to find beneficiary "100005941"</p>
            <p><strong>4. Dashboard:</strong> Check if KPI cards show real data</p>
            <p><strong>5. Explorer:</strong> Visit the Beneficiary Explorer for grid data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}