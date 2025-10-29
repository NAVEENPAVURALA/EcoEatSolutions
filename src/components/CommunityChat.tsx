import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  username: string;
  message: string;
  created_at: string;
}

const CommunityChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUser();
    fetchMessages();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsLoggedIn(true);
      setUsername(session.user.user_metadata.full_name || "Anonymous");
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) {
      console.error("Error fetching messages:", error);
    } else if (data) {
      setMessages(data);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!isLoggedIn) {
      toast.error("Please sign in to send messages");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to send messages");
      return;
    }

    const { error } = await supabase.from("chat_messages").insert({
      user_id: session.user.id,
      username: username,
      message: newMessage.trim(),
    });

    if (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } else {
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="p-6 h-[600px] flex flex-col">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Community Chat</h2>
        <div className="ml-auto">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-semibold text-primary">{msg.username}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isLoggedIn ? "Type your message..." : "Sign in to chat"}
          disabled={!isLoggedIn}
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={!isLoggedIn || !newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CommunityChat;