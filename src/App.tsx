import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { useAuth } from "@/hooks/useAuth";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import FarmerDashboard from "./pages/FarmerDashboard";
import AIGuidance from "./pages/AIGuidance";
import MyProjects from "./pages/MyProjects";
import IoTDevices from "./pages/IoTDevices";
import IPLearning from "./pages/IPLearning";
import ClubHub from "./pages/ClubHub";
import SettingsPage from "./pages/Settings";
import About from "./pages/About";
import PledgeWall from "./pages/PledgeWall";
import ClubActivities from "./pages/ClubActivities";
import RegistrationGuide from "./pages/RegistrationGuide";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center animate-pulse" style={{ background: 'var(--gradient-emerald)' }}>
          <span className="text-white text-lg">🌱</span>
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/ai-guidance" element={<ProtectedRoute><AIGuidance /></ProtectedRoute>} />
      <Route path="/dashboard/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
      <Route path="/dashboard/devices" element={<ProtectedRoute><IoTDevices /></ProtectedRoute>} />
      <Route path="/dashboard/ip-learning" element={<ProtectedRoute><IPLearning /></ProtectedRoute>} />
      <Route path="/dashboard/club-hub" element={<ProtectedRoute><ClubHub /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      <Route path="/dashboard/pledge-wall" element={<ProtectedRoute><PledgeWall /></ProtectedRoute>} />
      <Route path="/dashboard/activities" element={<ProtectedRoute><ClubActivities /></ProtectedRoute>} />
      <Route path="/dashboard/registration" element={<ProtectedRoute><RegistrationGuide /></ProtectedRoute>} />
      <Route path="/dashboard/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
