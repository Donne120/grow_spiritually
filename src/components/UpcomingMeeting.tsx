import { useState, useEffect } from 'react';
import { Video, MessageCircle, Calendar, Clock, ExternalLink, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Meeting {
  id: string;
  name: string;
  emoji: string;
  day: number; // 0 = Sunday, 5 = Friday
  startHour: number;
  endHour: number;
  endMinute: number;
  type: 'fellowship' | 'prayer';
}

const MEETINGS: Meeting[] = [
  {
    id: 'fellowship',
    name: 'Sunday Fellowship',
    emoji: '📖',
    day: 0, // Sunday
    startHour: 15, // 3 PM
    endHour: 17,
    endMinute: 30, // 5:30 PM
    type: 'fellowship'
  },
  {
    id: 'prayer',
    name: 'Friday Prayer',
    emoji: '🙏',
    day: 5, // Friday
    startHour: 19, // 7 PM
    endHour: 21,
    endMinute: 0, // 9 PM
    type: 'prayer'
  }
];

const GOOGLE_MEET_LINK = 'https://meet.google.com/dfy-siag-nxd';
const WHATSAPP_LINK = 'https://chat.whatsapp.com/JxRzGEWgGWOFZTdfotAWhL';

export const UpcomingMeeting = () => {
  const [now, setNow] = useState(new Date());
  const [nextMeeting, setNextMeeting] = useState<Meeting | null>(null);
  const [timeUntil, setTimeUntil] = useState<string>('');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Get current time in Kigali (GMT+2)
    const kigaliOffset = 2 * 60; // GMT+2 in minutes
    const localOffset = now.getTimezoneOffset();
    const kigaliTime = new Date(now.getTime() + (localOffset + kigaliOffset) * 60000);
    
    const currentDay = kigaliTime.getDay();
    const currentHour = kigaliTime.getHours();
    const currentMinute = kigaliTime.getMinutes();

    // Check if currently in a meeting
    for (const meeting of MEETINGS) {
      if (currentDay === meeting.day) {
        const startMinutes = meeting.startHour * 60;
        const endMinutes = meeting.endHour * 60 + meeting.endMinute;
        const currentMinutes = currentHour * 60 + currentMinute;

        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
          setNextMeeting(meeting);
          setIsLive(true);
          setTimeUntil('Live Now!');
          return;
        }
      }
    }

    // Find next upcoming meeting
    setIsLive(false);
    let closestMeeting: Meeting | null = null;
    let minDiff = Infinity;

    for (const meeting of MEETINGS) {
      let daysUntil = meeting.day - currentDay;
      if (daysUntil < 0) daysUntil += 7;
      if (daysUntil === 0 && currentHour * 60 + currentMinute > meeting.startHour * 60) {
        daysUntil = 7;
      }

      const meetingDate = new Date(kigaliTime);
      meetingDate.setDate(meetingDate.getDate() + daysUntil);
      meetingDate.setHours(meeting.startHour, 0, 0, 0);

      const diff = meetingDate.getTime() - kigaliTime.getTime();
      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        closestMeeting = meeting;
      }
    }

    if (closestMeeting) {
      setNextMeeting(closestMeeting);
      
      // Calculate time until
      const hours = Math.floor(minDiff / (1000 * 60 * 60));
      const minutes = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        setTimeUntil(`in ${days} day${days > 1 ? 's' : ''}`);
      } else if (hours > 0) {
        setTimeUntil(`in ${hours}h ${minutes}m`);
      } else {
        setTimeUntil(`in ${minutes} minutes`);
      }
    }
  }, [now]);

  if (!nextMeeting) return null;

  const formatTime = (hour: number, minute: number = 0) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return minute > 0 ? `${displayHour}:${minute.toString().padStart(2, '0')} ${period}` : `${displayHour}:00 ${period}`;
  };

  const gradientStyles = isLive 
    ? 'bg-gradient-to-br from-emerald-500/20 via-green-400/10 to-teal-500/5 border-emerald-400/40 shadow-lg shadow-emerald-500/10'
    : nextMeeting.type === 'fellowship'
      ? 'bg-gradient-to-br from-violet-500/15 via-purple-400/10 to-fuchsia-500/5 border-violet-400/30 shadow-lg shadow-violet-500/5'
      : 'bg-gradient-to-br from-amber-500/15 via-orange-400/10 to-yellow-500/5 border-amber-400/30 shadow-lg shadow-amber-500/5';

  const accentColor = isLive 
    ? 'text-emerald-500' 
    : nextMeeting.type === 'fellowship' 
      ? 'text-violet-500' 
      : 'text-amber-500';

  const iconBg = isLive 
    ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30' 
    : nextMeeting.type === 'fellowship'
      ? 'bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg shadow-violet-500/30'
      : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30';

  return (
    <div className={`relative rounded-2xl p-5 border overflow-hidden transition-all duration-500 ${gradientStyles}`}>
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-xl" />
      
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500 text-white">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider">Live</span>
        </div>
      )}

      {/* Header */}
      <div className="relative flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl text-white ${iconBg}`}>
          {nextMeeting.emoji}
        </div>
        <div className="flex-1">
          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${accentColor}`}>
            {isLive ? '🔴 Happening Now' : '📅 Upcoming Meeting'}
          </p>
          <h3 className="font-display font-bold text-xl text-foreground">
            {nextMeeting.name}
          </h3>
        </div>
      </div>

      {/* Time info */}
      <div className="relative flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/10 text-sm font-medium">
          <Clock className={`h-4 w-4 ${accentColor}`} />
          <span>{formatTime(nextMeeting.startHour)} - {formatTime(nextMeeting.endHour, nextMeeting.endMinute)}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/10 text-sm">
          <Calendar className={`h-4 w-4 ${accentColor}`} />
          <span>Kigali Time</span>
        </div>
      </div>

      {/* Countdown */}
      {!isLive && (
        <div className={`relative mb-4 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-white/10 inline-flex items-center gap-2 border ${
          nextMeeting.type === 'fellowship' ? 'border-violet-200 dark:border-violet-500/20' : 'border-amber-200 dark:border-amber-500/20'
        }`}>
          <span className={`text-lg ${accentColor}`}>⏰</span>
          <span className="text-sm font-semibold text-foreground">Starts {timeUntil}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="relative flex flex-col sm:flex-row gap-2">
        <Button
          className={`flex-1 gap-2 font-semibold ${
            isLive 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/30 animate-pulse-slow' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/20'
          }`}
          onClick={() => window.open(GOOGLE_MEET_LINK, '_blank')}
        >
          <Video className="h-4 w-4" />
          {isLive ? 'Join Meeting Now' : 'Join on Google Meet'}
          <ExternalLink className="h-3 w-3 opacity-70" />
        </Button>
        <Button
          className="flex-1 gap-2 font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/20"
          onClick={() => window.open(WHATSAPP_LINK, '_blank')}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp Group
          <ExternalLink className="h-3 w-3 opacity-70" />
        </Button>
      </div>
    </div>
  );
};

// Compact version for settings
export const MeetingSchedule = () => {
  return (
    <div className="space-y-4">
      {/* Schedule */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border border-violet-200/50 dark:border-violet-500/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-violet-500/20">
            📖
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Sunday Fellowship</p>
            <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">3:00 PM - 5:30 PM</p>
          </div>
          <div className="text-2xl">🥁</div>
        </div>
        
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-yellow-500/10 border border-amber-200/50 dark:border-amber-500/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
            🙏
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">Friday Prayer</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">7:00 PM - 9:00 PM</p>
          </div>
          <div className="text-2xl">🔥</div>
        </div>
      </div>

      {/* Links */}
      <div className="space-y-2">
        <Button
          className="w-full justify-start gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md"
          onClick={() => window.open(GOOGLE_MEET_LINK, '_blank')}
        >
          <Video className="h-5 w-5" />
          <span className="flex-1 text-left font-semibold">Join Google Meet</span>
          <ExternalLink className="h-4 w-4 opacity-70" />
        </Button>
        
        <Button
          className="w-full justify-start gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
          onClick={() => window.open(WHATSAPP_LINK, '_blank')}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="flex-1 text-left font-semibold">WhatsApp Community</span>
          <ExternalLink className="h-4 w-4 opacity-70" />
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>🌍</span>
        <span>All times are in GMT+2 (Kigali, Rwanda)</span>
      </div>
    </div>
  );
};

