import { Bell, User, Sun, Moon, LayoutDashboard, Users, TestTube, LogOut, CheckCircle, Sprout, Users2, AlertTriangle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { SearchDropdown } from "@/components/ui/SearchDropdown";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6">
        <div className="flex items-center gap-6 mr-8">
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">S</span>
            </div>
            <span className="text-xl font-semibold">Siddhi</span>
          </NavLink>

          <nav className="flex items-center gap-1">
            <NavLink 
              to="/dashboard"
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>

            <NavLink 
              to="/direct-lending"
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <CheckCircle className="h-4 w-4" />
              Direct Lending
            </NavLink>
            <NavLink 
              to="/first-time-borrower"
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Sprout className="h-4 w-4" />
              Incubator
            </NavLink>
            <NavLink 
              to="/joint-application"
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Users2 className="h-4 w-4" />
              Joint Loans
            </NavLink>
            <NavLink 
              to="/early-warning"
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <AlertTriangle className="h-4 w-4" />
              Early Warning
            </NavLink>
            <NavLink 
              to="/loan-rewards"
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Trophy className="h-4 w-4" />
              Rewards
            </NavLink>
            <NavLink 
              to="/sandbox"
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <TestTube className="h-4 w-4" />
              Sandbox
            </NavLink>
          </nav>
        </div>

        <div className="flex-1 max-w-2xl mx-auto">
          <SearchDropdown 
            placeholder="Search by Beneficiary ID, Purpose, or Loan Details..."
          />
        </div>

        <div className="flex items-center gap-2 ml-8">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" title={user?.name}>
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
