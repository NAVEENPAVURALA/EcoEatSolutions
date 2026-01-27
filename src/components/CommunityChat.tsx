import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

interface Message {
  id: string;
  username: string;
  message: string;
  created_at: any; // Firestore timestamp
}

const CommunityChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUsername(user.displayName || "Anonymous");
        setUserId(user.uid);
      } else {
        setIsLoggedIn(false);
        setUsername("");
        setUserId("");
      }
    });

    // Realtime listener for messages
    const q = query(collection(db, "chat_messages"), orderBy("created_at", "asc"), limit(50));
    const unsubscribeChat = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeChat();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!isLoggedIn) {
      toast.error("Please sign in to send messages");
      return;
    }

    try {
      await addDoc(collection(db, "chat_messages"), {
        user_id: userId,
        username: username,
        message: newMessage.trim(),
        created_at: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
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
                {msg.created_at?.toDate ? msg.created_at.toDate().toLocaleTimeString() : new Date().toLocaleTimeString()}
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