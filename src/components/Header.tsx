import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, LogOut, Home, BarChart3, BookOpen, Info, MessageCircle, Moon, Sun, Users, Stethoscope, Shield, Radio, Rocket, AlertTriangle, HeartPulse } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fsOpen, setFsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navigationItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Innovation", path: "/innovation", icon: Rocket },
    { name: "Care & Community", path: "/community", icon: Users },
    { name: "About Us", path: "/about", icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;
  const displayName = (() => {
    const meta: any = user?.user_metadata || {};
    const full = meta.full_name || meta.name || "";
    if (full) return full.split(" ")[0];
    const email = user?.email || "";
    return email ? email.split("@")[0] : "";
  })();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              mitर
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* For Students mega dropdown */}
            <DropdownMenu open={fsOpen} onOpenChange={setFsOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${fsOpen ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-primary hover:bg-muted"}`}
                >
                  <span>For Students</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[860px] p-6 bg-card border border-card-border shadow-2xl rounded-xl z-[60]">
                <div className="grid grid-cols-4 gap-6">
                  {/* Column 1 */}
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-3">Getting started</div>
                    <div className="space-y-2">
                      <button onClick={() => navigate('/assessment')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <HeartPulse className="w-4 h-4 text-primary"/> Assessment
                      </button>
                      <button onClick={() => navigate('/resources')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <BookOpen className="w-4 h-4 text-primary"/> Resources
                      </button>
                      <button onClick={() => navigate('/counsellors')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Users className="w-4 h-4 text-primary"/> Counsellors
                      </button>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-3">Innovation</div>
                    <div className="space-y-2">
                      <button onClick={() => navigate('/locker')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Shield className="w-4 h-4 text-primary"/> Health Locker (ABDM)
                      </button>
                      <button onClick={() => navigate('/devices')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Radio className="w-4 h-4 text-primary"/> IoT Devices
                      </button>
                      <button onClick={() => navigate('/innovation')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Rocket className="w-4 h-4 text-primary"/> Innovation Launchpad
                      </button>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-3">Care & community</div>
                    <div className="space-y-2">
                      <button onClick={() => navigate('/symptom-checker')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Stethoscope className="w-4 h-4 text-primary"/> Symptom Checker
                      </button>
                      <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Users className="w-4 h-4 text-primary"/> Community
                      </button>
                      <button onClick={() => navigate('/emergency')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <AlertTriangle className="w-4 h-4 text-primary"/> Emergency
                      </button>
                    </div>
                  </div>

                  {/* Column 4: promo */}
                  <div className="col-span-1">
                    <div className="h-full rounded-xl border border-card-border bg-card p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-foreground">Welcome to mitr</div>
                        <p className="text-sm text-muted-foreground">Your student wellbeing & innovation hub.</p>
                      </div>
                      <Button className="mt-3" onClick={() => navigate(user ? '/dashboard' : '/signup')}>
                        {user ? 'Open Dashboard' : 'Get Started'}
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Auth Buttons and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            
            {!user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-blue-600" 
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md" 
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{displayName ? `Hi, ${displayName}` : user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/chatbot")}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    AI Chatbot
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-1 pt-4">
              {/* For Students group on mobile */}
              <div className="px-4 py-3 rounded-lg bg-gray-50">
                <div className="text-sm font-semibold text-gray-800 mb-2">For Students</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/assessment'); setIsMenuOpen(false); }}><HeartPulse className="w-4 h-4 mr-2"/>Assessment</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/resources'); setIsMenuOpen(false); }}><BookOpen className="w-4 h-4 mr-2"/>Resources</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/counsellors'); setIsMenuOpen(false); }}><Users className="w-4 h-4 mr-2"/>Counsellors</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/symptom-checker'); setIsMenuOpen(false); }}><Stethoscope className="w-4 h-4 mr-2"/>Symptom Checker</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/locker'); setIsMenuOpen(false); }}><Shield className="w-4 h-4 mr-2"/>Health Locker</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/devices'); setIsMenuOpen(false); }}><Radio className="w-4 h-4 mr-2"/>IoT Devices</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/innovation'); setIsMenuOpen(false); }}><Rocket className="w-4 h-4 mr-2"/>Launchpad</Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/community'); setIsMenuOpen(false); }}><Users className="w-4 h-4 mr-2"/>Community</Button>
                </div>
              </div>

              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {/* Theme Toggle for Mobile */}
                <Button
                  variant="ghost"
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-5 h-5" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </Button>
                
                {!user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-blue-600" 
                      onClick={() => { 
                        setIsMenuOpen(false); 
                        navigate("/login"); 
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" 
                      onClick={() => { 
                        setIsMenuOpen(false); 
                        navigate("/signup"); 
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4" />
                      <span>{displayName ? `Hi, ${displayName}` : user.email}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-blue-600" 
                      onClick={() => { 
                        setIsMenuOpen(false); 
                        navigate("/dashboard"); 
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-blue-600" 
                      onClick={() => { 
                        setIsMenuOpen(false); 
                        handleSignOut(); 
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;