import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, TrendingUp, BadgeCheck, UserSearch, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Complete interface for all 42 features required by the AI model
interface LoanApplicationData {
  loan_amnt: number;
  term: number;
  int_rate: number;
  installment: number;
  grade: string;
  sub_grade: string;
  emp_length: number;
  home_ownership: string;
  annual_inc: number;
  verification_status: string;
  purpose: string;
  dti: number;
  delinq_2yrs: number;
  inq_last_6mths: number;
  open_acc: number;
  pub_rec: number;
  revol_bal: number;
  revol_util: number;
  total_acc: number;
  application_type: string;
  initial_fico_score: number;
  credit_history_length_years: number;
  is_first_time_borrower_flag: number;
  month_of_loan: number;
  principal_remaining: number;
  interest_paid_this_month: number;
  financial_state: string;
  synthetic_electricity_units: number;
  synthetic_mobile_recharge_amt: number;
  synthetic_utility_payment_ontime: number;
  synthetic_payment_status: number;
  consumption_stability_last_6m: number;
  missed_payments_last_3m: number;
  avg_recharge_amt_last_3m: number;
  consumption_trend_last_6m: number;
  time_in_stress_or_crisis: number;
  months_in_stress_or_crisis_l6m: number;
}

interface PredictionResult {
  prediction_probability: number;
  assessment: string;
  recommendation: string;
  top_factors: Array<{
    feature: string;
    value: string;
    importance: number;
    impact: string;
  }>;
  risk_level: string;
}

const API_BASE_URL = "http://localhost:8001";

