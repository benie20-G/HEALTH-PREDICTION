
import { useState, useEffect } from 'react';
import { usePrediction } from '@/context/PredictionContext';
import PredictionForm from '@/components/ui/PredictionForm';
import ResultsCard from '@/components/ui/ResultsCard';
import AdviceCard from '@/components/ui/AdviceCard';
import AnalyticsChart from '@/components/ui/AnalyticsChart';
import { generateDistributionData } from '@/utils/predictionUtils';

const Predictions = () => {
  const { latestPrediction } = usePrediction();
  const [distributionData, setDistributionData] = useState([]);

  // Update chart data when prediction changes
  useEffect(() => {
    if (latestPrediction) {
      setDistributionData(generateDistributionData(latestPrediction.symptoms));
    }
  }, [latestPrediction]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-health-foreground mb-2">Disease Prediction</h1>
        <p className="text-health-foreground/70">
          Select your symptoms to receive a prediction and personalized health advice
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prediction Form */}
        <div className="lg:col-span-5">
          <PredictionForm />
        </div>

        {/* Results and Advice */}
        <div className="lg:col-span-7 space-y-6">
          <ResultsCard prediction={latestPrediction} />
          
          {latestPrediction && distributionData.length > 0 && (
            <AnalyticsChart 
              data={distributionData} 
              type="bar" 
              dataKey="probability" 
              title="Other Possible Conditions" 
            />
          )}
          
          <AdviceCard prediction={latestPrediction} />
        </div>
      </div>
    </div>
  );
};

export default Predictions;
