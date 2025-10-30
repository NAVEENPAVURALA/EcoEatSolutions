import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BackToHomeButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      onClick={() => navigate("/")}
      className="fixed top-4 right-4 z-50 shadow-lg"
    >
      <Home className="w-4 h-4 mr-2" />
      Back to Home
    </Button>
  );
};
