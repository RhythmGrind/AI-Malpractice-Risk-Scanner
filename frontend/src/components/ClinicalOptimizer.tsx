import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Wand2, CheckCircle, Clock } from "lucide-react";

interface ClinicalOptimizerProps {
  originalText: string;
  onOptimized: (optimizedText: string) => void;
}

export function ClinicalOptimizer({ originalText, onOptimized }: ClinicalOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedText, setOptimizedText] = useState("");
  const [showResult, setShowResult] = useState(false);

  const optimizeText = async () => {
    if (!originalText.trim()) return;

    setIsOptimizing(true);
    setShowResult(false);

    // Simulate AI optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock optimization - Convert to more clinical language
    const optimized = enhanceClinicalLanguage(originalText);
    setOptimizedText(optimized);
    setIsOptimizing(false);
    setShowResult(true);
  };

  const enhanceClinicalLanguage = (text: string): string => {
    // Mock clinical optimization rules
    let enhanced = text
      // Standardize age presentation
      .replace(/(\d+)\s*y\/o/gi, '$1-year-old')
      .replace(/(\d+)\s*year\s*old/gi, '$1-year-old')
      
      // Standardize medical terms
      .replace(/heart attack/gi, 'myocardial infarction')
      .replace(/chest pain/gi, 'chest discomfort')
      .replace(/shortness of breath/gi, 'dyspnea')
      .replace(/difficulty breathing/gi, 'respiratory distress')
      .replace(/high blood pressure/gi, 'hypertension')
      .replace(/low blood pressure/gi, 'hypotension')
      .replace(/fast heart rate/gi, 'tachycardia')
      .replace(/slow heart rate/gi, 'bradycardia')
      
      // Standardize vital signs format
      .replace(/bp\s*(\d+\/\d+)/gi, 'Blood pressure $1 mmHg')
      .replace(/hr\s*(\d+)/gi, 'Heart rate $1 bpm')
      .replace(/temp\s*(\d+\.?\d*)/gi, 'Temperature $1°F')
      .replace(/o2\s*sat\s*(\d+)/gi, 'Oxygen saturation $1%')
      
      // Enhance presentation structure
      .replace(/^(.+?)presents/i, 'PATIENT PRESENTATION:\n$1 presents')
      .replace(/(history|pmh):\s*/gi, '\nPAST MEDICAL HISTORY:\n')
      .replace(/(medications|meds):\s*/gi, '\nCURRENT MEDICATIONS:\n')
      .replace(/(physical exam|examination):\s*/gi, '\nPHYSICAL EXAMINATION:\n')
      .replace(/(assessment|impression):\s*/gi, '\nCLINICAL ASSESSMENT:\n')
      .replace(/(plan|treatment):\s*/gi, '\nTREATMENT PLAN:\n');

    // Add clinical structure if missing
    if (!enhanced.includes('PATIENT PRESENTATION:')) {
      enhanced = 'PATIENT PRESENTATION:\n' + enhanced;
    }

    return enhanced;
  };

  const acceptOptimization = () => {
    onOptimized(optimizedText);
    setShowResult(false);
  };

  const getImprovements = () => {
    const improvements = [];
    if (originalText.includes('y/o') || originalText.includes('year old')) {
      improvements.push('Standardized age presentation');
    }
    if (originalText.match(/heart attack|chest pain|shortness of breath/i)) {
      improvements.push('Enhanced medical terminology');
    }
    if (originalText.match(/bp|hr|temp|o2/i)) {
      improvements.push('Formatted vital signs');
    }
    if (!originalText.includes('PATIENT PRESENTATION:')) {
      improvements.push('Added clinical structure');
    }
    return improvements;
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={optimizeText}
        disabled={!originalText.trim() || isOptimizing}
        variant="outline"
        className="w-full"
      >
        {isOptimizing ? (
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 animate-spin" />
            Optimizing Clinical Language...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Optimize Clinical Language
          </div>
        )}
      </Button>

      {showResult && (
        <div>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="text-green-800">Clinical Optimization Complete</h4>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-green-800">Improvements Made:</h5>
                  <div className="flex flex-wrap gap-1">
                    {getImprovements().map((improvement, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {improvement}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-green-200 rounded p-3 max-h-40 overflow-y-auto">
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {optimizedText}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={acceptOptimization}
                    size="sm"
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Use Optimized Text
                  </Button>
                  <Button 
                    onClick={() => setShowResult(false)}
                    variant="outline"
                    size="sm"
                  >
                    Keep Original
                  </Button>
                </div>

                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Clock className="h-3 w-3" />
                  <span>AI optimization completed in 2.1 seconds</span>
                </div>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}