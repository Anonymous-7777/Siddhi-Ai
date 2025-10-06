import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Target,
  Shield
} from "lucide-react";

interface EarlyWarningAlert {
  id: string;
  borrowerId: string;
  borrowerName: string;
  loanAmount: number;
  currentBalance: number;
  riskScore: number;
  warningLevel: 'low' | 'medium' | 'high' | 'critical';
  triggerFactors: string[];
  predictedDefaultDate: string;
  interventionSuggested: string;
  lastContact: string;
  status: 'new' | 'contacted' | 'intervention' | 'resolved';
  daysOverdue?: number;
}

interface InterventionAction {
  id: string;
  type: 'call' | 'email' | 'sms' | 'meeting';
  title: string;
  description: string;
  recommended: boolean;
}

const EarlyWarningSystem = () => {
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "dashboard");

  // Update tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      if (tabParam === 'critical' || tabParam === 'review') {
        setActiveTab("dashboard");
      } else {
        setActiveTab(tabParam);
      }
    }
  }, [searchParams]);

  const interventionActions: InterventionAction[] = [
    {
      id: "1",
      type: "call",
      title: "Supportive Check-in Call",
      description: "Friendly call to understand current situation and offer assistance",
      recommended: true
    },
    {
      id: "2", 
      type: "email",
      title: "Financial Resources Email",
      description: "Send curated list of financial assistance programs and budgeting tools",
      recommended: true
    },
    {
      id: "3",
      type: "meeting",
      title: "Financial Counseling Session",
      description: "Schedule one-on-one session with financial counselor",
      recommended: false
    },
    {
      id: "4",
      type: "sms",
      title: "Payment Reminder SMS",
      description: "Gentle reminder about upcoming payment with support options",
      recommended: true
    }
  ];

  // Mock data
  useEffect(() => {
    const mockAlerts: EarlyWarningAlert[] = [
      {
        id: "EW001",
        borrowerId: "100005941",
        borrowerName: "Sarah Johnson",
        loanAmount: 15000,
        currentBalance: 12500,
        riskScore: 85,
        warningLevel: 'high',
        triggerFactors: ["Income decreased 25%", "Missed last payment", "Increased credit utilization"],
        predictedDefaultDate: "2024-12-15",
        interventionSuggested: "Financial counseling + payment plan restructure",
        lastContact: "2024-11-20",
        status: 'new'
      },
      {
        id: "EW002",
        borrowerId: "100005942",
        borrowerName: "Michael Chen",
        loanAmount: 8000,
        currentBalance: 6200,
        riskScore: 72,
        warningLevel: 'medium',
        triggerFactors: ["Late payment pattern emerging", "Reduced account activity"],
        predictedDefaultDate: "2024-12-28",
        interventionSuggested: "Proactive check-in call",
        lastContact: "2024-11-15",
        status: 'contacted'
      },
      {
        id: "EW003",
        borrowerId: "100005943",
        borrowerName: "Emily Rodriguez",
        loanAmount: 22000,
        currentBalance: 18500,
        riskScore: 91,
        warningLevel: 'critical',
        triggerFactors: ["Job loss reported", "Multiple inquiries to other lenders", "Savings depleted"],
        predictedDefaultDate: "2024-11-30",
        interventionSuggested: "Immediate intervention + temporary payment suspension",
        lastContact: "2024-11-25",
        status: 'intervention',
        daysOverdue: 5
      },
      {
        id: "EW004", 
        borrowerId: "100005944",
        borrowerName: "David Thompson",
        loanAmount: 12000,
        currentBalance: 9800,
        riskScore: 68,
        warningLevel: 'low',
        triggerFactors: ["Minor payment delay", "Seasonal income fluctuation"],
        predictedDefaultDate: "2025-01-15",
        interventionSuggested: "Monitor closely, send financial tips",
        lastContact: "2024-11-10",
        status: 'new'
      }
    ];

    setTimeout(() => {
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  const getWarningBadge = (level: string) => {
    const getVariant = (level: string) => {
      switch (level) {
        case 'low': return 'secondary';
        case 'medium': return 'default';
        case 'high': return 'destructive';
        case 'critical': return 'destructive';
        default: return 'default';
      }
    };

    const colors = {
      'low': '',
      'medium': 'bg-yellow-600',
      'high': 'bg-orange-600', 
      'critical': 'bg-red-600'
    };

    return (
      <Badge 
        variant={getVariant(level)} 
        className={colors[level as keyof typeof colors]}
      >
        {level.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const getVariant = (status: string) => {
      switch (status) {
        case 'new': return 'secondary';
        case 'contacted': return 'default';
        case 'intervention': return 'outline';
        case 'resolved': return 'default';
        default: return 'default';
      }
    };

    const colors = {
      'resolved': 'bg-green-600'
    };

    return (
      <Badge 
        variant={getVariant(status)}
        className={status === 'resolved' ? colors[status as keyof typeof colors] : ''}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const markAsContacted = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'contacted', lastContact: new Date().toISOString().split('T')[0] }
          : alert
      )
    );
  };

  const startIntervention = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'intervention' }
          : alert
      )
    );
  };

  const markAsResolved = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' }
          : alert
      )
    );
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const criticalAlerts = alerts.filter(a => a.warningLevel === 'critical');
  const highRiskAlerts = alerts.filter(a => a.warningLevel === 'high');
  const totalAtRisk = alerts.filter(a => ['high', 'critical'].includes(a.warningLevel)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proactive Default Intervention</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered early warning system to predict and prevent defaults before they happen
          </p>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{criticalAlerts.length} critical alert(s)</strong> require immediate attention. 
            Predicted defaults within 7 days.
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Borrowers</p>
                <p className="text-2xl font-bold">{totalAtRisk}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interventions Active</p>
                <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'intervention').length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At-Risk Amount</p>
                <p className="text-2xl font-bold">
                  ${alerts.filter(a => ['high', 'critical'].includes(a.warningLevel))
                    .reduce((sum, a) => sum + a.currentBalance, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Active Alerts
          </TabsTrigger>
          <TabsTrigger value="interventions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Interventions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Resolved
          </TabsTrigger>
        </TabsList>

        {/* Active Alerts Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Early Warning Alerts</CardTitle>
              <CardDescription>
                Borrowers identified as at-risk for potential default based on AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Loan Details</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Key Risk Factors</TableHead>
                    <TableHead>Predicted Default</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.filter(a => a.status !== 'resolved').map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{alert.borrowerName}</p>
                          <p className="text-sm text-muted-foreground">{alert.borrowerId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Amount: ${alert.loanAmount.toLocaleString()}</p>
                          <p>Balance: ${alert.currentBalance.toLocaleString()}</p>
                          {alert.daysOverdue && (
                            <p className="text-red-600">{alert.daysOverdue} days overdue</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getWarningBadge(alert.warningLevel)}
                          <p className="text-xs text-muted-foreground">Score: {alert.riskScore}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-48">
                        <div className="text-sm space-y-1">
                          {alert.triggerFactors.slice(0, 2).map((factor, index) => (
                            <div key={index} className="text-red-600">• {factor}</div>
                          ))}
                          {alert.triggerFactors.length > 2 && (
                            <div className="text-muted-foreground">
                              +{alert.triggerFactors.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{alert.predictedDefaultDate}</p>
                          <p className="text-muted-foreground">
                            {Math.ceil((new Date(alert.predictedDefaultDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(alert.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {alert.status === 'new' && (
                            <Button 
                              size="sm" 
                              onClick={() => markAsContacted(alert.id)}
                              variant="outline"
                            >
                              Contact
                            </Button>
                          )}
                          {alert.status === 'contacted' && (
                            <Button 
                              size="sm" 
                              onClick={() => startIntervention(alert.id)}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Intervene
                            </Button>
                          )}
                          {alert.status === 'intervention' && (
                            <Button 
                              size="sm" 
                              onClick={() => markAsResolved(alert.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Resolve
                            </Button>
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

        {/* Interventions Tab */}
        <TabsContent value="interventions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Intervention Toolkit</CardTitle>
                <CardDescription>
                  Proven intervention strategies to help borrowers before default
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interventionActions.map((action) => (
                    <Card key={action.id} className="p-4">
                      <div className="flex items-start gap-3">
                        {getActionIcon(action.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium">{action.title}</h5>
                            {action.recommended && (
                              <Badge variant="outline" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Interventions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Interventions</CardTitle>
                <CardDescription>
                  Borrowers currently receiving intervention support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.filter(a => a.status === 'intervention').map((alert) => (
                    <Card key={alert.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium">{alert.borrowerName}</h5>
                          <p className="text-sm text-muted-foreground">{alert.borrowerId}</p>
                        </div>
                        {getWarningBadge(alert.warningLevel)}
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Suggested Intervention:</p>
                        <p className="text-sm text-muted-foreground">{alert.interventionSuggested}</p>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Last Contact: {alert.lastContact}</span>
                        <Button 
                          size="sm" 
                          onClick={() => markAsResolved(alert.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Accuracy</CardTitle>
                <CardDescription>AI model performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Early Detection Rate</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>False Positive Rate</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Intervention Success</span>
                      <span>73%</span>
                    </div>
                    <Progress value={73} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Current portfolio risk breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical Risk</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{criticalAlerts.length}</Badge>
                      <span className="text-sm text-muted-foreground">
                        ({((criticalAlerts.length / alerts.length) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Risk</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{highRiskAlerts.length}</Badge>
                      <span className="text-sm text-muted-foreground">
                        ({((highRiskAlerts.length / alerts.length) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Monitored</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{alerts.length}</Badge>
                      <span className="text-sm text-muted-foreground">borrowers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resolved Tab */}
        <TabsContent value="resolved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Successfully Resolved Cases</CardTitle>
              <CardDescription>
                Borrowers who received intervention and successfully avoided default
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Original Risk Level</TableHead>
                    <TableHead>Intervention Type</TableHead>
                    <TableHead>Resolution Date</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.filter(a => a.status === 'resolved').map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{alert.borrowerName}</p>
                          <p className="text-sm text-muted-foreground">{alert.borrowerId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getWarningBadge(alert.warningLevel)}
                      </TableCell>
                      <TableCell className="text-sm">{alert.interventionSuggested}</TableCell>
                      <TableCell>{alert.lastContact}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Default Prevented</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


    </div>
  );
};

export default EarlyWarningSystem;