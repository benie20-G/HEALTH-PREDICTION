
import { useState, useEffect } from 'react';
import { History as HistoryIcon, Filter, Trash2, ArrowLeft } from 'lucide-react';
import { usePrediction } from '@/context/PredictionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ResultsCard from '@/components/ui/ResultsCard';
import AnalyticsChart, { DataPoint } from '@/components/ui/AnalyticsChart';
import { groupPredictionsByDisease, generateTimeSeriesData } from '@/utils/predictionUtils';

const History = () => {
  const { predictions, clearPredictions } = usePrediction();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [diseaseData, setDiseaseData] = useState<DataPoint[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<DataPoint[]>([]);

  // Process analytics data
  useEffect(() => {
    if (predictions.length > 0) {
      setDiseaseData(groupPredictionsByDisease(predictions));
      setTimeSeriesData(generateTimeSeriesData(predictions));
    }
  }, [predictions]);

  // Filter predictions based on search term and filter type
  const filteredPredictions = predictions.filter(prediction => {
    const matchesSearch = prediction.disease.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    
    const probability = prediction.probability;
    if (filterType === 'high' && probability >= 75) return matchesSearch;
    if (filterType === 'medium' && probability >= 50 && probability < 75) return matchesSearch;
    if (filterType === 'low' && probability < 50) return matchesSearch;
    return false;
  });

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Get probability color based on value
  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'bg-red-500';
    if (probability >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-8">
      {selectedPrediction ? (
        <>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedPrediction(null)}
              className="text-health-foreground/70 hover:text-health-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to History
            </Button>
          </div>
          <ResultsCard prediction={selectedPrediction} />
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-health-foreground mb-2 flex items-center">
                <HistoryIcon className="h-7 w-7 mr-2 text-health-accent" />
                Prediction History
              </h1>
              <p className="text-health-foreground/70">View and analyze your past health predictions</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Input
                placeholder="Search by disease..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-health-card border-health-foreground/20"
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterType('all')}>
                    All Predictions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('high')}>
                    High Probability (75%+)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('medium')}>
                    Medium Probability (50-75%)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType('low')}>
                    Low Probability (0-50%)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear History</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to clear your prediction history? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearPredictions}>
                      Clear History
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* Analytics */}
          {predictions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <AnalyticsChart 
                data={diseaseData} 
                type="pie" 
                dataKey="value" 
                title="Disease Distribution" 
              />
              <AnalyticsChart 
                data={timeSeriesData} 
                type="line" 
                dataKey="value" 
                xAxisKey="name"
                title="Predictions Over Time" 
              />
            </div>
          )}
          
          {/* Predictions List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <History className="h-5 w-5 mr-2 text-health-accent" />
              {filterType !== 'all' ? (
                <span className="capitalize">{filterType} Probability Predictions</span>
              ) : (
                <span>All Predictions</span>
              )}
              {searchTerm && <span className="ml-2 text-health-foreground/70 text-base">matching "{searchTerm}"</span>}
            </h2>
            
            {filteredPredictions.length === 0 ? (
              <Card className="health-card">
                <CardContent className="py-10 text-center text-health-foreground/60">
                  {predictions.length === 0 ? (
                    <p>No predictions in your history. Start a new prediction to see results here.</p>
                  ) : (
                    <p>No predictions match your current filters.</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredPredictions.map((prediction) => (
                  <Card 
                    key={prediction.id} 
                    className="health-card hover:bg-health-card/80 cursor-pointer transition-colors"
                    onClick={() => setSelectedPrediction(prediction)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row justify-between">
                        <div>
                          <h3 className="font-bold text-health-foreground text-lg mb-1">
                            {prediction.disease}
                          </h3>
                          <p className="text-health-foreground/70 text-sm mb-2">
                            {formatDate(prediction.timestamp)}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {prediction.symptoms
                              .filter(s => s.value)
                              .slice(0, 3)
                              .map(symptom => (
                                <Badge key={symptom.id} variant="outline" className="text-health-foreground/80">
                                  {symptom.name}
                                </Badge>
                              ))}
                            {prediction.symptoms.filter(s => s.value).length > 3 && (
                              <Badge variant="outline" className="text-health-foreground/60">
                                +{prediction.symptoms.filter(s => s.value).length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-0 flex items-start">
                          <div className="flex flex-col items-center">
                            <div className={`rounded-full w-14 h-14 flex items-center justify-center ${getProbabilityColor(prediction.probability)}`}>
                              <span className="font-bold text-white">{prediction.probability}%</span>
                            </div>
                            <span className="text-xs text-health-foreground/70 mt-1">Probability</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default History;
