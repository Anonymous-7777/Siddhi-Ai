import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center space-y-6 max-w-2xl px-6">
        <h1 className="text-6xl font-semibold tracking-tight">
          Siddhi
        </h1>
        <p className="text-xl text-muted-foreground">
          AI Co-Pilot for Intelligent Loan Assessment
        </p>
        <p className="text-base text-muted-foreground max-w-xl mx-auto">
          Augment your intelligence with AI-powered risk assessment, behavioral analysis, and transparent decision-making tools.
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/login')}
          className="mt-8"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
