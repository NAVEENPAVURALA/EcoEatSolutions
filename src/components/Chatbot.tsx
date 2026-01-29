import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY;
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      apiKey = apiKey.trim(); // Ensure no spaces

      // Prompt for Mistral-7B-Instruct-v0.2
      const systemPrompt = "You are EcoEat Assistant, a helpful AI for a food donation platform. Keep answers concise (max 3 sentences).";
      const prompt = `<s>[INST] ${systemPrompt} ${input} [/INST]`;

      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 150,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        }
      );

      if (!response.ok) {
        // Handle common HF errors
        const errorText = await response.text();
        let errorMessage = "API request failed";
        try {
          const json = JSON.parse(errorText);
          errorMessage = json.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || response.statusText;
        }

        // Handle model loading state
        if (errorMessage.includes("loading")) {
          throw new Error("Model is waking up. Please try again in 20 seconds.");
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const text = result[0]?.generated_text || "I couldn't generate a response.";

      setMessages((prev) => [...prev, { role: "assistant", content: text.trim() }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      let msg = error.message || "Connection failed";

      if (msg === "Failed to fetch" || msg === "Load failed") {
        msg = "Network error. Check your connection or ad-blocker.";
      }

      toast.error(msg);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 gradient-primary hover:scale-105 transition-transform"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[350px] sm:w-[380px] h-[500px] flex flex-col shadow-2xl z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b gradient-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">EcoEat Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-primary-foreground hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/95">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-8 px-4">
                <p>👋 Hi! I'm here to help.</p>
                <p className="mt-2">Ask me about creating a donation, finding food, or how our platform works.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="gradient-primary shrink-0 transition-all active:scale-95"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
