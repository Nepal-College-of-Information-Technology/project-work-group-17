
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Dumbbell, Calculator, UtensilsCrossed, Target, Users, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getWelcome } from '../services/api';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const response = await getWelcome();
        setWelcomeMessage(response.data.message || 'Welcome to FitPro');
      } catch (error) {
        console.log('Welcome API not available');
        setWelcomeMessage('Welcome to FitPro');
      }
    };
    fetchWelcome();
  }, []);

  const features = [
    {
      icon: Calculator,
      title: 'BMI Calculator',
      description: 'Calculate your Body Mass Index and get personalized recommendations',
      link: '/bmi',
      color: 'bg-blue-500'
    },
    {
      icon: UtensilsCrossed,
      title: 'Diet Plans',
      description: 'Get personalized meal recommendations with our AI chatbot',
      link: '/diet',
      color: 'bg-green-500',
      protected: true
    },
    {
      icon: Dumbbell,
      title: 'Workout Plans',
      description: 'Access professional workout routines for all fitness levels',
      link: '/workout',
      color: 'bg-orange-500',
      protected: true
    },
    {
      icon: Target,
      title: 'Exercise Library',
      description: 'Browse exercises by muscle groups with detailed instructions',
      link: '/exercises',
      color: 'bg-purple-500',
      protected: true
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', icon: Users },
    { number: '500+', label: 'Exercises', icon: Dumbbell },
    { number: '50+', label: 'Workout Plans', icon: Target },
    { number: '100+', label: 'Success Stories', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Transform Your
              <span className="text-orange-500 block">Fitness Journey</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {welcomeMessage || 'Join thousands of fitness enthusiasts using our comprehensive platform to achieve their health and fitness goals'}
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/bmi"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Try BMI Calculator
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need for your fitness journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const canAccess = !feature.protected || isAuthenticated;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative"
                >
                  <Link
                    to={canAccess ? feature.link : '/login'}
                    className={`block bg-gray-700 rounded-xl p-6 h-full hover:bg-gray-600 transition-colors ${
                      !canAccess ? 'opacity-75' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                      {feature.protected && !isAuthenticated && (
                        <span className="text-orange-500 text-sm ml-2">*Premium</span>
                      )}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-orange-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-orange-100 mb-8">
                Join our community and get access to personalized workout plans, diet recommendations, and more!
              </p>
              <Link
                to="/register"
                className="bg-white text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Join Now - It's Free!
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
