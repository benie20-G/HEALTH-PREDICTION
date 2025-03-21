
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PredictionResult } from '@/context/PredictionContext';
import { History, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HistoryCardProps {
  predictions: PredictionResult[];
  limit?: number;
}

const HistoryCard = ({ predictions, limit = 5 }: HistoryCardProps) => {
  // Sort predictions by timestamp (most recent first)
  const sortedPredictions = [...predictions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-health-foreground">
          <History className="h-5 w-5 text-health-accent" />
          <span>Recent Predictions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedPredictions.length === 0 ? (
          <div className="text-center py-8 text-health-foreground/60">
            <p>No prediction history available.</p>
            <p className="text-sm mt-2">Complete a symptom check to start building your history.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {sortedPredictions.map((prediction) => (
                <div 
                  key={prediction.id}
                  className="flex items-center justify-between p-3 bg-health-foreground/5 border border-health-foreground/10 rounded-md hover:border-health-accent/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-health-accent/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-health-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-health-foreground">{prediction.disease}</p>
                      <div className="flex items-center text-xs text-health-foreground/60">
                        <span>{formatDate(prediction.timestamp)}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTime(prediction.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span 
                      className="text-sm font-medium mr-2"
                      style={{
                        color: prediction.probability > 70 
                          ? '#f87171' 
                          : prediction.probability > 40 
                            ? '#fbbf24' 
                            : '#34d399'
                      }}
                    >
                      {prediction.probability}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {predictions.length > limit && (
              <div className="flex justify-center mt-4">
                <Button 
                  variant="outline" 
                  asChild
                  className="border-health-foreground/20 text-health-foreground/70 hover:text-health-foreground hover:bg-health-card/80"
                >
                  <Link to="/history">
                    View All History
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
