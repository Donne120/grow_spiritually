import { Home, BarChart2, Clock, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: Clock },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom">
      {/* Gradient blur background */}
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/98 to-card/90 backdrop-blur-xl border-t border-border/50" />
      
      <div className="relative flex items-center justify-around h-18 max-w-lg mx-auto py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Active background glow */}
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 blur-xl animate-pulse-slow" />
                </div>
              )}
              
              <div className={cn(
                'relative p-2 rounded-xl transition-all duration-300',
                isActive && 'bg-primary/10'
              )}>
                <Icon
                  className={cn(
                    'h-5 w-5 transition-all duration-300',
                    isActive && 'scale-110'
                  )}
                />
              </div>
              
              <span className={cn(
                'text-xs mt-1 font-medium transition-all duration-300',
                isActive && 'font-semibold text-primary'
              )}>
                {tab.label}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
