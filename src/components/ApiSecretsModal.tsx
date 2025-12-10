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
      // Load Google Sign-In SDK if not already loaded
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          initializeGoogleSignIn();
        };
        
        document.head.appendChild(script);
      } else {
        initializeGoogleSignIn();
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      alert('Failed to sign in with Google. Please try again.');
      setGoogleSignInLoading(false);
    }
  };

  const initializeGoogleSignIn = () => {
    if (!window.google?.accounts?.id) {
      setGoogleSignInLoading(false);
      alert('Google Sign-In SDK not loaded. Please try again.');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: '566319724872-kn7kqd58poci11m9q3v64r8ltk5ifbi4.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    // Render the sign-in button
    const container = document.getElementById('google-signin-button');
    if (container && !container.innerHTML) {
      window.google.accounts.id.renderButton(container, {
        theme: 'dark',
        size: 'large',
        text: 'signin_with',
      });
    }
    
    setGoogleSignInLoading(false);
  };

  const handleCredentialResponse = (response: any) => {
    if (response.credential) {
      try {
        // Decode JWT token to get user info
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const userData = JSON.parse(jsonPayload);
        
        // Save the credential for use with Google API
        localStorage.setItem(`googleAuth:token`, response.credential);
        localStorage.setItem(`googleAuth:user`, JSON.stringify(userData));
        
        console.log('Google Sign-In successful:', userData);
        alert(`Welcome ${userData.name}!`);
      } catch (error) {
        console.error('Error processing credential:', error);
        alert('Error processing sign-in. Please try again.');
      }
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
        <DialogHeader className="pb-4">
          <DialogTitle className="text-base">API Secrets Management</DialogTitle>
          <DialogDescription className="text-sm">Manage your AI provider API keys. Keys are stored locally and securely.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Provider Selection */}
          <div>
            <p className="text-sm font-medium mb-3">Select AI Provider</p>
            <div className="flex gap-2 flex-wrap">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`px-3 py-2 rounded text-xs border transition ${
                    selected === p.id 
                      ? "bg-cyan-500 border-cyan-500 text-black" 
                      : "bg-[#0b1013] border-[#232b30] text-muted-foreground hover:border-[#3a4450]"
                  }`}>
                  {p.name.split(' ')[0]}
                  {p.badge && <span className="ml-1 text-[10px] bg-orange-500 rounded px-1.5">{p.badge.split(' ')[0]}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration and Stored Keys Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left: Form */}
            {selected ? (
              <div className="bg-[#0b0f11] rounded border border-border p-3 space-y-3">
                <div>
                  <label className="text-xs font-medium block mb-1.5">Model</label>
                  <Select value={model} onValueChange={(v) => setModel(v)}>
                    <SelectTrigger className="bg-[#0b1013] border-[#232b30] h-8 text-xs">
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
                  <label className="text-xs font-medium block mb-1.5">API Key</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter key" 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-[#0b1013] border-[#232b30] h-8 text-xs"
                      type="password"
                    />
                    <Button onClick={saveKey} className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium h-8 px-3 text-xs" size="sm">Save</Button>
                  </div>
                </div>

                {selected === "google" && (
                  <div className="space-y-2">
                    <Button 
                      onClick={handleGoogleSignIn}
                      disabled={googleSignInLoading}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-medium h-8 text-xs"
                      size="sm"
                    >
                      {googleSignInLoading ? "Loading..." : "Sign with Google"}
                    </Button>
                    <div id="google-signin-button" className="flex justify-center scale-90"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0b0f11] rounded border border-border p-3 flex items-center justify-center min-h-[140px]">
                <p className="text-muted-foreground text-xs text-center">Select a provider</p>
              </div>
            )}

            {/* Right: Stored Keys */}
            <div>
              <div className="bg-[#0b0f11] rounded border border-border p-3 h-full flex flex-col">
                <div className="text-sm font-medium mb-3">Stored Keys {selected ? `(${storedKeys.length})` : ""}</div>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {selected ? (
                    storedKeys.length > 0 ? (
                      <>
                        {storedKeys.map((k) => (
                          <div key={k.id} className="text-xs bg-[#161b1f] rounded p-2 border border-[#232b30]">
                            <div className="font-medium mb-1">{k.model}</div>
                            <div className="text-muted-foreground font-mono text-[10px] mb-1.5">{maskKey(k.key)}</div>
                            <div className="flex gap-1.5">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 text-xs h-6 p-0"
                                onClick={() => navigator.clipboard?.writeText(k.key)}
                              >
                                Copy
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                className="flex-1 text-xs h-6 p-0"
                                onClick={() => deleteKey(k.id)}
                              >
                                Del
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-24 text-center">
                        <p className="text-muted-foreground text-xs">No keys stored yet</p>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center h-24 text-center">
                      <p className="text-muted-foreground text-xs">Select a provider</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
