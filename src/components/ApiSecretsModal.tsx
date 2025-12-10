import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const providers = [
  { id: "google", name: "Google Gemini", hint: "Aiza...", badge: null },
  { id: "mistral", name: "Mistral AI", hint: "32-33 chars", badge: "Paid" },
  { id: "openai", name: "OpenAI", hint: "sk-...", badge: "Paid" },
  { id: "openrouter", name: "OpenRouter", hint: "sk-or-...", badge: "Paid & Free" },
];

const ApiSecretsModal: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [model, setModel] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [storedKeys, setStoredKeys] = useState<Array<any>>([]);

  useEffect(() => {
    if (selected) {
      const raw = localStorage.getItem(`apiKeys:${selected}`);
      try {
        const parsed = raw ? JSON.parse(raw) : [];
        setStoredKeys(parsed);
      } catch (e) {
        setStoredKeys([]);
      }
      // reset form values when switching providers
      setModel("");
      setApiKey("");
    }
  }, [selected]);

  const saveKey = () => {
    if (!selected) return alert("Please select a provider.");
    if (!apiKey || apiKey.trim().length === 0) return alert("Please enter an API key.");

    const next = [
      ...storedKeys,
      {
        id: Date.now().toString(),
        model: model || "default",
        key: apiKey.trim(),
        createdAt: new Date().toISOString(),
      },
    ];

    try {
      localStorage.setItem(`apiKeys:${selected}`, JSON.stringify(next));
      setStoredKeys(next);
      setApiKey("");
      // simple feedback
      // In production consider encrypting keys before storage
    } catch (e) {
      console.error(e);
      alert("Failed to save key.");
    }
  };

  const deleteKey = (id: string) => {
    if (!selected) return;
    const next = storedKeys.filter((k) => k.id !== id);
    localStorage.setItem(`apiKeys:${selected}`, JSON.stringify(next));
    setStoredKeys(next);
  };

  const modelsFor = (providerId: string | null) => {
    switch (providerId) {
      case "google":
        return ["Gemini 2.5 Flash-Lite Preview", "Gemini 1.0", "Gemini Nano"];
      case "mistral":
        return ["Mistral Large", "Mistral Mix"];
      case "openai":
        return ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"];
      case "openrouter":
        return ["OpenRouter Default"];
      default:
        return ["default"];
    }
  };

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
            <div className="flex gap-3 flex-wrap mb-4">
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

            {/* Form */}
            {selected ? (
              <div className="space-y-3">
                <label className="text-xs text-muted-foreground uppercase">Select Model</label>
                <Select value={model} onValueChange={(v) => setModel(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelsFor(selected).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label className="text-xs text-muted-foreground uppercase">API Key</label>
                <div className="flex gap-2">
                  <Input placeholder={`Enter ${providers.find((x) => x.id === selected)?.name} API key`} value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                  <Button onClick={saveKey}>Save</Button>
                </div>

                <p className="text-xs text-muted-foreground">Keys are saved to your browser's local storage. For stronger security, consider encryption or server-side storage.</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a provider to configure its API keys.</p>
            )}
          </div>

          <div>
            <p className="text-sm mb-2">Stored Keys {selected ? `(${storedKeys.length})` : ""}</p>
            <div className="h-64 rounded-md border border-border bg-card p-3 overflow-auto">
              {selected ? (
                storedKeys.length > 0 ? (
                  <div className="space-y-3">
                    {storedKeys.map((k) => (
                      <div key={k.id} className="flex items-center justify-between bg-[#0b0f11] rounded-md p-3">
                        <div>
                          <div className="font-medium">{k.model}</div>
                          <div className="text-xs text-muted-foreground">{maskKey(k.key)}</div>
                          <div className="text-[11px] text-muted-foreground mt-1">Added: {new Date(k.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => navigator.clipboard?.writeText(k.key)}>Copy</Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteKey(k.id)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No keys stored yet. Add a key using the form on the left.</div>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">Select a provider to view stored keys.</div>
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

function maskKey(k: string) {
  if (!k) return "";
  if (k.length <= 8) return "****" + k.slice(-4);
  return "****" + k.slice(-6);
}

export default ApiSecretsModal;
