
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Scale, Ruler, TrendingUp } from 'lucide-react';
import { calculateBMI, BMIData } from '../services/api';

const BMI: React.FC = () => {
  const [formData, setFormData] = useState<BMIData>({
    weight: 0,
    height: 0
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await calculateBMI(formData);
      setResult(response.data);
    } catch (err) {
      setError('Failed to calculate BMI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400', bg: 'bg-blue-500' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-400', bg: 'bg-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { category: 'Obese', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const bmiRanges = [
    { range: 'Below 18.5', category: 'Underweight', color: 'bg-blue-500' },
    { range: '18.5 - 24.9', category: 'Normal weight', color: 'bg-green-500' },
    { range: '25.0 - 29.9', category: 'Overweight', color: 'bg-yellow-500' },
    { range: '30.0 and above', category: 'Obese', color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">BMI Calculator</h1>
          <p className="text-xl text-gray-400">
            Calculate your Body Mass Index and get personalized health insights
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Enter Your Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Scale className="inline h-4 w-4 mr-2" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your weight in kg"
                  required
                  min="1"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  <Ruler className="inline h-4 w-4 mr-2" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your height in cm"
                  required
                  min="1"
                  step="0.1"
                />
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !formData.weight || !formData.height}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Calculating...' : 'Calculate BMI'}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 rounded-xl p-8"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">Your BMI Result</h3>
                  <div className="text-5xl font-bold text-orange-500 mb-2">
                    {result.bmi?.toFixed(1) || 'N/A'}
                  </div>
                  {result.bmi && (
                    <div className={`text-lg font-medium ${getBMICategory(result.bmi).color}`}>
                      {getBMICategory(result.bmi).category}
                    </div>
                  )}
                </div>

                {result.message && (
                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-gray-300">{result.message}</p>
                  </div>
                )}

                <div className="flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-gray-300">Track your progress over time</span>
                </div>
              </motion.div>
            )}

            {/* BMI Chart */}
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">BMI Categories</h3>
              <div className="space-y-4">
                {bmiRanges.map((range, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className={`w-4 h-4 rounded-full ${range.color}`}></div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{range.category}</div>
                      <div className="text-gray-400 text-sm">{range.range}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BMI;
