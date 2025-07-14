
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import BMI from "./pages/BMI";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Diet from "./pages/Diet";
import Workout from "./pages/Workout";
import Exercises from "./pages/Exercises";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bmi" element={<BMI />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/diet" 
                element={
                  <ProtectedRoute>
                    <Diet />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/workout" 
                element={
                  <ProtectedRoute>
                    <Workout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exercises" 
                element={
                  <ProtectedRoute>
                    <Exercises />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
