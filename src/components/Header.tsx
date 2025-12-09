import { format } from 'date-fns';
import { Sparkles, Church } from 'lucide-react';

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

  const getGradient = () => {
    const hour = today.getHours();
    if (hour < 12) return 'from-amber-400 via-orange-400 to-rose-400'; // Morning - warm sunrise
    if (hour < 17) return 'from-sky-400 via-blue-400 to-indigo-400'; // Afternoon - bright sky
    return 'from-indigo-500 via-purple-500 to-pink-400'; // Evening - sunset
  };

  return (
    <header className="relative overflow-hidden">
      {/* Colorful Hero Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-90`} />
      
      {/* Decorative patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        
        {/* Floating elements */}
        <div className="absolute top-8 right-8 text-3xl animate-float opacity-30">✨</div>
        <div className="absolute top-20 right-20 text-2xl animate-float opacity-20" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute bottom-12 left-8 text-2xl animate-float opacity-25" style={{ animationDelay: '0.5s' }}>🕊️</div>
      </div>
      
      {/* Content */}
      <div className="relative px-5 pt-10 pb-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
            <Church className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-white/90 font-bold text-sm tracking-wide">CYSMF</h2>
            <p className="text-white/60 text-xs">Ministry Tracker</p>
          </div>
        </div>

        {/* Greeting Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase">
              {format(today, 'EEEE')}
            </span>
            <span className="text-white/70 text-xs">
              {format(today, 'MMMM d, yyyy')}
            </span>
          </div>
          
          <h1 className="font-display text-4xl font-bold text-white flex items-center gap-3 drop-shadow-lg">
            <span>{greeting()}</span>
            <span className="text-3xl animate-float drop-shadow-lg">{getGreetingEmoji()}</span>
          </h1>
          
          <p className="text-xl font-display font-semibold text-white/90 mt-1 flex items-center gap-2">
            <span>Missionary</span>
            <span className="text-2xl">🙌</span>
          </p>
        </div>
        
        {/* Scripture Card */}
        <div className="relative p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl">
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center shadow-lg">
            <Sparkles className="h-4 w-4 text-amber-800" />
          </div>
          <p className="text-white/90 text-sm italic leading-relaxed">
            "Go into all the world and preach the gospel to all creation"
          </p>
          <p className="text-white font-bold text-sm mt-2 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-white/50 rounded-full"></span>
            Mark 16:15
          </p>
        </div>
      </div>
      
      {/* Bottom curve */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V30C240 50 480 60 720 50C960 40 1200 20 1440 30V60H0Z" className="fill-background"/>
        </svg>
      </div>
    </header>
  );
};
