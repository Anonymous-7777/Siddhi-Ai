import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
}

export function KPICard({ icon: Icon, title, value, change, trend }: KPICardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "text-success" : "text-destructive";

  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-semibold text-accent mt-1">{value}</h3>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 mt-3 text-sm ${trendColor}`}>
          <TrendIcon className="h-4 w-4" />
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}
