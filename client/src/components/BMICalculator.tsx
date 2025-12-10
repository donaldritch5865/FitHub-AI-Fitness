import React from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BMICalculatorProps {
  height: number;
  weight: number;
  targetWeight: number;
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ height, weight, targetWeight }) => {
  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const getEstimatedDate = (currentWeight: number, targetWeight: number): string => {
    const weightDifference = Math.abs(currentWeight - targetWeight);
    const daysNeeded = Math.ceil(weightDifference * 15); // 15 days per kg
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysNeeded);
    return targetDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const currentBMI = calculateBMI(weight, height);
  const targetBMI = calculateBMI(targetWeight, height);
  const currentBMIData = getBMICategory(currentBMI);
  const targetBMIData = getBMICategory(targetBMI);
  const estimatedDate = getEstimatedDate(weight, targetWeight);

  const getGoalIcon = () => {
    if (targetWeight < weight) return <TrendingDown className="w-5 h-5 text-red-500" />;
    if (targetWeight > weight) return <TrendingUp className="w-5 h-5 text-green-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-lg p-6 border border-gray-600">
      <div className="flex items-center mb-4">
        <Calculator className="w-6 h-6 text-cyan-400 mr-2" />
        <h3 className="text-xl font-semibold text-white">
          BMI Analysis
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-1">
            {currentBMI.toFixed(1)}
          </div>
          <div className={`text-sm font-medium ${currentBMIData.color.replace('text-', 'text-')} mb-1`}>
            {currentBMIData.category}
          </div>
          <div className="text-xs text-gray-400">
            Current BMI
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-1">
            {targetBMI.toFixed(1)}
          </div>
          <div className={`text-sm font-medium ${targetBMIData.color.replace('text-', 'text-')} mb-1`}>
            {targetBMIData.category}
          </div>
          <div className="text-xs text-gray-400">
            Target BMI
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            {getGoalIcon()}
            <span className="text-lg font-semibold text-white ml-2">
              {Math.abs(weight - targetWeight).toFixed(1)} kg
            </span>
          </div>
          <div className="text-sm text-gray-300 mb-1">
            Goal by {estimatedDate}
          </div>
          <div className="text-xs text-gray-400">
            Estimated timeline
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-300 text-center">
          <strong>Note:</strong> Timeline estimate is based on healthy weight change of ~0.5kg per week. 
          Actual results may vary based on individual factors.
        </p>
      </div>
    </div>
  );
};

export default BMICalculator;