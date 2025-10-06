import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome to Siddhi",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur">
        <CardHeader className="space-y-4 text-center">
          <div className="flex flex-col items-center space-y-4">
            {/* Logo */}
            <div className="w-40 h-40 flex items-center justify-center mb-2 overflow-hidden rounded-full ring-4 ring-blue-500/20 drop-shadow-2xl">
              <img 
                src="/Gemini_Generated_Image_hosjithosjithosj.png" 
                alt="Siddhi Logo" 
                className="w-48 h-48 object-cover scale-110"
              />
            </div>
            {/* Company Name */}
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                Siddhi
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Credit Scoring Platform
              </p>
            </div>
          </div>
          <div className="space-y-1 pt-2">
            <CardTitle className="text-xl font-semibold">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="officer@siddhi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg"
            >
              Sign In to Siddhi
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border border-border/50">
            <p className="text-sm font-medium mb-2 text-foreground">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• <span className="font-mono">officer@siddhi.com</span> / <span className="font-mono">password123</span></p>
              <p>• <span className="font-mono">admin@siddhi.com</span> / <span className="font-mono">admin123</span></p>
              <p>• <span className="font-mono">manager@siddhi.com</span> / <span className="font-mono">manager123</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
