
import { SymptomType } from '@/context/PredictionContext';

// Mock symptoms database
export const allSymptoms: SymptomType[] = [
  { id: 's1', name: 'Fever', value: false },
  { id: 's2', name: 'Cough', value: false },
  { id: 's3', name: 'Fatigue', value: false },
  { id: 's4', name: 'Difficulty Breathing', value: false },
  { id: 's5', name: 'Headache', value: false },
  { id: 's6', name: 'Sore Throat', value: false },
  { id: 's7', name: 'Body Aches', value: false },
  { id: 's8', name: 'Loss of Taste/Smell', value: false },
  { id: 's9', name: 'Runny Nose', value: false },
  { id: 's10', name: 'Nausea', value: false },
  { id: 's11', name: 'Diarrhea', value: false },
  { id: 's12', name: 'Chest Pain', value: false },
  { id: 's13', name: 'Rash', value: false },
  { id: 's14', name: 'Joint Pain', value: false },
  { id: 's15', name: 'Dizziness', value: false },
];

// Mock disease database with symptom correlations and advice
interface DiseaseType {
  name: string;
  symptoms: string[];
  advice: string[];
}

const diseases: DiseaseType[] = [
  {
    name: 'Common Cold',
    symptoms: ['Cough', 'Sore Throat', 'Runny Nose', 'Headache', 'Fatigue'],
    advice: [
      'Rest and stay hydrated',
      'Take over-the-counter pain relievers if needed',
      'Use a humidifier to ease congestion',
      'Try saline nasal drops or sprays',
      'Monitor symptoms and seek medical attention if symptoms worsen'
    ]
  },
  {
    name: 'Influenza',
    symptoms: ['Fever', 'Cough', 'Fatigue', 'Body Aches', 'Headache', 'Sore Throat'],
    advice: [
      'Rest and stay hydrated',
      'Take antiviral medications if prescribed',
      'Take over-the-counter medications for fever and pain',
      'Avoid contact with others to prevent spread',
      'Seek medical attention if symptoms are severe or worsen'
    ]
  },
  {
    name: 'COVID-19',
    symptoms: ['Fever', 'Cough', 'Fatigue', 'Difficulty Breathing', 'Loss of Taste/Smell', 'Headache'],
    advice: [
      'Isolate yourself to prevent spread',
      'Rest and stay hydrated',
      'Monitor your breathing and oxygen levels if possible',
      'Take over-the-counter medications for fever',
      'Seek immediate medical attention if experiencing severe symptoms'
    ]
  },
  {
    name: 'Allergic Reaction',
    symptoms: ['Rash', 'Runny Nose', 'Headache', 'Difficulty Breathing', 'Cough'],
    advice: [
      'Identify and avoid allergens',
      'Take antihistamines as recommended',
      'Use nasal sprays if prescribed',
      'Keep an epinephrine auto-injector if you have severe allergies',
      'Seek medical attention for severe reactions'
    ]
  },
  {
    name: 'Gastroenteritis',
    symptoms: ['Nausea', 'Diarrhea', 'Fatigue', 'Headache', 'Fever'],
    advice: [
      'Stay hydrated with clear fluids',
      'Eat bland, easy-to-digest foods',
      'Avoid dairy, caffeine, and fatty foods',
      'Rest and allow your body to recover',
      'Seek medical attention if symptoms persist or worsen'
    ]
  },
  {
    name: 'Migraine',
    symptoms: ['Headache', 'Nausea', 'Dizziness', 'Fatigue'],
    advice: [
      'Rest in a quiet, dark room',
      'Apply cold or warm compresses to your head',
      'Take pain relievers as recommended',
      'Stay hydrated and maintain regular meals',
      'Keep a headache diary to identify triggers'
    ]
  },
  {
    name: 'Pneumonia',
    symptoms: ['Fever', 'Cough', 'Difficulty Breathing', 'Chest Pain', 'Fatigue'],
    advice: [
      'Take antibiotics as prescribed (for bacterial pneumonia)',
      'Get plenty of rest',
      'Stay hydrated',
      'Take over-the-counter medications for fever and pain',
      'Seek immediate medical attention if breathing becomes difficult'
    ]
  }
];

