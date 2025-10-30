import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import jsPDF from "jspdf";

interface ReceiptData {
  donorName: string;
  receiverName?: string;
  donationType: string;
  quantity: string;
  date: string;
  time: string;
  location: string;
  receiptId: string;
}

export const ReceiptGenerator = ({ data }: { data: ReceiptData }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(34, 139, 34);
    doc.text("EcoEatSolutions", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Donation Receipt", 105, 35, { align: "center" });
    
    // Receipt ID
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Receipt ID: ${data.receiptId}`, 105, 45, { align: "center" });
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);
    
    // Receipt details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPos = 65;
    const lineHeight = 10;
    
    doc.text("Donor Information:", 20, yPos);
    yPos += lineHeight;
    doc.setFontSize(11);
    doc.text(`Name: ${data.donorName}`, 30, yPos);
    yPos += lineHeight;
    
    if (data.receiverName) {
      doc.setFontSize(12);
      yPos += 5;
      doc.text("Receiver Information:", 20, yPos);
      yPos += lineHeight;
      doc.setFontSize(11);
      doc.text(`Name: ${data.receiverName}`, 30, yPos);
      yPos += lineHeight;
    }
    
    doc.setFontSize(12);
    yPos += 5;
    doc.text("Donation Details:", 20, yPos);
    yPos += lineHeight;
    doc.setFontSize(11);
    doc.text(`Type: ${data.donationType}`, 30, yPos);
    yPos += lineHeight;
    doc.text(`Quantity: ${data.quantity}`, 30, yPos);
    yPos += lineHeight;
    doc.text(`Location: ${data.location}`, 30, yPos);
    yPos += lineHeight + 5;
    
    doc.setFontSize(12);
    doc.text("Date & Time:", 20, yPos);
    yPos += lineHeight;
    doc.setFontSize(11);
    doc.text(`Date: ${data.date}`, 30, yPos);
    yPos += lineHeight;
    doc.text(`Time: ${data.time}`, 30, yPos);
    
    // Footer
    yPos = 250;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for making a difference in fighting food waste!", 105, yPos, { align: "center" });
    yPos += 7;
    doc.text("Together we can create a sustainable future.", 105, yPos, { align: "center" });
    
    // Save the PDF
    doc.save(`donation-receipt-${data.receiptId}.pdf`);
  };

  return (
    <Button onClick={generatePDF} variant="outline" className="gap-2">
      <Download className="w-4 h-4" />
      Download Receipt
    </Button>
  );
};
