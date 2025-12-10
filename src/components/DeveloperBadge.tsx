import { User } from "lucide-react";

const DeveloperBadge = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-lg">
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Developed By</span>
          <span className="text-sm font-medium text-primary">Mazharul Islam</span>
        </div>
      </div>
    </div>
  );
};

export default DeveloperBadge;