// Calculate disease probability based on symptoms
export const predictDisease = (selectedSymptoms: SymptomType[]): {
  disease: string;
  probability: number;
  advice: string[];
} => {
  // Filter only active symptoms
  const activeSymptoms = selectedSymptoms.filter(s => s.value).map(s => s.name);
  
  if (activeSymptoms.length === 0) {
    return {
      disease: 'No Disease Detected',
      probability: 0,
      advice: ['Please select at least one symptom for a prediction.']
    };
  }

  const results = diseases.map(disease => {
    // Calculate matches between active symptoms and disease symptoms
    const matchingSymptoms = activeSymptoms.filter(s => disease.symptoms.includes(s));
    
    // Calculate probability based on matching symptoms
    const matchRatio = matchingSymptoms.length / disease.symptoms.length;
    const activeSymptomsRatio = matchingSymptoms.length / activeSymptoms.length;
    
    // Weighted probability calculation
    const probability = (matchRatio * 0.7) + (activeSymptomsRatio * 0.3);
    
    return {
      disease: disease.name,
      probability,
      advice: disease.advice
    };
  });

  // Sort by probability and get the highest
  const sortedResults = results.sort((a, b) => b.probability - a.probability);
  const topResult = sortedResults[0];

  // Scale probability to 0-100%
  return {
    disease: topResult.disease,
    probability: Math.min(Math.round(topResult.probability * 100), 100),
    advice: topResult.advice
  };
};

// Generate distribution data for charts
export const generateDistributionData = (selectedSymptoms: SymptomType[]) => {
  // Filter only active symptoms
  const activeSymptoms = selectedSymptoms.filter(s => s.value).map(s => s.name);
  
  if (activeSymptoms.length === 0) {
    return [];
  }

  return diseases.map(disease => {
    // Calculate matches between active symptoms and disease symptoms
    const matchingSymptoms = activeSymptoms.filter(s => disease.symptoms.includes(s));
    
    // Calculate probability based on matching symptoms
    const matchRatio = matchingSymptoms.length / disease.symptoms.length;
    const activeSymptomsRatio = matchingSymptoms.length / activeSymptoms.length;
    
    // Weighted probability calculation
    const probability = (matchRatio * 0.7) + (activeSymptomsRatio * 0.3);
    
    return {
      name: disease.name,
      value: Math.min(Math.round(probability * 100), 100)
    };
  }).sort((a, b) => b.value - a.value);
};

export const groupPredictionsByDisease = (predictions: any[]) => {
  const grouped = predictions.reduce((acc, prediction) => {
    const { disease } = prediction;
    if (!acc[disease]) {
      acc[disease] = 0;
    }
    acc[disease]++;
    return acc;
  }, {});

  return Object.keys(grouped).map(disease => ({
    name: disease,
    value: grouped[disease]
  }));
};

export const generateTimeSeriesData = (predictions: any[]) => {
  // Sort predictions by date
  const sorted = [...predictions].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Group by day
  const byDay: Record<string, any[]> = {};
  
  sorted.forEach(prediction => {
    const date = new Date(prediction.timestamp);
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    if (!byDay[dateKey]) {
      byDay[dateKey] = [];
    }
    
    byDay[dateKey].push(prediction);
  });

  // Create time series data
  return Object.keys(byDay).map(date => {
    const predictions = byDay[date];
    const totalProbability = predictions.reduce((sum, p) => sum + p.probability, 0);
    const avgProbability = totalProbability / predictions.length;
    
    return {
      name: date,
      value: predictions.length,
      averageProbability: Math.round(avgProbability)
    };
  });
};
