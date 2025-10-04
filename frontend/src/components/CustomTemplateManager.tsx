import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Plus, Edit, Trash2, Save, FileText, Clock } from "lucide-react";

interface CustomTemplate {
  id: string;
  title: string;
  department: string;
  complexity: "Simple" | "Moderate" | "Complex";
  estimatedTime: string;
  description: string;
  template: string;
  createdAt: string;
  isCustom: true;
}

interface CustomTemplateManagerProps {
  selectedDepartment: string | null;
  onSelectTemplate: (template: string) => void;
}

const departments = [
  { id: "cardiology", name: "Cardiology" },
  { id: "neurology", name: "Neurology" },
  { id: "internal", name: "Internal Medicine" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "ophthalmology", name: "Ophthalmology" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "emergency", name: "Emergency Medicine" },
  { id: "surgery", name: "General Surgery" },
  { id: "anesthesiology", name: "Anesthesiology" },
  { id: "psychiatry", name: "Psychiatry" }
];

export function CustomTemplateManager({ selectedDepartment, onSelectTemplate }: CustomTemplateManagerProps) {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    department: selectedDepartment || "",
    complexity: "Simple" as const,
    estimatedTime: "",
    description: "",
    template: ""
  });

  // Load custom templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customTemplates");
    if (saved) {
      try {
        setCustomTemplates(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading custom templates:", error);
      }
    }
  }, []);

  // Save to localStorage whenever templates change
  useEffect(() => {
    localStorage.setItem("customTemplates", JSON.stringify(customTemplates));
  }, [customTemplates]);

  // Update form department when selectedDepartment changes
  useEffect(() => {
    if (selectedDepartment && !editingTemplate) {
      setFormData(prev => ({ ...prev, department: selectedDepartment }));
    }
  }, [selectedDepartment, editingTemplate]);

  const filteredTemplates = selectedDepartment 
    ? customTemplates.filter(t => t.department === selectedDepartment)
    : customTemplates;

  const handleCreateTemplate = () => {
    if (!formData.title || !formData.department || !formData.template) return;

    const newTemplate: CustomTemplate = {
      id: `custom-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      isCustom: true
    };

    setCustomTemplates(prev => [...prev, newTemplate]);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleEditTemplate = (template: CustomTemplate) => {
    setEditingTemplate(template);
    setFormData({
      title: template.title,
      department: template.department,
      complexity: template.complexity,
      estimatedTime: template.estimatedTime,
      description: template.description,
      template: template.template
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate || !formData.title || !formData.department || !formData.template) return;

    setCustomTemplates(prev => 
      prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...formData }
          : t
      )
    );
    resetForm();
    setIsCreateDialogOpen(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== id));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department: selectedDepartment || "",
      complexity: "Simple",
      estimatedTime: "",
      description: "",
      template: ""
    });
    setEditingTemplate(null);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple": return "bg-green-100 text-green-800 border-green-200";
      case "Moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Complex": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            My Custom Templates
            {selectedDepartment && (
              <Badge variant="secondary" className="ml-2">
                {filteredTemplates.length} templates
              </Badge>
            )}
          </CardTitle>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? "Edit Template" : "Create Custom Template"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Template Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Custom Cardiology Case"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Department</label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Complexity</label>
                    <Select 
                      value={formData.complexity} 
                      onValueChange={(value: "Simple" | "Moderate" | "Complex") => 
                        setFormData(prev => ({ ...prev, complexity: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Simple">Simple</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Complex">Complex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Estimated Time</label>
                    <Input
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                      placeholder="e.g., 3-5 min"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the case template"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Template Content</label>
                  <Textarea
                    value={formData.template}
                    onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                    placeholder="Enter your clinical case template with [placeholders] for variables..."
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use [brackets] for placeholder variables, e.g., [age], [gender], [symptoms]
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                    disabled={!formData.title || !formData.department || !formData.template}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingTemplate ? "Update Template" : "Create Template"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="mb-2">No Custom Templates</h4>
            <p className="text-muted-foreground mb-4">
              {selectedDepartment 
                ? `Create your first custom template for ${departments.find(d => d.id === selectedDepartment)?.name || 'this department'}`
                : "Select a department and create your first custom template"
              }
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-4 space-y-3"
            >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{template.title}</h4>
                      <Badge variant="outline" className="text-xs">Custom</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getComplexityColor(template.complexity)} text-xs px-2 py-1`}>
                      {template.complexity}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.estimatedTime}
                  </div>
                  <div className="text-xs">
                    Created {new Date(template.createdAt).toLocaleDateString()}
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
          ))
        )}
      </CardContent>
    </Card>
  );
}