import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BeneficiaryDetail from "./pages/BeneficiaryDetail";
import DirectLending from "./pages/DirectLending";
import FirstTimeBorrower from "./pages/FirstTimeBorrower";
import JointApplication from "./pages/JointApplication";
import EarlyWarningSystem from "./pages/EarlyWarningSystem";
import LoanRewards from "./pages/LoanRewards";
import NotFound from "./pages/NotFound";
import InfoPage from "./pages/InfoPage";
import AIPredictionPage from "./pages/AIPredictionPage";
import ApiTestPage from "./pages/ApiTestPage";
import BeneficiaryDetailDebug from "./pages/BeneficiaryDetailDebug";
import BeneficiaryDetailSimple from "./pages/BeneficiaryDetailSimple";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/beneficiary/:id" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <BeneficiaryDetailSimple />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/interactive-data/:id?" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AIPredictionPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/direct-lending" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DirectLending />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/first-time-borrower" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <FirstTimeBorrower />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/joint-application" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <JointApplication />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/early-warning" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EarlyWarningSystem />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/loan-rewards" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <LoanRewards />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/audit-info" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <InfoPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/api-test" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ApiTestPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
