import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  TrendingUp, 
  Award, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Target,
  Lightbulb,
  Search,
  Download,
  ArrowUpDown,
  RefreshCw,
  GraduationCap,
  Briefcase,
  BarChart4,
  Users,
  ScrollText,
  Filter
} from "lucide-react";

interface FirstTimeBorrower {
  id: string;
  name: string;
  age: number;
  income: number;
  potentialScore: number;
  microLoanAmount: number;
  riskFactors: string[];
  strengths: string[];
  recommendedProgram: string;
  status: 'assessment' | 'micro' | 'graduated';
}



const FirstTimeBorrower = () => {
  const { toast } = useToast();
  const [borrowers, setBorrowers] = useState<FirstTimeBorrower[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assessment");
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState<FirstTimeBorrower | null>(null);
  const [showMicroHistory, setShowMicroHistory] = useState(false);
  const [showNewParticipantDialog, setShowNewParticipantDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showLoanOptionsDialog, setShowLoanOptionsDialog] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    age: '',
    income: '',
    employer: '',
    education: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    aadhaar: '',
    bankAccount: '',
    references: ''
  });



  // Mock data
  useEffect(() => {
    const mockBorrowers: FirstTimeBorrower[] = [
      {
        id: "FTB001",
        name: "Arjun Sharma",
        age: 22,
        income: 35000,
        potentialScore: 68,
        microLoanAmount: 50000,
        riskFactors: ["Limited credit history", "Young age"],
        strengths: ["Stable employment", "Good income"],
        recommendedProgram: "Standard Track",
        status: 'assessment'
      },
      {
        id: "FTB002",
        name: "Priya Patel",
        age: 26,
        income: 45000,
        potentialScore: 72,
        microLoanAmount: 75000,
        riskFactors: ["No previous loans"],
        strengths: ["High income", "College educated", "Savings account"],
        recommendedProgram: "Fast Track",
        status: 'micro'
      },
      {
        id: "FTB003",
        name: "Rohit Kumar",
        age: 19,
        income: 25000,
        potentialScore: 58,
        microLoanAmount: 30000,
        riskFactors: ["Very young", "Low income", "Part-time employment"],
        strengths: ["Strong income stability"],
        recommendedProgram: "Extended Support Track",
        status: 'assessment'
      },
      {
        id: "FTB004",
        name: "Sneha Reddy",
        age: 25,
        income: 55000,
        potentialScore: 78,
        microLoanAmount: 100000,
        riskFactors: ["Recent job change"],
        strengths: ["High income", "Technical skills", "Strong references"],
        recommendedProgram: "Fast Track",
        status: 'graduated'
      }
    ];

    setTimeout(() => {
      setBorrowers(mockBorrowers);
      setLoading(false);
    }, 1000);
  }, []);

  const approveForMicro = (borrowerId: string) => {
    setBorrowers(prev => 
      prev.map(borrower => 
        borrower.id === borrowerId 
          ? { ...borrower, status: 'micro' }
          : borrower
      )
    );
  };

  const graduateBorrower = (borrowerId: string) => {
    setBorrowers(prev => 
      prev.map(borrower => 
        borrower.id === borrowerId 
          ? { ...borrower, status: 'graduated' }
          : borrower
      )
    );
  };

  const addNewParticipant = () => {
    if (!newParticipant.firstName || !newParticipant.lastName || !newParticipant.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newBorrower: FirstTimeBorrower = {
      id: `FTB${String(borrowers.length + 1).padStart(3, '0')}`,
      name: `${newParticipant.firstName} ${newParticipant.lastName}`,
      age: 25, // Default age
      income: 40000, // Default income in rupees
      potentialScore: Math.floor(Math.random() * 40) + 50, // Random score 50-90
      microLoanAmount: 60000, // Default micro amount in rupees
      riskFactors: ["New applicant", "No credit history"],
      strengths: ["Referred applicant"],
      recommendedProgram: "Standard Track",
      status: 'assessment'
    };
    
    setBorrowers(prev => [...prev, newBorrower]);
    setNewParticipant({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
      age: '',
      income: '',
      employer: '',
      education: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      aadhaar: '',
      bankAccount: '',
      references: ''
    });
    setShowNewParticipantDialog(false);
    
    toast({
      title: "Participant Added",
      description: `${newBorrower.name} has been added to the assessment program.`,
    });
  };

  const handleAddNewParticipant = addNewParticipant;

  const handleViewDetails = (borrower: FirstTimeBorrower) => {
    setSelectedBorrower(borrower);
    setShowDetailsDialog(true);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'assessment': return 'secondary';
      case 'trial': return 'outline';
      case 'graduated': return 'default';
      default: return 'default';
    }
  };

  const handleViewProfile = (borrower: FirstTimeBorrower) => {
    setSelectedBorrower(borrower);
    setShowProfileDialog(true);
  };

  const handleLoanOptions = (borrower: FirstTimeBorrower) => {
    setSelectedBorrower(borrower);
    setShowLoanOptionsDialog(true);
  };

  // Helper function to format Indian currency
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const viewDetails = (borrower: FirstTimeBorrower) => {
    setSelectedBorrower(borrower);
    setShowDetailsModal(true);
  };

  const viewMicroHistory = () => {
    setShowMicroHistory(true);
  };

  const getStatusBadge = (status: string) => {
    const getVariant = (status: string) => {
      switch (status) {
        case 'assessment': return 'secondary';

        case 'trial': return 'outline';
        case 'graduated': return 'default';
        default: return 'default';
      }
    };
    
    const colors = {
      'assessment': 'bg-yellow-600',
      'trial': 'bg-purple-600',
      'graduated': 'bg-green-600'
    };

    return (
      <Badge 
        variant={getVariant(status)} 
        className={status === 'graduated' ? colors[status as keyof typeof colors] : ''}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPotentialScoreBadge = (score: number) => {
    if (score >= 70) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');
  
  const filterBorrowers = (borrowers: FirstTimeBorrower[]) => {
    return borrowers.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const sortBorrowers = (borrowers: FirstTimeBorrower[]) => {
    return [...borrowers].sort((a, b) => {
      switch (sortCriteria) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.potentialScore - a.potentialScore;
        case 'age':
          return a.age - b.age;
        case 'income':
          return b.income - a.income;
        default:
          return 0;
      }
    });
  };

  const filteredBorrowers = sortBorrowers(filterBorrowers(borrowers));
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 bg-blue-50 p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">First-Time Borrower Incubator</h1>
          <p className="text-blue-700 mt-2 max-w-2xl">
            Transform applicants with no credit history into qualified borrowers through structured education and progressive lending
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 flex gap-2 items-center"
          onClick={() => setShowNewParticipantDialog(true)}
        >
          <Users className="h-4 w-4" />
          <span>Add New Participant</span>
        </Button>
      </div>

      {/* Program Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Participants</p>
                <p className="text-2xl font-bold">{borrowers.length}</p>
                <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">In Trial Phase</p>
                <p className="text-2xl font-bold">{borrowers.filter(b => b.status === 'micro').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Active loans</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Graduated</p>
                <p className="text-2xl font-bold">{borrowers.filter(b => b.status === 'graduated').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Successfully completed</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Success Rate</p>
                <p className="text-2xl font-bold">
                  {borrowers.length > 0 ? 
                    Math.round((borrowers.filter(b => b.status === 'graduated').length / borrowers.length) * 100) 
                    : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">+5% from last quarter</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <BarChart4 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2 pb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
          <Input
            type="search"
            placeholder="Search participants by name or ID..."
            className="pl-8 border-blue-200 focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Select value={sortCriteria} onValueChange={setSortCriteria}>
            <SelectTrigger className="w-[180px] border-blue-200">
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4 text-blue-500" />
                <span>Sort By</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="score">Potential Score</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => setLoading(true)}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger 
            value="assessment" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Assessment
          </TabsTrigger>
          <TabsTrigger 
            value="trial" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Micro Loans
          </TabsTrigger>
          <TabsTrigger 
            value="graduated" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Assessment Tab */}
        <TabsContent value="assessment" className="space-y-6 pt-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="mt-4 text-blue-700">Loading assessment data...</p>
              </div>
            </div>
          ) : (
            <>

              <Card className="shadow-sm border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-blue-900">Potential Score Assessment</CardTitle>
                      <CardDescription>
                        Applicants being evaluated for the First-Time Borrower program
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {filteredBorrowers.filter(b => b.status === 'assessment').length} Applicants
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredBorrowers.filter(b => b.status === 'assessment').length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <ScrollText className="h-10 w-10 text-blue-300 mb-4" />
                      <p className="text-muted-foreground text-center">
                        No applicants currently in assessment phase.
                      </p>
                      <Button variant="link" className="mt-2 text-blue-600">
                        View all participants
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-blue-50">
                        <TableRow>
                          <TableHead className="text-blue-700">Applicant ID</TableHead>
                          <TableHead className="text-blue-700">Name</TableHead>
                          <TableHead className="text-blue-700">Age</TableHead>
                          <TableHead className="text-blue-700">Income</TableHead>
                          <TableHead className="text-blue-700">Potential Score</TableHead>
                          <TableHead className="text-blue-700">Risk Factors</TableHead>
                          <TableHead className="text-blue-700">Program Track</TableHead>
                          <TableHead className="text-blue-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBorrowers.filter(b => b.status === 'assessment').map((borrower) => (
                          <TableRow key={borrower.id} className="hover:bg-blue-50/50">
                            <TableCell className="font-mono text-sm text-blue-800">{borrower.id}</TableCell>
                            <TableCell className="font-medium">{borrower.name}</TableCell>
                            <TableCell>{borrower.age}</TableCell>
                            <TableCell>₹{borrower.income.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant={getPotentialScoreBadge(borrower.potentialScore)} className={
                                  borrower.potentialScore >= 70 ? "bg-green-100 text-green-800 hover:bg-green-200" :
                                  borrower.potentialScore >= 60 ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                                  "bg-red-100 text-red-800 hover:bg-red-200"
                                }>
                                  {borrower.potentialScore}
                                </Badge>
                                <div className="w-20 h-2 bg-gray-100 rounded-full">
                                  <div 
                                    className={`h-full rounded-full ${
                                      borrower.potentialScore >= 70 ? "bg-green-500" :
                                      borrower.potentialScore >= 60 ? "bg-yellow-500" :
                                      "bg-red-500"
                                    }`}
                                    style={{ width: `${borrower.potentialScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                {borrower.riskFactors.map((factor, index) => (
                                  <Badge key={index} variant="outline" className="mr-1 mb-1 text-red-600 border-red-200">
                                    {factor}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-blue-200 text-blue-700">
                                {borrower.recommendedProgram}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button 
                                  size="sm"
                                  onClick={() => approveForMicro(borrower.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-xs"
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs"
                                  onClick={() => handleViewDetails(borrower)}
                                >
                                  Details
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t px-6 py-3">
                  <div className="flex justify-between w-full text-sm text-muted-foreground">
                    <p>Updated 2 hours ago</p>
                    <p className="flex items-center">
                      <Filter className="h-3 w-3 mr-1" />
                      Showing all applicants
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Trial Loans Tab */}
        <TabsContent value="trial" className="space-y-6 pt-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="mt-4 text-blue-700">Loading trial loan data...</p>
              </div>
            </div>
          ) : (
            <>


              <Card className="shadow-sm border-blue-100">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-blue-900">Active Micro Loans</CardTitle>
                      <CardDescription>
                        Monitoring performance of participants in their micro loan period
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {filteredBorrowers.filter(b => b.status === 'micro').length} Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredBorrowers.filter(b => b.status === 'micro').length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <DollarSign className="h-10 w-10 text-blue-300 mb-4" />
                      <p className="text-muted-foreground text-center">
                        No active trial loans at the moment.
                      </p>
                      <Button variant="link" className="mt-2 text-blue-600">
                        View approved applicants
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-blue-50">
                        <TableRow>
                          <TableHead className="text-blue-700">Participant</TableHead>
                          <TableHead className="text-blue-700">Trial Amount</TableHead>
                          <TableHead className="text-blue-700">Potential Score</TableHead>
                          <TableHead className="text-blue-700">Risk Profile</TableHead>
                          <TableHead className="text-blue-700">Performance</TableHead>
                          <TableHead className="text-blue-700">Timeline</TableHead>
                          <TableHead className="text-blue-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBorrowers.filter(b => b.status === 'micro').map((borrower) => (
                          <TableRow key={borrower.id} className="hover:bg-blue-50/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                  {borrower.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-medium text-blue-900">{borrower.name}</p>
                                  <p className="text-xs text-muted-foreground font-mono">{borrower.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold text-blue-900">₹{borrower.microLoanAmount.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">6-month term</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getPotentialScoreBadge(borrower.potentialScore)} className={
                                borrower.potentialScore >= 70 ? "bg-green-100 text-green-800" :
                                borrower.potentialScore >= 60 ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {borrower.potentialScore}
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">Initial score</div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Risks:</span>
                                  <span className="font-medium text-red-600">{borrower.riskFactors.length}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Strengths:</span>
                                  <span className="font-medium text-green-600">{borrower.strengths.length}</span>
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full text-xs mt-1 h-7 border-blue-200 text-blue-600"
                                  onClick={() => handleViewDetails(borrower)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <div className="bg-green-100 p-1 rounded-full">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-green-700">On Track</div>
                                  <div className="text-xs text-muted-foreground">All payments current</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1.5">
                                <div className="w-full bg-gray-100 h-2 rounded-full">
                                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <div className="text-xs text-center text-muted-foreground">
                                  65% Complete
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm"
                                onClick={() => graduateBorrower(borrower.id)}
                                className="bg-green-600 hover:bg-green-700 w-full"
                              >
                                Graduate
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-1 border-blue-200 text-blue-600 hover:bg-blue-50 w-full"
                                onClick={() => handleViewDetails(borrower)}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t px-6 py-3">
                  <div className="flex justify-between w-full text-sm text-muted-foreground">
                    <p>Updated 30 minutes ago</p>
                    <Button 
                      variant="link" 
                      className="text-blue-600 p-0 h-auto"
                      onClick={() => setShowMicroHistory(true)}
                    >
                      View all micro loan history
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="graduated" className="space-y-6 pt-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="mt-4 text-blue-700">Loading graduate data...</p>
              </div>
            </div>
          ) : (
            <>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="shadow-sm border-green-100 bg-gradient-to-br from-green-50 to-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <Award className="h-5 w-5 text-green-600" />
                        Analytics
                      </h3>
                      <Badge className="bg-green-100 text-green-800">
                        {borrowers.filter(b => b.status === 'graduated').length} Graduates
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-700 font-medium">Average Score Improvement</span>
                          <span className="text-green-700 font-bold">+78 points</span>
                        </div>
                        <Progress value={78} max={100} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-700 font-medium">Loan Repayment Rate</span>
                          <span className="text-green-700 font-bold">100%</span>
                        </div>
                        <Progress value={100} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-700 font-medium">Full Loan Qualification</span>
                          <span className="text-green-700 font-bold">100%</span>
                        </div>
                        <Progress value={100} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        Portfolio
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                          <p className="text-xs text-blue-600 font-medium">Total Graduate Loans</p>
                          <p className="text-2xl font-bold text-blue-900 mt-1">
                            ₹{(borrowers
                              .filter(b => b.status === 'graduated')
                              .reduce((sum, b) => sum + (b.microLoanAmount * 3), 0)).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Next phase funding</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                          <p className="text-xs text-blue-600 font-medium">Average New Loan</p>
                          <p className="text-2xl font-bold text-blue-900 mt-1">
                            ₹{borrowers.filter(b => b.status === 'graduated').length > 0
                              ? Math.round(
                                  borrowers
                                    .filter(b => b.status === 'graduated')
                                    .reduce((sum, b) => sum + (b.microLoanAmount * 3), 0) / 
                                    borrowers.filter(b => b.status === 'graduated').length
                                ).toLocaleString()
                              : 0}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">3x initial trial amount</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                          View Full Graduate Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-sm border-green-100">
                <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-green-900">Program Analytics</CardTitle>
                      <CardDescription>
                        Successful participants who have completed the program and qualified for standard loan products
                      </CardDescription>
                    </div>

                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredBorrowers.filter(b => b.status === 'graduated').length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <GraduationCap className="h-10 w-10 text-green-300 mb-4" />
                      <p className="text-muted-foreground text-center">
                        No program analytics data yet.
                      </p>
                      <Button variant="link" className="mt-2 text-green-600">
                        View participants in trial phase
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-green-50">
                        <TableRow>
                          <TableHead className="text-green-700">Graduate</TableHead>
                          <TableHead className="text-green-700">Original Score</TableHead>
                          <TableHead className="text-green-700">Final Credit Score</TableHead>
                          <TableHead className="text-green-700">Trial Loan Performance</TableHead>
                          <TableHead className="text-green-700">Next Loan Eligibility</TableHead>
                          <TableHead className="text-green-700">Status</TableHead>
                          <TableHead className="text-green-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBorrowers.filter(b => b.status === 'graduated').map((borrower) => (
                          <TableRow key={borrower.id} className="hover:bg-green-50/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
                                  {borrower.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <p className="font-medium text-green-900">{borrower.name}</p>
                                  <p className="text-xs text-muted-foreground font-mono">{borrower.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50">
                                {borrower.potentialScore}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-green-600">
                                {Math.min(850, borrower.potentialScore + 80)} {/* Simulated improved score */}
                              </Badge>
                              <div className="text-xs text-green-700 mt-1">+{80} points</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="bg-green-100 p-1 rounded-full">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-green-700">Excellent</div>
                                  <div className="text-xs text-muted-foreground">100% on-time</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold text-blue-700">₹{(borrower.microLoanAmount * 3).toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">Standard terms</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-green-600">
                                Full Member
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-200 text-green-600 hover:bg-green-50"
                                  onClick={() => handleViewProfile(borrower)}
                                >
                                  View Profile
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                  onClick={() => handleLoanOptions(borrower)}
                                >
                                  Loan Options
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t px-6 py-3">
                  <div className="flex justify-between w-full text-sm text-muted-foreground">
                    <p>Last graduate: 2 weeks ago</p>
                    <p className="flex items-center">
                      <Filter className="h-3 w-3 mr-1" />
                      Showing all graduates
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Add New Participant Dialog */}
      <Dialog open={showNewParticipantDialog} onOpenChange={setShowNewParticipantDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Participant</DialogTitle>
            <DialogDescription>
              Add a new first-time borrower to the assessment program with complete details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-blue-900 border-b pb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    value={newParticipant.firstName}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    value={newParticipant.lastName}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newParticipant.email}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    value={newParticipant.phone}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number"
                    value={newParticipant.age}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="25" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ssn">Aadhaar (Last 4 digits)</Label>
                  <Input 
                    id="ssn" 
                    value={newParticipant.aadhaar}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, aadhaar: e.target.value }))}
                    placeholder="1234" 
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-blue-900 border-b pb-2">Address Information</h4>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input 
                  id="address" 
                  value={newParticipant.address}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 MG Road" 
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={newParticipant.city}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Mumbai" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    value={newParticipant.state}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="Maharashtra" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">PIN Code</Label>
                  <Input 
                    id="zipCode" 
                    value={newParticipant.zipCode}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="400001" 
                  />
                </div>
              </div>
            </div>

            {/* Employment & Financial Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-blue-900 border-b pb-2">Employment & Financial Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employer">Employer</Label>
                  <Input 
                    id="employer" 
                    value={newParticipant.employer}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, employer: e.target.value }))}
                    placeholder="ABC Company Inc." 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income</Label>
                  <Input 
                    id="income" 
                    type="number"
                    value={newParticipant.income}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, income: e.target.value }))}
                    placeholder="45000" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Input 
                    id="education" 
                    value={newParticipant.education}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, education: e.target.value }))}
                    placeholder="Bachelor's Degree" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Bank Account (Last 4 digits)</Label>
                  <Input 
                    id="bankAccount" 
                    value={newParticipant.bankAccount}
                    onChange={(e) => setNewParticipant(prev => ({ ...prev, bankAccount: e.target.value }))}
                    placeholder="5678" 
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-blue-900 border-b pb-2">Additional Information</h4>
              <div className="space-y-2">
                <Label htmlFor="references">References</Label>
                <Textarea 
                  id="references" 
                  value={newParticipant.references}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, references: e.target.value }))}
                  placeholder="List 2-3 personal or professional references..."
                  className="min-h-[60px]" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={newParticipant.notes}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional information about the applicant..."
                  className="min-h-[80px]" 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewParticipantDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewParticipant} className="bg-blue-600 hover:bg-blue-700">
              Add Participant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Borrower Details</DialogTitle>
            <DialogDescription>
              Detailed information and risk assessment for {selectedBorrower?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedBorrower && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono">{selectedBorrower.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{selectedBorrower.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={getBadgeVariant(selectedBorrower.status)}>
                          {selectedBorrower.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Financial Profile</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Potential Score:</span>
                        <Badge variant={getPotentialScoreBadge(selectedBorrower.potentialScore)}>
                          {selectedBorrower.potentialScore}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trial Loan:</span>
                        <span>₹{selectedBorrower.microLoanAmount?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Program:</span>
                        <span>{selectedBorrower.recommendedProgram}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Risk Factors</h4>
                    <div className="space-y-1">
                      {selectedBorrower.riskFactors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-red-600 border-red-200 text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                    <div className="space-y-1">
                      {selectedBorrower.strengths.map((strength, index) => (
                        <Badge key={index} variant="outline" className="text-green-600 border-green-200 text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Trial History Dialog */}
      <Dialog open={showMicroHistory} onOpenChange={setShowMicroHistory}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Micro Loan History</DialogTitle>
            <DialogDescription>
              Complete history of all micro loans in the program
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {borrowers.filter(b => b.status === 'micro').length}
                </div>
                <div className="text-muted-foreground">Active Loans</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {borrowers.filter(b => b.status === 'graduated').length}
                </div>
                <div className="text-muted-foreground">Completed</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  ₹{borrowers.filter(b => b.microLoanAmount).reduce((sum, b) => sum + (b.microLoanAmount || 0), 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">Total Lent</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(borrowers.filter(b => b.potentialScore).reduce((sum, b) => sum + b.potentialScore, 0) / borrowers.filter(b => b.potentialScore).length)}
                </div>
                <div className="text-muted-foreground">Avg Score</div>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead>Borrower</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowers.filter(b => b.status === 'micro' || b.status === 'graduated').map((borrower) => (
                    <TableRow key={borrower.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                            {borrower.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{borrower.name}</p>
                            <p className="text-xs text-muted-foreground">{borrower.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>₹{borrower.microLoanAmount?.toLocaleString() || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(borrower.status)}>
                          {borrower.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: borrower.status === 'graduated' ? '100%' : '65%' }}
                          ></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMicroHistory(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Graduate Profile</DialogTitle>
            <DialogDescription>
              Complete profile information for {selectedBorrower?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedBorrower && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-800 mb-3">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Full Name:</span>
                        <span className="font-medium">{selectedBorrower.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono text-xs">{selectedBorrower.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span>{selectedBorrower.age} years old</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {selectedBorrower.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-800 mb-3">Financial Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Income:</span>
                        <span className="font-medium">₹{selectedBorrower.income.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credit Score:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {selectedBorrower.potentialScore}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Micro Loan Amount:</span>
                        <span className="font-medium">₹{selectedBorrower.microLoanAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Program:</span>
                        <span>{selectedBorrower.recommendedProgram}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-800 mb-3">Program Journey</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Assessment Completed</div>
                          <div className="text-muted-foreground">Score: {selectedBorrower.potentialScore}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Micro Loan Successful</div>
                          <div className="text-muted-foreground">100% repayment rate</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <GraduationCap className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Program Graduated</div>
                          <div className="text-muted-foreground">Qualified for standard loans</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-green-800 mb-3">Achievements</h4>
                    <div className="space-y-1">
                      {selectedBorrower.strengths.map((strength, index) => (
                        <Badge key={index} variant="outline" className="text-green-600 border-green-200 text-xs mr-1 mb-1">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-green-800 mb-3">Next Steps</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    🎉 <strong>{selectedBorrower.name}</strong> has successfully completed the First-Time Borrower program 
                    and is now eligible for standard loan products with preferential rates.
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loan Options Dialog */}
      <Dialog open={showLoanOptionsDialog} onOpenChange={setShowLoanOptionsDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Available Loan Options</DialogTitle>
            <DialogDescription>
              Loan products available for {selectedBorrower?.name} as a program graduate
            </DialogDescription>
          </DialogHeader>
          {selectedBorrower && (
            <div className="space-y-4">
              {/* Personal Loan Option */}
              <Card className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-blue-900">Personal Loan</CardTitle>
                      <CardDescription>Unsecured personal loan for any purpose</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Loan Amount</span>
                      <div className="font-semibold">₹2,00,000 - ₹10,00,000</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Interest Rate</span>
                      <div className="font-semibold">8.99% - 12.99%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Term</span>
                      <div className="font-semibold">12 - 60 months</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Auto Loan Option */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Auto Loan</CardTitle>
                  <CardDescription>Secured loan for vehicle purchase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Loan Amount</span>
                      <div className="font-semibold">₹2,00,000 - ₹20,00,000</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Interest Rate</span>
                      <div className="font-semibold">5.99% - 9.99%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Term</span>
                      <div className="font-semibold">24 - 72 months</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Card Option */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Secured Credit Card</CardTitle>
                  <CardDescription>Build credit history with a secured card</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Credit Limit</span>
                      <div className="font-semibold">₹25,000 - ₹1,25,000</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">APR</span>
                      <div className="font-semibold">18.99% - 24.99%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Security Deposit</span>
                      <div className="font-semibold">₹10,000 minimum</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-green-800">Graduate Benefits</div>
                    <div className="text-green-700 mt-1">
                      • No application fees • Preferential interest rates • Priority processing • Dedicated support
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoanOptionsDialog(false)}>
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Schedule Consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FirstTimeBorrower;