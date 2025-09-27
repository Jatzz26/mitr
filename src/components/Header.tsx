import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, LogOut, Home, BarChart3, BookOpen, Info, MessageCircle, Moon, Sun, Users } from "lucide-react";
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
    { name: "Assessment", path: "/assessment", icon: BarChart3 },
    { name: "Resources", path: "/resources", icon: BookOpen },
    { name: "Counsellors", path: "/counsellors", icon: Users },
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