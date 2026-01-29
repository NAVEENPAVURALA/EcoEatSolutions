import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const NotificationsSheet = () => {
    const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "users", user.uid, "notifications"),
            orderBy("created_at", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(items);
            setUnreadCount(items.filter((n: any) => !n.read).length);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            await updateDoc(doc(db, "users", user.uid, "notifications", id), {
                read: true
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await deleteDoc(doc(db, "users", user.uid, "notifications", id));
            toast.success("Notification removed");
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    if (!user) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="w-5 h-5 text-foreground/80" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[350px] sm:w-[450px]">
                <SheetHeader className="mb-4">
                    <SheetTitle className="flex justify-between items-center">
                        Notifications
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {unreadCount} New
                            </Badge>
                        )}
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-[85vh] pr-4">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <Bell className="w-8 h-8 mb-2 opacity-50" />
                            <p>No new notifications</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`relative p-4 rounded-xl border transition-all ${n.read
                                            ? "bg-secondary/20 border-border/50 opacity-70"
                                            : "bg-white border-primary/20 shadow-sm"
                                        }`}
                                >
                                    <h4 className="font-semibold text-sm mb-1">{n.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-3">{n.message}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground/50">
                                            {n.created_at?.toDate ? n.created_at.toDate().toLocaleDateString() : "Just now"}
                                        </span>
                                        <div className="flex gap-2">
                                            {!n.read && (
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => markAsRead(n.id)}>
                                                    <Check className="w-3 h-3 text-primary" />
                                                </Button>
                                            )}
                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => deleteNotification(n.id)}>
                                                <X className="w-3 h-3 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};
