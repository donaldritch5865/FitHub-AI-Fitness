import React, { useState } from 'react';
import { Calculator, Target, Droplets, Calendar, Activity, AlertCircle } from 'lucide-react';
import { UserData, DietPlanResponse } from '@/types/diet';
import BMICalculator from './BMICalculator';
import LoadingSpinner from './LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface DietFormProps {
  onPlanGenerated: (plan: DietPlanResponse) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DietForm: React.FC<DietFormProps> = ({ onPlanGenerated, loading, setLoading }) => {
  const [formData, setFormData] = useState<UserData>({
    age: 25,
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    fitnessGoal: 'lose_weight',
    dietaryPreference: 'vegetarian',
    sugarIntake: 'moderate',
    waterIntake: 8,
    upcomingEvent: '',
    sportsInterest: '',
    pastFitnessIssues: '',
  });

  const [errors, setErrors] = useState<Partial<UserData>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};

    if (formData.age < 16 || formData.age > 100) {
      newErrors.age = 16;
    }
    if (formData.height < 100 || formData.height > 250) {
      newErrors.height = 100;
    }
    if (formData.currentWeight < 30 || formData.currentWeight > 300) {
      newErrors.currentWeight = 30;
    }
    if (formData.targetWeight < 30 || formData.targetWeight > 300) {
      newErrors.targetWeight = 30;
    }
    if (formData.waterIntake < 1 || formData.waterIntake > 20) {
      newErrors.waterIntake = 1;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response - in production this would be from your backend
      const mockResponse: DietPlanResponse = {
        userData: formData,
        bmiData: {
          bmi: formData.currentWeight / ((formData.height / 100) ** 2),
          category: 'Normal',
          estimatedGoalDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
        },
        aiResponse: `**Personalized Diet Plan for ${formData.fitnessGoal.replace('_', ' ')}**

Based on your profile, here's your customized plan:

**Daily Calorie Target:** ${formData.fitnessGoal === 'lose_weight' ? '1800-2000' : formData.fitnessGoal === 'gain_weight' ? '2500-2800' : '2200-2400'} calories

**Meal Structure:**
- Breakfast: 25% of daily calories
- Lunch: 35% of daily calories  
- Dinner: 30% of daily calories
- Snacks: 10% of daily calories

**Key Recommendations:**
- Follow ${formData.dietaryPreference} diet preferences
- Drink ${formData.waterIntake} glasses of water daily
- ${formData.sugarIntake === 'low' ? 'Maintain low sugar intake' : formData.sugarIntake === 'moderate' ? 'Keep sugar intake moderate' : 'Gradually reduce sugar intake'}

**Sample Daily Menu:**

**Breakfast:**
- Oatmeal with fruits and nuts
- Green tea or coffee

**Lunch:**
- Quinoa bowl with vegetables
- Lean protein source
- Side salad

**Dinner:**
- Grilled vegetables
- Brown rice or whole grain
- Protein as per dietary preference

**Snacks:**
- Fresh fruits
- Nuts or seeds
- Yogurt (if not vegan)

**Exercise Recommendations:**
${formData.sportsInterest ? `Continue with ${formData.sportsInterest} activities` : 'Include 30 minutes of moderate exercise daily'}

**Timeline:**
Expected to reach target weight by: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
        timestamp: new Date().toISOString()
      };

      onPlanGenerated(mockResponse);
      toast({
        title: "Diet Plan Generated!",
        description: "Your personalized diet plan has been created successfully.",
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate diet plan. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Tell us about yourself
          </h2>
          <p className="text-gray-300">
            Provide your details to get a personalized diet plan
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calculator className="w-4 h-4 inline mr-2" />
                Age (years)
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.age ? 'border-red-500' : 'border-gray-600'} bg-gray-800 text-white placeholder:text-gray-400`}
                min="16"
                max="100"
                required
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Age must be between 16-100
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.height ? 'border-red-500' : 'border-gray-600'} bg-gray-800 text-white placeholder:text-gray-400`}
                min="100"
                max="250"
                required
              />
              {errors.height && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Height must be between 100-250 cm
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Weight (kg)
              </label>
              <input
                type="number"
                value={formData.currentWeight}
                onChange={(e) => handleInputChange('currentWeight', parseInt(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.currentWeight ? 'border-red-500' : 'border-gray-600'} bg-gray-800 text-white placeholder:text-gray-400`}
                min="30"
                max="300"
                required
              />
              {errors.currentWeight && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Weight must be between 30-300 kg
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Target Weight (kg)
              </label>
              <input
                type="number"
                value={formData.targetWeight}
                onChange={(e) => handleInputChange('targetWeight', parseInt(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.targetWeight ? 'border-red-500' : 'border-gray-600'} bg-gray-800 text-white placeholder:text-gray-400`}
                min="30"
                max="300"
                required
              />
              {errors.targetWeight && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Weight must be between 30-300 kg
                </p>
              )}
            </div>
          </div>

          {/* BMI Calculator */}
          <BMICalculator 
            height={formData.height} 
            weight={formData.currentWeight}
            targetWeight={formData.targetWeight}
          />

          {/* Goals and Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fitness Goal
              </label>
              <select
                value={formData.fitnessGoal}
                onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white"
                required
              >
                <option value="lose_weight">Lose Weight</option>
                <option value="gain_weight">Gain Weight</option>
                <option value="build_muscle">Build Muscle</option>
                <option value="maintain">Maintain Current Weight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dietary Preference
              </label>
              <select
                value={formData.dietaryPreference}
                onChange={(e) => handleInputChange('dietaryPreference', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white"
                required
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sugar Intake Frequency
              </label>
              <select
                value={formData.sugarIntake}
                onChange={(e) => handleInputChange('sugarIntake', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white"
                required
              >
                <option value="low">Low (Rarely)</option>
                <option value="moderate">Moderate (Sometimes)</option>
                <option value="high">High (Frequently)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Droplets className="w-4 h-4 inline mr-2" />
                Daily Water Intake (glasses)
              </label>
              <input
                type="number"
                value={formData.waterIntake}
                onChange={(e) => handleInputChange('waterIntake', parseInt(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.waterIntake ? 'border-red-500' : 'border-gray-600'} bg-gray-800 text-white placeholder:text-gray-400`}
                min="1"
                max="20"
                required
              />
              {errors.waterIntake && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Water intake must be between 1-20 glasses
                </p>
              )}
            </div>
          </div>

          {/* Optional Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">
              Additional Information (Optional)
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Upcoming Event
              </label>
              <input
                type="text"
                value={formData.upcomingEvent}
                onChange={(e) => handleInputChange('upcomingEvent', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder:text-gray-400"
                placeholder="e.g., Wedding, Marathon, Beach vacation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Activity className="w-4 h-4 inline mr-2" />
                Sports Interest
              </label>
              <input
                type="text"
                value={formData.sportsInterest}
                onChange={(e) => handleInputChange('sportsInterest', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder:text-gray-400"
                placeholder="e.g., Running, Swimming, Yoga, Gym"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Past Fitness Issues
              </label>
              <textarea
                value={formData.pastFitnessIssues}
                onChange={(e) => handleInputChange('pastFitnessIssues', e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder:text-gray-400"
                rows={3}
                placeholder="Any past injuries, medical conditions, or dietary restrictions"
              />
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold text-lg px-12 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Generating Your Plan...' : 'Generate My Diet Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DietForm;