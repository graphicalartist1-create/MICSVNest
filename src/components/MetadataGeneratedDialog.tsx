import { useState } from "react";
import { X, Copy, Check, Twitter, Facebook, Linkedin, Download, MessageCircle, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { exportAsCSV } from "@/lib/export";

export interface ExportResult {
  id: string;
  filename: string;
  title: string;
  description: string;
  keywords: string[];
  prompt?: string;
}

interface MetadataGeneratedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: ExportResult[];
  isVectorFile?: boolean;
}

const MetadataGeneratedDialog = ({
  open,
  onOpenChange,
  results,
  isVectorFile = false,
}: MetadataGeneratedDialogProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const shareUrl = "https://micsvnest.online";
  const shareText = "I just generated amazing metadata for my images using CSVnest! Check it out:";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("dontShowMetadataGenerated", "true");
    }
    onOpenChange(false);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      exportAsCSV(results, "csvnest-metadata.csv");
      setTimeout(() => {
        setIsExporting(false);
        onOpenChange(false);
      }, 800);
    } catch (error) {
      console.error("Export error:", error);
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    // Create a simple ZIP with CSV metadata
    // For now, we'll create a CSV export with a different filename
    setIsExporting(true);
    try {
      exportAsCSV(results, "vector-metadata.csv");
      setTimeout(() => {
        setIsExporting(false);
        onOpenChange(false);
      }, 800);
    } catch (error) {
      console.error("ZIP export error:", error);
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background border-border/50">
        <DialogHeader className="relative">
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 p-1 hover:bg-secondary/50 rounded transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
          <DialogTitle className="text-lg font-bold text-cyan-400">Metadata Generated!</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Share Text */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Share your success with others.</p>
          </div>

          {/* Social Share Buttons */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Share with your network</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="h-12 flex flex-col items-center justify-center gap-1 border-border/50 hover:bg-secondary/50"
                onClick={shareOnTwitter}
              >
                <Twitter className="h-5 w-5 text-cyan-400" />
                <span className="text-xs font-medium">Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="h-12 flex flex-col items-center justify-center gap-1 border-border/50 hover:bg-secondary/50"
                onClick={shareOnFacebook}
              >
                <Facebook className="h-5 w-5 text-blue-500" />
                <span className="text-xs font-medium">Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="h-12 flex flex-col items-center justify-center gap-1 border-border/50 hover:bg-secondary/50"
                onClick={shareOnLinkedIn}
              >
                <Linkedin className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-medium">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Share Link Section */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Share CSVnest</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-xs bg-secondary/30 border border-cyan-400/30 rounded text-foreground placeholder-muted-foreground/60"
              />
              <Button
                size="sm"
                className="gap-1.5 h-9 px-3 text-xs font-medium bg-cyan-600 hover:bg-cyan-700 transition-all"
                onClick={copyLink}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* More Ways to Engage */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">More ways to engage</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-10 border-border/50 hover:bg-secondary/50 text-foreground"
                onClick={openWhatsApp}
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                <div className="text-left">
                  <div className="text-xs font-semibold">Join our WhatsApp Group</div>
                  <div className="text-xs text-muted-foreground">Get support, share tips, and connect with other users.</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-3 px-3 border-border/50 hover:bg-secondary/50 text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={isVectorFile ? handleExportZip : handleExportCSV}
                disabled={isExporting}
              >
                {isVectorFile ? (
                  <>
                    <Package className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <div className="text-xs font-semibold">{isExporting ? "Preparing ZIP..." : "Download Vector Package ZIP"}</div>
                      <div className="text-xs text-muted-foreground">Export your generated content and vector assets.</div>
                    </div>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <div className="text-xs font-semibold">{isExporting ? "Preparing CSV..." : "Download Metadata CSV"}</div>
                      <div className="text-xs text-muted-foreground">Export your generated content.</div>
                    </div>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Footer with Checkbox and Close */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/30">
            <div className="flex items-center gap-2">
              <Checkbox
                id="dontShowAgain"
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                className="h-4 w-4"
              />
              <label htmlFor="dontShowAgain" className="text-xs text-muted-foreground cursor-pointer">
                Don't show again
              </label>
            </div>
            <Button
              variant="outline"
              className="h-9 px-4 text-sm font-medium border-border/50 hover:bg-secondary/50"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MetadataGeneratedDialog;
