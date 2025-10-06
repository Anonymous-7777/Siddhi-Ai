export interface Beneficiary {
  id: string;
  name: string;
  compositeScore: number;
  riskBand: 'low' | 'medium' | 'high';
  financialState: 'Stable' | 'Stressed' | 'Crisis';
  loanAmount: number;
  region: string;
  monthsActive: number;
  principalRemaining: number;
  consumptionStability: number;
}

export const mockBeneficiaries: Beneficiary[] = [
  {
    id: 'BEN-2024-001',
    name: 'Priya Sharma',
    compositeScore: 8.2,
    riskBand: 'low',
    financialState: 'Stable',
    loanAmount: 50000,
    region: 'Mumbai',
    monthsActive: 18,
    principalRemaining: 32000,
    consumptionStability: 0.85
  },
  {
    id: 'BEN-2024-002',
    name: 'Rajesh Kumar',
    compositeScore: 6.5,
    riskBand: 'medium',
    financialState: 'Stable',
    loanAmount: 75000,
    region: 'Delhi',
    monthsActive: 12,
    principalRemaining: 58000,
    consumptionStability: 0.72
  },
  {
    id: 'BEN-2024-003',
    name: 'Anita Desai',
    compositeScore: 3.8,
    riskBand: 'high',
    financialState: 'Stressed',
    loanAmount: 40000,
    region: 'Pune',
    monthsActive: 24,
    principalRemaining: 35000,
    consumptionStability: 0.45
  },
  {
    id: 'BEN-2024-004',
    name: 'Mohammed Ali',
    compositeScore: 7.9,
    riskBand: 'low',
    financialState: 'Stable',
    loanAmount: 60000,
    region: 'Bangalore',
    monthsActive: 15,
    principalRemaining: 38000,
    consumptionStability: 0.88
  },
  {
    id: 'BEN-2024-005',
    name: 'Lakshmi Iyer',
    compositeScore: 5.2,
    riskBand: 'medium',
    financialState: 'Stressed',
    loanAmount: 55000,
    region: 'Chennai',
    monthsActive: 20,
    principalRemaining: 42000,
    consumptionStability: 0.58
  },
  {
    id: 'BEN-2024-006',
    name: 'Amit Patel',
    compositeScore: 8.7,
    riskBand: 'low',
    financialState: 'Stable',
    loanAmount: 80000,
    region: 'Ahmedabad',
    monthsActive: 10,
    principalRemaining: 65000,
    consumptionStability: 0.92
  },
  {
    id: 'BEN-2024-007',
    name: 'Sneha Reddy',
    compositeScore: 4.1,
    riskBand: 'high',
    financialState: 'Crisis',
    loanAmount: 45000,
    region: 'Hyderabad',
    monthsActive: 22,
    principalRemaining: 40000,
    consumptionStability: 0.38
  },
  {
    id: 'BEN-2024-008',
    name: 'Vikram Singh',
    compositeScore: 7.3,
    riskBand: 'low',
    financialState: 'Stable',
    loanAmount: 70000,
    region: 'Jaipur',
    monthsActive: 14,
    principalRemaining: 48000,
    consumptionStability: 0.81
  },
  {
    id: 'BEN-2024-009',
    name: 'Kavita Nair',
    compositeScore: 5.8,
    riskBand: 'medium',
    financialState: 'Stable',
    loanAmount: 52000,
    region: 'Kochi',
    monthsActive: 16,
    principalRemaining: 36000,
    consumptionStability: 0.68
  },
  {
    id: 'BEN-2024-010',
    name: 'Deepak Gupta',
    compositeScore: 3.2,
    riskBand: 'high',
    financialState: 'Crisis',
    loanAmount: 38000,
    region: 'Kolkata',
    monthsActive: 26,
    principalRemaining: 34000,
    consumptionStability: 0.32
  },
  {
    id: 'BEN-2024-011',
    name: 'Meera Joshi',
    compositeScore: 8.4,
    riskBand: 'low',
    financialState: 'Stable',
    loanAmount: 65000,
    region: 'Mumbai',
    monthsActive: 11,
    principalRemaining: 52000,
    consumptionStability: 0.89
  },
  {
    id: 'BEN-2024-012',
    name: 'Sanjay Mehta',
    compositeScore: 6.1,
    riskBand: 'medium',
    financialState: 'Stable',
    loanAmount: 58000,
    region: 'Surat',
    monthsActive: 19,
    principalRemaining: 41000,
    consumptionStability: 0.71
  },
  {
    id: 'BEN-2024-013',
    name: 'Asha Pillai',
    compositeScore: 4.5,
    riskBand: 'high',
    financialState: 'Stressed',
    loanAmount: 43000,
    region: 'Trivandrum',
    monthsActive: 23,
    principalRemaining: 38000,
    consumptionStability: 0.48
  },
  {
    id: 'BEN-2024-014',
    name: 'Rahul Bose',
    compositeScore: 7.6,
    riskBand: 'low',
    financialState: 'Stable',
    loanAmount: 72000,
    region: 'Delhi',
    monthsActive: 13,
    principalRemaining: 55000,
    consumptionStability: 0.84
  },
  {
    id: 'BEN-2024-015',
    name: 'Pooja Kapoor',
    compositeScore: 5.5,
    riskBand: 'medium',
    financialState: 'Stressed',
    loanAmount: 48000,
    region: 'Chandigarh',
    monthsActive: 21,
    principalRemaining: 39000,
    consumptionStability: 0.62
  },
  {
    id: 'BEN-2024-016',
    name: 'Arjun Rao',
    compositeScore: 8.9,
    riskBand: 'low',
    financialState: 'Stable',
    loanAmount: 85000,
    region: 'Bangalore',
    monthsActive: 9,
    principalRemaining: 71000,
    consumptionStability: 0.94
  },
  {
    id: 'BEN-2024-017',
    name: 'Divya Menon',
    compositeScore: 3.6,
    riskBand: 'high',
    financialState: 'Crisis',
    loanAmount: 42000,
    region: 'Chennai',
    monthsActive: 25,
    principalRemaining: 39000,
    consumptionStability: 0.35
  },
  {
    id: 'BEN-2024-018',
    name: 'Karan Malhotra',
    compositeScore: 7.1,
    riskBand: 'low',
    financialState: 'Stable',
    loanAmount: 68000,
    region: 'Ludhiana',
    monthsActive: 17,
    principalRemaining: 49000,
    consumptionStability: 0.79
  },
  {
    id: 'BEN-2024-019',
    name: 'Shweta Verma',
    compositeScore: 6.3,
    riskBand: 'medium',
    financialState: 'Stable',
    loanAmount: 54000,
    region: 'Indore',
    monthsActive: 14,
    principalRemaining: 40000,
    consumptionStability: 0.73
  },
  {
    id: 'BEN-2024-020',
    name: 'Naveen Krishnan',
    compositeScore: 4.8,
    riskBand: 'medium',
    financialState: 'Stressed',
    loanAmount: 46000,
    region: 'Coimbatore',
    monthsActive: 22,
    principalRemaining: 37000,
    consumptionStability: 0.52
  }
];

