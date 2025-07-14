
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Sparkles, Send, Apple, Coffee, Sandwich, Cookie } from 'lucide-react';
import { getChatbotResponse } from '../services/api';

const Diet: React.FC = () => {
  const [message, setMessage] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sampleMeals = [
    {
      id: 1,
      title: 'Breakfast Power Bowl',
      description: 'Oatmeal with berries, nuts, and Greek yogurt',
      calories: '350 cal',
      icon: Coffee,
      color: 'bg-yellow-500'
    },
    {
      id: 2,
      title: 'Protein-Packed Lunch',
      description: 'Grilled chicken salad with quinoa and vegetables',
      calories: '480 cal',
      icon: Apple,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Balanced Dinner',
      description: 'Salmon with sweet potato and steamed broccoli',
      calories: '520 cal',
      icon: Sandwich,
      color: 'bg-blue-500'
    },
    {
      id: 4,
      title: 'Healthy Snack',
      description: 'Mixed nuts and dried fruits energy blend',
      calories: '180 cal',
      icon: Cookie,
      color: 'bg-purple-500'
    }
  ];

  const quickPrompts = [
    "I want to lose weight, what should I eat?",
    "High protein meal ideas for muscle gain",
    "Vegetarian diet plan for beginners",
    "Quick breakfast ideas for busy mornings",
    "Post-workout nutrition suggestions"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await getChatbotResponse({ message });
      setRecommendations([...recommendations, {
        id: Date.now(),
        question: message,
        answer: response.data.response || response.data.message,
        timestamp: new Date()
      }]);
      setMessage('');
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      // Demo response for fallback
      setRecommendations([...recommendations, {
        id: Date.now(),
        question: message,
        answer: "Here's a personalized meal plan based on your preferences: Focus on lean proteins, complex carbohydrates, and plenty of vegetables. Consider having 3 main meals and 2 healthy snacks throughout the day.",
        timestamp: new Date()
      }]);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Diet Recommendations</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">
            Get personalized meal suggestions from our AI nutrition assistant ✨
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-pink-400" />
              <h2 className="text-2xl font-semibold text-white">AI Nutrition Assistant</h2>
            </div>

            {/* Quick Prompts */}
            <div className="mb-6">
              <p className="text-pink-100 text-sm mb-3">Try these quick questions:</p>
              <div className="space-y-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="block w-full text-left bg-white bg-opacity-10 hover:bg-opacity-20 text-pink-100 text-sm px-3 py-2 rounded-lg transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your diet, nutrition goals, meal planning..."
                className="w-full h-24 px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-pink-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                required
              />
              
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Get Recommendations</span>
                  </>
                )}
              </button>
            </form>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-6 space-y-4 max-h-64 overflow-y-auto">
                {recommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white bg-opacity-10 rounded-lg p-4"
                  >
                    <div className="font-medium text-pink-200 mb-2">Q: {rec.question}</div>
                    <div className="text-white text-sm">{rec.answer}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sample Meal Plans */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h2 className="text-2xl font-semibold text-white mb-6">Popular Meal Ideas</h2>
              <div className="space-y-4">
                {sampleMeals.map((meal, index) => {
                  const Icon = meal.icon;
                  return (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${meal.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{meal.title}</h3>
                          <p className="text-pink-100 text-sm">{meal.description}</p>
                        </div>
                        <div className="text-pink-200 text-sm font-medium">
                          {meal.calories}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
              <h3 className="text-xl font-semibold text-white mb-4">💡 Nutrition Tips</h3>
              <ul className="space-y-3 text-pink-100">
                <li className="flex items-start space-x-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Eat a variety of colorful fruits and vegetables daily</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Stay hydrated with 8-10 glasses of water per day</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Include lean protein with every meal</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Plan your meals ahead for better consistency</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
