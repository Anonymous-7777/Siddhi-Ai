import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Award, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star,
  Crown,
  Gift,
  Percent,
  Calendar,
  CheckCircle,
  Lightbulb
} from "lucide-react";

interface RewardsBorrower {
  id: string;
  borrowerName: string;
  loanAmount: number;
  currentBalance: number;
  monthsOnTime: number;
  totalPayments: number;
  currentTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  rewardsEarned: number;
  nextRewardProgress: number;
  eligibleRewards: string[];
  paymentStreak: number;
  interestReduction: number;
  status: 'active' | 'pending_reward' | 'rewarded';
}

interface RewardTier {
  name: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirementMonths: number;
  benefits: string[];
  interestReduction: number;
  color: string;
}

interface RewardAction {
  id: string;
  type: 'interest_reduction' | 'cashback' | 'fee_waiver' | 'credit_increase';
  title: string;
  description: string;
  value: string;
  eligibilityMonths: number;
}

const LoanRewards = () => {
  const [borrowers, setBorrowers] = useState<RewardsBorrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const rewardTiers: RewardTier[] = [
    {
      name: "Bronze",
      level: 'bronze',
      requirementMonths: 3,
      benefits: ["Payment tracking", "Financial tips"],
      interestReduction: 0,
      color: "text-amber-600"
    },
    {
      name: "Silver", 
      level: 'silver',
      requirementMonths: 6,
      benefits: ["0.25% rate reduction", "Priority support", "Fee waivers"],
      interestReduction: 0.25,
      color: "text-gray-500"
    },
    {
      name: "Gold",
      level: 'gold', 
      requirementMonths: 12,
      benefits: ["0.5% rate reduction", "Bonus cashback", "Fast-track applications"],
      interestReduction: 0.5,
      color: "text-yellow-500"
    },
    {
      name: "Platinum",
      level: 'platinum',
      requirementMonths: 24,
      benefits: ["1% rate reduction", "Exclusive products", "Personal advisor"],
      interestReduction: 1.0,
      color: "text-purple-500"
    }
  ];

  const rewardActions: RewardAction[] = [
    {
      id: "1",
      type: "interest_reduction",
      title: "Interest Rate Reduction",
      description: "Permanent reduction in loan interest rate",
      value: "0.25% - 1%",
      eligibilityMonths: 6
    },
    {
      id: "2",
      type: "cashback", 
      title: "Payment Cashback",
      description: "Cash reward for consistent payments",
      value: "$50 - $200",
      eligibilityMonths: 12
    },
    {
      id: "3",
      type: "fee_waiver",
      title: "Fee Waiver",
      description: "Waive processing fees on next loan",
      value: "100%",
      eligibilityMonths: 3
    },
    {
      id: "4",
      type: "credit_increase",
      title: "Credit Limit Increase",
      description: "Higher borrowing limit for future loans",
      value: "25% - 50%",
      eligibilityMonths: 18
    }
  ];

  // Mock data
  useEffect(() => {
    const mockBorrowers: RewardsBorrower[] = [
      {
        id: "100005941",
        borrowerName: "Sarah Johnson",
        loanAmount: 15000,
        currentBalance: 8500,
        monthsOnTime: 18,
        totalPayments: 18,
        currentTier: 'gold',
        rewardsEarned: 3,
        nextRewardProgress: 75,
        eligibleRewards: ["Cashback Reward", "Fee Waiver"],
        paymentStreak: 18,
        interestReduction: 0.5,
        status: 'pending_reward'
      },
      {
        id: "100005942",
        borrowerName: "Michael Chen",
        loanAmount: 8000,
        currentBalance: 3200,
        monthsOnTime: 8,
        totalPayments: 8,
        currentTier: 'silver',
        rewardsEarned: 1,
        nextRewardProgress: 40,
        eligibleRewards: ["Fee Waiver"],
        paymentStreak: 8,
        interestReduction: 0.25,
        status: 'active'
      },
      {
        id: "100005943",
        borrowerName: "Emily Rodriguez",
        loanAmount: 22000,
        currentBalance: 15400,
        monthsOnTime: 36,
        totalPayments: 36,
        currentTier: 'platinum',
        rewardsEarned: 8,
        nextRewardProgress: 100,
        eligibleRewards: ["All Rewards Available"],
        paymentStreak: 36,
        interestReduction: 1.0,
        status: 'rewarded'
      },
      {
        id: "100005944",
        borrowerName: "David Thompson",
        loanAmount: 12000,
        currentBalance: 9800,
        monthsOnTime: 4,
        totalPayments: 4,
        currentTier: 'bronze',
        rewardsEarned: 0,
        nextRewardProgress: 20,
        eligibleRewards: ["On track for Silver tier"],
        paymentStreak: 4,
        interestReduction: 0,
        status: 'active'
      }
    ];

    setTimeout(() => {
      setBorrowers(mockBorrowers);
      setLoading(false);
    }, 1000);
  }, []);

  const getTierBadge = (tier: string) => {
    const tierConfig = rewardTiers.find(t => t.level === tier);
    if (!tierConfig) return <Badge variant="outline">Unknown</Badge>;

    return (
      <Badge variant="outline" className={tierConfig.color}>
        <Crown className="w-3 h-3 mr-1" />
        {tierConfig.name}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const getVariant = (status: string) => {
      switch (status) {
        case 'active': return 'default';
        case 'pending_reward': return 'secondary';
        case 'rewarded': return 'default';
        default: return 'outline';
      }
    };

    const colors = {
      'pending_reward': 'bg-orange-600',
      'rewarded': 'bg-green-600'
    };

    return (
      <Badge 
        variant={getVariant(status)}
        className={colors[status as keyof typeof colors] || ''}
      >
        {status === 'pending_reward' ? 'Reward Pending' : 
         status === 'rewarded' ? 'Recently Rewarded' : 'Active'}
      </Badge>
    );
  };

  const applyReward = (borrowerId: string) => {
    setBorrowers(prev => 
      prev.map(borrower => 
        borrower.id === borrowerId 
          ? { 
              ...borrower, 
              status: 'rewarded', 
              rewardsEarned: borrower.rewardsEarned + 1,
              nextRewardProgress: 0
            }
          : borrower
      )
    );
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'interest_reduction': return <Percent className="w-4 h-4" />;
      case 'cashback': return <DollarSign className="w-4 h-4" />;
      case 'fee_waiver': return <Gift className="w-4 h-4" />;
      case 'credit_increase': return <TrendingUp className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const eligibleForRewards = borrowers.filter(b => b.status === 'pending_reward');
  const totalRewardsEarned = borrowers.reduce((sum, b) => sum + b.rewardsEarned, 0);
  const avgPaymentStreak = borrowers.reduce((sum, b) => sum + b.paymentStreak, 0) / borrowers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dynamic Loan Terms & Rewards</h1>
          <p className="text-muted-foreground mt-2">
            Automatic rewards for responsible borrowers - creating incentives for financial discipline
          </p>
        </div>
      </div>

      {/* Pending Rewards Alert */}
      {eligibleForRewards.length > 0 && (
        <Alert>
          <Gift className="h-4 w-4" />
          <AlertDescription>
            <strong>{eligibleForRewards.length} borrower(s)</strong> are eligible for rewards based on their 
            consistent payment history. Review and apply rewards to encourage continued good behavior.
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Participants</p>
                <p className="text-2xl font-bold">{borrowers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rewards Earned</p>
                <p className="text-2xl font-bold">{totalRewardsEarned}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Payment Streak</p>
                <p className="text-2xl font-bold">{Math.round(avgPaymentStreak)}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Rewards</p>
                <p className="text-2xl font-bold">{eligibleForRewards.length}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tiers">Reward Tiers</TabsTrigger>
          <TabsTrigger value="actions">Reward Actions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {selectedTier ? 
                    `${rewardTiers.find(t => t.level === selectedTier)?.name} Tier Borrowers` : 
                    'Borrower Rewards Status'}
                </CardTitle>
                <CardDescription>
                  {selectedTier ? 
                    `Showing ${borrowers.filter(b => b.currentTier === selectedTier).length} borrowers in this tier` : 
                    'Track borrower progress and apply rewards for consistent payment behavior'}
                </CardDescription>
              </div>
              {selectedTier && (
                <Button variant="outline" size="sm" onClick={() => setSelectedTier(null)}>
                  Clear Filter
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Loan Details</TableHead>
                    <TableHead>Payment Streak</TableHead>
                    <TableHead>Tier Status</TableHead>
                    <TableHead>Interest Reduction</TableHead>
                    <TableHead>Next Reward Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(selectedTier ? 
                    borrowers.filter(b => b.currentTier === selectedTier) : 
                    borrowers).map((borrower) => (
                    <TableRow key={borrower.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{borrower.borrowerName}</p>
                          <p className="text-sm text-muted-foreground">{borrower.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>Amount: ${borrower.loanAmount.toLocaleString()}</p>
                          <p>Balance: ${borrower.currentBalance.toLocaleString()}</p>
                          <p>Payments: {borrower.totalPayments}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{borrower.paymentStreak}</p>
                          <p className="text-xs text-muted-foreground">months on time</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTierBadge(borrower.currentTier)}
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">-{borrower.interestReduction}%</p>
                          <p className="text-xs text-muted-foreground">rate reduction</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress value={borrower.nextRewardProgress} className="h-2" />
                          <p className="text-xs text-center text-muted-foreground">
                            {borrower.nextRewardProgress}% to next reward
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(borrower.status)}
                      </TableCell>
                      <TableCell>
                        {borrower.status === 'pending_reward' ? (
                          <Button 
                            size="sm"
                            onClick={() => applyReward(borrower.id)}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Apply Reward
                          </Button>
                        ) : borrower.status === 'rewarded' ? (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Rewarded
                          </Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reward Tiers Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewardTiers.map((tier) => (
              <Card 
                key={tier.level} 
                className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedTier === tier.level ? 'ring-2 ring-primary' : ''}`}
                onClick={() => {
                  setSelectedTier(tier.level);
                  setActiveTab("overview");
                }}
              >
                <CardHeader className="pb-2">
                  <CardTitle className={`flex items-center gap-2 ${tier.color}`}>
                    <Crown className="w-5 h-5" />
                    {tier.name}
                  </CardTitle>
                  <CardDescription>
                    {tier.requirementMonths} months of on-time payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="text-2xl font-bold text-green-600">
                        -{tier.interestReduction}%
                      </p>
                      <p className="text-xs text-muted-foreground">Interest Reduction</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold mb-2">Benefits:</p>
                      <ul className="text-xs space-y-1">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        {borrowers.filter(b => b.currentTier === tier.level).length} active members
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>


        </TabsContent>

        {/* Reward Actions Tab */}
        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewardActions.map((action) => (
              <Card key={action.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getRewardIcon(action.type)}
                    {action.title}
                  </CardTitle>
                  <CardDescription>
                    Eligible after {action.eligibilityMonths} months of on-time payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span className="text-sm font-medium">Reward Value</span>
                      <span className="text-lg font-bold text-green-600">{action.value}</span>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium mb-2">Currently Eligible:</p>
                      <div className="flex flex-wrap gap-1">
                        {borrowers.filter(b => b.monthsOnTime >= action.eligibilityMonths).map((borrower) => (
                          <Badge key={borrower.id} variant="outline" className="text-xs">
                            {borrower.borrowerName}
                          </Badge>
                        ))}
                        {borrowers.filter(b => b.monthsOnTime >= action.eligibilityMonths).length === 0 && (
                          <span className="text-muted-foreground">None currently eligible</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tier Distribution</CardTitle>
                <CardDescription>Current borrower distribution across reward tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewardTiers.map((tier) => {
                    const count = borrowers.filter(b => b.currentTier === tier.level).length;
                    const percentage = (count / borrowers.length) * 100;
                    
                    return (
                      <div key={tier.level} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${tier.color}`}>{tier.name}</span>
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

            <Card>
              <CardHeader>
                <CardTitle>Reward Impact</CardTitle>
                <CardDescription>Measuring the effectiveness of the rewards program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>On-Time Payment Rate</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Borrower Retention</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Early Repayment Rate</span>
                      <span>31%</span>
                    </div>
                    <Progress value={31} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Satisfaction</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-2">Program ROI</h4>
                  <p className="text-2xl font-bold text-green-600">+23%</p>
                  <p className="text-xs text-muted-foreground">
                    Increased profitability through reduced defaults and improved retention
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>


    </div>
  );
};

export default LoanRewards;