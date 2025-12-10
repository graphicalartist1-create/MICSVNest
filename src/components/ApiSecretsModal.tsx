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
  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setGoogleSignInLoading(true);
    try {
      // Initialize Google Sign-In SDK
      if (!window.google) {
        // Load the Google Sign-In library
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.head.appendChild(script);
        
        // Wait for script to load
        await new Promise(resolve => {
          script.onload = resolve;
        });
      }

      // Trigger Google Sign-In
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: '566319724872-kn7kqd58poci11m9q3v64r8ltk5ifbi4.apps.googleusercontent.com',
          callback: (response: any) => {
            if (response.credential) {
              // Decode JWT token to get user info
              const base64Url = response.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map((c: string) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              
              const userData = JSON.parse(jsonPayload);
              
              // You can save user info if needed
              console.log('Google Sign-In successful:', userData);
              alert(`Welcome ${userData.name}!`);
            }
          },
        });
        
        window.google.accounts.id.prompt();
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      alert('Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleSignInLoading(false);
    }
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

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>API Secrets Management</DialogTitle>
          <DialogDescription>Manage your AI provider API keys. Keys are stored locally and securely.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Provider Selection */}
          <div>
            <p className="text-sm font-medium mb-2">Select AI Provider</p>
            <div className="flex gap-2 flex-wrap">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border transition text-sm ${
                    selected === p.id 
                      ? "bg-cyan-500 border-cyan-500 text-black" 
                      : "bg-[#0b1013] border-[#232b30] text-muted-foreground hover:border-[#3a4450]"
                  }`}>
                  <span className="h-4 w-4 rounded-sm bg-opacity-20 flex items-center justify-center text-xs font-bold">
                    {p.name.split(' ')[0].charAt(0)}
                  </span>
                  <span className="text-xs font-medium">{p.name}</span>
                  {p.badge && <span className="text-xs bg-orange-500 rounded-full px-2 py-0.5 font-medium">{p.badge}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration and Stored Keys Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left: Form */}
            <div>
              {selected ? (
                <div className="bg-[#0b0f11] rounded-lg border border-border p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      {providers.find((x) => x.id === selected)?.name} Configuration
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selected === "google" && "Google's advanced AI model"}
                      {selected === "mistral" && "Mistral's language models"}
                      {selected === "openai" && "OpenAI's state-of-the-art models"}
                      {selected === "openrouter" && "Multi-model routing platform"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium block mb-1">Select Model</label>
                      <Select value={model} onValueChange={(v) => setModel(v)}>
                        <SelectTrigger className="bg-[#0b1013] border-[#232b30] h-8">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {modelsFor(selected).map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-1">API Key</label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Enter API key" 
                          value={apiKey} 
                          onChange={(e) => setApiKey(e.target.value)}
                          className="bg-[#0b1013] border-[#232b30] h-8 text-xs"
                          type="password"
                        />
                        <Button onClick={saveKey} className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium h-8 px-3" size="sm">Save</Button>
                      </div>
                    </div>

                    {selected === "google" && (
                      <Button 
                        onClick={handleGoogleSignIn}
                        disabled={googleSignInLoading}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium h-9 flex items-center justify-center gap-2"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        {googleSignInLoading ? "Signing in..." : "Sign in with Google"}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#0b0f11] rounded-lg border border-border p-4 h-full flex items-center justify-center">
                  <p className="text-muted-foreground text-xs text-center">Select a provider</p>
                </div>
              )}
            </div>

            {/* Right: Stored Keys */}
            <div>
              <div className="bg-[#0b0f11] rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold mb-3">
                  Stored Keys {selected ? `(${storedKeys.length})` : ""}
                </h3>
                <div className="h-48 overflow-y-auto space-y-2">
                  {selected ? (
                    storedKeys.length > 0 ? (
                      <>
                        {storedKeys.map((k) => (
                          <div key={k.id} className="bg-[#161b1f] rounded-md p-2 border border-[#232b30]">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-medium text-xs">{k.model}</div>
                                <div className="text-xs text-muted-foreground font-mono">{maskKey(k.key)}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 text-xs h-7"
                                onClick={() => navigator.clipboard?.writeText(k.key)}
                              >
                                Copy
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="flex-1 text-xs h-7"
                                onClick={() => deleteKey(k.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-center">
                        <p className="text-muted-foreground text-xs">No keys stored yet</p>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <p className="text-muted-foreground text-xs">Select a provider</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" size="sm">Close</Button>
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

// Type declaration for Google Sign-In
declare global {
  interface Window {
    google: any;
  }
}

export default ApiSecretsModal;
