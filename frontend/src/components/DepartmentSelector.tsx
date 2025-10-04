import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Heart, 
  Brain, 
  Stethoscope, 
  Bone, 
  Eye, 
  Baby, 
  Activity, 
  Scissors,
  UserCheck,
  Zap
} from "lucide-react";

const departments = [
  { id: "cardiology", name: "Cardiology", icon: Heart, color: "bg-red-100 text-red-800 border-red-200" },
  { id: "neurology", name: "Neurology", icon: Brain, color: "bg-purple-100 text-purple-800 border-purple-200" },
  { id: "internal", name: "Internal Medicine", icon: Stethoscope, color: "bg-blue-100 text-blue-800 border-blue-200" },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, color: "bg-gray-100 text-gray-800 border-gray-200" },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, color: "bg-green-100 text-green-800 border-green-200" },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, color: "bg-pink-100 text-pink-800 border-pink-200" },
  { id: "emergency", name: "Emergency Medicine", icon: Activity, color: "bg-orange-100 text-orange-800 border-orange-200" },
  { id: "surgery", name: "General Surgery", icon: Scissors, color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { id: "anesthesiology", name: "Anesthesiology", icon: Zap, color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { id: "psychiatry", name: "Psychiatry", icon: UserCheck, color: "bg-teal-100 text-teal-800 border-teal-200" }
];

interface DepartmentSelectorProps {
  selectedDepartment: string | null;
  onSelect: (departmentId: string) => void;
}

export function DepartmentSelector({ selectedDepartment, onSelect }: DepartmentSelectorProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4">Select Department/Specialty</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {departments.map((dept) => {
            const Icon = dept.icon;
            const isSelected = selectedDepartment === dept.id;
            
            return (
              <button
                key={dept.id}
                onClick={() => onSelect(dept.id)}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-muted hover:border-primary/30'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-full ${dept.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-center">{dept.name}</span>
                  {isSelected && (
                    <Badge variant="default" className="text-xs">Selected</Badge>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}