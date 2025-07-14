
import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:8000/app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const registerUser = (data: RegisterData) => API.post('register/', data);
export const loginUser = (data: LoginData) => API.post('login/', data);
export const getUser = () => API.get('user_details/');
export const fetchUserDetails = () => API.get('fetch_user_details/');

// Main features
export const calculateBMI = (data: BMIData) => API.post('BMI/', data);
export const getWorkoutPlans = () => API.get('Workout/');

// Exercise endpoints
export const getChestExercises = () => API.get('chest/');
export const getBackExercises = () => API.get('back/');
export const getBicepsExercises = () => API.get('biceps/');
export const getTricepsExercises = () => API.get('triceps/');
export const getShouldersExercises = () => API.get('shoulders/');
export const getLegsExercises = () => API.get('legs/');
export const getAbsExercises = () => API.get('abs/');

// Bonus endpoints
export const getChatbotResponse = (data: any) => API.post('/chatbot/', data);
export const healthCheck = () => API.get('/health/');
export const getWelcome = () => API.get('/');

// TypeScript interfaces
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface BMIData {
  weight: number;
  height: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Exercise {
  id: number;
  name: string;
  type: string;
  equipment: string;
  difficulty?: string;
  instructions?: string;
}

export interface WorkoutPlan {
  id: number;
  name: string;
  description: string;
  duration: string;
  level: string;
}
