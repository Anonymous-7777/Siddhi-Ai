import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, TrendingUp, TrendingDown, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define the type for the loan data
interface LoanData {
  loan_amnt: number;
  term: number;
  annual_inc: number;
  dti: number;
  initial_fico_score: number;
  emp_length: number;
  home_ownership: 'RENT' | 'MORTGAGE' | 'OWN' | 'ANY';
  purpose: string;
}

// Define the type for the prediction result
interface PredictionResult {
  prediction: 'Default' | 'No Default';
  confidence: number;
  riskScore: number;
  keyFactors: {
    positive: string[];
    negative: string[];
  };
  recommendation: 'Approve' | 'Manual Review' | 'Deny';
}

export default function InteractiveDataGrid() {
  const [loanData, setLoanData] = useState<LoanData>({
    loan_amnt: 7500,
    term: 36,
    annual_inc: 48000,
    dti: 25.23,
    initial_fico_score: 712,
    emp_length: 3,
    home_ownership: 'RENT',
    purpose: 'debt_consolidation',
  });

  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoanData(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (id: keyof LoanData, value: string) => {
    setLoanData(prev => ({ ...prev, [id]: value }));
  };

  // This is where you would call your AI model
  const handlePredict = () => {
    setIsPredicting(true);
    setPredictionResult(null);

    // Simulate an API call to the AI model
    setTimeout(() => {
      // Mock prediction logic - replace with your actual AI call
      const positiveFactors: string[] = [];
      const negativeFactors: string[] = [];

      let score = 500; // Base score

      // Credit Score impact
      if (loanData.initial_fico_score > 720) {
        score += 150;
        positiveFactors.push("Excellent credit score");
      } else if (loanData.initial_fico_score > 680) {
        score += 80;
      } else {
        score -= 100;
        negativeFactors.push("Low credit score");
      }

      // DTI impact
      if (loanData.dti < 15) {
        score += 100;
        positiveFactors.push("Low Debt-to-Income ratio");
      } else if (loanData.dti > 35) {
        score -= 120;
        negativeFactors.push("High Debt-to-Income ratio");
      }

      // Income impact
      if (loanData.annual_inc > 75000) {
        score += 90;
        positiveFactors.push("High annual income");
      }

      // Employment length impact
      if (loanData.emp_length > 5) {
        score += 60;
        positiveFactors.push("Stable employment history");
      } else if (loanData.emp_length < 1) {
        score -= 50;
        negativeFactors.push("Short employment history");
      }
      
      const finalScore = Math.max(300, Math.min(850, score));
      const isDefault = finalScore < 640;
      const confidence = isDefault ? 1 - (finalScore / 1600) : finalScore / 1000;

      let recommendation: PredictionResult['recommendation'] = 'Manual Review';
      if (finalScore > 700) recommendation = 'Approve';
      if (finalScore < 620) recommendation = 'Deny';

      setPredictionResult({
        prediction: isDefault ? 'Default' : 'No Default',
        confidence: parseFloat(confidence.toFixed(2)),
        riskScore: finalScore,
        keyFactors: {
          positive: positiveFactors,
          negative: negativeFactors,
        },
        recommendation,
      });

      setIsPredicting(false);
    }, 1500);
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Loan Default Risk Predictor</h1>
        <p className="text-gray-500 mt-1">
          Enter the applicant's information below to predict the loan default risk.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Applicant Data</CardTitle>
          <CardDescription>
            Adjust the values to see how they impact the prediction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Loan Amount */}
            <div className="space-y-2">
              <Label htmlFor="loan_amnt">Loan Amount (₹)</Label>
              <Input id="loan_amnt" type="number" value={loanData.loan_amnt} onChange={handleInputChange} />
            </div>

            {/* Term */}
            <div className="space-y-2">
              <Label htmlFor="term">Term (Months)</Label>
              <Input id="term" type="number" value={loanData.term} onChange={handleInputChange} />
            </div>

            {/* Annual Income */}
            <div className="space-y-2">
              <Label htmlFor="annual_inc">Annual Income (₹)</Label>
              <Input id="annual_inc" type="number" value={loanData.annual_inc} onChange={handleInputChange} />
            </div>

            {/* Debt-to-Income Ratio */}
            <div className="space-y-2">
              <Label htmlFor="dti">Debt-to-Income (DTI)</Label>
              <Input id="dti" type="number" value={loanData.dti} onChange={handleInputChange} />
            </div>

            {/* Initial Credit Score */}
            <div className="space-y-2">
              <Label htmlFor="initial_fico_score">Initial Credit Score</Label>
              <Input id="initial_fico_score" type="number" value={loanData.initial_fico_score} onChange={handleInputChange} />
            </div>

            {/* Employment Length */}
            <div className="space-y-2">
              <Label htmlFor="emp_length">Employment Length (Years)</Label>
              <Input id="emp_length" type="number" value={loanData.emp_length} onChange={handleInputChange} />
            </div>

            {/* Home Ownership */}
            <div className="space-y-2">
              <Label htmlFor="home_ownership">Home Ownership</Label>
              <Select value={loanData.home_ownership} onValueChange={(value) => handleSelectChange('home_ownership', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="RENT">Rent</SelectItem>
                  <SelectItem value="MORTGAGE">Mortgage</SelectItem>
                  <SelectItem value="OWN">Own</SelectItem>
                  <SelectItem value="ANY">Any</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Loan</Label>
              <Select value={loanData.purpose} onValueChange={(value) => handleSelectChange('purpose', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="home_improvement">Home Improvement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handlePredict} disabled={isPredicting} className="bg-blue-600 hover:bg-blue-700">
              {isPredicting ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Predict Default Risk
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {predictionResult && (
        <div className="mt-8">
          <Alert variant={predictionResult.prediction === 'Default' ? 'destructive' : 'default'}>
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-bold flex items-center justify-between">
              <span>Prediction: {predictionResult.prediction} (Confidence: {predictionResult.confidence * 100}%)</span>
              <Badge variant="secondary">Risk Score: {predictionResult.riskScore}</Badge>
            </AlertTitle>
            <AlertDescription>
              <div className="mt-4">
                <div className="flex items-center font-semibold">
                   <BadgeCheck className="w-5 h-5 mr-2 text-green-600" />
                   Recommendation: <span className="ml-2 font-bold">{predictionResult.recommendation}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-green-500"/>Positive Factors</h4>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      {predictionResult.keyFactors.positive.length > 0 ? (
                        predictionResult.keyFactors.positive.map((factor, i) => <li key={i}>{factor}</li>)
                      ) : (
                        <li>No significant positive factors.</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center"><TrendingDown className="w-5 h-5 mr-2 text-red-500"/>Negative Factors</h4>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      {predictionResult.keyFactors.negative.length > 0 ? (
                        predictionResult.keyFactors.negative.map((factor, i) => <li key={i}>{factor}</li>)
                      ) : (
                        <li>No significant negative factors.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}