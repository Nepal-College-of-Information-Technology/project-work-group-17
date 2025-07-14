import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Search, Filter } from "lucide-react";
import axios from "axios";
import { API } from "@/services/api";

interface Exercise {
   id: number;
   name: string;
   type: string;
   equipment: string;
   muscle_group: string;
   image_url: string;
}

const Exercises: React.FC = () => {
   const [exercises, setExercises] = useState<Exercise[]>([]);
   const [loading, setLoading] = useState(false);
   const [selectedMuscle, setSelectedMuscle] = useState("chest");
   const [searchTerm, setSearchTerm] = useState("");
   const [error, setError] = useState("");

   const muscleGroups = [
      { id: "chest", name: "Chest", color: "bg-red-500" },
      { id: "back", name: "Back", color: "bg-blue-500" },
      { id: "biceps", name: "Biceps", color: "bg-green-500" },
      { id: "triceps", name: "Triceps", color: "bg-yellow-500" },
      { id: "shoulders", name: "Shoulders", color: "bg-purple-500" },
      { id: "legs", name: "Legs", color: "bg-indigo-500" },
      { id: "abs", name: "Abs", color: "bg-orange-500" },
   ];

   const fetchExercises = async (muscleGroup: string) => {
      setLoading(true);
      setError("");
      try {
         const response = await API.get(`${muscleGroup}/`);
         const data = response.data;

         // Handle different possible response structures
         if (Array.isArray(data)) {
            setExercises(data);
         } else if (data.exercises) {
            setExercises(data.exercises);
         } else if (data[`${muscleGroup}_exercises`]) {
            setExercises(data[`${muscleGroup}_exercises`]);
         } else {
            setExercises([]);
         }
      } catch (err) {
         setError(`Failed to load ${muscleGroup} exercises`);
         console.error(err);
         setExercises([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchExercises(selectedMuscle);
   }, [selectedMuscle]);

   const filteredExercises = exercises.filter(
      (exercise) =>
         exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         exercise.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
         exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const getTypeColor = (type: string) => {
      switch (type?.toLowerCase()) {
         case "compound":
            return "text-blue-400 bg-blue-500 bg-opacity-20";
         case "isolation":
            return "text-purple-400 bg-purple-500 bg-opacity-20";
         default:
            return "text-gray-400 bg-gray-500 bg-opacity-20";
      }
   };

   return (
      <div className="min-h-screen bg-gray-900 py-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
               className="text-center mb-12"
            >
               <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
               </div>
               <h1 className="text-4xl font-bold text-white mb-4">Exercise Library</h1>
               <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Browse exercises by muscle group with detailed information and visual guides
               </p>
            </motion.div>

            {/* Filters */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="mb-8 space-y-6"
            >
               {/* Search */}
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                     type="text"
                     placeholder="Search exercises..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
               </div>

               {/* Muscle Group Filter */}
               <div className="flex items-center space-x-2 mb-4">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300 font-medium">Muscle Group:</span>
               </div>
               <div className="flex flex-wrap gap-3">
                  {muscleGroups.map((group) => (
                     <button
                        key={group.id}
                        onClick={() => setSelectedMuscle(group.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                           selectedMuscle === group.id
                              ? `${group.color} text-white`
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                     >
                        {group.name}
                     </button>
                  ))}
               </div>
            </motion.div>

            {error && (
               <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-8 text-center">
                  {error}
               </div>
            )}

            {/* Loading */}
            {loading && (
               <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading {selectedMuscle} exercises...</p>
               </div>
            )}

            {/* Exercises Grid */}
            {!loading && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
               >
                  {filteredExercises.map((exercise, index) => (
                     <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-all border border-gray-700 hover:border-orange-500"
                     >
                        {/* Exercise Image */}
                        <div className="h-48 bg-gray-700 overflow-hidden">
                           {exercise.image_url ? (
                              <img
                                 src={`http://localhost:8000/static/${exercise.image_url}`}
                                 alt={exercise.name}
                                 className="w-full h-full object-cover"
                                 onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                       "https://via.placeholder.com/400x300?text=Exercise+Image";
                                 }}
                              />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-600 text-gray-400">
                                 <Target className="h-12 w-12" />
                              </div>
                           )}
                        </div>

                        <div className="p-6">
                           <div className="flex items-start justify-between mb-4">
                              <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
                              <span
                                 className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(exercise.type)}`}
                              >
                                 {exercise.type}
                              </span>
                           </div>

                           <div className="space-y-2 mb-4">
                              <div className="flex items-center space-x-2">
                                 <span className="text-gray-400 text-sm">Equipment:</span>
                                 <span className="text-white text-sm font-medium">{exercise.equipment}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <span className="text-gray-400 text-sm">Muscle Group:</span>
                                 <span className="text-white text-sm font-medium capitalize">
                                    {exercise.muscle_group}
                                 </span>
                              </div>
                           </div>

                           <button className="w-full mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                              View Details
                           </button>
                        </div>
                     </motion.div>
                  ))}
               </motion.div>
            )}

            {/* No Results */}
            {!loading && filteredExercises.length === 0 && (
               <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No exercises found</h3>
                  <p className="text-gray-500">Try adjusting your search or select a different muscle group</p>
               </div>
            )}
         </div>
      </div>
   );
};

export default Exercises;
