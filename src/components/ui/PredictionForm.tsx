
import { useState } from 'react';
import { SymptomType } from '@/context/PredictionContext';
import { allSymptoms, predictDisease } from '@/utils/predictionUtils';
import { usePrediction } from '@/context/PredictionContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Stethoscope, RotateCw } from 'lucide-react';

const PredictionForm = () => {
  const [symptoms, setSymptoms] = useState<SymptomType[]>(allSymptoms);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPrediction } = usePrediction();

  const handleSymptomToggle = (id: string) => {
    setSymptoms(prevSymptoms => 
      prevSymptoms.map(symptom => 
        symptom.id === id ? { ...symptom, value: !symptom.value } : symptom
      )
    );
  };

  const handleReset = () => {
    setSymptoms(allSymptoms);
  };

  const handleSubmit = () => {
    const selectedSymptoms = symptoms.filter(s => s.value);
    
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      const result = predictDisease(symptoms);
      
      addPrediction({
        disease: result.disease,
        probability: result.probability,
        symptoms: symptoms,
        advice: result.advice
      });

      toast.success('Prediction completed successfully');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-health-foreground">
          <Stethoscope className="h-5 w-5 text-health-accent" />
          <span>Symptom Checker</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-health-foreground/80">
          Select all symptoms you're currently experiencing:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {symptoms.map((symptom) => (
            <div 
              key={symptom.id} 
              className="flex items-center space-x-2 bg-health-card/50 p-3 rounded-md border border-health-foreground/10 hover:border-health-accent/30 transition-colors"
            >
              <Checkbox 
                id={symptom.id} 
                checked={symptom.value}
                onCheckedChange={() => handleSymptomToggle(symptom.id)}
                className="border-health-foreground/30 data-[state=checked]:bg-health-accent data-[state=checked]:border-health-accent"
              />
              <label 
                htmlFor={symptom.id} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {symptom.name}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="border-health-foreground/20 text-health-foreground/70 hover:text-health-foreground hover:bg-health-card/80"
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="bg-health-accent text-health-primary-foreground hover:bg-health-accent/90"
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse mr-2">Processing</span>
              <RotateCw className="animate-spin h-4 w-4" />
            </>
          ) : (
            <>
              Generate Prediction
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PredictionForm;
