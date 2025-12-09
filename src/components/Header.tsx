import { format } from 'date-fns';
import { Sparkles } from 'lucide-react';

export const Header = () => {
  const today = new Date();
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGreetingEmoji = () => {
    const hour = today.getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    return '🌙';
  };

  return (
    <header className="relative px-4 pt-8 pb-6 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold tracking-wider uppercase text-primary/70">
            {format(today, 'EEEE')}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {format(today, 'MMMM d, yyyy')}
          </span>
        </div>
        
        <h1 className="font-display text-3xl font-bold text-foreground mt-2 flex items-center gap-3">
          <span>{greeting()}</span>
          <span className="text-2xl animate-float">{getGreetingEmoji()}</span>
        </h1>
        
        <p className="text-lg font-display font-medium text-primary mt-1">
          Missionary
        </p>
        
        <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
          <Sparkles className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "Go into all the world and preach the gospel" 
            <span className="text-primary font-medium not-italic ml-1">— Mark 16:15</span>
          </p>
        </div>
      </div>
    </header>
  );
};
