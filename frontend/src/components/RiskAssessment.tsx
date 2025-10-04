import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { AlertTriangle, Shield, AlertCircle } from "lucide-react";

interface RiskAssessmentProps {
  riskScore: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  keyFindings: string[];
}

export function RiskAssessment({ riskScore, riskLevel, keyFindings }: RiskAssessmentProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
      case "MODERATE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HIGH": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "LOW": return <Shield className="h-5 w-5" />;
      case "MODERATE": return <AlertCircle className="h-5 w-5" />;
      case "HIGH": return <AlertTriangle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-green-500";
      case "MODERATE": return "bg-yellow-500";
      case "HIGH": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getRiskIcon(riskLevel)}
          Overall Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">{riskScore}%</div>
          <Badge className={`${getRiskColor(riskLevel)} px-3 py-1`}>
            {riskLevel} RISK
          </Badge>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Risk Score</span>
            <span>{riskScore}%</span>
          </div>
          <Progress 
            value={riskScore} 
            className="h-2"
            style={{ 
              "--progress-foreground": getProgressColor(riskLevel) 
            } as React.CSSProperties}
          />
        </div>

        <div>
          <h4 className="mb-3">Key Risk Factors</h4>
          <ul className="space-y-2">
            {keyFindings.map((finding, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                <span className="leading-tight">{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}