import { useState, useEffect, useRef } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
}

interface Chat {
    id: string;
    participants: string[];
    lastMessage?: string;
    lastMessageTime?: any;
    otherUser?: {
        uid: string;
        displayName: string;
        photoURL?: string;
    };
}

const Messages = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingChats, setLoadingChats] = useState(true);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate("/login");
                return;
            }
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, [navigate]);

    // Fetch Chats
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", user.uid),
            orderBy("lastMessageTime", "desc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const chatsData = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data();
                const otherUserId = data.participants.find((p: string) => p !== user.uid);

                let otherUserData = { uid: otherUserId, displayName: "Unknown User", photoURL: "" };

                if (otherUserId) {
                    try {
                        const userDoc = await getDoc(doc(db, "users", otherUserId));
                        if (userDoc.exists()) {
                            const ud = userDoc.data();
                            otherUserData = { uid: otherUserId, displayName: ud.displayName, photoURL: ud.photoURL };
                        }
                    } catch (e) {
                        console.error("Error fetching user data", e);
                    }
                }

                return {
                    id: docSnapshot.id,
                    ...data,
                    otherUser: otherUserData
                } as Chat;
            }));

            setChats(chatsData);
            setLoadingChats(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Fetch Messages for Selected Chat
    useEffect(() => {
        if (!selectedChatId) return;

        const q = query(
            collection(db, "chats", selectedChatId, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(msgs);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });

        return () => unsubscribe();
    }, [selectedChatId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChatId || !user) return;

        try {
            await addDoc(collection(db, "chats", selectedChatId, "messages"), {
                text: newMessage,
                senderId: user.uid,
                createdAt: serverTimestamp()
            });

            await setDoc(doc(db, "chats", selectedChatId), {
                lastMessage: newMessage,
                lastMessageTime: serverTimestamp()
            }, { merge: true });

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        }
    };

    const startNewChat = async () => {
        // Placeholder for starting a new chat logic
        // In a real app, you'd open a user search modal here.
        toast.info("To start a chat, go to the Browse page and click 'Message' on a donation.");
    };

    return (
        <div className="h-[calc(100vh-80px)] bg-secondary/30 p-4 pt-8">
            <div className="container mx-auto max-w-6xl h-full flex gap-6 animate-fade-in">

                {/* Sidebar */}
                <div className={`w-full md:w-80 flex flex-col glass-card rounded-2xl overflow-hidden ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/40 backdrop-blur-md">
                        <h2 className="font-bold text-xl">Messages</h2>
                        <Button size="icon" variant="ghost" onClick={startNewChat}>
                            <PlusCircle className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="p-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-9 bg-white/50 border-none" />
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="flex flex-col p-2 gap-1">
                            {loadingChats ? (
                                [1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-white/20 animate-pulse" />)
                            ) : chats.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p>No messages yet</p>
                                </div>
                            ) : (
                                chats.map(chat => (
                                    <button
                                        key={chat.id}
                                        onClick={() => setSelectedChatId(chat.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${selectedChatId === chat.id ? "bg-white shadow-sm" : "hover:bg-white/40"
                                            }`}
                                    >
                                        <Avatar>
                                            <AvatarImage src={chat.otherUser?.photoURL} />
                                            <AvatarFallback>{chat.otherUser?.displayName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{chat.otherUser?.displayName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{chat.lastMessage || "Started a chat"}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Chat Window */}
                <div className={`flex-1 glass-card rounded-2xl overflow-hidden flex flex-col ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                    {selectedChatId ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/10 bg-white/40 backdrop-blur-md flex items-center gap-3 shadow-sm z-10">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedChatId(null)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </Button>
                                {(() => {
                                    const chat = chats.find(c => c.id === selectedChatId);
                                    return (
                                        <>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={chat?.otherUser?.photoURL} />
                                                <AvatarFallback>{chat?.otherUser?.displayName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-bold">{chat?.otherUser?.displayName}</h3>
                                                <p className="text-xs text-green-600 font-medium">Online</p>
                                            </div>
                                        </>
                                    )
                                })()}
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 p-4 bg-white/20">
                                <div className="flex flex-col gap-4">
                                    {messages.map((msg) => {
                                        const isMe = msg.senderId === user?.uid;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                <div
                                                    className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${isMe
                                                            ? "bg-primary text-white rounded-tr-none"
                                                            : "bg-white text-foreground rounded-tl-none"
                                                        }`}
                                                >
                                                    {msg.text}
                                                    <div className={`text-[10px] mt-1 text-right opacity-70 ${isMe ? "text-white" : "text-gray-500"}`}>
                                                        {/* Timestamp formatting would go here */}
                                                        {new Date(msg.createdAt?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/10">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-white/60 border-none h-11 focus-visible:ring-primary"
                                    />
                                    <Button type="submit" size="icon" className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 shadow-md transition-transform active:scale-95" disabled={!newMessage.trim()}>
                                        <Send className="w-5 h-5 text-white" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-white/10">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <MessageSquare className="w-10 h-10 opacity-50" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-foreground">No Chat Selected</h3>
                            <p className="max-w-md mx-auto">Select a conversation from the sidebar or start a new collection to connect with your community.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
