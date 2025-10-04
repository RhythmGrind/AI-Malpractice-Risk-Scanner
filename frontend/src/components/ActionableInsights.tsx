import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, AlertTriangle, Clock, FileText } from "lucide-react";

interface Recommendation {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: "Documentation" | "Clinical Decision" | "Follow-up" | "Communication";
  title: string;
  description: string;
  action: string;
}

interface ActionableInsightsProps {
  recommendations: Recommendation[];
}

export function ActionableInsights({ recommendations }: ActionableInsightsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Documentation": return <FileText className="h-4 w-4" />;
      case "Clinical Decision": return <AlertTriangle className="h-4 w-4" />;
      case "Follow-up": return <Clock className="h-4 w-4" />;
      case "Communication": return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Actionable Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-3 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-0.5">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <h4 className="font-medium text-sm leading-tight">{rec.title}</h4>
                </div>
                <Badge className={`${getPriorityColor(rec.priority)} text-xs px-2 py-1 flex-shrink-0 whitespace-nowrap`}>
                  {rec.priority}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {rec.description}
              </p>
              
              <div className="bg-muted/50 rounded p-3">
                <div className="text-xs text-muted-foreground mb-1">Recommended Action:</div>
                <div className="text-sm">{rec.action}</div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Category: {rec.category}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}