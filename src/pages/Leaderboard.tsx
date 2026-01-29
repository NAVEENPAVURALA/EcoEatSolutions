import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Star } from "lucide-react";

interface UserProfile {
    id: string;
    displayName: string;
    photoURL?: string;
    impactScore: number;
    user_type: string;
}

const Leaderboard = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const q = query(
                    collection(db, "users"),
                    orderBy("impactScore", "desc"),
                    limit(10)
                );
                const snapshot = await getDocs(q);
                const leaderboardData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as UserProfile[];
                setUsers(leaderboardData);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 1: return <Medal className="w-6 h-6 text-gray-400" />;
            case 2: return <Medal className="w-6 h-6 text-amber-700" />;
            default: return <span className="font-bold text-muted-foreground">#{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-secondary/30 py-12 px-4">
            <div className="container mx-auto max-w-4xl animate-fade-in">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Hall of Fame</h1>
                    <p className="text-muted-foreground text-lg">Celebrating our top Eco-Heroes making a difference.</p>
                </div>

                {/* Top 3 Podium */}
                <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16">
                    {/* 2nd Place */}
                    {users[1] && (
                        <div className="order-2 md:order-1 flex flex-col items-center animate-fade-up" style={{ animationDelay: "100ms" }}>
                            <div className="w-24 h-24 rounded-full border-4 border-gray-300 overflow-hidden mb-4 shadow-lg">
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={users[1].photoURL} />
                                    <AvatarFallback className="text-2xl bg-gray-200">{users[1].displayName[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="glass-card p-6 w-48 text-center rounded-t-2xl border-b-0 h-48 flex flex-col justify-center bg-gradient-to-t from-gray-100/50 to-white/20">
                                <p className="font-bold text-lg truncate w-full">{users[1].displayName}</p>
                                <p className="text-sm text-muted-foreground mb-2 capitalize">{users[1].user_type}</p>
                                <div className="flex items-center justify-center gap-1 font-bold text-gray-500">
                                    <Star className="w-4 h-4 fill-current" /> {users[1].impactScore}
                                </div>
                                <div className="mt-2 text-gray-400 font-bold text-xl">2nd</div>
                            </div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {users[0] && (
                        <div className="order-1 md:order-2 flex flex-col items-center z-10 animate-fade-up">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden mb-4 shadow-xl ring-4 ring-yellow-400/20">
                                    <Avatar className="w-full h-full">
                                        <AvatarImage src={users[0].photoURL} />
                                        <AvatarFallback className="text-4xl bg-yellow-100">{users[0].displayName[0]}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                    <Trophy className="w-10 h-10 text-yellow-500 fill-yellow-500 drop-shadow-md" />
                                </div>
                            </div>
                            <div className="glass-card p-8 w-56 text-center rounded-t-2xl border-b-0 h-64 flex flex-col justify-center bg-gradient-to-t from-yellow-50/50 to-white/20">
                                <p className="font-bold text-xl truncate w-full">{users[0].displayName}</p>
                                <p className="text-sm text-muted-foreground mb-2 capitalize">{users[0].user_type}</p>
                                <div className="flex items-center justify-center gap-1 font-bold text-yellow-600 text-lg">
                                    <Star className="w-5 h-5 fill-current" /> {users[0].impactScore}
                                </div>
                                <div className="mt-2 text-yellow-500 font-bold text-2xl">1st</div>
                            </div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {users[2] && (
                        <div className="order-3 flex flex-col items-center animate-fade-up" style={{ animationDelay: "200ms" }}>
                            <div className="w-24 h-24 rounded-full border-4 border-amber-600 overflow-hidden mb-4 shadow-lg">
                                <Avatar className="w-full h-full">
                                    <AvatarImage src={users[2].photoURL} />
                                    <AvatarFallback className="text-2xl bg-amber-100">{users[2].displayName[0]}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="glass-card p-6 w-48 text-center rounded-t-2xl border-b-0 h-40 flex flex-col justify-center bg-gradient-to-t from-amber-50/50 to-white/20">
                                <p className="font-bold text-lg truncate w-full">{users[2].displayName}</p>
                                <p className="text-sm text-muted-foreground mb-2 capitalize">{users[2].user_type}</p>
                                <div className="flex items-center justify-center gap-1 font-bold text-amber-700">
                                    <Star className="w-4 h-4 fill-current" /> {users[2].impactScore}
                                </div>
                                <div className="mt-2 text-amber-600 font-bold text-xl">3rd</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* The Rest of the List */}
                <div className="space-y-4">
                    {users.slice(3).map((user, index) => (
                        <Card key={user.id} className="glass-card border-white/20 hover:bg-white/40 transition-colors">
                            <CardContent className="flex items-center p-4">
                                <div className="w-8 font-bold text-muted-foreground text-center mr-4">
                                    #{index + 4}
                                </div>
                                <Avatar className="h-10 w-10 mr-4">
                                    <AvatarImage src={user.photoURL} />
                                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{user.displayName}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{user.user_type}</p>
                                </div>
                                <div className="font-bold flex items-center gap-1 text-primary">
                                    <Star className="w-4 h-4 fill-current" />
                                    {user.impactScore}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {loading && [1, 2, 3].map(i => (
                        <div key={i} className="h-20 w-full bg-muted/30 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
