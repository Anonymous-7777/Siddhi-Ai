/**
 * API Service for Siddhi Credit Scoring Backend
 * 
 * This service handles all HTTP requests to the FastAPI backend
 */

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async fetchWithErrorHandling<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Health check
  async getHealth() {
    return this.fetchWithErrorHandling<{
      status: string;
      database_connected: boolean;
      total_records: number;
      timestamp: string;
    }>(`${this.baseURL}/health`);
  }

  // Get API information
  async getApiInfo() {
    return this.fetchWithErrorHandling<{
      message: string;
      version: string;
      endpoints: string[];
    }>(`${this.baseURL}/`);
  }

  // Get beneficiaries with pagination
  async getBeneficiaries(params: {
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params.sort_order) searchParams.append('sort_order', params.sort_order);

    return this.fetchWithErrorHandling<{
      data: any[];
      pagination: {
        page: number;
        page_size: number;
        total_items: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
      };
    }>(`${this.baseURL}/beneficiaries?${searchParams}`);
  }

  // Get single beneficiary
  async getBeneficiary(id: number) {
    return this.fetchWithErrorHandling<any>(`${this.baseURL}/beneficiary/${id}`);
  }

  // Get KPI summary
  async getKpiSummary() {
    return this.fetchWithErrorHandling<{
      overview: {
        total_beneficiaries: number;
        total_loan_amount: number;
        avg_loan_amount: number;
        avg_credit_score: number;
        default_rate_percent: number;
      };
      distributions: {
        grade: Array<{ grade: string; count: number }>;
        purpose: Array<{ purpose: string; count: number }>;
        home_ownership: Array<{ home_ownership: string; count: number }>;
      };
      risk_metrics: {
        total_defaults: number;
        default_rate: number;
      };
    }>(`${this.baseURL}/kpi_summary`);
  }

  // Search beneficiaries
  async searchBeneficiaries(params: {
    query: string;
    page?: number;
    page_size?: number;
  }) {
    const searchParams = new URLSearchParams();
    searchParams.append('query', params.query);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.page_size) searchParams.append('page_size', params.page_size.toString());

    return this.fetchWithErrorHandling<{
      query: string;
      results: any[];
      count: number;
    }>(`${this.baseURL}/search_beneficiaries?${searchParams}`);
  }

  // Filter beneficiaries
  async filterBeneficiaries(filters: {
    grade?: string;
    loan_amnt_min?: number;
    loan_amnt_max?: number;
    credit_score_min?: number;
    credit_score_max?: number;
    purpose?: string;
    home_ownership?: string;
    is_defaulted?: number;
  }, pagination: {
    page?: number;
    page_size?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    if (pagination.page) searchParams.append('page', pagination.page.toString());
    if (pagination.page_size) searchParams.append('page_size', pagination.page_size.toString());

    return this.fetchWithErrorHandling<{
      data: any[];
      pagination: {
        page: number;
        page_size: number;
        total_items: number;
        total_pages: number;
      };
      filters_applied: any;
    }>(`${this.baseURL}/filter_beneficiaries?${searchParams}`, {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  // Get loan analytics
  async getLoanAnalytics() {
    return this.fetchWithErrorHandling<{
      loan_by_grade: Array<{
        grade: string;
        loan_count: number;
        avg_amount: number;
        total_amount: number;
        min_amount: number;
        max_amount: number;
      }>;
      purpose_analysis: Array<{
        purpose: string;
        loan_count: number;
        avg_amount: number;
        avg_credit: number;
        default_rate: number;
      }>;
      term_analysis: Array<{
        term: number;
        loan_count: number;
        avg_amount: number;
        avg_interest_rate: number;
      }>;
    }>(`${this.baseURL}/loan_analytics`);
  }

  // Get risk analytics
  async getRiskAnalytics() {
    return this.fetchWithErrorHandling<{
      default_by_grade: Array<{
        grade: string;
        total_loans: number;
        defaults: number;
        default_rate: number;
        avg_credit: number;
      }>;
      credit_risk_analysis: Array<{
        credit_range: string;
        loan_count: number;
        default_rate: number;
        avg_loan_amount: number;
      }>;
      home_ownership_risk: Array<{
        home_ownership: string;
        total_loans: number;
        default_rate: number;
        avg_loan_amount: number;
        avg_income: number;
      }>;
    }>(`${this.baseURL}/risk_analytics`);
  }

  // Get portfolio health trends
  async getPortfolioTrends() {
    return this.fetchWithErrorHandling<{
      portfolio_health: Array<{
        month: string;
        score: number;
        avg_credit: number;
        default_rate: number;
      }>;
      current_metrics: {
        health_score: number;
        avg_credit_score: number;
        default_rate: number;
        total_loans: number;
      };
    }>(`${this.baseURL}/portfolio_trends`);
  }

  // Get database columns
  async getColumns() {
    return this.fetchWithErrorHandling<{
      table_name: string;
      columns: Array<{
        name: string;
        type: string;
        not_null: boolean;
        primary_key: boolean;
      }>;
      total_columns: number;
    }>(`${this.baseURL}/columns`);
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export types for better TypeScript support
export interface Beneficiary {
  id: number;
  loan_amnt: number;
  term: number;
  int_rate: number;
  installment: number;
  grade: string;
  sub_grade: string;
  emp_length: string;
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
  is_defaulted: number;
  initial_fico_score: number;
  credit_history_length_years: number;
  is_first_time_borrower_flag: number;
  [key: string]: any; // For additional columns
}

export interface KpiSummary {
  overview: {
    total_beneficiaries: number;
    total_loan_amount: number;
    avg_loan_amount: number;
    avg_credit_score: number;
    default_rate_percent: number;
  };
  distributions: {
    grade: Array<{ grade: string; count: number }>;
    purpose: Array<{ purpose: string; count: number }>;
    home_ownership: Array<{ home_ownership: string; count: number }>;
  };
  risk_metrics: {
    total_defaults: number;
    default_rate: number;
  };
}

export default apiService;