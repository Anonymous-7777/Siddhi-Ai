import { 
  Search, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Users, 
  TestTube, 
  LogOut, 
  CheckCircle, 
  Sprout, 
  Users2, 
  AlertTriangle, 
  Trophy,
  DollarSign,
  FileText,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ElementType;
  description: string;
  className?: string;
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems: NavigationItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & Analytics"
    },

    {
      title: "Direct Lending",
      href: "/direct-lending",
      icon: CheckCircle,
      description: "Pre-approved Loans"
    },

    {
      title: "First-Time Borrower",
      href: "/first-time-borrower",
      icon: Sprout,
      description: "Incubator Program"
    },
    {
      title: "Joint Applications",
      href: "/joint-application",
      icon: Users2,
      description: "Co-borrower Processing"
    },
    {
      title: "Early Warning System",
      href: "/early-warning",
      icon: AlertTriangle,
      description: "Default Prevention"
    },
    {
      title: "Loan Rewards",
      href: "/loan-rewards",
      icon: Trophy,
      description: "Dynamic Incentives"
    },
    {
      title: "API Test",
      href: "/api-test",
      icon: TestTube,
      description: "Test Backend Connection"
    },
    {
      title: "Audit Information",
      href: "/audit-info",
      icon: FileText,
      description: "Documentation for Auditors",
      className: "bg-red-50 text-red-600 mt-4 border-t border-red-200"
    }
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen bg-background border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className={`${isCollapsed ? 'relative' : 'flex items-center justify-between'} p-4 border-b`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/20 drop-shadow-md bg-white">
                <img 
                  src="/Gemini_Generated_Image_hosjithosjithosj.png" 
                  alt="Siddhi Logo" 
                  className="w-14 h-14 object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">Siddhi</span>
                <span className="text-xs text-muted-foreground">Credit Scoring</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/20 drop-shadow-md bg-white">
              <img 
                src="/Gemini_Generated_Image_hosjithosjithosj.png" 
                alt="Siddhi Logo" 
                className="w-12 h-12 object-cover"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-6 h-6"
            >
              <Menu className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2",
                  item.className
                )
              }
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate">{item.title}</span>
                  <span className="text-xs opacity-70 truncate group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "Toggle theme" : undefined}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          {!isCollapsed && <span className="ml-3">Toggle theme</span>}
        </Button>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'Loan Officer'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'officer@siddhi.com'}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
