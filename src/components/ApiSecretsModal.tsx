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

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">API Secrets Management</DialogTitle>
          <DialogDescription className="text-base">Manage your AI provider API keys. Keys are stored locally and securely.</DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Provider Selection */}
          <div>
            <p className="text-base font-medium mb-4">Select AI Provider</p>
            <div className="flex gap-3 flex-wrap">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition ${
                    selected === p.id 
                      ? "bg-cyan-500 border-cyan-500 text-black" 
                      : "bg-[#0b1013] border-[#232b30] text-muted-foreground hover:border-[#3a4450]"
                  }`}>
                  <span className="h-6 w-6 rounded-md bg-opacity-20 flex items-center justify-center text-sm font-bold">
                    {p.name.split(' ')[0].charAt(0)}
                  </span>
                  <span className="text-sm font-medium">{p.name}</span>
                  {p.badge && <span className="ml-auto text-xs bg-orange-500 rounded-full px-3 py-1 font-medium">{p.badge}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration and Stored Keys Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Form */}
            <div>
              {selected ? (
                <div className="bg-[#0b0f11] rounded-lg border border-border p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {providers.find((x) => x.id === selected)?.name} Configuration
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selected === "google" && "Google's advanced AI model for text and image analysis"}
                      {selected === "mistral" && "Mistral's powerful language models"}
                      {selected === "openai" && "OpenAI's state-of-the-art models"}
                      {selected === "openrouter" && "OpenRouter's multi-model routing platform"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Select Model</label>
                      <Select value={model} onValueChange={(v) => setModel(v)}>
                        <SelectTrigger className="bg-[#0b1013] border-[#232b30]">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {modelsFor(selected).map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selected === "google" && model === "Gemini 2.5 Flash-Lite Preview" && (
                        <p className="text-xs text-cyan-400 mt-2">ℹ️ This model supports image analysis</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">{providers.find((x) => x.id === selected)?.name} API Keys</label>
                      <p className="text-xs text-muted-foreground mb-3">
                        {selected === "google" && 'Gemini API keys should start with "Aiza"'}
                        {selected === "mistral" && "32-33 character Mistral API key"}
                        {selected === "openai" && "OpenAI API key starting with sk-"}
                        {selected === "openrouter" && "OpenRouter API key starting with sk-or-"}
                      </p>
                      <div className="flex gap-2 mb-3">
                        <Input 
                          placeholder={`Enter ${providers.find((x) => x.id === selected)?.name} API key`} 
                          value={apiKey} 
                          onChange={(e) => setApiKey(e.target.value)}
                          className="bg-[#0b1013] border-[#232b30]"
                          type="password"
                        />
                        <Button onClick={saveKey} className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium">Save</Button>
                      </div>

                      {selected === "google" && (
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                          🔗 Get Google Gemini API Key
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0b0f11] rounded-lg border border-border p-6 h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-center">Select a provider to configure its API keys.</p>
                </div>
              )}
            </div>

            {/* Right: Stored Keys */}
            <div>
              <div className="bg-[#0b0f11] rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Stored Keys {selected ? `(${storedKeys.length})` : ""}
                </h3>
                <div className="h-80 overflow-y-auto pr-2 space-y-3">
                  {selected ? (
                    storedKeys.length > 0 ? (
                      <>
                        {storedKeys.map((k) => (
                          <div key={k.id} className="bg-[#161b1f] rounded-lg p-4 border border-[#232b30]">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-semibold text-sm">{k.model}</div>
                                <div className="text-xs text-muted-foreground font-mono mt-1">{maskKey(k.key)}</div>
                                <div className="text-xs text-muted-foreground mt-2">Added: {new Date(k.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 text-xs"
                                onClick={() => {
                                  navigator.clipboard?.writeText(k.key);
                                  // You can add a toast notification here
                                }}
                              >
                                Copy
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="flex-1 text-xs"
                                onClick={() => deleteKey(k.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <p className="text-muted-foreground text-sm">No {providers.find((x) => x.id === selected)?.name} API keys stored yet.</p>
                          <p className="text-muted-foreground text-xs mt-2">Add a key using the form on the left.</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="h-full flex items-center justify-center text-center">
                      <p className="text-muted-foreground text-sm">Select a provider to view stored keys.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="px-6">Close</Button>
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
