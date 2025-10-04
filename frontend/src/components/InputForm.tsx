import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { DepartmentSelector } from "./DepartmentSelector";
import { CaseTemplates } from "./CaseTemplates";
import { VoiceInput } from "./VoiceInput";
import { ClinicalOptimizer } from "./ClinicalOptimizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FileText, Edit3, Zap, Mic } from "lucide-react";

interface InputFormProps {
  onAnalyze: (text: string, department: string | null) => void;
  isAnalyzing: boolean;
}

export function InputForm({ onAnalyze, isAnalyzing }: InputFormProps) {
  const [caseText, setCaseText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("templates");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (caseText.trim()) {
      onAnalyze(caseText, selectedDepartment);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setCaseText(template);
    setActiveTab("write");
  };

  const placeholderText = selectedDepartment 
    ? `Enter your clinical case description here or select a template from the Templates tab...` 
    : `Select a department above, then choose a template or write your case description...`;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="mb-4 flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          AI Malpractice Risk Scanner
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Analyze clinical notes to identify potential malpractice risks. Select your specialty, 
          choose a template, or write your own case description.
        </p>
      </div>

      <div className="space-y-6">
        {/* Department Selection */}
        <DepartmentSelector 
          selectedDepartment={selectedDepartment}
          onSelect={setSelectedDepartment}
        />

        {/* Main Input Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="write" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Write Case
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice Input
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-6">
            <CaseTemplates 
              selectedDepartment={selectedDepartment}
              onSelectTemplate={handleTemplateSelect}
            />
          </TabsContent>

          <TabsContent value="voice" className="mt-6">
            <VoiceInput 
              onTranscript={(text) => setCaseText(prev => prev + " " + text)}
              isDisabled={isAnalyzing}
            />
          </TabsContent>

          <TabsContent value="write" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label htmlFor="case-description" className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4" />
                        Clinical Case Description
                      </label>
                      {caseText && (
                        <div className="text-sm text-muted-foreground">
                          {caseText.length} characters
                        </div>
                      )}
                    </div>
                    <Textarea
                      id="case-description"
                      placeholder={placeholderText}
                      value={caseText}
                      onChange={(e) => setCaseText(e.target.value)}
                      className="min-h-[400px] resize-none"
                      disabled={isAnalyzing}
                    />
                  </div>

                  {/* Clinical Language Optimizer */}
                  <div>
                    <ClinicalOptimizer
                      originalText={caseText}
                      onOptimized={setCaseText}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {selectedDepartment ? (
                        <span className="capitalize">Department: {selectedDepartment}</span>
                      ) : (
                        "No department selected"
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setCaseText("")}
                        disabled={isAnalyzing || !caseText}
                      >
                        Clear
                      </Button>
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={!caseText.trim() || isAnalyzing}
                        className="px-8"
                      >
                        {isAnalyzing ? "Analyzing Case..." : "Analyze Case"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}