import { Button } from "./ui/button";
import { RiskAssessment } from "./RiskAssessment";
import { ActionableInsights } from "./ActionableInsights";
import { SupportingEvidence } from "./SupportingEvidence";
import { RiskVisualization } from "./RiskVisualization";
import { ArrowLeft } from "lucide-react";

interface ResultsDashboardProps {
  caseText: string;
  onBack: () => void;
}

export function ResultsDashboard({ caseText, onBack }: ResultsDashboardProps) {
  // Mock data - in a real app, this would come from an API
  const mockResults = {
    riskScore: 65,
    riskLevel: "MODERATE" as const,
    keyFindings: [
      "Incomplete documentation of patient's cardiac history",
      "Delayed administration of thrombolytics",
      "Missing consent documentation for emergency procedure",
      "Insufficient monitoring post-procedure notes"
    ],
    recommendations: [
      {
        id: "1",
        priority: "HIGH" as const,
        category: "Documentation" as const,
        title: "Complete Missing Cardiac History",
        description: "Patient's previous cardiac events and medications are not fully documented, which could impact treatment decisions.",
        action: "Review and document complete cardiac history including previous MI, interventions, and current medications within 24 hours."
      },
      {
        id: "2",
        priority: "HIGH" as const,
        category: "Clinical Decision" as const,
        title: "Document Thrombolytic Decision Timeline",
        description: "The decision-making process and timing for thrombolytic therapy administration needs clearer documentation.",
        action: "Add detailed notes explaining the 45-minute delay and clinical rationale for treatment timing."
      },
      {
        id: "3",
        priority: "MEDIUM" as const,
        category: "Communication" as const,
        title: "Enhance Family Communication Record",
        description: "Documentation of family communication during emergency procedure is incomplete.",
        action: "Document all family communications and consent discussions, including verbal consent for emergency situation."
      },
      {
        id: "4",
        priority: "LOW" as const,
        category: "Follow-up" as const,
        title: "Schedule Comprehensive Follow-up",
        description: "Post-procedure follow-up planning could be more detailed and specific.",
        action: "Document specific follow-up timeline with cardiology and primary care within discharge planning."
      }
    ],
    evidence: [
      {
        id: "1",
        type: "Text Analysis" as const,
        excerpt: "History of diabetes and hypertension",
        analysis: "Incomplete cardiac risk factor documentation. Missing details about diabetes control, duration, and complications which are critical for malpractice risk assessment.",
        confidence: 85,
        impact: "High" as const
      },
      {
        id: "2",
        type: "Pattern Recognition" as const,
        excerpt: "Patient taken to cath lab for emergency PCI",
        analysis: "Standard of care met for STEMI management with timely PCI. However, documentation lacks door-to-balloon time which is a key quality metric.",
        confidence: 92,
        impact: "Medium" as const
      },
      {
        id: "3",
        type: "Standard Compliance" as const,
        excerpt: "Administered aspirin 325mg, started on heparin protocol",
        analysis: "Appropriate dual antiplatelet therapy initiated. Medications and dosages align with current guidelines for acute coronary syndrome management.",
        confidence: 95,
        impact: "Low" as const
      },
      {
        id: "4",
        type: "Risk Factor" as const,
        excerpt: "EKG showed ST elevations in leads II, III, aVF",
        analysis: "Clear documentation of inferior STEMI. EKG findings properly documented, but missing right-sided leads evaluation for posterior involvement.",
        confidence: 88,
        impact: "Medium" as const
      }
    ],
    analysisMetrics: {
      totalWords: 89,
      keyPhrases: 12,
      riskIndicators: 4,
      confidenceScore: 87
    },
    riskVisualizationData: [
      {
        category: "Documentation",
        risk: 75,
        impact: 85,
        confidence: 92,
        color: "rgba(239, 68, 68, 0.8)"
      },
      {
        category: "Clinical Decision",
        risk: 60,
        impact: 90,
        confidence: 88,
        color: "rgba(234, 179, 8, 0.8)"
      },
      {
        category: "Communication",
        risk: 45,
        impact: 70,
        confidence: 85,
        color: "rgba(34, 197, 94, 0.8)"
      },
      {
        category: "Follow-up",
        risk: 35,
        impact: 60,
        confidence: 80,
        color: "rgba(59, 130, 246, 0.8)"
      },
      {
        category: "Medication",
        risk: 25,
        impact: 95,
        confidence: 95,
        color: "rgba(168, 85, 247, 0.8)"
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          New Analysis
        </Button>
        <div>
          <h1>Risk Analysis Results</h1>
          <p className="text-muted-foreground">
            Analysis complete • {mockResults.analysisMetrics.totalWords} words processed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Column 1: Risk Assessment */}
        <div className="md:col-span-1">
          <RiskAssessment
            riskScore={mockResults.riskScore}
            riskLevel={mockResults.riskLevel}
            keyFindings={mockResults.keyFindings}
          />
        </div>

        {/* Column 2: Risk Visualization */}
        <div className="md:col-span-1">
          <RiskVisualization
            riskData={mockResults.riskVisualizationData}
            overallRisk={mockResults.riskScore}
          />
        </div>

        {/* Column 3: Actionable Insights */}
        <div className="md:col-span-1 xl:col-span-1">
          <ActionableInsights recommendations={mockResults.recommendations} />
        </div>

        {/* Column 4: Supporting Evidence */}
        <div className="md:col-span-1 xl:col-span-1">
          <SupportingEvidence
            evidence={mockResults.evidence}
            analysisMetrics={mockResults.analysisMetrics}
          />
        </div>
      </div>
    </div>
  );
}