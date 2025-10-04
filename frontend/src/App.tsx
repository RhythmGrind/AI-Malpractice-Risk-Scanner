import { useState } from "react";
import { TestModeBanner } from "./components/TestModeBanner";
import { InputForm } from "./components/InputForm";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { StreamingAnalysis } from "./components/StreamingAnalysis";

export default function App() {
  const [currentView, setCurrentView] = useState<"input" | "analyzing" | "results">("input");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentCaseText, setCurrentCaseText] = useState("");

  const handleAnalyze = async (text: string, department: string | null) => {
    setIsAnalyzing(true);
    setCurrentCaseText(text);
    setCurrentView("analyzing");
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setCurrentView("results");
  };

  const handleBack = () => {
    setCurrentView("input");
    setCurrentCaseText("");
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <TestModeBanner />
        
        {currentView === "input" && (
          <InputForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        )}
        
        {currentView === "analyzing" && (
          <StreamingAnalysis 
            isVisible={true} 
            onComplete={handleAnalysisComplete}
          />
        )}
        
        {currentView === "results" && (
          <ResultsDashboard caseText={currentCaseText} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}