// Calculate aggregate statistics
export const getStatistics = () => {
  const totalBeneficiaries = mockBeneficiaries.length;
  const avgScore = mockBeneficiaries.reduce((sum, b) => sum + b.compositeScore, 0) / totalBeneficiaries;
  const totalLoanVolume = mockBeneficiaries.reduce((sum, b) => sum + b.loanAmount, 0);
  
  const riskDistribution = {
    low: mockBeneficiaries.filter(b => b.riskBand === 'low').length,
    medium: mockBeneficiaries.filter(b => b.riskBand === 'medium').length,
    high: mockBeneficiaries.filter(b => b.riskBand === 'high').length,
  };

  const earlyWarnings = mockBeneficiaries.filter(b => 
    b.compositeScore < 5 && b.financialState === 'Stressed'
  ).length;

  const criticalAlerts = mockBeneficiaries.filter(b => 
    b.compositeScore < 4 && b.financialState === 'Crisis'
  ).length;

  const reviewRequired = mockBeneficiaries.filter(b => 
    b.riskBand === 'medium' && b.consumptionStability < 0.6
  ).length;

  return {
    totalBeneficiaries,
    avgScore,
    totalLoanVolume,
    riskDistribution,
    earlyWarnings,
    criticalAlerts,
    reviewRequired
  };
};
