import { useState, useEffect } from "react";
import { TrendingUp, Users, Shield, DollarSign, AlertTriangle, Clock, CheckCircle, ChevronRight, Database, Activity } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { QueueCard } from "@/components/dashboard/QueueCard";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getStatistics } from "@/data/mockBeneficiaries";
import { dummyUsers, userRiskScores } from "@/data/dummyLoanData";
import { useToast } from "@/components/ui/use-toast";
import { apiService, KpiSummary } from "@/lib/apiService";

const portfolioData = [
  { month: "Jan", score: 6.2 },
  { month: "Feb", score: 6.5 },
  { month: "Mar", score: 6.8 },
  { month: "Apr", score: 7.2 },
  { month: "May", score: 7.5 },
  { month: "Jun", score: 7.8 },
];

const riskBandData = [
  { name: "Low Risk", value: 425, color: "hsl(var(--chart-4))" },
  { name: "Medium Risk", value: 312, color: "hsl(var(--chart-2))" },
  { name: "High Risk", value: 163, color: "hsl(var(--chart-3))" },
];

export default function Dashboard() {
  const { toast } = useToast();
  const stats = getStatistics();
  const [processedLoans, setProcessedLoans] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [kpiData, setKpiData] = useState<KpiSummary | null>(null);
  const [portfolioTrends, setPortfolioTrends] = useState<any>(null);
  const [riskAnalytics, setRiskAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check API health first
        const health = await apiService.getHealth();
        setApiConnected(health.database_connected);
        
        // Fetch all dashboard data in parallel
        const [kpis, trends, risks] = await Promise.all([
          apiService.getKpiSummary(),
          apiService.getPortfolioTrends(),
          apiService.getRiskAnalytics()
        ]);
        
        console.log('Dashboard Data received:', { kpis, trends, risks });
        setKpiData(kpis);
        setPortfolioTrends(trends);
        setRiskAnalytics(risks);
        
        toast({
          title: "Dashboard Updated",
          description: `Connected to database with ${health.total_records.toLocaleString()} records`,
        });
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setApiConnected(false);
        toast({
          title: "Connection Error",
          description: "Unable to connect to backend API. Using mock data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);
  
  // Dynamic risk data based on API response or fallback to mock data
  const riskData = apiConnected && riskAnalytics && riskAnalytics.credit_risk_analysis ? 
    riskAnalytics.credit_risk_analysis.map((item: any) => ({
      name: item.credit_range.replace(/\(\d+.*\)/, '').trim(), // Clean up the display name
      value: item.loan_count,
      color: item.credit_range.includes('Poor') ? "hsl(var(--chart-3))" :
             item.credit_range.includes('Fair') ? "hsl(var(--chart-2))" :
             item.credit_range.includes('Good') ? "hsl(var(--chart-4))" :
             item.credit_range.includes('Very Good') ? "hsl(var(--chart-1))" :
             "hsl(var(--chart-5))"
    })) :
    [
      { name: "Low Risk", value: stats.riskDistribution.low, color: "hsl(var(--chart-4))" },
      { name: "Medium Risk", value: stats.riskDistribution.medium, color: "hsl(var(--chart-2))" },
      { name: "High Risk", value: stats.riskDistribution.high, color: "hsl(var(--chart-3))" },
    ];

  // Dynamic portfolio health data
  const portfolioHealthData = apiConnected && portfolioTrends && portfolioTrends.portfolio_health ? 
    portfolioTrends.portfolio_health : 
    portfolioData;

  const handleApprove = (userId: string) => {
    setProcessedLoans(prev => ({
      ...prev,
      [userId]: 'approved'
    }));
    toast({
      title: "Loan Approved",
      description: `Beneficiary ${userId}'s loan has been approved successfully.`
    });
  };

  const handleReject = (userId: string) => {
    setProcessedLoans(prev => ({
      ...prev,
      [userId]: 'rejected'
    }));
    toast({
      title: "Loan Rejected",
      description: `Beneficiary ${userId}'s loan application has been rejected.`,
      variant: "destructive"
    });
  };


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-semibold">Siddhi Credit Scoring - Main Dashboard</h1>
            <Badge variant={apiConnected ? "default" : "destructive"} className="text-xs">
              {apiConnected ? (
                <>
                  <Database className="w-3 h-3 mr-1" />
                  Live Data
                </>
              ) : (
                <>
                  <Activity className="w-3 h-3 mr-1" />
                  Mock Data
                </>
              )}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {apiConnected 
              ? "Real-time data from SQLite database with 1.2M+ loan records" 
              : "Comprehensive overview of all lending operations and fairness initiatives"
            }
          </p>
        </div>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link to="/interactive-data">
            <TrendingUp className="mr-2 h-4 w-4" />
            Interactive Data Analysis
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={TrendingUp}
          title="Average Credit Score"
          value={loading ? "..." : kpiData?.overview?.avg_credit_score ? kpiData.overview.avg_credit_score.toFixed(0) : stats.avgScore.toFixed(1)}
          change={apiConnected ? "Real-time data" : "Mock data"}
          trend="up"
        />
        <KPICard
          icon={Users}
          title="Total Beneficiaries"
          value={loading ? "..." : kpiData?.overview?.total_beneficiaries ? kpiData.overview.total_beneficiaries.toLocaleString() : stats.totalBeneficiaries.toString()}
          change={apiConnected ? `${loading ? "..." : kpiData?.overview.total_beneficiaries.toLocaleString()} records` : "+12 this month"}
          trend="up"
        />
        <KPICard
          icon={Shield}
          title="Default Rate"
          value={loading ? "..." : kpiData?.overview?.default_rate_percent !== undefined ? `${kpiData.overview.default_rate_percent.toFixed(1)}%` : "7.8%"}
          change={apiConnected ? "Portfolio risk" : "+0.3 improvement"}
          trend={kpiData?.overview?.default_rate_percent !== undefined ? (kpiData.overview.default_rate_percent < 10 ? "up" : "down") : "up"}
        />
        <KPICard
          icon={DollarSign}
          title="Total Loan Volume"
          value={loading ? "..." : kpiData?.overview?.total_loan_amount ? `₹${(kpiData.overview.total_loan_amount / 10000000).toFixed(1)}Cr` : `₹${(stats.totalLoanVolume / 100000).toFixed(1)}L`}
          change={apiConnected ? "Live database" : "+8.2% this quarter"}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Portfolio Health Trend
              <Badge variant={apiConnected ? "default" : "secondary"} className="text-xs">
                {apiConnected ? "Live" : "Mock"}
              </Badge>
            </CardTitle>
            {apiConnected && portfolioTrends && (
              <CardDescription>
                Current Health Score: {portfolioTrends.current_metrics.health_score}/10.0
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-muted-foreground">Loading portfolio trends...</div>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={portfolioHealthData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toFixed(1) : value,
                    name === 'score' ? 'Health Score' : name
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--chart-1))" 
                  fill="url(#colorScore)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Risk Band Distribution
              <Badge variant={apiConnected ? "default" : "secondary"} className="text-xs">
                {apiConnected ? "Live" : "Mock"}
              </Badge>
            </CardTitle>
            {apiConnected && riskAnalytics && (
              <CardDescription>
                Based on Credit Score Ranges
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-muted-foreground">Loading risk distribution...</div>
              </div>
            ) : (
            <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: any, name: any, props: any) => {
                    const total = riskData.reduce((sum, item) => sum + item.value, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return [`${value} (${percentage}%)`, name];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {riskData.map((item) => {
                const total = riskData.reduce((sum, riskItem) => sum + riskItem.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                return (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value.toLocaleString()} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
            </>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">High-Priority Queues</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/early-warning">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QueueCard
            icon={AlertTriangle}
            title="Early Warning Alerts"
            count={stats.earlyWarnings}
            description="Beneficiaries showing signs of financial stress"
            path="/early-warning"
          />
          <QueueCard
            icon={Clock}
            title="Critical Alerts"
            count={stats.criticalAlerts}
            description="High-risk beneficiaries in crisis state"
            path="/early-warning?tab=critical"
          />
          <QueueCard
            icon={CheckCircle}
            title="Review Required"
            count={stats.reviewRequired}
            description="Medium risk with unstable consumption"
            path="/early-warning?tab=review"
          />
        </div>
      </div>

      {/* High Priority Loan Approvals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>High Priority Loan Approvals</CardTitle>
            <CardDescription>Applications awaiting final approval</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/direct-lending?tab=all_applications">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dummyUsers.slice(0, 4).map((user) => (
              <div key={user.id + "-" + Math.random()} className="flex items-center justify-between border-b pb-3">
                <div>
                  <div className="font-medium">Beneficiary {user.id}</div>
                  <div className="text-sm text-muted-foreground">₹{user.loan_amnt.toLocaleString()} | {user.purpose.replace('_', ' ')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={userRiskScores[user.id].score > 70 ? "success" : "destructive"}>
                    {userRiskScores[user.id].band}
                  </Badge>
                  {processedLoans[user.id] === 'approved' ? (
                    <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">
                      Approved
                    </Badge>
                  ) : processedLoans[user.id] === 'rejected' ? (
                    <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                      Rejected
                    </Badge>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(user.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(user.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/beneficiary/${user.id}`}>
                      Review
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Module Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lending Modules Overview</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/direct-lending" className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-sm mb-2">Direct Lending</h4>
              <p className="text-xs text-muted-foreground mb-2">Pre-approved low-risk candidates</p>
              <p className="text-lg font-bold text-green-600">24 Ready</p>
            </Link>
            <Link to="/first-time-borrower" className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-sm mb-2">First-Time Borrowers</h4>
              <p className="text-xs text-muted-foreground mb-2">Incubator program pipeline</p>
              <p className="text-lg font-bold text-blue-600">18 Active</p>
            </Link>
            <Link to="/joint-application" className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-sm mb-2">Joint Applications</h4>
              <p className="text-xs text-muted-foreground mb-2">Co-borrower processing</p>
              <p className="text-lg font-bold text-purple-600">7 Pending</p>
            </Link>
            <Link to="/loan-rewards" className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-sm mb-2">Loan Rewards</h4>
              <p className="text-xs text-muted-foreground mb-2">Active reward programs</p>
              <p className="text-lg font-bold text-orange-600">156 Enrolled</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
