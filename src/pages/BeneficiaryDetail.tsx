import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Download, TrendingUp, Shield, DollarSign, Calendar, AlertTriangle, Edit, Save, RotateCcw, User, Database, Loader2, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, BarChart, Bar } from "recharts";
import { dummyUsers, userRiskScores, BeneficiaryData } from "@/data/dummyLoanData";
import { apiService, Beneficiary } from "@/lib/apiService";

export default function BeneficiaryDetail() {
  const { id } = useParams();
  const [beneficiary, setBeneficiary] = useState<BeneficiaryData | null>(null);
  const [apiData, setApiData] = useState<Beneficiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingApiData, setUsingApiData] = useState(false);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [staticData, setStaticData] = useState<{label: string, value: string}[]>([]);
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [editingCell, setEditingCell] = useState<{rowIndex: number, field: string} | null>(null);
  const [changedCells, setChangedCells] = useState<{[key: string]: boolean}>({});
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [currentRiskScore, setCurrentRiskScore] = useState<number>(0);

  // Handle cell click to start editing
  const handleCellClick = (rowIndex: number, field: string) => {
    if (field !== 'month') { // Don't allow editing month names
      setEditingCell({ rowIndex, field });
    }
  };

  // Handle input change in editable cell
  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCell) return;
    
    const { rowIndex, field } = editingCell;
    const newValue = field === 'creditScore' ? parseInt(e.target.value) : parseInt(e.target.value);
    
    // Update the data
    const updatedData = [...financialData];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: newValue };
    setFinancialData(updatedData);
    
    // Mark this cell as changed if it differs from original value
    const cellKey = `${rowIndex}-${field}`;
    const originalValue = originalData[rowIndex][field];
    if (newValue !== originalValue) {
      setChangedCells(prev => ({ ...prev, [cellKey]: true }));
    } else {
      setChangedCells(prev => {
        const updated = { ...prev };
        delete updated[cellKey];
        return updated;
      });
    }
  };
  
  // Handle key press in editable cell
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditingCell(null);
    } else if (e.key === 'Escape') {
      // Cancel edit and restore original value
      if (editingCell) {
        const { rowIndex, field } = editingCell;
        const updatedData = [...financialData];
        updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: originalData[rowIndex][field] };
        setFinancialData(updatedData);
        
        // Remove change marking if existed
        const cellKey = `${rowIndex}-${field}`;
        setChangedCells(prev => {
          const updated = { ...prev };
          delete updated[cellKey];
          return updated;
        });
        
        setEditingCell(null);
      }
    }
  };
  
  // Calculate new risk score based on changes
  const recalculateRiskScore = () => {
    // Check how many values have increased vs decreased
    let improvements = 0;
    let deteriorations = 0;
    
    Object.keys(changedCells).forEach(key => {
      const [rowIndex, field] = key.split('-');
      const currentValue = financialData[parseInt(rowIndex)][field];
      const originalValue = originalData[parseInt(rowIndex)][field];
      
      // Different logic based on field type
      if (field === 'income' || field === 'savings' || field === 'creditScore') {
        // Higher is better
        if (currentValue > originalValue) improvements++;
        else if (currentValue < originalValue) deteriorations++;
      } else if (field === 'expenses' || field === 'electricity' || field === 'mobile') {
        // Lower might be better (less spending)
        if (currentValue < originalValue) improvements++;
        else if (currentValue > originalValue) deteriorations++;
      }
    });
    
    // Calculate score adjustment
    const netImpact = improvements - deteriorations;
    const scoreAdjustment = netImpact * 2; // Each net improvement/deterioration changes score by 2 points
    
    // Original risk score from user data
    const originalScore = userRiskScores[id || ""]?.score || 50;
    let newScore = originalScore + scoreAdjustment;
    
    // Cap score between 0-100
    newScore = Math.max(0, Math.min(100, newScore));
    setCurrentRiskScore(newScore);
    
    toast({
      title: "Risk Score Recalculated",
      description: `Score changed from ${originalScore} to ${newScore} (${scoreAdjustment > 0 ? '+' : ''}${scoreAdjustment} points)`,
      variant: scoreAdjustment >= 0 ? "default" : "destructive",
    });
  };
  
  // Reset all changes
  const resetChanges = () => {
    setFinancialData([...originalData]);
    setChangedCells({});
    setCurrentRiskScore(userRiskScores[id || ""]?.score || 50);
    
    toast({
      title: "Changes Reset",
      description: "All modifications have been reset to original values.",
    });
  };

  // Export beneficiary data to PDF
  const exportBeneficiaryPDF = () => {
    const currentData = usingApiData ? apiData : beneficiary;
    const currentRisk = userRiskScores[id || ""] || { score: currentRiskScore, band: "Medium Risk", recommendation: "Review" };
    
    if (!currentData) {
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
Beneficiary ID: ${currentData.id}
Data Source: ${usingApiData ? 'Live Database' : 'Mock Data'}
Report Generated: ${new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}

LOAN DETAILS
------------
Amount: ₹${currentData.loan_amnt?.toLocaleString('en-IN') || 'N/A'}
${usingApiData ? `Monthly Installment: ₹${apiData.installment?.toLocaleString('en-IN') || 'N/A'}
Term: ${apiData.term || 'N/A'} months
Interest Rate: ${apiData.int_rate || 'N/A'}%
Grade: ${apiData.grade || 'N/A'}
Sub Grade: ${apiData.sub_grade || 'N/A'}` : ''}
Purpose: ${currentData.purpose?.replace('_', ' ') || 'N/A'}
${usingApiData ? `Application Type: ${apiData.application_type || 'N/A'}` : ''}

PERSONAL INFORMATION
--------------------
${usingApiData ? `Employment Length: ${apiData.emp_length || 'N/A'}
Home Ownership: ${apiData.home_ownership || 'N/A'}
Annual Income: ₹${apiData.annual_inc?.toLocaleString('en-IN') || 'N/A'}
Income Verification: ${apiData.verification_status || 'N/A'}` : 'Limited personal data available in mock dataset'}

CREDIT PROFILE
--------------
${usingApiData ? `Initial Credit Score: ${apiData.initial_fico_score || 'N/A'}
Credit History: ${apiData.credit_history_length_years || 'N/A'} years
DTI Ratio: ${apiData.dti || 'N/A'}%
Delinquencies (2yr): ${apiData.delinq_2yrs || 'N/A'}
Credit Inquiries (6m): ${apiData.inq_last_6mths || 'N/A'}
Open Credit Lines: ${apiData.open_acc || 'N/A'}
Total Credit Lines: ${apiData.total_acc || 'N/A'}
Public Records: ${apiData.pub_rec || 'N/A'}` : 'Detailed credit information available in live data mode only'}

RISK ASSESSMENT
---------------
Current Risk Score: ${currentRisk.score}/100
Risk Band: ${currentRisk.band}
Recommendation: ${currentRisk.recommendation}
${Object.keys(changedCells).length > 0 ? `
MODIFIED DATA POINTS: ${Object.keys(changedCells).length} changes made
Risk score updated from original calculation` : 'No modifications made to original data'}

${usingApiData ? `
FINANCIAL STATUS
----------------
Revolving Balance: ₹${apiData.revol_bal?.toLocaleString('en-IN') || 'N/A'}
Revolving Utilization: ${apiData.revol_util || 'N/A'}%

DEFAULT INFORMATION
-------------------
Status: ${apiData.is_defaulted === 1 ? '⚠️  DEFAULTED' : '✅ CURRENT'}
First Time Borrower: ${apiData.is_first_time_borrower_flag === 1 ? 'Yes' : 'No'}
` : ''}

ADDITIONAL NOTES
----------------
- This dossier contains confidential financial information
- Generated from ${usingApiData ? 'live database with 1.2M+ records' : 'sample data for demonstration'}
- Risk calculations based on Siddhi proprietary algorithms
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
    link.download = `Beneficiary_${currentData.id}_Dossier_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Beneficiary ${currentData.id} dossier downloaded successfully.`,
    });
  };
  
  useEffect(() => {
    const fetchBeneficiaryData = async () => {
      if (!id) {
        console.error('No ID provided to BeneficiaryDetail component');
        setLoading(false);
        return;
      }
      
      console.log(`🔍 Fetching beneficiary data for ID: ${id}`);
      setLoading(true);
      
      try {
        // Try to fetch from API first
        console.log('📡 Attempting API call...');
        const apiResult = await apiService.getBeneficiary(parseInt(id));
        console.log('✅ API call successful:', apiResult);
        setApiData(apiResult);
        setUsingApiData(true);
        
        toast({
          title: "Real Data Loaded",
          description: `Loaded beneficiary ${id} from database`,
        });
        
        // Create comprehensive static data from ALL API result fields
        const staticInfo = [
          // Basic Loan Information
          { label: "Beneficiary ID", value: apiResult.id?.toString() || "N/A" },
          { label: "Loan Amount", value: `₹${apiResult.loan_amnt?.toLocaleString() || "N/A"}` },
          { label: "Monthly Installment", value: `₹${apiResult.installment?.toLocaleString() || "N/A"}` },
          { label: "Loan Term", value: `${apiResult.term || "N/A"} months` },
          { label: "Interest Rate", value: `${apiResult.int_rate || "N/A"}%` },
          { label: "Loan Grade", value: `${apiResult.grade || "N/A"}` },
          { label: "Sub Grade", value: apiResult.sub_grade || "N/A" },
          { label: "Purpose", value: apiResult.purpose?.replace(/_/g, ' ') || "N/A" },
          { label: "Application Type", value: apiResult.application_type || "N/A" },
          
          // Personal Information
          { label: "Employment Length", value: apiResult.emp_length || "N/A" },
          { label: "Home Ownership", value: apiResult.home_ownership || "N/A" },
          { label: "Annual Income", value: `₹${apiResult.annual_inc?.toLocaleString() || "N/A"}` },
          { label: "Income Verification", value: apiResult.verification_status || "N/A" },
          
          // Credit Information
          { label: "Credit Score", value: apiResult.initial_fico_score?.toString() || "N/A" },
          { label: "Credit History Length", value: `${apiResult.credit_history_length_years || "N/A"} years` },
          { label: "DTI Ratio", value: `${apiResult.dti || "N/A"}%` },
          { label: "Delinquencies (2yr)", value: apiResult.delinq_2yrs?.toString() || "N/A" },
          { label: "Credit Inquiries (6m)", value: apiResult.inq_last_6mths?.toString() || "N/A" },
          { label: "Open Credit Lines", value: apiResult.open_acc?.toString() || "N/A" },
          { label: "Public Records", value: apiResult.pub_rec?.toString() || "N/A" },
          { label: "Total Credit Lines", value: apiResult.total_acc?.toString() || "N/A" },
          
          // Revolving Credit
          { label: "Revolving Balance", value: `₹${apiResult.revol_bal?.toLocaleString() || "N/A"}` },
          { label: "Revolving Utilization", value: `${apiResult.revol_util || "N/A"}%` },
          
          // Risk and Default Information
          { label: "Default Status", value: apiResult.is_defaulted === 1 ? "⚠️ DEFAULTED" : "✅ CURRENT" },
          { label: "First Time Borrower", value: apiResult.is_first_time_borrower_flag === 1 ? "Yes" : "No" },
          
          // Loan Performance
          { label: "Month of Loan", value: apiResult.month_of_loan?.toString() || "N/A" },
          { label: "Principal Remaining", value: `₹${apiResult.principal_remaining?.toLocaleString() || "N/A"}` },
          { label: "Interest Paid This Month", value: `₹${apiResult.interest_paid_this_month?.toLocaleString() || "N/A"}` },
          { label: "Financial State", value: apiResult.financial_state || "N/A" },
          
          // Synthetic/Alternative Data
          { label: "Electricity Usage", value: `${apiResult.synthetic_electricity_units || "N/A"} units` },
          { label: "Mobile Recharge", value: `₹${apiResult.synthetic_mobile_recharge_amt || "N/A"}` },
          { label: "Utility Payment On-time", value: apiResult.synthetic_utility_payment_ontime === 1 ? "Yes" : "No" },
          { label: "Payment Status", value: apiResult.synthetic_payment_status === 1 ? "On-time" : "Delayed" },
          
          // Consumption & Behavior Analysis
          { label: "Consumption Stability (6m)", value: apiResult.consumption_stability_last_6m || "N/A" },
          { label: "Missed Payments (3m)", value: apiResult.missed_payments_last_3m?.toString() || "N/A" },
          { label: "Avg Recharge (3m)", value: `₹${apiResult.avg_recharge_amt_last_3m || "N/A"}` },
          { label: "Consumption Trend", value: apiResult.consumption_trend_last_6m || "N/A" },
          
          // Stress Analysis
          { label: "Time in Stress/Crisis", value: apiResult.time_in_stress_or_crisis?.toString() || "N/A" },
          { label: "Stress Months (6m)", value: apiResult.months_in_stress_or_crisis_l6m?.toString() || "N/A" },
        ];
        setStaticData(staticInfo);
        
        // Set current risk score based on credit score and default status
        let riskScore = 50;
        if (apiResult.initial_fico_score) {
          if (apiResult.initial_fico_score >= 750) riskScore = 80;
          else if (apiResult.initial_fico_score >= 650) riskScore = 65;
          else if (apiResult.initial_fico_score >= 600) riskScore = 50;
          else riskScore = 30;
          
          if (apiResult.is_defaulted === 1) riskScore -= 20;
        }
        setCurrentRiskScore(riskScore);
        
      } catch (error) {
        console.error('Failed to fetch beneficiary from API:', error);
        setUsingApiData(false);
        
        toast({
          title: "Using Mock Data", 
          description: "Could not load from database, using sample data",
          variant: "destructive",
        });
        
        // Fallback to mock data - ALWAYS create a beneficiary for the requested ID
        console.log(`Looking for beneficiary with ID: ${id}`);
        console.log(`Available dummy user IDs:`, dummyUsers.map(u => u.id).slice(0, 10));
        
        let matchedBeneficiary = dummyUsers.find(user => user.id === id);
        console.log(`Found matched beneficiary:`, matchedBeneficiary ? 'YES' : 'NO');
        
        // If no exact match, create a synthetic beneficiary for this ID
        if (!matchedBeneficiary && id) {
          console.log(`Creating synthetic beneficiary for ID: ${id}`);
          matchedBeneficiary = {
            ...dummyUsers[0], // Use first dummy user as template
            id: id,
            loan_amnt: 100000 + (parseInt(id) % 500000), // Vary loan amount based on ID
            initial_fico_score: 650 + (parseInt(id) % 150), // Vary credit score
            annual_inc: 300000 + (parseInt(id) % 700000), // Vary income
            grade: ['A', 'B', 'C', 'D'][parseInt(id) % 4], // Vary grade
            purpose: ['debt_consolidation', 'home_improvement', 'major_purchase', 'medical'][parseInt(id) % 4]
          };
        }
        
        if (matchedBeneficiary) {
          setBeneficiary(matchedBeneficiary);
      
      // Create timeline data from available data points
      const timeline = dummyUsers
        .filter(user => user.id === id)
        .sort((a, b) => a.month_of_loan - b.month_of_loan)
        .map(user => ({
          month: user.month_of_loan,
          principal: user.principal_remaining,
          stability: user.consumption_stability_last_6m || 5.0,
          state: user.financial_state,
          electricity: user.synthetic_electricity_units,
          mobile: user.synthetic_mobile_recharge_amt,
          interest: user.interest_paid_this_month
        }));
      
      setTimelineData(timeline);

      // Generate static data for the beneficiary
      const riskScore = userRiskScores[id || ""] || { score: 50, band: "Medium Risk-Medium Need", recommendation: "Review" };
      setCurrentRiskScore(riskScore.score);
      
      // Generate sample financial data for interactive grid
      const months = ['May 2025', 'June 2025', 'July 2025', 'August 2025', 'September 2025'];
      const financialGridData = months.map((month, index) => {
        // Generate some realistic financial data
        const baseIncomeMultiplier = 0.95 + (index * 0.05);
        const baseExpenseMultiplier = 1 + (index * 0.03);
        const baseElectricityMultiplier = 0.9 + (index * 0.08);
        const baseMobileMultiplier = 1 + (index * 0.04);
        
        return {
          month,
          income: Math.round((matchedBeneficiary.annual_inc / 12) * baseIncomeMultiplier),
          expenses: Math.round((matchedBeneficiary.annual_inc / 12 * 0.6) * baseExpenseMultiplier),
          savings: Math.round((matchedBeneficiary.annual_inc / 12 * 0.1) * (1 + index * 0.02)),
          electricity: Math.round(timeline[0]?.electricity * baseElectricityMultiplier || 100),
          mobile: Math.round(timeline[0]?.mobile * baseMobileMultiplier || 500),
          creditScore: Math.round(600 + (index * 10))
        };
      });
      
      setFinancialData(financialGridData);
      setOriginalData([...financialGridData]);
      
      setStaticData([
        { label: "Beneficiary ID", value: matchedBeneficiary.id },
        { label: "Loan Amount", value: `₹${matchedBeneficiary.loan_amnt.toLocaleString()}` },
        { label: "Interest Rate", value: `${matchedBeneficiary.int_rate}%` },
        { label: "Loan Term", value: `${matchedBeneficiary.term} months` },
        { label: "Home Ownership", value: matchedBeneficiary.home_ownership },
        { label: "Annual Income", value: `₹${matchedBeneficiary.annual_inc.toLocaleString()}` },
        { label: "Loan Purpose", value: matchedBeneficiary.purpose.replace('_', ' ') },
        { label: "Risk Score", value: `${riskScore.score} (${riskScore.band})` },
      ]);
        } else {
          // If still no beneficiary found, show error
          console.error(`No beneficiary found for ID: ${id}`);
          toast({
            title: "Beneficiary Not Found",
            description: `No data available for beneficiary ID: ${id}`,
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaryData();
  }, [id]);

  const shapValues = [
    { feature: "Payment History", value: beneficiary?.synthetic_payment_status === 1 ? 2.8 : -2.8, positive: beneficiary?.synthetic_payment_status === 1 },
    { feature: "Income Stability", value: (beneficiary?.consumption_stability_last_6m || 0) > 50 ? 1.5 : -1.5, positive: (beneficiary?.consumption_stability_last_6m || 0) > 50 },
    { feature: "Debt-to-Income", value: (beneficiary?.dti || 0) < 30 ? 1.2 : -1.2, positive: (beneficiary?.dti || 0) < 30 },
    { feature: "Credit History", value: beneficiary?.credit_history_length_years || 0 > 10 ? 0.8 : -0.8, positive: (beneficiary?.credit_history_length_years || 0) > 10 },
    { feature: "Recent Inquiries", value: (beneficiary?.inq_last_6mths || 0) < 2 ? 0.5 : -0.5, positive: (beneficiary?.inq_last_6mths || 0) < 2 },
  ];
  
  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading beneficiary data...</p>
      </div>
    );
  }

  if (!beneficiary && !apiData) {
    return (
      <div className="p-8 text-center">
        <p>Beneficiary not found</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const displayData = apiData || beneficiary;
  const displayId = apiData?.id || beneficiary?.id || id;
  const riskScore = userRiskScores[id || ""] || { score: currentRiskScore, band: "Medium Risk", recommendation: "Review" };
  const riskBand = riskScore.band.split("-")[0];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-semibold">Beneficiary {displayId} - Comprehensive Profile</h1>
            <Badge variant={usingApiData ? "default" : "secondary"}>
              {usingApiData ? (
                <>
                  <Database className="w-3 h-3 mr-1" />
                  Live Data
                </>
              ) : (
                <>
                  <User className="w-3 h-3 mr-1" />
                  Mock Data
                </>
              )}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {usingApiData ? 
              `Real data from database • ${apiData?.purpose || 'Unknown purpose'} • Complete loan record` :
              `${beneficiary?.id} • ${beneficiary?.purpose.replace('_', ' ')} • Sample data profile`
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link to={`/interactive-data/${displayId}`}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Interactive Data Grid
            </Link>
          </Button>
          <Button onClick={() => exportBeneficiaryPDF()}>
            <Download className="mr-2 h-4 w-4" />
            Download Dossier (PDF)
          </Button>
          {!usingApiData && (
            <Button variant="outline" onClick={() => window.location.reload()}>
              <Database className="mr-2 h-4 w-4" />
              Try Live Data
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>AI Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">{riskScore.score}</div>
                <p className="text-sm text-muted-foreground">Composite Score</p>
                <Badge variant={riskScore.score >= 75 ? "low" : riskScore.score >= 60 ? "medium" : "high"} className="mt-2">{riskBand}</Badge>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Next Best Action</h4>
                <p className="text-sm text-muted-foreground">
                  {riskScore.recommendation === "Approve" ? 
                    "Approve for direct lending. Beneficiary shows strong repayment behavior and stable financial condition." :
                    riskScore.recommendation === "Review" ?
                    "Continue monitoring. Some risk factors present, but generally stable financial behavior." :
                    "Exercise caution. Multiple risk factors identified in beneficiary's profile."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Brutally Honest Justification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shapValues.map((item) => (
                  <div key={item.feature}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{item.feature}</span>
                      <span className={item.positive ? "text-success" : "text-destructive"}>
                        {item.positive ? "+" : ""}{item.value}
                      </span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full ${item.positive ? "bg-success" : "bg-destructive"}`}
                        style={{
                          width: `${Math.abs(item.value) * 20}%`,
                          left: item.positive ? "50%" : "auto",
                          right: item.positive ? "auto" : "50%",
                        }}
                      />
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Risk Band</span>
                </div>
                <Badge variant={riskScore.score >= 75 ? "low" : riskScore.score >= 60 ? "medium" : "high"}>{riskBand}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Financial State</span>
                </div>
                <Badge variant={beneficiary.financial_state === "Stable" ? "success" : "destructive"}>{beneficiary.financial_state}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Remaining</span>
                </div>
                <span className="text-sm font-semibold">₹{beneficiary.principal_remaining.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Months Elapsed</span>
                </div>
                <span className="text-sm font-semibold">{beneficiary.month_of_loan}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Missed Payments</span>
                </div>
                <span className="text-sm font-semibold">{beneficiary.missed_payments_last_3m}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Behavioral Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" label={{ value: "Month", position: "insideBottom", offset: -5 }} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" label={{ value: "Principal ($)", angle: -90, position: "insideLeft" }} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" label={{ value: "Stability", angle: 90, position: "insideRight" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="principal" 
                    stroke="hsl(var(--chart-1))" 
                    fill="url(#colorPrincipal)"
                    strokeWidth={2}
                    name="Principal Remaining"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="stability" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Consumption Stability"
                    dot={{ fill: "hsl(var(--chart-2))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-0">
              <Tabs defaultValue="static" className="w-full">
                <TabsList className="w-full grid grid-cols-4 rounded-none border-b">
                  <TabsTrigger value="static">Static Loan Data</TabsTrigger>
                  <TabsTrigger value="timeline">Monthly Timeline</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed Data</TabsTrigger>
                  <TabsTrigger value="interactive">Interactive Data</TabsTrigger>
                </TabsList>
                <TabsContent value="static" className="p-6">
                  {usingApiData ? (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <Badge variant="default" className="mb-2">
                          <Database className="w-3 h-3 mr-1" />
                          Real Database Data - All {staticData.length} Fields
                        </Badge>
                        <p className="text-sm text-muted-foreground">Complete loan record from SQLite database</p>
                      </div>
                      
                      {/* Organize fields into logical groups */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Basic Loan Information */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <DollarSign className="w-5 h-5 mr-2" />
                              Loan Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-3">
                              {staticData.slice(0, 9).map((item) => (
                                <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/50">
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-semibold text-right">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Personal & Employment */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <User className="w-5 h-5 mr-2" />
                              Personal Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-3">
                              {staticData.slice(9, 13).map((item) => (
                                <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/50">
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-semibold text-right">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Credit Profile */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Shield className="w-5 h-5 mr-2" />
                              Credit Profile
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-3">
                              {staticData.slice(13, 23).map((item) => (
                                <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/50">
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-semibold text-right">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Risk & Performance */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <AlertTriangle className="w-5 h-5 mr-2" />
                              Risk & Performance
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-3">
                              {staticData.slice(23, 29).map((item) => (
                                <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/50">
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-semibold text-right">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Alternative Data */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Activity className="w-5 h-5 mr-2" />
                              Alternative Data
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-3">
                              {staticData.slice(29, 33).map((item) => (
                                <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/50">
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-semibold text-right">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Behavioral Analysis */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <TrendingUp className="w-5 h-5 mr-2" />
                              Behavioral Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-3">
                              {staticData.slice(33).map((item) => (
                                <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/50">
                                  <span className="text-sm text-muted-foreground">{item.label}</span>
                                  <span className="text-sm font-semibold text-right">{item.value}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center mb-4">
                        <Badge variant="secondary">
                          <User className="w-3 h-3 mr-1" />
                          Mock Data
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">Sample data for demonstration</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {staticData.map((item) => (
                          <div key={item.label} className="space-y-1">
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className="text-sm font-semibold">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="timeline" className="p-6">
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {timelineData.map((month) => (
                      <div key={month.month} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold w-16">Month {month.month}</span>
                          <Badge variant={month.state === "Stable" ? "success" : month.state === "Stressed" ? "destructive" : "secondary"}>
                            {month.state}
                          </Badge>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Principal: </span>
                            <span className="font-semibold">₹{month.principal.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stability: </span>
                            <span className="font-semibold">{month.stability}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="detailed" className="p-6">
                  <div className="max-h-[400px] overflow-auto">
                    <table className="min-w-full border-collapse text-xs">
                      <thead className="sticky top-0 bg-background">
                        <tr>
                          <th className="border px-2 py-1">Month</th>
                          <th className="border px-2 py-1">Principal</th>
                          <th className="border px-2 py-1">Interest</th>
                          <th className="border px-2 py-1">Financial State</th>
                          <th className="border px-2 py-1">Electricity</th>
                          <th className="border px-2 py-1">Mobile</th>
                          <th className="border px-2 py-1">Utility Payment</th>
                          <th className="border px-2 py-1">Stability</th>
                          <th className="border px-2 py-1">Missed Payments</th>
                          <th className="border px-2 py-1">Avg Recharge</th>
                          <th className="border px-2 py-1">Consumption Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dummyUsers
                          .filter(user => user.id === id)
                          .sort((a, b) => a.month_of_loan - b.month_of_loan)
                          .map((data) => (
                            <tr key={data.month_of_loan}>
                              <td className="border px-2 py-1">{data.month_of_loan}</td>
                              <td className="border px-2 py-1">₹{data.principal_remaining.toFixed(2)}</td>
                              <td className="border px-2 py-1">₹{data.interest_paid_this_month.toFixed(2)}</td>
                              <td className="border px-2 py-1">{data.financial_state}</td>
                              <td className="border px-2 py-1">{data.synthetic_electricity_units || '-'}</td>
                              <td className="border px-2 py-1">₹{data.synthetic_mobile_recharge_amt}</td>
                              <td className="border px-2 py-1">{data.synthetic_utility_payment_ontime === 1 ? 'On Time' : 'Late'}</td>
                              <td className="border px-2 py-1">{data.consumption_stability_last_6m?.toFixed(2) || '-'}</td>
                              <td className="border px-2 py-1">{data.missed_payments_last_3m}</td>
                              <td className="border px-2 py-1">₹{data.avg_recharge_amt_last_3m?.toFixed(2) || '-'}</td>
                              <td className="border px-2 py-1">{data.consumption_trend_last_6m?.toFixed(2) || '-'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Module Participation */}
          <Card>
            <CardHeader>
              <CardTitle>Module Participation & History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Direct Lending</h4>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Eligible
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Pre-approved for expedited processing</p>
                    <p className="text-xs text-muted-foreground mt-1">Risk Score: 72 (Low Risk)</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Early Warning System</h4>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Monitored
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Active monitoring for stress signals</p>
                    <p className="text-xs text-muted-foreground mt-1">Last Alert: None (30 days)</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Loan Rewards Program</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Gold Tier
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">6-month payment streak active</p>
                    <p className="text-xs text-muted-foreground mt-1">Rate Reduction: -0.5%</p>
                  </div>

                  <div className="p-4 border rounded-lg opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">First-Time Borrower</h4>
                      <Badge variant="outline">
                        N/A
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Not applicable (existing borrower)</p>
                    <p className="text-xs text-muted-foreground mt-1">Previous loans: 2</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-3">Fairness & Transparency Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">98%</p>
                      <p className="text-xs text-muted-foreground">Transparency Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">15</p>
                      <p className="text-xs text-muted-foreground">Support Interactions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">0</p>
                      <p className="text-xs text-muted-foreground">Complaints Filed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Data Grid */}
              <TabsContent value="interactive" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Interactive Financial Data Grid</h3>
                    <p className="text-sm text-muted-foreground">Click on any cell to edit values. Changes will be highlighted.</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button variant="outline" size="sm" onClick={resetChanges}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset Changes
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" size="sm" onClick={recalculateRiskScore}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Recalculate Risk Score
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <Badge className="text-lg bg-blue-50 text-blue-800 border border-blue-200 px-4 py-1">
                    Current Risk Score: {currentRiskScore}
                  </Badge>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="border p-2 text-left">Month</th>
                        <th className="border p-2 text-left">Income (₹)</th>
                        <th className="border p-2 text-left">Expenses (₹)</th>
                        <th className="border p-2 text-left">Savings (₹)</th>
                        <th className="border p-2 text-left">Electricity Units</th>
                        <th className="border p-2 text-left">Mobile Recharge (₹)</th>
                        <th className="border p-2 text-left">Credit Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          <td className="border p-2">{row.month}</td>
                          
                          {/* Income Cell */}
                          <td className="border p-2" 
                              onClick={() => handleCellClick(rowIndex, 'income')}
                              style={changedCells[`${rowIndex}-income`] ? {backgroundColor: '#DBEAFE'} : {}}
                          >
                            {editingCell?.rowIndex === rowIndex && editingCell?.field === 'income' ? (
                              <Input 
                                autoFocus
                                type="number" 
                                value={row.income} 
                                onChange={handleCellChange}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={handleKeyPress}
                                className="p-0 h-6 w-full border-none text-blue-700"
                              />
                            ) : (
                              `₹${row.income.toLocaleString()}`
                            )}
                          </td>
                          
                          {/* Expenses Cell */}
                          <td className="border p-2" 
                              onClick={() => handleCellClick(rowIndex, 'expenses')}
                              style={changedCells[`${rowIndex}-expenses`] ? {backgroundColor: '#DBEAFE'} : {}}
                          >
                            {editingCell?.rowIndex === rowIndex && editingCell?.field === 'expenses' ? (
                              <Input 
                                autoFocus
                                type="number" 
                                value={row.expenses} 
                                onChange={handleCellChange}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={handleKeyPress}
                                className="p-0 h-6 w-full border-none text-blue-700"
                              />
                            ) : (
                              `₹${row.expenses.toLocaleString()}`
                            )}
                          </td>
                          
                          {/* Savings Cell */}
                          <td className="border p-2" 
                              onClick={() => handleCellClick(rowIndex, 'savings')}
                              style={changedCells[`${rowIndex}-savings`] ? {backgroundColor: '#DBEAFE'} : {}}
                          >
                            {editingCell?.rowIndex === rowIndex && editingCell?.field === 'savings' ? (
                              <Input 
                                autoFocus
                                type="number" 
                                value={row.savings} 
                                onChange={handleCellChange}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={handleKeyPress}
                                className="p-0 h-6 w-full border-none text-blue-700"
                              />
                            ) : (
                              `₹${row.savings.toLocaleString()}`
                            )}
                          </td>
                          
                          {/* Electricity Cell */}
                          <td className="border p-2" 
                              onClick={() => handleCellClick(rowIndex, 'electricity')}
                              style={changedCells[`${rowIndex}-electricity`] ? {backgroundColor: '#DBEAFE'} : {}}
                          >
                            {editingCell?.rowIndex === rowIndex && editingCell?.field === 'electricity' ? (
                              <Input 
                                autoFocus
                                type="number" 
                                value={row.electricity} 
                                onChange={handleCellChange}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={handleKeyPress}
                                className="p-0 h-6 w-full border-none text-blue-700"
                              />
                            ) : (
                              row.electricity
                            )}
                          </td>
                          
                          {/* Mobile Cell */}
                          <td className="border p-2" 
                              onClick={() => handleCellClick(rowIndex, 'mobile')}
                              style={changedCells[`${rowIndex}-mobile`] ? {backgroundColor: '#DBEAFE'} : {}}
                          >
                            {editingCell?.rowIndex === rowIndex && editingCell?.field === 'mobile' ? (
                              <Input 
                                autoFocus
                                type="number" 
                                value={row.mobile} 
                                onChange={handleCellChange}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={handleKeyPress}
                                className="p-0 h-6 w-full border-none text-blue-700"
                              />
                            ) : (
                              `₹${row.mobile}`
                            )}
                          </td>
                          
                          {/* Credit Score Cell */}
                          <td className="border p-2" 
                              onClick={() => handleCellClick(rowIndex, 'creditScore')}
                              style={changedCells[`${rowIndex}-creditScore`] ? {backgroundColor: '#DBEAFE'} : {}}
                          >
                            {editingCell?.rowIndex === rowIndex && editingCell?.field === 'creditScore' ? (
                              <Input 
                                autoFocus
                                type="number" 
                                value={row.creditScore} 
                                onChange={handleCellChange}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={handleKeyPress}
                                className="p-0 h-6 w-full border-none text-blue-700"
                                min="300"
                                max="900"
                              />
                            ) : (
                              row.creditScore
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-semibold">How to use:</h4>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1 mt-2">
                    <li>Click on any cell to edit the value</li>
                    <li>Press Enter or click elsewhere to save changes</li>
                    <li>Changes will be highlighted in blue</li>
                    <li>Click "Recalculate Risk Score" to see how changes impact the risk score</li>
                    <li>Click "Reset Changes" to revert to original data</li>
                  </ul>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
