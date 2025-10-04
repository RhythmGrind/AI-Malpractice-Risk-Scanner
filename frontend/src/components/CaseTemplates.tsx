import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FileText, Clock, AlertTriangle, Star, User } from "lucide-react";
import { CustomTemplateManager } from "./CustomTemplateManager";

interface CaseTemplate {
  id: string;
  title: string;
  department: string;
  complexity: "Simple" | "Moderate" | "Complex";
  estimatedTime: string;
  description: string;
  template: string;
}

const templates: CaseTemplate[] = [
  {
    id: "cardiology-mi",
    title: "Acute Myocardial Infarction",
    department: "cardiology",
    complexity: "Complex",
    estimatedTime: "5-7 min",
    description: "STEMI presentation with emergency intervention",
    template: `Chief Complaint: Chest pain for 2 hours

History of Present Illness: 
[Age]-year-old [gender] with past medical history of [relevant conditions] presents to ED with acute onset chest pain. Pain described as [character], [severity]/10, radiating to [location]. Associated symptoms include [symptoms]. Pain started at [time] while [activity].

Past Medical History: [Diabetes, Hypertension, Hyperlipidemia, Prior MI, etc.]

Medications: [Current medications]

Physical Examination:
- Vital Signs: BP [value], HR [value], RR [value], O2 sat [value]%, Temp [value]
- General: [appearance]
- Cardiovascular: [heart sounds, murmurs, peripheral pulses]
- Pulmonary: [lung sounds]

Diagnostic Studies:
- EKG: [findings - leads, ST changes, etc.]
- Laboratory: [Troponin levels, CBC, BMP, PT/PTT, etc.]
- Imaging: [Chest X-ray, Echo findings if obtained]

Assessment and Plan:
- Impression: [Primary diagnosis]
- Treatment: [Medications given, procedures performed]
- Disposition: [Admitted to, consultation requested]
- Monitoring: [Vital signs frequency, telemetry, etc.]`
  },
  {
    id: "emergency-trauma",
    title: "Multi-Trauma Patient",
    department: "emergency",
    complexity: "Complex",
    estimatedTime: "7-10 min",
    description: "Major trauma with multiple system involvement",
    template: `Chief Complaint: Motor vehicle collision with multiple injuries

Mechanism of Injury: [Description of accident/trauma mechanism]

Primary Survey (ABCDE):
- Airway: [Patent/compromised, interventions]
- Breathing: [Respiratory status, chest rise, sounds]
- Circulation: [Pulse, blood pressure, signs of shock]
- Disability: [Neurological assessment, GCS score]
- Exposure: [External injuries noted]

Secondary Survey:
- Head: [Pupils, cranial nerves, scalp lacerations]
- Neck: [C-spine precautions, tracheal position]
- Chest: [Inspection, palpation, percussion, auscultation]
- Abdomen: [Distension, tenderness, bowel sounds]
- Extremities: [Deformities, pulses, sensation, movement]

Vital Signs: BP [value], HR [value], RR [value], O2 sat [value]%, GCS [score]

Diagnostic Studies:
- CT Head/C-spine/Chest/Abdomen-Pelvis: [Findings]
- Laboratory: [CBC, BMP, Coags, Type & Screen, ABG]
- X-rays: [Chest, pelvis, extremities as indicated]

Interventions:
- IV access: [Number and size of IVs]
- Fluid resuscitation: [Type and amount]
- Blood products: [If transfused]
- Procedures: [Intubation, chest tube, etc.]

Disposition: [Admitted to trauma surgery, transferred to OR, etc.]`
  },
  {
    id: "surgery-appendectomy",
    title: "Acute Appendicitis",
    department: "surgery",
    complexity: "Moderate",
    estimatedTime: "3-5 min",
    description: "Surgical case with pre/post-operative care",
    template: `Preoperative Note:

Chief Complaint: Abdominal pain for [duration]

History: [Age]-year-old [gender] presents with [onset] abdominal pain, initially [location] then migrating to right lower quadrant. Associated with [nausea/vomiting/fever/anorexia]. No recent travel, sick contacts, or dietary indiscretion.

Physical Examination:
- Vital Signs: [Temperature, BP, HR, RR]
- Abdomen: [Inspection, auscultation, palpation findings]
- McBurney's point tenderness: [Present/absent]
- Rovsing's sign: [Positive/negative]
- Psoas sign: [Positive/negative]

Diagnostic Studies:
- Laboratory: WBC [value], Left shift [yes/no], CRP [value]
- Imaging: CT abdomen/pelvis - [findings]

Assessment: Acute appendicitis

Plan: Laparoscopic appendectomy

Operative Note:
- Procedure: [Laparoscopic/Open] appendectomy
- Findings: [Appendix appearance, perforation, abscess]
- Technique: [Port placement, dissection method]
- Specimens: [Appendix sent to pathology]
- Complications: [None/specify]

Postoperative Orders:
- Diet: [NPO initially, advance as tolerated]
- Activity: [Ambulate POD #0]
- Medications: [Pain control, antibiotics if indicated]
- Monitoring: [Vital signs, wound checks]`
  },
  {
    id: "pediatrics-fever",
    title: "Pediatric Febrile Illness",
    department: "pediatrics",
    complexity: "Simple",
    estimatedTime: "2-3 min",
    description: "Common pediatric presentation requiring careful evaluation",
    template: `Chief Complaint: Fever for [duration] in [age] [month/year] old

History of Present Illness:
[Age] [gender] presents with fever up to [temperature]°F for [duration]. Associated symptoms include [irritability/poor feeding/rash/respiratory symptoms/GI symptoms]. No recent immunizations, travel, or sick contacts. Parents report [behavior changes/appetite changes].

Past Medical History: [Birth history, prior hospitalizations, chronic conditions]
Immunizations: [Up to date/specify if delayed]
Family History: [Relevant family history]
Social History: [Daycare attendance, siblings, pets]

Physical Examination:
- Vital Signs: Temp [value]°F, HR [value], RR [value], BP [value], O2 sat [value]%
- General Appearance: [Alert/lethargic/toxic appearing]
- HEENT: [Fontanelle if applicable, ears, throat, neck]
- Cardiovascular: [Heart rate, rhythm, murmurs, perfusion]
- Pulmonary: [Work of breathing, lung sounds]
- Abdomen: [Distension, tenderness, organomegaly]
- Extremities: [Perfusion, rashes, joint swelling]
- Neurologic: [Activity level, reflexes, tone]
- Skin: [Rashes, petechiae, capillary refill]

Diagnostic Studies:
- [Specify if obtained: CBC with diff, blood culture, urine analysis/culture, CXR]

Assessment: [Age] with fever - [working diagnosis]

Plan:
- [Symptomatic treatment/antibiotics/further workup]
- [Discharge home with precautions/admission]
- [Follow-up instructions]
- [Return precautions discussed with parents]`
  },
  {
    id: "neurology-stroke",
    title: "Acute Stroke Evaluation",
    department: "neurology",
    complexity: "Complex",
    estimatedTime: "5-8 min",
    description: "Time-sensitive neurological emergency",
    template: `Chief Complaint: Sudden onset neurological symptoms

History of Present Illness:
[Age]-year-old [gender] with past medical history of [risk factors] presents with acute onset [symptoms] at [time]. Last known well at [time]. Symptoms include [weakness/speech changes/vision changes/confusion]. [Witnessed/unwitnessed]. No head trauma.

NIHSS Score: [Calculate and document]

Past Medical History: [Atrial fibrillation, hypertension, diabetes, prior stroke/TIA, etc.]
Medications: [Anticoagulants, antiplatelets, antihypertensives]
Social History: [Smoking, alcohol use]

Physical Examination:
- Vital Signs: BP [value], HR [value], RR [value], O2 sat [value]%, Glucose [value]
- General: [Level of consciousness]
- Neurological:
  * Mental Status: [Orientation, attention, language]
  * Cranial Nerves: [Visual fields, extraocular movements, facial symmetry, speech]
  * Motor: [Strength testing by extremity]
  * Sensory: [Light touch, proprioception]
  * Coordination: [Finger-to-nose, heel-to-shin]
  * Gait: [If able to assess]
  * Reflexes: [Deep tendon reflexes, Babinski]

Diagnostic Studies:
- CT Head (non-contrast): [Findings - hemorrhage/early ischemic changes]
- Laboratory: [CBC, BMP, PT/PTT/INR, Glucose]
- EKG: [Rhythm, evidence of MI]
- Time metrics: [Symptom onset, door time, CT time]

Assessment: Acute [ischemic/hemorrhagic] stroke

Plan:
- [tPA candidate assessment if within window]
- [Neurology/stroke team consultation]
- [Admission to stroke unit/ICU]
- [Monitoring parameters]
- [Secondary prevention measures]`
  }
];

