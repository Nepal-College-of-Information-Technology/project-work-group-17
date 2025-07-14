import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
   id: string;
   username: string;
   email: string;
   // Add other user properties as needed
}

interface AuthContextType {
   user: User | null;
   token: string | null;
   login: (token: string, userData: User) => void;
   logout: () => void;
   isAuthenticated: boolean;
   isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};

interface AuthProviderProps {
   children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const [user, setUser] = useState<User | null>(null);
   const [token, setToken] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const initializeAuth = async () => {
         try {
            const storedToken = localStorage.getItem("authToken");
            const storedUser = localStorage.getItem("authUser");

            if (storedToken && storedUser) {
               const parsedUser = JSON.parse(storedUser);
               if (isValidUser(parsedUser)) {
                  setToken(storedToken);
                  setUser(parsedUser);
               } else {
                  console.warn("Stored user data is invalid");
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("authUser");
               }
            }
         } catch (error) {
            console.error("Failed to initialize auth", error);
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
         } finally {
            setIsLoading(false);
         }
      };

      initializeAuth();
   }, []);

   const isValidUser = (data: any): data is User => {
      return (
         data && typeof data.username === "string" && typeof data.email === "string"
         // Add id check if available
      );
   };

   const login = (newToken: string, userData: User) => {
      if (!isValidUser(userData)) {
         throw new Error("Invalid user data provided");
      }

      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
   };

   const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setToken(null);
      setUser(null);
   };

   const value = {
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      isLoading,
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
