import { Dumbbell, Zap, Target, User } from "lucide-react";

interface WorkoutRecommendationsProps {
  selectedBodyType?: 'Ectomorph' | 'Mesomorph' | 'Endomorph' | null;
}

const WorkoutRecommendations = ({ selectedBodyType }: WorkoutRecommendationsProps) => {
  const workoutPlans = [
    {
      bodyType: 'Ectomorph',
      title: 'Muscle Building Focus',
      description: 'Heavy lifting with longer rest periods to maximize muscle growth',
      focus: 'Bulk & Strength',
      exercises: [
        'Compound lifts (squats, deadlifts)',
        'Progressive overload training',
        'Minimal cardio, focus on weights'
      ],
      color: 'from-accent to-accent/70',
      icon: Zap,
      recommended: selectedBodyType === 'Ectomorph'
    },
    {
      bodyType: 'Mesomorph',
      title: 'Balanced Training',
      description: 'Mix of strength training and cardio for optimal body composition',
      focus: 'Athletic Performance',
      exercises: [
        'Strength training 4-5x/week',
        'HIIT cardio sessions',
        'Functional movement patterns'
      ],
      color: 'from-primary to-primary-glow',
      icon: Target,
      recommended: selectedBodyType === 'Mesomorph'
    },
    {
      bodyType: 'Endomorph',
      title: 'Fat Loss Priority',
      description: 'High-intensity workouts combined with metabolic training',
      focus: 'Lean & Tone',
      exercises: [
        'Circuit training',
        'Cardio 5-6x/week',
        'High-rep strength training'
      ],
      color: 'from-secondary to-secondary/70',
      icon: User,
      recommended: selectedBodyType === 'Endomorph'
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Personalized Workout Plans
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Each body type responds differently to exercise. Choose the plan that matches your natural physique for optimal results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {workoutPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.bodyType}
                className={`p-6 relative overflow-hidden transition-all duration-500 hover:scale-105 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border ${
                  plan.recommended 
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' 
                    : 'border-gray-700/50 shadow-xl hover:border-purple-500/30'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Recommended for You
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon and Header */}
                  <div className="text-center">
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center shadow-lg mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.bodyType}
                    </h3>
                    <div className="bg-gray-700 border border-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {plan.focus}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      {plan.title}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Exercise List */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h5 className="font-medium text-white mb-3 text-sm">Key Training Elements:</h5>
                    <ul className="space-y-2">
                      {plan.exercises.map((exercise, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                          <Dumbbell className="h-3 w-3 mt-1 flex-shrink-0 text-cyan-400" />
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button 
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      plan.recommended 
                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                    }`}
                  >
                    Get {plan.bodyType} Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkoutRecommendations;