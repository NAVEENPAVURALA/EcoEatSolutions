import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calculator } from "lucide-react";

interface NutritionResults {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const NutritionCalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [results, setResults] = useState<NutritionResults | null>(null);

  const calculateNutrition = () => {
    // Validation
    if (!weight || !height || !age || !gender || !activityLevel || !goal) {
      toast.error("Please fill in all fields");
      return;
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (w <= 0 || h <= 0 || a <= 0) {
      toast.error("Please enter valid positive numbers");
      return;
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    // Calculate TDEE based on activity level
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Adjust calories based on goal
    let targetCalories: number;
    if (goal === "lose") {
      targetCalories = tdee - 500;
    } else if (goal === "gain") {
      targetCalories = tdee + 500;
    } else {
      targetCalories = tdee;
    }

    // Calculate macros (protein: 30%, carbs: 40%, fats: 30%)
    const protein = (targetCalories * 0.3) / 4;
    const carbs = (targetCalories * 0.4) / 4;
    const fats = (targetCalories * 0.3) / 9;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
    });

    toast.success("Nutrition calculated successfully!");
  };

  return (
    <Card className="p-6 border-4 border-transparent bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_50px_rgba(124,58,237,0.7)] transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          Nutrition Calculator
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="170"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger id="gender" className="mt-1">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="activity">Activity Level</Label>
          <Select value={activityLevel} onValueChange={setActivityLevel}>
            <SelectTrigger id="activity" className="mt-1">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="light">Light Exercise</SelectItem>
              <SelectItem value="moderate">Moderate Exercise</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="veryActive">Very Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="goal">Goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger id="goal" className="mt-1">
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">Lose Weight</SelectItem>
              <SelectItem value="maintain">Maintain Weight</SelectItem>
              <SelectItem value="gain">Gain Weight</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={calculateNutrition} className="w-full mb-6 gradient-primary">
        Calculate Nutrition
      </Button>

      {results && (
        <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border-2 border-primary/30">
          <div className="space-y-3">
            <div className="p-3 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground">BMR (Basal Metabolic Rate)</p>
              <p className="text-2xl font-bold text-primary">{results.bmr} kcal/day</p>
            </div>
            <div className="p-3 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground">TDEE (Total Daily Energy)</p>
              <p className="text-2xl font-bold text-secondary">{results.tdee} kcal/day</p>
            </div>
            <div className="p-3 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground">Target Calories</p>
              <p className="text-2xl font-bold text-accent">{results.calories} kcal/day</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground">Protein (30%)</p>
              <p className="text-2xl font-bold text-primary">{results.protein}g/day</p>
            </div>
            <div className="p-3 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground">Carbs (40%)</p>
              <p className="text-2xl font-bold text-secondary">{results.carbs}g/day</p>
            </div>
            <div className="p-3 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground">Fats (30%)</p>
              <p className="text-2xl font-bold text-accent">{results.fats}g/day</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default NutritionCalculator;