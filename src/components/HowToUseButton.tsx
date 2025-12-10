import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowToUseButton = () => {
  return (
    <Button
      variant="outline"
      className="fixed bottom-6 right-6 gap-2 shadow-lg animate-pulse-glow"
      onClick={() => window.open("https://youtu.be/EnoznAs5O80", "_blank")}
    >
      <Youtube className="h-4 w-4" />
      How to use
    </Button>
  );
};

export default HowToUseButton;
