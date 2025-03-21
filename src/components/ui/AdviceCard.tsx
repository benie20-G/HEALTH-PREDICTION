
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PredictionResult } from '@/context/PredictionContext';
import { HeartPulse, AlertTriangle } from 'lucide-react';

interface AdviceCardProps {
  prediction: PredictionResult | null;
}

const AdviceCard = ({ prediction }: AdviceCardProps) => {
  if (!prediction || !prediction.advice || prediction.advice.length === 0) {
    return (
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-health-foreground">
            <HeartPulse className="h-5 w-5 text-health-accent" />
            <span>Personalized Health Advice</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-health-foreground/60">
          <AlertTriangle className="h-16 w-16 mb-4 text-health-foreground/40" />
          <p className="text-center max-w-md">
            Complete a symptom check to receive personalized health recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-health-foreground">
          <HeartPulse className="h-5 w-5 text-health-accent" />
          <span>Personalized Health Advice</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-health-foreground/80">
            Based on your symptoms and predicted condition, here are some recommendations:
          </p>
          
          <ul className="space-y-3">
            {prediction.advice.map((advice, index) => (
              <li 
                key={index} 
                className="flex items-start bg-health-foreground/5 border border-health-foreground/10 p-3 rounded-md"
              >
                <span className="inline-flex items-center justify-center rounded-full bg-health-accent/10 text-health-accent h-6 w-6 text-xs mr-3 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-health-foreground/90">{advice}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 p-3 bg-health-accent/10 border border-health-accent/20 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-health-accent mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-health-foreground/90">
                This advice is generated based on common recommendations for your predicted condition. 
                Always consult with a healthcare professional before making medical decisions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdviceCard;
