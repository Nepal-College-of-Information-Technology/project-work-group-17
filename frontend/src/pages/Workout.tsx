import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Clock, Users, TrendingUp, Calendar, Heart, Activity, ChevronRight } from "lucide-react";
import { getWorkoutPlans } from "../services/api";

interface ScheduleItem {
   day: number;
   workout: string;
}

interface WorkoutPlan {
   id: number;
   name: string;
   description: string;
   schedule?: ScheduleItem[]; // Make schedule optional
}

const Workout: React.FC = () => {
   const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
   const [activeTab, setActiveTab] = useState("all");

   useEffect(() => {
      const fetchWorkoutPlans = async () => {
         try {
            const response = await getWorkoutPlans();
            const data = response.data.workouts;
            // Ensure each plan has a schedule array, even if empty
            const plansWithSchedule = data.map((plan) => ({
               ...plan,
               schedule: plan.schedule || [],
            }));
            setWorkoutPlans(plansWithSchedule);
         } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load workout plans");
            console.error("Error fetching workout plans:", err);
         } finally {
            setLoading(false);
         }
      };

      fetchWorkoutPlans();
   }, []);

   const getWorkoutDays = (schedule?: ScheduleItem[]) => {
      if (!schedule || !Array.isArray(schedule)) return 0;
      return schedule.filter((item) => item.workout && !item.workout.toLowerCase().includes("rest")).length;
   };

   const getLevel = (plan: WorkoutPlan) => {
      const workoutDays = getWorkoutDays(plan.schedule);
      if (workoutDays >= 5) return "Advanced";
      if (workoutDays >= 3) return "Intermediate";
      return "Beginner";
   };

   const getLevelColor = (level: string) => {
      switch (level.toLowerCase()) {
         case "beginner":
            return "bg-emerald-500";
         case "intermediate":
            return "bg-amber-500";
         case "advanced":
            return "bg-rose-500";
         default:
            return "bg-gray-500";
      }
   };

   const getLevelIcon = (level: string) => {
      switch (level.toLowerCase()) {
         case "beginner":
            return <Users className="h-4 w-4" />;
         case "intermediate":
            return <TrendingUp className="h-4 w-4" />;
         case "advanced":
            return <Dumbbell className="h-4 w-4" />;
         default:
            return <Users className="h-4 w-4" />;
      }
   };

   const filteredPlans = workoutPlans.filter((plan) => {
      if (activeTab === "all") return true;
      const level = getLevel(plan).toLowerCase();
      return level === activeTab;
   });

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
               <p className="text-gray-300">Loading workout plans...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <div className="bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto text-center">
               <div className="bg-rose-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-8 w-8 text-rose-500" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Error Loading Workouts</h3>
               <p className="text-gray-400 mb-4">{error}</p>
               <button
                  onClick={() => window.location.reload()}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
               >
                  Try Again
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
         {/* Header Section */}
         <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto text-center mb-12"
         >
            <div className="inline-flex items-center justify-center bg-orange-500/10 p-3 rounded-full mb-6">
               <Dumbbell className="h-8 w-8 text-orange-500" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Professional Workout Plans</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
               Scientifically designed programs to help you achieve your fitness goals
            </p>
         </motion.div>

         {/* Workout Plans Grid */}
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-7xl mx-auto"
         >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredPlans.map((plan) => {
                  const level = getLevel(plan);
                  const workoutDays = getWorkoutDays(plan.schedule);

                  return (
                     <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-orange-500 transition-all duration-300 shadow-lg"
                     >
                        <div className="p-6">
                           <div className="flex justify-between items-start mb-4">
                              <div
                                 className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${getLevelColor(
                                    level
                                 )}`}
                              >
                                 {getLevelIcon(level)}
                                 <span className="ml-1">{level}</span>
                              </div>
                              <div className="bg-gray-700 rounded-lg px-3 py-1 text-sm font-medium text-gray-300 flex items-center">
                                 <Clock className="h-3 w-3 mr-1" />
                                 {workoutDays} days/week
                              </div>
                           </div>

                           <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                           <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                           <div className="mb-6">
                              <div className="flex items-center text-gray-300 text-xs font-medium mb-2">
                                 <Calendar className="h-4 w-4 mr-2" />
                                 WEEKLY SCHEDULE
                              </div>
                              <div className="space-y-2">
                                 {(plan.schedule || []).map((item) => (
                                    <div
                                       key={`${plan.id}-${item.day}`}
                                       className="flex items-center bg-gray-700/50 rounded-lg px-3 py-2"
                                    >
                                       <div className="w-16 shrink-0 font-medium text-orange-500">Day {item.day}</div>
                                       <div className="text-gray-300 truncate">{item.workout}</div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <button
                              onClick={() => setSelectedPlan(plan)}
                              className="w-full flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                           >
                              <span>View Full Plan</span>
                              <ChevronRight className="h-4 w-4" />
                           </button>
                        </div>
                     </motion.div>
                  );
               })}
            </div>
         </motion.div>

         {/* Plan Details Modal */}
         {selectedPlan && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
               >
                  <div className="p-6">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <div
                              className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${getLevelColor(
                                 getLevel(selectedPlan)
                              )}`}
                           >
                              {getLevelIcon(getLevel(selectedPlan))}
                              <span className="ml-1">{getLevel(selectedPlan)}</span>
                           </div>
                           <h2 className="text-2xl font-bold text-white mt-2">{selectedPlan.name}</h2>
                        </div>
                        <button onClick={() => setSelectedPlan(null)} className="text-gray-400 hover:text-white">
                           ✕
                        </button>
                     </div>

                     <p className="text-gray-300 mb-6">{selectedPlan.description}</p>

                     <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                        <div className="flex items-center text-gray-300 text-sm font-medium mb-3">
                           <Calendar className="h-4 w-4 mr-2" />
                           WEEKLY WORKOUT SCHEDULE
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                           {(selectedPlan.schedule || []).map((item) => (
                              <div
                                 key={`modal-${selectedPlan.id}-${item.day}`}
                                 className="bg-gray-800 rounded-lg p-3 flex items-start"
                              >
                                 <div className="bg-orange-500/10 text-orange-500 rounded-lg w-10 h-10 flex items-center justify-center mr-3 shrink-0">
                                    {item.day}
                                 </div>
                                 <div>
                                    <div className="font-medium text-white">{item.workout}</div>
                                    {item.workout.toLowerCase().includes("rest") ? (
                                       <div className="text-gray-400 text-xs">Recovery day</div>
                                    ) : (
                                       <div className="text-orange-500 text-xs">Workout day</div>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                           Start This Program
                        </button>
                        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                           Save for Later
                        </button>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </div>
   );
};

export default Workout;
