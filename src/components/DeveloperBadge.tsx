import { User } from "lucide-react";

const DeveloperBadge = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-4 bg-card border border-border rounded-lg px-4 py-3 shadow-lg">
        <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center ring-1 ring-[#0ea5a4]/20">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">HOW TO USE</span>
        </div>
      </div>
    </div>
  );
};

export default DeveloperBadge;