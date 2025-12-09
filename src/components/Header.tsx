import { format } from 'date-fns';
import { Sparkles, Church, Trophy } from 'lucide-react';

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
    if (hour < 12) return 'from-amber-400 via-orange-400 to-rose-400';
    if (hour < 17) return 'from-sky-400 via-blue-400 to-indigo-400';
    return 'from-indigo-500 via-purple-500 to-pink-400';
  };

  return (
    <header className="relative overflow-hidden">
      {/* Colorful Hero Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-90`} />
      
      {/* Decorative patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-8 right-8 text-3xl animate-float opacity-30">✨</div>
      </div>
      
      {/* Content */}
      <div className="relative px-5 pt-8 pb-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
            <Church className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm tracking-wide">CYSMF</h2>
            <p className="text-white/60 text-xs">Ministry Tracker</p>
          </div>
        </div>

        {/* Weekly Challenge Banner - Centered */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-xl border border-emerald-300/40">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
              <Trophy className="h-5 w-5 text-yellow-200" />
            </div>
            <div className="text-left">
              <p className="text-yellow-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                🏆 Weekly Challenge
              </p>
              <p className="text-white text-sm font-bold">
                Top Ministry Hours Wins 2,000 RWF Data!
              </p>
              <p className="text-emerald-100 text-[10px] mt-0.5">
                For CYSMF Integrated Members Only
              </p>
            </div>
            <div className="text-3xl">🎁</div>
          </div>
        </div>

        {/* Greeting Section */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase">
              {format(today, 'EEEE')}
            </span>
            <span className="text-white/70 text-xs">
              {format(today, 'MMMM d, yyyy')}
            </span>
          </div>
          
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
            <span>{greeting()}</span>
            <span className="text-2xl animate-float">{getGreetingEmoji()}</span>
          </h1>
          
          <p className="text-lg font-display font-semibold text-white/90 mt-0.5">
            Missionary 🙌
          </p>
        </div>
        
        {/* Scripture Card */}
        <div className="relative p-3.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl">
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-amber-800" />
          </div>
          <p className="text-white/90 text-sm italic leading-relaxed">
            "Go into all the world and preach the gospel to all creation"
          </p>
          <p className="text-white font-bold text-sm mt-1.5 flex items-center gap-2">
            <span className="w-5 h-0.5 bg-white/50 rounded-full"></span>
            Mark 16:15
          </p>
        </div>
      </div>
      
      {/* Bottom curve */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 50V25C360 45 720 50 1080 40C1260 35 1380 25 1440 25V50H0Z" className="fill-background"/>
        </svg>
      </div>
    </header>
  );
};
