import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scan, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface QRScannerProps {
    onScan: (data: string) => void;
    label?: string;
}

export const QRScanner = ({ onScan, label = "Scan QR Code" }: QRScannerProps) => {
    const [scanning, setScanning] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSimulatedScan = () => {
        setScanning(true);
        // Simulate camera initialization and scanning delay
        setTimeout(() => {
            setScanning(false);
            setSuccess(true);
            toast.success("QR Code Verified Successfully");

            // Simulate reading the data (in a real app, this comes from a library like react-qr-reader)
            onScan("verified_mock_data");

            // Reset after a moment
            setTimeout(() => setSuccess(false), 2000);
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-green-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Button
                    onClick={handleSimulatedScan}
                    disabled={scanning || success}
                    className={`relative w-full h-16 text-lg font-semibold bg-white text-foreground hover:bg-gray-50 border border-gray-200 shadow-sm ${success ? "text-green-600 border-green-500" : ""
                        }`}
                >
                    {scanning ? (
                        <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                            Scanning...
                        </>
                    ) : success ? (
                        <>
                            <CheckCircle2 className="mr-2 h-6 w-6 text-green-600" />
                            Verified
                        </>
                    ) : (
                        <>
                            <Scan className="mr-2 h-6 w-6 text-primary" />
                            {label}
                        </>
                    )}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-[200px]">
                Point camera at the other user's device to verify.
            </p>
        </div>
    );
};
