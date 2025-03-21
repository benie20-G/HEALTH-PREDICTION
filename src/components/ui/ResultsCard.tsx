
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, AlertCircle } from 'lucide-react';
import { PredictionResult } from '@/context/PredictionContext';

interface ResultsCardProps {
  prediction: PredictionResult | null;
}

const ResultsCard = ({ prediction }: ResultsCardProps) => {
  if (!prediction) {
    return (
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="text-health-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-health-accent" />
            <span>Prediction Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-health-foreground/60">
          <AlertCircle className="h-16 w-16 mb-4 text-health-foreground/40" />
          <p className="text-center max-w-md">
            No prediction data available. Please fill out the symptom checker to generate a prediction.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get confidence level text based on probability
  const getConfidenceLevel = (probability: number) => {
    if (probability >= 80) return 'High';
    if (probability >= 50) return 'Moderate';
    return 'Low';
  };

  // Get color based on probability
  const getConfidenceColor = (probability: number) => {
    if (probability >= 80) return 'text-red-400';
    if (probability >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-health-foreground">
          <Activity className="h-5 w-5 text-health-accent" />
          <span>Prediction Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-1">
              {prediction.disease}
            </h3>
            <p className="text-sm text-health-foreground/70">
              Predicted based on your selected symptoms
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence Level</span>
              <span className={getConfidenceColor(prediction.probability)}>
                {getConfidenceLevel(prediction.probability)}
              </span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-health-foreground/10">
              <div 
                className="h-full bg-gradient-to-r from-health-accent to-health-highlight transition-all duration-500 ease-in-out"
                style={{ width: `${prediction.probability}%` }}
              />
            </div>
            <div className="text-right text-sm font-medium text-health-accent">
              {prediction.probability}%
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-health-foreground">Detected Symptoms</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {prediction.symptoms
                .filter(s => s.value)
                .map(symptom => (
                  <div 
                    key={symptom.id} 
                    className="text-sm bg-health-foreground/5 border border-health-foreground/10 px-3 py-2 rounded-md"
                  >
                    {symptom.name}
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4 flex items-center text-xs text-health-foreground/50">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>This is not a medical diagnosis. Consult a healthcare professional for accurate diagnosis.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
