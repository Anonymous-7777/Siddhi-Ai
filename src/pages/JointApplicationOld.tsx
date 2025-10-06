import { useState } from 'react';
import { Users2, Plus, Calculator, FileText, CheckCircle2, AlertCircle, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Applicant {
  id: string;
  name: string;
  age: number;
  individualScore: number;
  monthlyIncome: number;
  creditHistory: string;
  location: string;
  businessType: string;
  relationship?: string;
}

interface JointApplication {
  id: string;
  primaryApplicant: Applicant;
  secondaryApplicant: Applicant;
  requestedAmount: number;
  jointScore: number;
  combinedIncome: number;
  sharedLiability: number;
  recommendedAmount: number;
  status: 'pending' | 'approved' | 'reviewing';
  applicationDate: string;
}

const mockApplicants: Applicant[] = [
  {
    id: '1',
    name: 'Rohit Sharma',
    age: 32,
    individualScore: 68,
    monthlyIncome: 18000,
    creditHistory: 'Limited',
    location: 'Mumbai, MH',
    businessType: 'Street Vendor'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    age: 28,
    individualScore: 72,
    monthlyIncome: 15000,
    creditHistory: 'Good',
    location: 'Mumbai, MH',
    businessType: 'Tailoring'
  }
];

const mockJointApplications: JointApplication[] = [
  {
    id: '1',
    primaryApplicant: {
      id: '1',
      name: 'Amit Kumar',
      age: 35,
      individualScore: 65,
      monthlyIncome: 20000,
      creditHistory: 'Fair',
      location: 'Delhi, DL',
      businessType: 'Auto Repair',
      relationship: 'Brother'
    },
    secondaryApplicant: {
      id: '2',
      name: 'Vikash Kumar',
      age: 30,
      individualScore: 70,
      monthlyIncome: 16000,
      creditHistory: 'Good',
      location: 'Delhi, DL',
      businessType: 'Electronics Shop',
      relationship: 'Brother'
    },
    requestedAmount: 50000,
    jointScore: 78,
    combinedIncome: 36000,
    sharedLiability: 50,
    recommendedAmount: 45000,
    status: 'pending',
    applicationDate: '2024-10-01'
  }
];

export default function JointApplication() {
  const [selectedPrimary, setSelectedPrimary] = useState<Applicant | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<Applicant | null>(null);
  const [requestedAmount, setRequestedAmount] = useState<string>('');
  const [jointApplications, setJointApplications] = useState(mockJointApplications);
  const { toast } = useToast();

  const calculateJointScore = (primary: Applicant, secondary: Applicant) => {
    const avgScore = (primary.individualScore + secondary.individualScore) / 2;
    const incomeBonus = Math.min(10, (primary.monthlyIncome + secondary.monthlyIncome) / 5000);
    return Math.round(avgScore + incomeBonus);
  };

  const handleCreateJointApplication = () => {
    if (!selectedPrimary || !selectedSecondary || !requestedAmount) {
      toast({
        title: "Incomplete Application",
        description: "Please select both applicants and enter loan amount.",
        variant: "destructive"
      });
      return;
    }

    const jointScore = calculateJointScore(selectedPrimary, selectedSecondary);
    const newApplication: JointApplication = {
      id: Date.now().toString(),
      primaryApplicant: selectedPrimary,
      secondaryApplicant: selectedSecondary,
      requestedAmount: parseInt(requestedAmount),
      jointScore,
      combinedIncome: selectedPrimary.monthlyIncome + selectedSecondary.monthlyIncome,
      sharedLiability: 50,
      recommendedAmount: Math.round(parseInt(requestedAmount) * 0.9),
      status: 'pending',
      applicationDate: new Date().toISOString().split('T')[0]
    };

    setJointApplications([...jointApplications, newApplication]);
    setSelectedPrimary(null);
    setSelectedSecondary(null);
    setRequestedAmount('');

    toast({
      title: "Joint Application Created",
      description: `Application created with joint score: ${jointScore}`,
    });
  };

  const handleApproveApplication = (applicationId: string) => {
    setJointApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'approved' as const }
          : app
      )
    );
    
    toast({
      title: "Joint Application Approved",
      description: "Both applicants are now jointly responsible for the loan.",
    });
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 75) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">🤝 Joint Application Module</h1>
          <p className="text-muted-foreground">
            Co-borrower loans with shared responsibility • Family & Partnership lending
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Joint Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jointApplications.length}</div>
            <p className="text-xs text-muted-foreground">Total applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jointApplications.filter(app => app.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Joint Score</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(jointApplications.reduce((sum, app) => sum + app.jointScore, 0) / jointApplications.length) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Combined scoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loan Value</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{jointApplications.reduce((sum, app) => sum + app.recommendedAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Joint lending value</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Application</TabsTrigger>
          <TabsTrigger value="pending">Pending ({jointApplications.filter(app => app.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({jointApplications.filter(app => app.status === 'approved').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Joint Loan Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Primary Applicant</Label>
                <div className="grid gap-3 mt-2">
                  {mockApplicants.map((applicant) => (
                    <Card 
                      key={applicant.id}
                      className={`cursor-pointer transition-colors ${
                        selectedPrimary?.id === applicant.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPrimary(applicant)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{applicant.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {applicant.location} • {applicant.businessType}
                            </p>
                            <p className="text-sm">₹{applicant.monthlyIncome.toLocaleString()}/month</p>
                          </div>
                          <Badge className={getScoreBadgeColor(applicant.individualScore)}>
                            Score: {applicant.individualScore}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Secondary Applicant (Co-borrower)</Label>
                <div className="grid gap-3 mt-2">
                  {mockApplicants.filter(a => a.id !== selectedPrimary?.id).map((applicant) => (
                    <Card 
                      key={applicant.id}
                      className={`cursor-pointer transition-colors ${
                        selectedSecondary?.id === applicant.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSecondary(applicant)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{applicant.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {applicant.location} • {applicant.businessType}
                            </p>
                            <p className="text-sm">₹{applicant.monthlyIncome.toLocaleString()}/month</p>
                          </div>
                          <Badge className={getScoreBadgeColor(applicant.individualScore)}>
                            Score: {applicant.individualScore}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedPrimary && selectedSecondary && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center mb-4">
                      <Link className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold">Joint Score Calculation</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Combined Monthly Income</p>
                        <p className="text-lg font-bold">₹{(selectedPrimary.monthlyIncome + selectedSecondary.monthlyIncome).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Calculated Joint Score</p>
                        <p className="text-lg font-bold text-blue-600">
                          {calculateJointScore(selectedPrimary, selectedSecondary)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="loanAmount">Requested Loan Amount (₹)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="Enter loan amount"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleCreateJointApplication}
                disabled={!selectedPrimary || !selectedSecondary || !requestedAmount}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Joint Application
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {jointApplications.filter(app => app.status === 'pending').map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Users2 className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {application.primaryApplicant.name} + {application.secondaryApplicant.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Applied: {new Date(application.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getScoreBadgeColor(application.jointScore)}>
                      Joint Score: {application.jointScore}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Requested Amount</p>
                      <p className="text-lg font-semibold text-primary">₹{application.requestedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Recommended Amount</p>
                      <p className="text-lg font-semibold text-green-600">₹{application.recommendedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Combined Income</p>
                      <p className="text-lg">₹{application.combinedIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Shared Liability</p>
                      <p className="text-lg font-semibold text-blue-600">{application.sharedLiability}% each</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      <p>Primary: {application.primaryApplicant.businessType} (Score: {application.primaryApplicant.individualScore})</p>
                      <p>Secondary: {application.secondaryApplicant.businessType} (Score: {application.secondaryApplicant.individualScore})</p>
                    </div>
                    <Button 
                      onClick={() => handleApproveApplication(application.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve Joint Loan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="grid gap-4">
            {jointApplications.filter(app => app.status === 'approved').map((application) => (
              <Card key={application.id} className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {application.primaryApplicant.name} + {application.secondaryApplicant.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Joint loan approved - Both parties legally responsible
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Approved
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Approved Amount</p>
                      <p className="text-lg font-semibold text-green-600">₹{application.recommendedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Joint Score</p>
                      <p className="text-lg font-semibold text-blue-600">{application.jointScore}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Liability Split</p>
                      <p className="text-lg">{application.sharedLiability}% / {application.sharedLiability}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {jointApplications.filter(app => app.status === 'approved').length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No joint applications approved yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}