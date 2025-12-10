import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const providers = [
  { id: "google", name: "Google Gemini", hint: "Aiza...", badge: null },
  { id: "mistral", name: "Mistral AI", hint: "32-33 chars", badge: "Paid" },
  { id: "openai", name: "OpenAI", hint: "sk-...", badge: "Paid" },
  { id: "openrouter", name: "OpenRouter", hint: "sk-or-...", badge: "Paid & Free" },
];

const ApiSecretsModal: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          API Secrets
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Secrets Management</DialogTitle>
          <DialogDescription>Manage your AI provider API keys. Keys are stored locally and securely.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm mb-2">Select AI Provider</p>
            <div className="flex gap-3 flex-wrap">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border transition ${selected === p.id ? "bg-cyan-500 text-black" : "bg-[#0b1013] border-[#232b30] text-muted-foreground"}`}>
                  <span className="h-5 w-5 rounded-sm bg-[#0b1013] flex items-center justify-center text-xs">{p.name.split(' ')[0][0]}</span>
                  <span className="text-sm">{p.name}</span>
                  {p.badge && <span className="ml-2 text-xs bg-orange-500 rounded-full px-2 py-0.5">{p.badge}</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm mb-2">Stored Keys {selected ? `(${selected})` : ""}</p>
            <div className="h-40 rounded-md border border-border bg-card flex items-center justify-center text-muted-foreground">
              {selected ? (
                <div className="p-4 text-sm">
                  <p className="font-medium mb-2">{providers.find((x) => x.id === selected)?.name} Configuration</p>
                  <p className="text-xs text-muted-foreground">Add API keys using the form on the left (placeholder).</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a provider to view/add keys.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiSecretsModal;
