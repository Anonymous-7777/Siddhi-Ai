import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, DollarSign, TrendingUp, Users, Eye, Clock } from "lucide-react";
import { dummyUsers, userRiskScores } from "@/data/dummyLoanData";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

interface LoanCandidate {
  id: string;
  name: string;
  riskScore: number;
  needScore: number;
  compositeScore: number;
  requestedAmount: number;
  monthlyIncome: number;
  creditHistory: number;
  status: 'eligible' | 'pending' | 'approved' | 'rejected';
}

const DirectLending = () => {
  const [candidates, setCandidates] = useState<LoanCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');

  const navigate = useNavigate();

  // Set active tab from URL param on load
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Use dummy data to populate candidates
  useEffect(() => {
    // Filter unique user IDs and transform to loan candidates
    const uniqueUserIds = Array.from(new Set(dummyUsers.map(user => user.id)));
    
    // Get all users for full list
    const allUsers = uniqueUserIds.filter(id => userRiskScores[id]);
    
    // Get eligible users (good risk score)
    const eligibleUsers = uniqueUserIds.filter(id => {
      const riskScore = userRiskScores[id];
      return riskScore && riskScore.score >= 70; // Only show users with good risk scores
    });

    // Create candidates from eligible users
    const mockEligibleCandidates: LoanCandidate[] = eligibleUsers.map(id => {
      const user = dummyUsers.find(u => u.id === id);
      const riskScore = userRiskScores[id];
      
      return {
        id,
        name: `Beneficiary ${id}`,
        riskScore: riskScore.score,
        needScore: Math.floor(Math.random() * 15) + 80, // Random need score between 80-95
        compositeScore: riskScore.score,
        requestedAmount: user?.loan_amnt || 5000,
        monthlyIncome: Math.round((user?.annual_inc || 50000) / 12),
        creditHistory: Math.round(user?.credit_history_length_years || 5),
        status: 'eligible'
      };
    });
    
    // Create candidates for all users (including those with lower risk scores)
    const mockAllCandidates: LoanCandidate[] = allUsers.map(id => {
      const user = dummyUsers.find(u => u.id === id);
      const riskScore = userRiskScores[id];
      const isEligible = riskScore.score >= 70;
      
      return {
        id,
        name: `Beneficiary ${id}`,
        riskScore: riskScore.score,
        needScore: Math.floor(Math.random() * 30) + 65, // Random need score between 65-95
        compositeScore: riskScore.score,
        requestedAmount: user?.loan_amnt || 5000,
        monthlyIncome: Math.round((user?.annual_inc || 50000) / 12),
        creditHistory: Math.round(user?.credit_history_length_years || 5),
        status: isEligible ? 'eligible' : 'pending'
      };
    });

    setTimeout(() => {
      // Store all candidates but default to showing only eligible ones
      setCandidates(mockAllCandidates);
      setLoading(false);
    }, 500);
  }, []);

  const handleSelectCandidate = (candidateId: string) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleOneClickApproval = (candidateId: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: 'approved' }
          : candidate
      )
    );
  };

  const handleOneClickRejection = (candidateId: string) => {
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: 'rejected' }
          : candidate
      )
    );
  };

  const goToBeneficiary = (id: string) => {
    navigate(`/beneficiary/${id}`);
  };
  
  const handleBulkApproval = () => {
    setCandidates(prev => 
      prev.map(candidate => 
        selectedCandidates.has(candidate.id)
          ? { ...candidate, status: 'approved' }
          : candidate
      )
    );
    setSelectedCandidates(new Set());
  };
  
  const handleBulkRejection = () => {
    setCandidates(prev => 
      prev.map(candidate => 
        selectedCandidates.has(candidate.id)
          ? { ...candidate, status: 'rejected' }
          : candidate
      )
    );
    setSelectedCandidates(new Set());
  };

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  const totalRequestedAmount = candidates
    .filter(c => selectedCandidates.has(c.id))
    .reduce((sum, c) => sum + c.requestedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Direct Digital Lending</h1>
          <p className="text-muted-foreground mt-2">
            Pre-filtered candidates ready for immediate loan approval (Low Risk - High Need)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleBulkApproval} 
            disabled={selectedCandidates.size === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve Selected ({selectedCandidates.size})
          </Button>
          <Button 
            onClick={handleBulkRejection} 
            disabled={selectedCandidates.size === 0}
            className="bg-red-600 hover:bg-red-700"
          >
            Reject Selected ({selectedCandidates.size})
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eligible Candidates</p>
                <p className="text-2xl font-bold">{candidates.filter(c => c.status === 'eligible').length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Loan Amount</p>
                <p className="text-2xl font-bold">₹{candidates.reduce((sum, c) => sum + c.requestedAmount, 0).toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Composite Score</p>
                <p className="text-2xl font-bold">
                  {(candidates.reduce((sum, c) => sum + c.compositeScore, 0) / candidates.length || 0).toFixed(1)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected Amount</p>
                <p className="text-2xl font-bold">₹{totalRequestedAmount.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Eligible Candidates
          </TabsTrigger>
          <TabsTrigger 
            value="all_applications" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            All Applications
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Pending Approvals
          </TabsTrigger>
          <TabsTrigger 
            value="approved" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Approved Loans
          </TabsTrigger>
        </TabsList>

        {/* Eligible Candidates Tab */}
        <TabsContent value="all" className="space-y-6 pt-4">
          {/* Candidates Table */}
          <Card>
            <CardHeader>
              <CardTitle>Pre-Qualified Loan Candidates</CardTitle>
              <CardDescription>
                Candidates with high need scores and low risk profiles, ready for immediate approval
              </CardDescription>
            </CardHeader>
            <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Beneficiary ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Need Score</TableHead>
                <TableHead>Composite Score</TableHead>
                <TableHead>Requested Amount</TableHead>
                <TableHead>Monthly Income</TableHead>
                <TableHead>Credit History</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    Loading candidates...
                  </TableCell>
                </TableRow>
              ) : candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    No eligible candidates found
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCandidates.has(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                        disabled={candidate.status === 'approved'}
                        className="w-4 h-4"
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{candidate.id}</TableCell>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(candidate.riskScore)}>
                        {candidate.riskScore}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{candidate.needScore}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{candidate.compositeScore}</Badge>
                    </TableCell>
                    <TableCell>₹{candidate.requestedAmount.toLocaleString()}</TableCell>
                    <TableCell>₹{candidate.monthlyIncome.toLocaleString()}</TableCell>
                    <TableCell>{candidate.creditHistory} months</TableCell>
                    <TableCell>
                      <Badge 
                        variant={candidate.status === 'approved' ? 'default' : 
                                 candidate.status === 'eligible' ? 'secondary' : 
                                 candidate.status === 'rejected' ? 'destructive' : 'outline'}
                        className={candidate.status === 'approved' ? 'bg-green-600' : 
                                  candidate.status === 'rejected' ? 'bg-red-600' : ''}
                      >
                        {candidate.status === 'approved' ? 'Approved' : 
                         candidate.status === 'eligible' ? 'Eligible' : 
                         candidate.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {candidate.status === 'eligible' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleOneClickApproval(candidate.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleOneClickRejection(candidate.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Reject
                            </Button>
                          </>
                        ) : candidate.status === 'approved' ? (
                          <Badge variant="outline" className="text-green-600">
                            ✓ Approved
                          </Badge>
                        ) : candidate.status === 'rejected' ? (
                          <Badge variant="outline" className="text-red-600">
                            ✗ Rejected
                          </Badge>
                        ) : null}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => goToBeneficiary(candidate.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
    
    {/* All Applications Tab */}
    <TabsContent value="all_applications" className="space-y-6 pt-4">
      {/* All Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Loan Applications</CardTitle>
              <CardDescription>
                Complete list of all loan applications regardless of risk level
              </CardDescription>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {candidates.length} Total Applications
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Need Score</TableHead>
                <TableHead>Requested Amount</TableHead>
                <TableHead>Monthly Income</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-mono text-sm">{candidate.id}</TableCell>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(candidate.riskScore)} 
                           className={candidate.riskScore < 70 ? "bg-red-100 text-red-800" : ""}>
                      {candidate.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={candidate.needScore > 80 ? "default" : "secondary"}>
                      {candidate.needScore}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{candidate.requestedAmount.toLocaleString()}</TableCell>
                  <TableCell>₹{candidate.monthlyIncome.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={candidate.status === 'approved' ? "default" : 
                             candidate.status === 'eligible' ? "secondary" : 
                             candidate.status === 'rejected' ? "destructive" : "outline"}
                      className={candidate.status === 'approved' ? 'bg-green-600' : 
                                candidate.status === 'eligible' ? 'bg-blue-600' : 
                                candidate.status === 'rejected' ? 'bg-red-600' : ''}
                    >
                      {candidate.status === 'approved' ? 'Approved' : 
                       candidate.status === 'eligible' ? 'Eligible' : 
                       candidate.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {candidate.status !== 'approved' && candidate.status !== 'rejected' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleOneClickApproval(candidate.id)}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={candidate.riskScore < 70}
                          >
                            {candidate.riskScore >= 70 ? 'Approve' : 'Not Eligible'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleOneClickRejection(candidate.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => goToBeneficiary(candidate.id)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Pending Approvals Tab */}
    <TabsContent value="pending" className="space-y-6 pt-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pending Loan Approvals</CardTitle>
              <CardDescription>
                High priority loans waiting for final approval decision
              </CardDescription>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800">
              {candidates.filter(c => c.status === 'eligible').length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Requested Amount</TableHead>
                <TableHead>Monthly Income</TableHead>
                <TableHead>Credit History</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.filter(c => c.status === 'eligible').map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-mono text-sm">{candidate.id}</TableCell>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(candidate.riskScore)}>
                      {candidate.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{candidate.requestedAmount.toLocaleString()}</TableCell>
                  <TableCell>₹{candidate.monthlyIncome.toLocaleString()}</TableCell>
                  <TableCell>{candidate.creditHistory} months</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleOneClickApproval(candidate.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => goToBeneficiary(candidate.id)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Approved Loans Tab */}
    <TabsContent value="approved" className="space-y-6 pt-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Approved Loans</CardTitle>
              <CardDescription>
                Loans that have been approved and are ready for disbursement
              </CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {candidates.filter(c => c.status === 'approved').length} Approved
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.filter(c => c.status === 'approved').map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-mono text-sm">{candidate.id}</TableCell>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(candidate.riskScore)}>
                      {candidate.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{candidate.requestedAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => goToBeneficiary(candidate.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>

      {/* No footer info here */}
    </div>
  );
};

export default DirectLending;