
import { useEffect, useState } from 'react';
import { 
  Activity, 
  Stethoscope, 
  History, 
  Brain, 
  Users
} from 'lucide-react';
import { usePrediction } from '@/context/PredictionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnalyticsChart, { DataPoint } from '@/components/ui/AnalyticsChart';
import AnimatedStat from '@/components/ui/AnimatedStat';
import ResultsCard from '@/components/ui/ResultsCard';
import HistoryCard from '@/components/ui/HistoryCard';
import { generateDistributionData, groupPredictionsByDisease, generateTimeSeriesData } from '@/utils/predictionUtils';

const Dashboard = () => {
  const { predictions, latestPrediction } = usePrediction();
  const [distributionData, setDistributionData] = useState<DataPoint[]>([]);
  const [diseaseData, setDiseaseData] = useState<DataPoint[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<DataPoint[]>([]);

  // Process data for charts
  useEffect(() => {
    if (latestPrediction) {
      setDistributionData(generateDistributionData(latestPrediction.symptoms));
    }
    
    if (predictions.length > 0) {
      setDiseaseData(groupPredictionsByDisease(predictions));
      setTimeSeriesData(generateTimeSeriesData(predictions));
    }
  }, [predictions, latestPrediction]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-health-foreground mb-2">Health Dashboard</h1>
          <p className="text-health-foreground/70">
            Monitor your health predictions and analyze trends
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            asChild
            className="bg-health-accent text-health-primary-foreground hover:bg-health-accent/90"
          >
            <Link to="/predictions">
              <Stethoscope className="mr-2 h-4 w-4" />
              Start New Prediction
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="health-card">
          <CardContent className="p-6">
            <AnimatedStat 
              value={predictions.length} 
              label="Total Predictions" 
              icon={<Activity className="h-5 w-5 text-health-accent" />}
            />
          </CardContent>
        </Card>
        <Card className="health-card">
          <CardContent className="p-6">
            <AnimatedStat 
              value={predictions.length > 0 ? Math.round(predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length) : 0} 
              suffix="%" 
              label="Avg. Confidence" 
              icon={<Brain className="h-5 w-5 text-health-accent" />}
            />
          </CardContent>
        </Card>
        <Card className="health-card">
          <CardContent className="p-6">
            <AnimatedStat 
              value={new Set(predictions.map(p => p.disease)).size} 
              label="Unique Diseases" 
              icon={<Stethoscope className="h-5 w-5 text-health-accent" />}
            />
          </CardContent>
        </Card>
        <Card className="health-card">
          <CardContent className="p-6">
            <AnimatedStat 
              value={Math.floor(Math.random() * 2000) + 5000} 
              label="Global Users" 
              icon={<Users className="h-5 w-5 text-health-accent" />}
            />
          </CardContent>
        </Card>
      </div>

      {/* Latest Prediction & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResultsCard prediction={latestPrediction} />
        <HistoryCard predictions={predictions} limit={3} />
      </div>

      {/* Analytics */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-health-foreground">Health Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {latestPrediction && distributionData.length > 0 && (
            <AnalyticsChart 
              data={distributionData} 
              type="bar" 
              dataKey="value" 
              title="Disease Probability Distribution" 
            />
          )}
          
          {predictions.length > 0 && diseaseData.length > 0 && (
            <AnalyticsChart 
              data={diseaseData} 
              type="pie" 
              dataKey="value" 
              title="Disease Frequency" 
            />
          )}
          
          {predictions.length > 1 && timeSeriesData.length > 0 && (
            <AnalyticsChart 
              data={timeSeriesData} 
              type="line" 
              dataKey="value" 
              xAxisKey="name"
              title="Predictions Over Time" 
              className="col-span-1 lg:col-span-2"
            />
          )}
          
          {(!latestPrediction || distributionData.length === 0) && (
            <Card className="health-card col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-health-foreground">
                  <Activity className="h-5 w-5 text-health-accent" />
                  <span>Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-health-foreground/60">
                <p className="text-center max-w-md">
                  Complete a prediction to see detailed health analytics.
                </p>
                <Button 
                  className="mt-4 bg-health-accent text-health-primary-foreground hover:bg-health-accent/90"
                  asChild
                >
                  <Link to="/predictions">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Start Prediction
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
