
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface SymptomType {
  id: string;
  name: string;
  value: boolean;
}

export interface PredictionResult {
  id: string;
  timestamp: Date;
  disease: string;
  probability: number;
  symptoms: SymptomType[];
  advice: string[];
}

interface PredictionContextType {
  predictions: PredictionResult[];
  addPrediction: (prediction: Omit<PredictionResult, 'id' | 'timestamp'>) => void;
  clearPredictions: () => void;
  latestPrediction: PredictionResult | null;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};

interface PredictionProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'health-predictions';

export const PredictionProvider = ({ children }: PredictionProviderProps) => {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(null);

  // Load predictions from localStorage on initial render
  useEffect(() => {
    try {
      const storedPredictions = localStorage.getItem(STORAGE_KEY);
      if (storedPredictions) {
        const parsedPredictions = JSON.parse(storedPredictions).map((pred: any) => ({
          ...pred,
          timestamp: new Date(pred.timestamp)
        }));
        setPredictions(parsedPredictions);
        
        // Set latest prediction if any exist
        if (parsedPredictions.length > 0) {
          setLatestPrediction(parsedPredictions[0]);
        }
      }
    } catch (error) {
      console.error('Error loading predictions from localStorage:', error);
    }
  }, []);

  // Save predictions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions));
    } catch (error) {
      console.error('Error saving predictions to localStorage:', error);
    }
  }, [predictions]);

  const addPrediction = (prediction: Omit<PredictionResult, 'id' | 'timestamp'>) => {
    const newPrediction: PredictionResult = {
      ...prediction,
      id: `pred-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
    };
    
    setPredictions((prev) => [newPrediction, ...prev]);
    setLatestPrediction(newPrediction);
  };

  const clearPredictions = () => {
    setPredictions([]);
    setLatestPrediction(null);
  };

  return (
    <PredictionContext.Provider
      value={{
        predictions,
        addPrediction,
        clearPredictions,
        latestPrediction,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};
