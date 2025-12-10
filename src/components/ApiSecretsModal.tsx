import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const providers = [
  { id: "google", name: "Google Gemini" },
  { id: "mistral", name: "Mistral" },
  { id: "openai", name: "OpenAI" },
  { id: "openrouter", name: "OpenRouter" },
];

const providerUrls: Record<string, string> = {
  google: "https://aistudio.google.com/app/apikey",
  mistral: "https://console.mistral.ai/api-keys/",
  openai: "https://platform.openai.com/api-keys",
  openrouter: "https://openrouter.ai/keys",
};

export default function ApiSecretsModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(providers[0].id);
  const [apiKey, setApiKey] = useState("");
  const [stored, setStored] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const data: Record<string, string[]> = {};
    providers.forEach((p) => {
      try {
        const v = localStorage.getItem(`apiKeys:${p.id}`);
        data[p.id] = v ? JSON.parse(v) : [];
      } catch {
        data[p.id] = [];
      }
    });
    setStored(data);
  }, []);

  const saveKey = () => {
    const next = [...(stored[selected] || []), apiKey].filter(Boolean);
    const copy = { ...stored, [selected]: next };
    localStorage.setItem(`apiKeys:${selected}`, JSON.stringify(next));
    setStored(copy);
    setApiKey("");
  };

  const deleteKey = (index: number) => {
    const next = (stored[selected] || []).filter((_, i) => i !== index);
    const copy = { ...stored, [selected]: next };
    localStorage.setItem(`apiKeys:${selected}`, JSON.stringify(next));
    setStored(copy);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          API Secrets
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[92vw] max-w-none h-[calc(100vh-4rem)] overflow-hidden p-6">
        <DialogHeader>
          <DialogTitle>API Secrets Management</DialogTitle>
          <DialogDescription>Manage your AI provider API keys. Keys are stored locally and securely.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-7 space-y-4">
            <label className="text-sm text-muted-foreground">Select AI Provider</label>
            <div className="flex gap-2">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`px-3 py-1 rounded-md text-sm ${selected === p.id ? "bg-cyan-500 text-black" : "bg-[#0b1013] text-muted-foreground"}`}>
                  {p.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 items-start">
              <div>
                <label className="text-sm text-muted-foreground">Model</label>
                <Select value="" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select model</SelectItem>
                  </SelectContent>
                </Select>

                <label className="text-sm text-muted-foreground mt-4 block">API Key</label>
                <div className="flex gap-2">
                  <Input placeholder="Enter key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                  <Button onClick={saveKey}>Save</Button>
                </div>

                <a className="text-cyan-400 underline text-sm mt-2 inline-block" href={providerUrls[selected]} target="_blank" rel="noreferrer">Get {providers.find(p=>p.id===selected)?.name} API Key</a>
              </div>

              <div className="col-span-1">
                <div className="border border-border rounded-md p-4 h-full">
                  <div className="text-sm font-medium mb-2">Stored Keys ({(stored[selected] || []).length})</div>
                  <div className="text-sm text-muted-foreground">
                    {(stored[selected] || []).length === 0 ? (
                      <span>No keys stored yet</span>
                    ) : (
                      <ul className="space-y-2">
                        {(stored[selected] || []).map((k, i) => (
                          <li key={i} className="flex justify-between items-center">
                            <span className="truncate max-w-[150px]">{k}</span>
                            <button className="text-xs text-red-400" onClick={() => deleteKey(i)}>Delete</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-5">
            {/* Right column can hold help/links or details */}
            <div className="border border-border rounded-md p-4 h-full">
              <div className="text-sm font-medium mb-2">Quick Links</div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  <a className="text-cyan-400 underline" href={providerUrls.openrouter} target="_blank" rel="noreferrer">OpenRouter - Get OpenRouter API Key</a>
                </li>
                <li>
                  <a className="text-cyan-400 underline" href={providerUrls.openai} target="_blank" rel="noreferrer">OpenAI - Get API Key</a>
                </li>
                <li>
                  <a className="text-cyan-400 underline" href={providerUrls.google} target="_blank" rel="noreferrer">Google - Get API Key</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
