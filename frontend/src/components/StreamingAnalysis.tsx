import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Brain, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StreamingStep {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "pending" | "processing" | "complete";
  icon: React.ReactNode;
  duration: number;
}

interface StreamingAnalysisProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function StreamingAnalysis({ isVisible, onComplete }: StreamingAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<StreamingStep[]>([
    {
      id: "text-parsing",
      title: "Text Analysis & Parsing",
      description: "Extracting medical terminology and clinical context...",
      progress: 0,
      status: "pending",
      icon: <Brain className="h-4 w-4" />,
      duration: 1500
    },
    {
      id: "risk-detection",
      title: "Risk Pattern Recognition",
      description: "Analyzing for malpractice risk indicators using ML models...",
      progress: 0,
      status: "pending",
      icon: <AlertTriangle className="h-4 w-4" />,
      duration: 2000
    },
    {
      id: "guideline-check",
      title: "Medical Guideline Validation",
      description: "Cross-referencing with current medical standards...",
      progress: 0,
      status: "pending",
      icon: <CheckCircle className="h-4 w-4" />,
      duration: 1800
    },
    {
      id: "report-generation",
      title: "Generating Comprehensive Report",
      description: "Compiling insights and actionable recommendations...",
      progress: 0,
      status: "pending",
      icon: <Zap className="h-4 w-4" />,
      duration: 1200
    }
  ]);

  useEffect(() => {
    if (!isVisible) return;

    const processStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setTimeout(onComplete, 500);
        return;
      }

      // Mark current step as processing
      setSteps(prev => 
        prev.map((step, index) => 
          index === stepIndex 
            ? { ...step, status: "processing" as const }
            : step
        )
      );

      // Animate progress
      const duration = steps[stepIndex].duration;
      const intervalTime = 50;
      const totalIntervals = duration / intervalTime;
      let currentInterval = 0;

      const progressInterval = setInterval(() => {
        currentInterval++;
        const progress = (currentInterval / totalIntervals) * 100;

        setSteps(prev => 
          prev.map((step, index) => 
            index === stepIndex 
              ? { ...step, progress: Math.min(progress, 100) }
              : step
          )
        );

        if (currentInterval >= totalIntervals) {
          clearInterval(progressInterval);
          
          // Mark as complete
          setSteps(prev => 
            prev.map((step, index) => 
              index === stepIndex 
                ? { ...step, status: "complete" as const, progress: 100 }
                : step
            )
          );

          // Move to next step
          setTimeout(() => {
            setCurrentStep(stepIndex + 1);
            processStep(stepIndex + 1);
          }, 300);
        }
      }, intervalTime);
    };

    // Start processing
    setCurrentStep(0);
    processStep(0);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-600";
      case "processing": return "bg-blue-100 text-blue-600";
      case "complete": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-5 w-5 text-primary" />
            </motion.div>
            AI Analysis in Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                step.status === "processing" 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : step.status === "complete"
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={step.status === "processing" ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={`p-2 rounded-full ${getStatusColor(step.status)}`}
                >
                  {step.icon}
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <Badge variant={step.status === "complete" ? "default" : "secondary"}>
                  {step.status === "complete" ? "Complete" : 
                   step.status === "processing" ? "Processing" : "Pending"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(step.progress)}%</span>
                </div>
                <Progress 
                  value={step.progress} 
                  className="h-2"
                />
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center pt-4"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex gap-1"
              >
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="w-2 h-2 bg-primary rounded-full" />
              </motion.div>
              <span>Powered by Advanced AI Models</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}