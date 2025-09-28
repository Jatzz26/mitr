import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Dashboard from "@/pages/Dashboard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chatbot from "@/pages/Chatbot";
import Booking from "@/pages/Booking";
import Groups from "@/pages/Groups";
import Assessment from "@/pages/Assessment";
import Journal from "@/pages/Journal";
import Resources from "@/pages/Resources";
import Counsellors from "@/pages/Counsellors";
import AboutPage from "@/pages/About";
import ResetPassword from "@/pages/auth/ResetPassword";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior }); } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
                <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
                <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
                <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                <Route path="/counsellors" element={<ProtectedRoute><Counsellors /></ProtectedRoute>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
