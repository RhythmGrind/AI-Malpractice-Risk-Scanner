import { Alert, AlertDescription } from "./ui/alert";
import { TestTube } from "lucide-react";

export function TestModeBanner() {
  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800 mb-6">
      <TestTube className="h-4 w-4" />
      <AlertDescription>
        <span className="font-medium">Test Mode:</span> The backend API is not available. Displaying mock data.
      </AlertDescription>
    </Alert>
  );
}