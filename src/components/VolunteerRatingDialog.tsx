import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/config";

interface VolunteerRatingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    volunteerId: string;
    volunteerName?: string;
    donationId: string;
}

export const VolunteerRatingDialog = ({ isOpen, onClose, volunteerId, volunteerName, donationId }: VolunteerRatingDialogProps) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a star rating");
            return;
        }

        setSubmitting(true);
        try {
            // Update Volunteer's Profile Stats
            const userRef = doc(db, "users", volunteerId);
            await updateDoc(userRef, {
                ratingSum: increment(rating),
                ratingCount: increment(1),
                impactScore: increment(rating * 5) // Bonus points for good ratings
            });

            // Mark donation as rated (to prevent double rating) - simplified logic
            await updateDoc(doc(db, "donations", donationId), {
                isRated: true
            });

            toast.success("Thank you for your feedback!");
            onClose();
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast.error("Failed to submit rating");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-center">Rate Verification</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6 py-6">
                    <p className="text-center text-muted-foreground">
                        How was your experience with {volunteerName || "the volunteer"}?
                    </p>

                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`transition-all hover:scale-110 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                            >
                                <Star className="w-8 h-8 fill-current" />
                            </button>
                        ))}
                    </div>

                    <Textarea
                        placeholder="Write a short review (optional)..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="w-full"
                    />
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button variant="outline" onClick={onClose}>Skip</Button>
                    <Button onClick={handleSubmit} disabled={submitting || rating === 0}>
                        {submitting ? "Submitting..." : "Submit Rating"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
