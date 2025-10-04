import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { FileSearch, Quote, TrendingUp, AlertCircle } from "lucide-react";

interface EvidenceItem {
  id: string;
  type: "Text Analysis" | "Pattern Recognition" | "Standard Compliance" | "Risk Factor";
  excerpt: string;
  analysis: string;
  confidence: number;
  impact: "High" | "Medium" | "Low";
}

interface SupportingEvidenceProps {
  evidence: EvidenceItem[];
  analysisMetrics: {
    totalWords: number;
    keyPhrases: number;
    riskIndicators: number;
    confidenceScore: number;
  };
}

export function SupportingEvidence({ evidence, analysisMetrics }: SupportingEvidenceProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Text Analysis": return <FileSearch className="h-4 w-4" />;
      case "Pattern Recognition": return <TrendingUp className="h-4 w-4" />;
      case "Standard Compliance": return <AlertCircle className="h-4 w-4" />;
      case "Risk Factor": return <AlertCircle className="h-4 w-4" />;
      default: return <FileSearch className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="h-5 w-5" />
          Supporting Evidence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis Metrics */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-xl font-bold truncate">{analysisMetrics.totalWords}</div>
            <div className="text-xs text-muted-foreground">Words</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold truncate">{analysisMetrics.keyPhrases}</div>
            <div className="text-xs text-muted-foreground">Phrases</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold truncate">{analysisMetrics.riskIndicators}</div>
            <div className="text-xs text-muted-foreground">Indicators</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold truncate">{analysisMetrics.confidenceScore}%</div>
            <div className="text-xs text-muted-foreground">Confidence</div>
          </div>
        </div>

        {/* Evidence Items */}
        <div className="space-y-4">
          <h4>Detailed Analysis</h4>
          {evidence.map((item) => (
            <div key={item.id} className="border rounded-lg p-3 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getTypeIcon(item.type)}
                  <span className="text-sm font-medium truncate">{item.type}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={`${getImpactColor(item.impact)} text-xs px-2 py-1 whitespace-nowrap`}>
                    {item.impact}
                  </Badge>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.confidence}%
                  </div>
                </div>
              </div>

              {item.excerpt && (
                <div className="bg-muted/30 border-l-4 border-muted-foreground/20 pl-4 py-2">
                  <Quote className="h-3 w-3 text-muted-foreground mb-1" />
                  <div className="text-sm italic text-muted-foreground">
                    "{item.excerpt}"
                  </div>
                </div>
              )}

              <p className="text-sm">{item.analysis}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}