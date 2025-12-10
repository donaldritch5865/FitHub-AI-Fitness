import { Brain, Activity, Target } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="w-12 h-12 text-purple-400" />,
      title: "Real-time Pose Detection",
      description: "Advanced AI algorithms analyze your posture and movements in real-time, providing instant feedback for optimal form and maximum results."
    },
    {
      icon: <Activity className="w-12 h-12 text-pink-400" />,
      title: "Smart Workout Planning", 
      description: "Personalized exercise routines that adapt to your fitness level, goals, and preferences using machine learning intelligence."
    },
    {
      icon: <Target className="w-12 h-12 text-blue-400" />,
      title: "Precision Nutrition",
      description: "AI-driven dietary recommendations tailored to your body type, lifestyle, and fitness objectives for optimal nutrition."
    }
  ];

  return (
    <section id="features-section" className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Powered by
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Advanced AI
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-4 rounded-full border border-gray-600">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;