import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database, AlertTriangle, Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dummyUsers } from "@/data/dummyLoanData";
import { apiService, Beneficiary } from "@/lib/apiService";

export default function BeneficiaryDetailSimple() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      console.log(`Loading beneficiary ${id}...`);
      setLoading(true);

      // First, prepare mock data as fallback
      let mockData = dummyUsers.find(user => user.id === id);
      
      if (!mockData) {
        // Create synthetic data for any ID
        mockData = {
          id: id,
          loan_amnt: 100000 + (parseInt(id) % 500000),
          term: 36,
          int_rate: 10.5 + (parseInt(id) % 10),
          installment: 3200 + (parseInt(id) % 1000),
          grade: ['A', 'B', 'C', 'D'][parseInt(id) % 4],
          sub_grade: ['A1', 'B2', 'C3', 'D4'][parseInt(id) % 4],
          emp_length: 2 + (parseInt(id) % 10),
          home_ownership: ['RENT', 'MORTGAGE', 'OWN'][parseInt(id) % 3],
          annual_inc: 300000 + (parseInt(id) % 1000000),
          verification_status: 'Verified',
          purpose: 'debt_consolidation',
          dti: 15 + (parseInt(id) % 20),
          initial_fico_score: 650 + (parseInt(id) % 150),
          delinq_2yrs: 0,
          inq_last_6mths: 1,
          open_acc: 5 + (parseInt(id) % 15),
          pub_rec: 0,
          revol_bal: 10000 + (parseInt(id) % 50000),
          revol_util: 20 + (parseInt(id) % 50),
          total_acc: 10 + (parseInt(id) % 30),
          application_type: 'Individual',
          is_defaulted: 0,
          financial_state: 'Current'
        };
      }

      // Try API first
      try {
        const apiResult = await apiService.getBeneficiary(parseInt(id));
        setData(apiResult);
        setDataSource('api');
        console.log('✅ Loaded from API');
        
        toast({
          title: "Real Data Loaded",
          description: `Successfully loaded beneficiary ${id} from database`,
        });
      } catch (error) {
        console.log('❌ API failed, using mock data:', error);
        setData(mockData);
        setDataSource('mock');
        
        toast({
          title: "Using Mock Data",
          description: "Backend unavailable, showing sample data",
          variant: "destructive",
        });
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  // Export beneficiary data to PDF
  const exportBeneficiaryPDF = () => {
    if (!data) {
      toast({
        title: "Export Failed",
        description: "No beneficiary data available to export.",
        variant: "destructive"
      });
      return;
    }

    // Create comprehensive PDF content
    const pdfContent = `
BENEFICIARY COMPREHENSIVE DOSSIER
===============================================

BASIC INFORMATION
-----------------
Beneficiary ID: ${data.id}
Data Source: ${dataSource === 'api' ? 'Live Database' : 'Mock Data'}
Report Generated: ${new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}

LOAN DETAILS
------------
Amount: ₹${data.loan_amnt?.toLocaleString('en-IN') || 'N/A'}
Monthly Installment: ₹${data.installment?.toLocaleString('en-IN') || 'N/A'}
Term: ${data.term || 'N/A'} months
Interest Rate: ${data.int_rate || 'N/A'}%
Grade: ${data.grade || 'N/A'}
Sub Grade: ${data.sub_grade || 'N/A'}
Purpose: ${data.purpose?.replace('_', ' ') || 'N/A'}

PERSONAL INFORMATION
--------------------
Employment Length: ${data.emp_length || 'N/A'} years
Home Ownership: ${data.home_ownership || 'N/A'}
Annual Income: ₹${data.annual_inc?.toLocaleString('en-IN') || 'N/A'}
Income Verification: ${data.verification_status || 'N/A'}

CREDIT PROFILE
--------------
Credit Score: ${data.initial_fico_score || 'N/A'}
DTI Ratio: ${data.dti || 'N/A'}%
Delinquencies (2yr): ${data.delinq_2yrs || 'N/A'}
Credit Inquiries (6m): ${data.inq_last_6mths || 'N/A'}
Open Accounts: ${data.open_acc || 'N/A'}
Total Accounts: ${data.total_acc || 'N/A'}
Public Records: ${data.pub_rec || 'N/A'}
Revolving Balance: ₹${data.revol_bal?.toLocaleString('en-IN') || 'N/A'}
Utilization: ${data.revol_util || 'N/A'}%

STATUS INFORMATION
------------------
${dataSource === 'api' ? `Default Status: ${data.is_defaulted === 1 ? '⚠️  DEFAULTED' : '✅ CURRENT'}
First Time Borrower: ${data.is_first_time_borrower_flag === 1 ? 'Yes' : 'No'}` : 'Status: Current (Mock Data)'}

ADDITIONAL NOTES
----------------
- This dossier contains confidential financial information
- Generated from ${dataSource === 'api' ? 'live database with 1.2M+ records' : 'sample data for demonstration'}
- All currency amounts displayed in Indian Rupees (₹)

===============================================
Siddhi Credit Scoring System
Confidential Document - Authorized Personnel Only
Generated on: ${new Date().toISOString()}
===============================================
    `;

    // Create and download the file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Beneficiary_${data.id}_Dossier_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Beneficiary ${data.id} dossier downloaded successfully.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading beneficiary {id}...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Data Found</h2>
          <p className="text-muted-foreground mb-4">
            Could not load data for beneficiary {id}
          </p>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Beneficiary {id}</h1>
          <Badge variant={dataSource === 'api' ? 'default' : 'secondary'}>
            {dataSource === 'api' ? (
              <>
                <Database className="w-3 h-3 mr-1" />
                Live Data
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                Mock Data
              </>
            )}
          </Badge>
        </div>
        <Button onClick={exportBeneficiaryPDF} className="bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Download Dossier (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">ID:</span>
              <span>{data.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Loan Amount:</span>
              <span>₹{data.loan_amnt?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Grade:</span>
              <Badge variant="outline">{data.grade}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Interest Rate:</span>
              <span>{data.int_rate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Term:</span>
              <span>{data.term} months</span>
            </div>
          </CardContent>
        </Card>

        {/* Financial Details */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Annual Income:</span>
              <span>₹{data.annual_inc?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">DTI Ratio:</span>
              <span>{data.dti}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Credit Score:</span>
              <span>{data.initial_fico_score}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Home Ownership:</span>
              <span>{data.home_ownership}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Employment:</span>
              <span>{data.emp_length} years</span>
            </div>
          </CardContent>
        </Card>

        {/* Credit Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Open Accounts:</span>
              <span>{data.open_acc}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total Accounts:</span>
              <span>{data.total_acc}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Revolving Balance:</span>
              <span>₹{data.revol_bal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Utilization:</span>
              <span>{data.revol_util}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Delinquencies:</span>
              <span>{data.delinq_2yrs}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Information */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.is_defaulted === 0 ? '✅' : '⚠️'}
              </div>
              <div className="text-sm font-medium">
                {data.is_defaulted === 0 ? 'Current' : 'Defaulted'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {data.verification_status === 'Verified' ? '✅' : '❓'}
              </div>
              <div className="text-sm font-medium">Income Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.grade}</div>
              <div className="text-sm font-medium">Risk Grade</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.purpose?.replace(/_/g, ' ')}</div>
              <div className="text-sm font-medium">Purpose</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Information */}
      {dataSource === 'mock' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">⚠️ Debug Mode</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-700">
            <p>This page is showing mock data because the backend API is not available.</p>
            <p className="mt-2"><strong>To see real data:</strong></p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Start the backend: <code>python main.py</code></li>
              <li>Verify it's running: <a href="http://localhost:8001/health" target="_blank" className="underline">http://localhost:8001/health</a></li>
              <li>Refresh this page</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}