export default function InteractiveDataGrid() {
  // Perfect Applicant preset as default
  const [loanData, setLoanData] = useState<LoanApplicationData>({
    loan_amnt: 10000, term: 36, int_rate: 7.5, installment: 311.06, grade: 'A', sub_grade: 'A3',
    emp_length: 10.0, home_ownership: 'MORTGAGE', annual_inc: 120000, verification_status: 'Verified',
    purpose: 'debt_consolidation', dti: 10.0, delinq_2yrs: 0, inq_last_6mths: 0, open_acc: 15, pub_rec: 0,
    revol_bal: 5000, revol_util: 20.0, total_acc: 30, application_type: 'Individual', initial_fico_score: 780,
    credit_history_length_years: 15, is_first_time_borrower_flag: 0, month_of_loan: 12, principal_remaining: 6789.0,
    interest_paid_this_month: 45.0, financial_state: 'Stable', synthetic_electricity_units: 250,
    synthetic_mobile_recharge_amt: 499, synthetic_utility_payment_ontime: 1, synthetic_payment_status: 1,
    consumption_stability_last_6m: 15.0, missed_payments_last_3m: 0, avg_recharge_amt_last_3m: 499,
    consumption_trend_last_6m: 0.5, time_in_stress_or_crisis: 0, months_in_stress_or_crisis_l6m: 0,
  });

  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isLoadingBeneficiary, setIsLoadingBeneficiary] = useState(false);
  const [beneficiaryId, setBeneficiaryId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numValue = parseFloat(value);
    setLoanData(prev => ({ ...prev, [id]: isNaN(numValue) ? 0 : numValue }));
  };

  const handleSelectChange = (id: keyof LoanApplicationData, value: string) => {
    setLoanData(prev => ({ ...prev, [id]: value }));
  };

  const loadBeneficiaryData = async () => {
    if (!beneficiaryId || beneficiaryId.trim() === "") {
      setError("Please enter a valid beneficiary ID");
      return;
    }

    setIsLoadingBeneficiary(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/beneficiary/${beneficiaryId}`);
      if (!response.ok) throw new Error(`Beneficiary not found: ${response.statusText}`);

      const beneficiaryData = await response.json();
      setLoanData(prev => ({ ...prev, ...beneficiaryData }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load beneficiary data");
    } finally {
      setIsLoadingBeneficiary(false);
    }
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    setPredictionResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData),
      });

      if (!response.ok) throw new Error(`Prediction failed: ${response.statusText}`);

      const result = await response.json();
      setPredictionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get prediction");
    } finally {
      setIsPredicting(false);
    }
  };

  const loadPresetCase = (caseType: 'perfect' | 'high-risk' | 'first-time') => {
    const presets: Record<typeof caseType, LoanApplicationData> = {
      perfect: {
        loan_amnt: 10000, term: 36, int_rate: 7.5, installment: 311.06, grade: 'A', sub_grade: 'A3',
        emp_length: 10.0, home_ownership: 'MORTGAGE', annual_inc: 120000, verification_status: 'Verified',
        purpose: 'debt_consolidation', dti: 10.0, delinq_2yrs: 0, inq_last_6mths: 0, open_acc: 15, pub_rec: 0,
        revol_bal: 5000, revol_util: 20.0, total_acc: 30, application_type: 'Individual', initial_fico_score: 780,
        credit_history_length_years: 15, is_first_time_borrower_flag: 0, month_of_loan: 12, principal_remaining: 6789.0,
        interest_paid_this_month: 45.0, financial_state: 'Stable', synthetic_electricity_units: 250,
        synthetic_mobile_recharge_amt: 499, synthetic_utility_payment_ontime: 1, synthetic_payment_status: 1,
        consumption_stability_last_6m: 15.0, missed_payments_last_3m: 0, avg_recharge_amt_last_3m: 499,
        consumption_trend_last_6m: 0.5, time_in_stress_or_crisis: 0, months_in_stress_or_crisis_l6m: 0,
      },
      'high-risk': {
        loan_amnt: 25000, term: 60, int_rate: 22.5, installment: 700.0, grade: 'E', sub_grade: 'E2',
        emp_length: 1.0, home_ownership: 'RENT', annual_inc: 40000, verification_status: 'Not Verified',
        purpose: 'other', dti: 35.0, delinq_2yrs: 3, inq_last_6mths: 4, open_acc: 5, pub_rec: 1,
        revol_bal: 15000, revol_util: 85.0, total_acc: 10, application_type: 'Individual', initial_fico_score: 620,
        credit_history_length_years: 3, is_first_time_borrower_flag: 0, month_of_loan: 24, principal_remaining: 20000.0,
        interest_paid_this_month: 350.0, financial_state: 'Crisis', synthetic_electricity_units: 400,
        synthetic_mobile_recharge_amt: 149, synthetic_utility_payment_ontime: 0, synthetic_payment_status: 0,
        consumption_stability_last_6m: 150.0, missed_payments_last_3m: 2, avg_recharge_amt_last_3m: 149,
        consumption_trend_last_6m: -20.5, time_in_stress_or_crisis: 12, months_in_stress_or_crisis_l6m: 6,
      },
      'first-time': {
        loan_amnt: 5000, term: 36, int_rate: 11.0, installment: 163.71, grade: 'B', sub_grade: 'B4',
        emp_length: 0.5, home_ownership: 'RENT', annual_inc: 30000, verification_status: 'Not Verified',
        purpose: 'credit_card', dti: 15.0, delinq_2yrs: 0, inq_last_6mths: 1, open_acc: 3, pub_rec: 0,
        revol_bal: 1000, revol_util: 50.0, total_acc: 3, application_type: 'Individual', initial_fico_score: 690,
        credit_history_length_years: 1.5, is_first_time_borrower_flag: 1, month_of_loan: 6, principal_remaining: 4200.0,
        interest_paid_this_month: 40.0, financial_state: 'Stable', synthetic_electricity_units: 180,
        synthetic_mobile_recharge_amt: 299, synthetic_utility_payment_ontime: 1, synthetic_payment_status: 1,
        consumption_stability_last_6m: 25.0, missed_payments_last_3m: 0, avg_recharge_amt_last_3m: 299,
        consumption_trend_last_6m: 1.2, time_in_stress_or_crisis: 0, months_in_stress_or_crisis_l6m: 0,
      }
    };
    
    setLoanData(presets[caseType]);
    setPredictionResult(null);
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🤖 AI-Powered Loan Default Risk Predictor</h1>
        <p className="text-gray-500 mt-1">
          Load existing beneficiary data or use preset test cases, then tweak values to see how the AI predicts loan default risk.
        </p>
      </div>

      {/* Load Beneficiary Section */}
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserSearch className="w-5 h-5 mr-2" />
            Load Beneficiary Data
          </CardTitle>
          <CardDescription>
            Enter a beneficiary ID to load their data, or use a preset test case below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="beneficiary_id">Beneficiary ID</Label>
              <Input 
                id="beneficiary_id" 
                type="number" 
                placeholder="Enter ID (e.g., 113194, 113195...)"
                value={beneficiaryId}
                onChange={(e) => setBeneficiaryId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadBeneficiaryData()}
              />
            </div>
            <Button 
              onClick={loadBeneficiaryData} 
              disabled={isLoadingBeneficiary}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoadingBeneficiary ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <UserSearch className="w-4 h-4 mr-2" />
                  Load Data
                </>
              )}
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => loadPresetCase('perfect')} variant="outline" size="sm">
              ✨ Load Perfect Applicant
            </Button>
            <Button onClick={() => loadPresetCase('high-risk')} variant="outline" size="sm">
              ⚠️ Load High-Risk Applicant
            </Button>
            <Button onClick={() => loadPresetCase('first-time')} variant="outline" size="sm">
              🆕 Load First-Time Borrower
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Data Input Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Applicant Data - Tweak to See AI Response</CardTitle>
          <CardDescription>
            Adjust any values below to see how they impact the AI's prediction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="loan" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="loan">💰 Loan Info</TabsTrigger>
              <TabsTrigger value="credit">📊 Credit</TabsTrigger>
              <TabsTrigger value="employment">💼 Employment</TabsTrigger>
              <TabsTrigger value="financial">💸 Financial</TabsTrigger>
              <TabsTrigger value="behavioral">📱 Behavioral</TabsTrigger>
            </TabsList>

            {/* Loan Information Tab */}
            <TabsContent value="loan" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loan_amnt">Loan Amount (₹)</Label>
                  <Input id="loan_amnt" type="number" value={loanData.loan_amnt} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term">Term (Months)</Label>
                  <Select value={String(loanData.term)} onValueChange={(val) => setLoanData(prev => ({...prev, term: parseInt(val)}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="36">36 Months</SelectItem>
                      <SelectItem value="60">60 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="int_rate">Interest Rate (%)</Label>
                  <Input id="int_rate" type="number" step="0.1" value={loanData.int_rate} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installment">Monthly Installment (₹)</Label>
                  <Input id="installment" type="number" step="0.01" value={loanData.installment} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={loanData.grade} onValueChange={(val) => handleSelectChange('grade', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub_grade">Sub Grade</Label>
                  <Input id="sub_grade" value={loanData.sub_grade} onChange={(e) => setLoanData(prev => ({...prev, sub_grade: e.target.value}))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select value={loanData.purpose} onValueChange={(val) => handleSelectChange('purpose', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="home_improvement">Home Improvement</SelectItem>
                      <SelectItem value="major_purchase">Major Purchase</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application_type">Application Type</Label>
                  <Select value={loanData.application_type} onValueChange={(val) => handleSelectChange('application_type', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Joint">Joint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month_of_loan">Month of Loan</Label>
                  <Input id="month_of_loan" type="number" value={loanData.month_of_loan} onChange={handleInputChange} />
                </div>
              </div>
            </TabsContent>

            {/* Credit Information Tab */}
            <TabsContent value="credit" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initial_fico_score">FICO Score</Label>
                  <Input id="initial_fico_score" type="number" value={loanData.initial_fico_score} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credit_history_length_years">Credit History (Years)</Label>
                  <Input id="credit_history_length_years" type="number" step="0.1" value={loanData.credit_history_length_years} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delinq_2yrs">Delinquencies (2 Years)</Label>
                  <Input id="delinq_2yrs" type="number" value={loanData.delinq_2yrs} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inq_last_6mths">Inquiries (Last 6 Months)</Label>
                  <Input id="inq_last_6mths" type="number" value={loanData.inq_last_6mths} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="open_acc">Open Accounts</Label>
                  <Input id="open_acc" type="number" value={loanData.open_acc} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_acc">Total Accounts</Label>
                  <Input id="total_acc" type="number" value={loanData.total_acc} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pub_rec">Public Records</Label>
                  <Input id="pub_rec" type="number" value={loanData.pub_rec} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revol_bal">Revolving Balance (₹)</Label>
                  <Input id="revol_bal" type="number" value={loanData.revol_bal} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revol_util">Revolving Utilization (%)</Label>
                  <Input id="revol_util" type="number" step="0.1" value={loanData.revol_util} onChange={handleInputChange} />
                </div>
              </div>
            </TabsContent>

            {/* Employment & Income Tab */}
            <TabsContent value="employment" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annual_inc">Annual Income (₹)</Label>
                  <Input id="annual_inc" type="number" value={loanData.annual_inc} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emp_length">Employment Length (Years)</Label>
                  <Input id="emp_length" type="number" step="0.1" value={loanData.emp_length} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verification_status">Verification Status</Label>
                  <Select value={loanData.verification_status} onValueChange={(val) => handleSelectChange('verification_status', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Source Verified">Source Verified</SelectItem>
                      <SelectItem value="Not Verified">Not Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home_ownership">Home Ownership</Label>
                  <Select value={loanData.home_ownership} onValueChange={(val) => handleSelectChange('home_ownership', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RENT">Rent</SelectItem>
                      <SelectItem value="MORTGAGE">Mortgage</SelectItem>
                      <SelectItem value="OWN">Own</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Financial Status Tab */}
            <TabsContent value="financial" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dti">Debt-to-Income Ratio (%)</Label>
                  <Input id="dti" type="number" step="0.1" value={loanData.dti} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principal_remaining">Principal Remaining (₹)</Label>
                  <Input id="principal_remaining" type="number" value={loanData.principal_remaining} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest_paid_this_month">Interest Paid This Month (₹)</Label>
                  <Input id="interest_paid_this_month" type="number" step="0.01" value={loanData.interest_paid_this_month} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financial_state">Financial State</Label>
                  <Select value={loanData.financial_state} onValueChange={(val) => handleSelectChange('financial_state', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stable">Stable</SelectItem>
                      <SelectItem value="Stressed">Stressed</SelectItem>
                      <SelectItem value="Crisis">Crisis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_first_time_borrower_flag">First-Time Borrower</Label>
                  <Select value={String(loanData.is_first_time_borrower_flag)} onValueChange={(val) => setLoanData(prev => ({...prev, is_first_time_borrower_flag: parseInt(val)}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_in_stress_or_crisis">Time in Stress/Crisis (Months)</Label>
                  <Input id="time_in_stress_or_crisis" type="number" value={loanData.time_in_stress_or_crisis} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="months_in_stress_or_crisis_l6m">Stress Months (Last 6M)</Label>
                  <Input id="months_in_stress_or_crisis_l6m" type="number" value={loanData.months_in_stress_or_crisis_l6m} onChange={handleInputChange} />
                </div>
              </div>
            </TabsContent>

            {/* Behavioral Data Tab */}
            <TabsContent value="behavioral" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="synthetic_electricity_units">Electricity Units</Label>
                  <Input id="synthetic_electricity_units" type="number" value={loanData.synthetic_electricity_units} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="synthetic_mobile_recharge_amt">Mobile Recharge Amount (₹)</Label>
                  <Input id="synthetic_mobile_recharge_amt" type="number" value={loanData.synthetic_mobile_recharge_amt} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="synthetic_utility_payment_ontime">Utility Payment On-Time</Label>
                  <Select value={String(loanData.synthetic_utility_payment_ontime)} onValueChange={(val) => setLoanData(prev => ({...prev, synthetic_utility_payment_ontime: parseInt(val)}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="synthetic_payment_status">Payment Status</Label>
                  <Select value={String(loanData.synthetic_payment_status)} onValueChange={(val) => setLoanData(prev => ({...prev, synthetic_payment_status: parseInt(val)}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Missed</SelectItem>
                      <SelectItem value="1">On-Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumption_stability_last_6m">Consumption Stability (Last 6M)</Label>
                  <Input id="consumption_stability_last_6m" type="number" step="0.1" value={loanData.consumption_stability_last_6m} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="missed_payments_last_3m">Missed Payments (Last 3M)</Label>
                  <Input id="missed_payments_last_3m" type="number" value={loanData.missed_payments_last_3m} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avg_recharge_amt_last_3m">Avg Recharge (Last 3M)</Label>
                  <Input id="avg_recharge_amt_last_3m" type="number" value={loanData.avg_recharge_amt_last_3m} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumption_trend_last_6m">Consumption Trend (Last 6M)</Label>
                  <Input id="consumption_trend_last_6m" type="number" step="0.1" value={loanData.consumption_trend_last_6m} onChange={handleInputChange} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button onClick={handlePredict} disabled={isPredicting} className="bg-blue-600 hover:bg-blue-700" size="lg">
              {isPredicting ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  AI is Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run AI Prediction
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Prediction Results */}
      {predictionResult && (
        <div className="mt-8">
          <Alert 
            variant={predictionResult.risk_level === 'high' ? 'destructive' : 'default'}
            className={predictionResult.risk_level === 'low' ? 'border-green-500 bg-green-50' : ''}
          >
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-bold flex items-center justify-between">
              <span>🤖 AI Prediction: {predictionResult.prediction_probability.toFixed(2)}% Probability of Default</span>
              <Badge 
                variant={predictionResult.risk_level === 'high' ? 'destructive' : predictionResult.risk_level === 'medium' ? 'default' : 'secondary'}
                className={predictionResult.risk_level === 'low' ? 'bg-green-600 text-white' : ''}
              >
                {predictionResult.assessment}
              </Badge>
            </AlertTitle>
            <AlertDescription>
              <div className="mt-4 space-y-4">
                <div className="flex items-center font-semibold text-lg">
                  <BadgeCheck className="w-5 h-5 mr-2 text-blue-600" />
                  Recommendation: 
                  <span className={`ml-2 font-bold ${
                    predictionResult.recommendation === 'APPROVE' ? 'text-green-600' : 
                    predictionResult.recommendation === 'DENY' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {predictionResult.recommendation}
                  </span>
                </div>

                <Separator />

                {predictionResult.top_factors && predictionResult.top_factors.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-purple-500"/>
                      Top Influencing Factors
                    </h4>
                    <div className="space-y-2">
                      {predictionResult.top_factors.map((factor, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex-1">
                            <span className="font-medium">{factor.feature.replace(/_/g, ' ').toUpperCase()}</span>
                            <span className="text-gray-600 ml-2">= {factor.value}</span>
                          </div>
                          <Badge variant={
                            factor.impact === 'HIGH' ? 'destructive' : 
                            factor.impact === 'MEDIUM' ? 'default' : 
                            'secondary'
                          }>
                            {factor.impact} Impact
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
