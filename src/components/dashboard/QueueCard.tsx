import { LucideIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface QueueCardProps {
  icon: LucideIcon;
  title: string;
  count: number;
  description: string;
  path: string;
}

export function QueueCard({ icon: Icon, title, count, description, path }: QueueCardProps) {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/50 group cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
            <Icon className="h-6 w-6 text-destructive" />
          </div>
          <span className="text-3xl font-bold text-accent">{count}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10" asChild>
          <Link to={path}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