interface CaseTemplatesProps {
  selectedDepartment: string | null;
  onSelectTemplate: (template: string) => void;
}

export function CaseTemplates({ selectedDepartment, onSelectTemplate }: CaseTemplatesProps) {
  const filteredTemplates = selectedDepartment 
    ? templates.filter(t => t.department === selectedDepartment)
    : templates;

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple": return "bg-green-100 text-green-800 border-green-200";
      case "Moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Complex": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Tabs defaultValue="built-in" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="built-in" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Built-in Templates
        </TabsTrigger>
        <TabsTrigger value="custom" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          My Templates
        </TabsTrigger>
      </TabsList>

      <TabsContent value="built-in" className="mt-4">
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="mb-2">No Built-in Templates</h3>
              <p className="text-muted-foreground">
                Select a department above to see relevant case templates.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Built-in Case Templates
                {selectedDepartment && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredTemplates.length} available
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{template.title}</h4>
                        <Badge variant="secondary" className="text-xs">Built-in</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getComplexityColor(template.complexity)} text-xs px-2 py-1`}>
                        {template.complexity}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {template.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {template.complexity} case
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelectTemplate(template.template)}
                    className="w-full"
                  >
                    Use This Template
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="custom" className="mt-4">
        <CustomTemplateManager 
          selectedDepartment={selectedDepartment}
          onSelectTemplate={onSelectTemplate}
        />
      </TabsContent>
    </Tabs>
  );
}