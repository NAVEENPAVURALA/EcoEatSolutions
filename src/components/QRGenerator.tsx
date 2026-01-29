import { Card } from "@/components/ui/card";
import QRCode from "react-qr-code";

interface QRGeneratorProps {
    value: string;
    label?: string;
}

export const QRGenerator = ({ value, label }: QRGeneratorProps) => {
    return (
        <Card className="glass-card p-6 flex flex-col items-center gap-4 inline-block">
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <QRCode value={value} size={150} level="H" />
            </div>
            {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
        </Card>
    );
};
