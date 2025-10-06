import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  UserPlus, 
  FileText, 
  DollarSign, 
  Calculator,
  CheckCircle,
  AlertTriangle,
  Clock,
  Handshake,
  Shield,
  TrendingUp,
  Target
} from "lucide-react";

interface JointApplication {
  id: string;
  primaryApplicant: {
    name: string;
    id: string;
    income: number;
    creditScore: number;
    employmentYears: number;
    individualRiskScore: number;
  };
  coApplicant: {
    name: string;
    id: string;
    income: number;
    creditScore: number;
    employmentYears: number;
    individualRiskScore: number;
  };
  loanDetails: {
    requestedAmount: number;
    purpose: string;
    term: number;
  };
  jointScore: number;
  combinedIncome: number;
  responsibility: 'joint_and_several' | 'proportional' | 'primary_secondary';
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  submissionDate: string;
  legalFramework: string;
}

interface ResponsibilityOption {
  type: 'joint_and_several' | 'proportional' | 'primary_secondary';
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  benefits: string[];
  considerations: string[];
}

const JointApplication = () => {
  const [applications, setApplications] = useState<JointApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applications");

  const responsibilityOptions: ResponsibilityOption[] = [
    {
      type: 'joint_and_several',
      title: 'Joint & Several Liability',
      description: 'Both parties are fully responsible for the entire loan amount',
      riskLevel: 'low',
      benefits: ['Lowest risk for lender', 'Better loan terms', 'Faster approval'],
      considerations: ['Each party liable for full amount', 'Higher personal risk']
    },
    {
      type: 'proportional',
      title: 'Proportional Responsibility',
      description: 'Each party responsible based on income contribution',
      riskLevel: 'medium',
      benefits: ['Risk matches income', 'Fair distribution', 'Clear boundaries'],
      considerations: ['More complex legal structure', 'Moderate terms']
    },
    {
      type: 'primary_secondary',
      title: 'Primary-Secondary Structure',
      description: 'One primary borrower with co-signer guaranteeing',
      riskLevel: 'medium',
      benefits: ['Clear primary responsibility', 'Backup guarantee', 'Flexible structure'],
      considerations: ['Unequal responsibility', 'Secondary party risk']
    }
  ];

  // Mock data
  useEffect(() => {
    const mockApplications: JointApplication[] = [
      {
        id: 'JA001',
        primaryApplicant: {
          name: 'Sarah Johnson',
          id: '100005941',
          income: 85000,
          creditScore: 750,
          employmentYears: 5,
          individualRiskScore: 72
        },
        coApplicant: {
          name: 'Michael Johnson', 
          id: '100005945',
          income: 67000,
          creditScore: 720,
          employmentYears: 3,
          individualRiskScore: 68
        },
        loanDetails: {
          requestedAmount: 45000,
          purpose: 'Home Improvement',
          term: 60
        },
        jointScore: 78,
        combinedIncome: 152000,
        responsibility: 'joint_and_several',
        status: 'approved',
        submissionDate: '2024-11-15',
        legalFramework: 'Joint & Several Liability Agreement'
      },
      {
        id: 'JA002',
        primaryApplicant: {
          name: 'David Chen',
          id: '100005942',
          income: 72000,
          creditScore: 680,
          employmentYears: 7,
          individualRiskScore: 65
        },
        coApplicant: {
          name: 'Lisa Chen',
          id: '100005946',
          income: 58000,
          creditScore: 710,
          employmentYears: 4,
          individualRiskScore: 70
        },
        loanDetails: {
          requestedAmount: 35000,
          purpose: 'Business Investment',
          term: 48
        },
        jointScore: 73,
        combinedIncome: 130000,
        responsibility: 'proportional',
        status: 'under_review',
        submissionDate: '2024-11-20',
        legalFramework: 'Proportional Liability Agreement'
      },
      {
        id: 'JA003',
        primaryApplicant: {
          name: 'Emily Rodriguez',
          id: '100005943',
          income: 95000,
          creditScore: 780,
          employmentYears: 8,
          individualRiskScore: 75
        },
        coApplicant: {
          name: 'Carlos Rodriguez',
          id: '100005947',
          income: 45000,
          creditScore: 650,
          employmentYears: 2,
          individualRiskScore: 58
        },
        loanDetails: {
          requestedAmount: 50000,
          purpose: 'Debt Consolidation',
          term: 72
        },
        jointScore: 69,
        combinedIncome: 140000,
        responsibility: 'primary_secondary',
        status: 'submitted',
        submissionDate: '2024-11-25',
        legalFramework: 'Primary-Secondary Guarantee Agreement'
      }
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const getVariant = (status: string) => {
      switch (status) {
        case 'submitted': return 'secondary';
        case 'under_review': return 'default';
        case 'approved': return 'default';
        case 'rejected': return 'destructive';
        default: return 'outline';
      }
    };

    const colors = {
      'under_review': 'bg-blue-600',
      'approved': 'bg-green-600'
    };

    return (
      <Badge 
        variant={getVariant(status)}
        className={colors[status as keyof typeof colors] || ''}
      >
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  const getRiskBadge = (level: string) => {
    const getVariant = (level: string) => {
      switch (level) {
        case 'low': return 'default';
        case 'medium': return 'secondary';
        case 'high': return 'destructive';
        default: return 'outline';
      }
    };

    const colors = {
      'low': 'bg-green-600',
      'medium': 'bg-yellow-600'
    };

    return (
      <Badge 
        variant={getVariant(level)}
        className={colors[level as keyof typeof colors] || ''}
      >
        {level.toUpperCase()} RISK
      </Badge>
    );
  };

  const getScoreBadge = (score: number) => {
    if (score >= 75) return <Badge variant="default" className="bg-green-600">{score}</Badge>;
    if (score >= 65) return <Badge variant="secondary">{score}</Badge>;
    return <Badge variant="destructive">{score}</Badge>;
  };

  const approveApplication = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'approved' }
          : app
      )
    );
  };

  const rejectApplication = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'rejected' }
          : app
      )
    );
  };

  const calculateJointBenefit = (app: JointApplication) => {
    const avgIndividualScore = (app.primaryApplicant.individualRiskScore + app.coApplicant.individualRiskScore) / 2;
    return app.jointScore - avgIndividualScore;
  };

  const pendingApplications = applications.filter(app => ['submitted', 'under_review'].includes(app.status));
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const totalLoanAmount = applications.reduce((sum, app) => sum + app.loanDetails.requestedAmount, 0);
  const avgJointScore = applications.reduce((sum, app) => sum + app.jointScore, 0) / applications.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Joint Application Module</h1>
          <p className="text-muted-foreground mt-2">
            Fair and legal solution for co-borrower applications with transparent responsibility frameworks
          </p>
        </div>
      </div>

      {/* Pending Applications Alert */}
      {pendingApplications.length > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>{pendingApplications.length} joint application(s)</strong> are awaiting review. 
            Combined loan value: ${pendingApplications.reduce((sum, app) => sum + app.loanDetails.requestedAmount, 0).toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{pendingApplications.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{approvedApplications.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Joint Score</p>
                <p className="text-2xl font-bold">{Math.round(avgJointScore)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="framework">Legal Framework</TabsTrigger>
          <TabsTrigger value="calculator">Joint Score Calculator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Joint Applications</CardTitle>
              <CardDescription>
                Co-borrower applications with combined risk assessment and legal responsibility framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application ID</TableHead>
                    <TableHead>Applicants</TableHead>
                    <TableHead>Loan Details</TableHead>
                    <TableHead>Individual Scores</TableHead>
                    <TableHead>Joint Score</TableHead>
                    <TableHead>Responsibility Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-mono text-sm">{application.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">{application.primaryApplicant.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            <span className="text-sm text-muted-foreground">{application.coApplicant.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Combined: ${application.combinedIncome.toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">${application.loanDetails.requestedAmount.toLocaleString()}</p>
                          <p className="text-muted-foreground">{application.loanDetails.purpose}</p>
                          <p className="text-xs text-muted-foreground">{application.loanDetails.term} months</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Primary:</span>
                            {getScoreBadge(application.primaryApplicant.individualRiskScore)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">Co-App:</span>
                            {getScoreBadge(application.coApplicant.individualRiskScore)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          {getScoreBadge(application.jointScore)}
                          <div className="text-xs text-muted-foreground mt-1">
                            {calculateJointBenefit(application) > 0 ? '+' : ''}{calculateJointBenefit(application).toFixed(1)} benefit
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">
                            {application.responsibility.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' & ')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(application.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {application.status === 'submitted' || application.status === 'under_review' ? (
                            <>
                              <Button 
                                size="sm"
                                onClick={() => approveApplication(application.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => rejectApplication(application.id)}
                              >
                                Reject
                              </Button>
                            </>
                          ) : application.status === 'approved' ? (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600">
                              Declined
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Framework Tab */}
        <TabsContent value="framework" className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {responsibilityOptions.map((option) => (
              <Card key={option.type}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {option.title}
                    {getRiskBadge(option.riskLevel)}
                  </CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-semibold text-green-600 mb-2">Benefits:</h5>
                      <ul className="text-xs space-y-1">
                        {option.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-orange-600 mb-2">Considerations:</h5>
                      <ul className="text-xs space-y-1">
                        {option.considerations.map((consideration, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                            {consideration}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        {applications.filter(app => app.responsibility === option.type).length} active applications
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Joint Score Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Joint Score Methodology
              </CardTitle>
              <CardDescription>
                How we calculate combined risk scores for co-borrower applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Calculation Formula</h4>
                  <div className="space-y-4 text-sm">
                    <div className="p-4 bg-muted rounded">
                      <p className="font-mono text-center">
                        Joint Score = (Primary Score × 0.6) + (Co-Applicant Score × 0.4) + Synergy Bonus
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Weighting Factors:</h5>
                      <ul className="space-y-1">
                        <li>• Primary Applicant: 60% weight</li>
                        <li>• Co-Applicant: 40% weight</li>
                        <li>• Combined Income Bonus: +2-8 points</li>
                        <li>• Employment Stability: +1-3 points</li>
                        <li>• Credit Score Harmony: +1-4 points</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Synergy Factors</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <h5 className="font-medium text-sm">Income Diversification</h5>
                      <p className="text-xs text-muted-foreground">
                        Multiple income sources reduce overall risk
                      </p>
                      <Progress value={75} className="h-2 mt-2" />
                    </div>
                    
                    <div className="p-3 border rounded">
                      <h5 className="font-medium text-sm">Complementary Strengths</h5>
                      <p className="text-xs text-muted-foreground">
                        One strong credit score can offset the other's weaknesses
                      </p>
                      <Progress value={60} className="h-2 mt-2" />
                    </div>
                    
                    <div className="p-3 border rounded">
                      <h5 className="font-medium text-sm">Relationship Stability</h5>
                      <p className="text-xs text-muted-foreground">
                        Married couples and long-term partners show better performance
                      </p>
                      <Progress value={85} className="h-2 mt-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Calculations</CardTitle>
              <CardDescription>Real examples from current applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.slice(0, 2).map((app) => (
                  <div key={app.id} className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">Application {app.id}</h5>
                      <Badge variant="outline">{app.primaryApplicant.name} + {app.coApplicant.name}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Primary Score</p>
                        <p className="font-bold">{app.primaryApplicant.individualRiskScore} × 0.6 = {(app.primaryApplicant.individualRiskScore * 0.6).toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Co-App Score</p>
                        <p className="font-bold">{app.coApplicant.individualRiskScore} × 0.4 = {(app.coApplicant.individualRiskScore * 0.4).toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Synergy Bonus</p>
                        <p className="font-bold text-green-600">+{(app.jointScore - (app.primaryApplicant.individualRiskScore * 0.6 + app.coApplicant.individualRiskScore * 0.4)).toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Final Joint Score</p>
                        <p className="text-lg font-bold text-blue-600">{app.jointScore}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Performance</CardTitle>
                <CardDescription>Joint application vs individual application metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Approval Rate (Joint)</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Approval Rate (Individual)</span>
                      <span>74%</span>
                    </div>
                    <Progress value={74} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Default Rate (Joint)</span>
                      <span>3.2%</span>
                    </div>
                    <Progress value={3.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Score Improvement</span>
                      <span>+12.4 points</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsibility Distribution</CardTitle>
                <CardDescription>How applicants choose legal frameworks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responsibilityOptions.map((option) => {
                    const count = applications.filter(app => app.responsibility === option.type).length;
                    const percentage = (count / applications.length) * 100;
                    
                    return (
                      <div key={option.type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{option.title}</span>
                          <div className="text-right">
                            <span className="text-sm font-bold">{count}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>


    </div>
  );
};

export default JointApplication;