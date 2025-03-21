
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Stethoscope, 
  History, 
  Menu, 
  X, 
  User, 
  Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    path: "/", 
    label: "Dashboard", 
    icon: Activity 
  },
  { 
    path: "/predictions", 
    label: "Disease Prediction", 
    icon: Stethoscope 
  },
  { 
    path: "/history", 
    label: "Prediction History", 
    icon: History 
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-8",
      scrolled ? "bg-health-background/90 backdrop-blur-md shadow-lg" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Stethoscope className="h-6 w-6 text-health-accent" />
          <span className="text-xl font-bold text-health-foreground">HealthPredict</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "text-health-accent" 
                  : "text-health-foreground/70 hover:text-health-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-health-foreground/70 hover:text-health-foreground hover:bg-health-card">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-health-foreground/70 hover:text-health-foreground hover:bg-health-card">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-health-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-0 bg-health-background/95 backdrop-blur-lg transition-transform duration-300 ease-in-out z-40 pt-20 px-6 md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col space-y-6 mt-8">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center space-x-3 text-lg font-medium py-2 transition-colors duration-200",
                isActive 
                  ? "text-health-accent" 
                  : "text-health-foreground/70 hover:text-health-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="h-px w-full bg-health-foreground/10 my-2" />
          <Button variant="ghost" className="justify-start px-2 text-health-foreground/70 hover:text-health-foreground">
            <User className="h-5 w-5 mr-3" />
            <span className="text-lg">Profile</span>
          </Button>
          <Button variant="ghost" className="justify-start px-2 text-health-foreground/70 hover:text-health-foreground">
            <Settings className="h-5 w-5 mr-3" />
            <span className="text-lg">Settings</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
