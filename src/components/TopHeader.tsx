import { useState, useEffect, useRef } from "react";
import { Bell, X, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchDropdown } from "@/components/ui/SearchDropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'warning',
    title: 'High Risk Application',
    message: 'Beneficiary #100005941 has been flagged for manual review due to inconsistent income patterns.',
    time: '5 min ago',
    read: false,
    icon: AlertTriangle,
    color: 'text-yellow-600'
  },
  {
    id: 2,
    type: 'success',
    title: 'Portfolio Update',
    message: 'Monthly portfolio health score improved by 0.3 points to 7.8/10.',
    time: '1 hour ago',
    read: false,
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Critical Alert',
    message: 'System detected 15 new applications requiring immediate attention.',
    time: '2 hours ago',
    read: false,
    icon: Clock,
    color: 'text-red-600'
  },
  {
    id: 4,
    type: 'info',
    title: 'Database Sync',
    message: 'Successfully synchronized 1,247 new records from external data sources.',
    time: '3 hours ago',
    read: true,
    icon: CheckCircle,
    color: 'text-blue-600'
  },
  {
    id: 5,
    type: 'warning',
    title: 'Model Performance',
    message: 'AI model accuracy dropped to 94.2%. Consider retraining with latest data.',
    time: '1 day ago',
    read: true,
    icon: AlertTriangle,
    color: 'text-orange-600'
  }
];

export function TopHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const { toast } = useToast();
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showNotifications]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification removed",
      description: "Notification has been cleared",
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-blue-50/95 backdrop-blur supports-[backdrop-filter]:bg-blue-50/60">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <SearchDropdown 
            className="flex-1" 
            placeholder="Search beneficiaries by ID, purpose..."
          />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 relative" ref={notificationRef}>
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 z-50">
              <Card className="w-80 shadow-lg border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Notifications</CardTitle>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={markAllAsRead}
                          className="text-xs h-6 px-2"
                        >
                          Mark all read
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowNotifications(false)}
                        className="h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {notifications.map((notification) => {
                          const Icon = notification.icon;
                          return (
                            <div
                              key={notification.id}
                              className={`p-3 border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors ${
                                !notification.read ? 'bg-blue-50/50' : ''
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${notification.color}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-medium leading-tight">
                                      {notification.title}
                                    </h4>
                                    <div className="flex items-center gap-1">
                                      {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          clearNotification(notification.id);
                                        }}
                                        className="h-4 w-4 hover:bg-red-100"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopHeader;