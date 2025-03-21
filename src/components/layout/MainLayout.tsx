
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-health-background text-health-foreground">
      <Navbar />
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="animate-enter">
          {children}
        </div>
      </main>
      <footer className="py-6 border-t border-health-foreground/10 bg-health-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-health-foreground/60 text-sm">
          <p>© {new Date().getFullYear()} HealthPredict. All rights reserved.</p>
          <p className="mt-1">This is a demo application. Not for medical use.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
