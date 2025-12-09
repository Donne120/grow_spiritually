import { Task, TaskCategory, DailySummary, WeeklySummary } from '@/types/task';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatTimeCompact = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getCategoryLabel = (category: TaskCategory): string => {
  const labels: Record<TaskCategory, string> = {
    evangelism: 'Evangelism',
    prayer: 'Prayer',
    bible_study: 'Bible Study',
    meditation: 'Meditation',
    literature: 'Christian Literature',
    fellowship: 'Fellowship',
    other: 'Other Ministry',
  };
  return labels[category];
};

export const getCategoryIcon = (category: TaskCategory): string => {
  const icons: Record<TaskCategory, string> = {
    evangelism: '📢',
    prayer: '🙏',
    bible_study: '📖',
    meditation: '🕊️',
    literature: '📚',
    fellowship: '🤝',
    other: '✨',
  };
  return icons[category];
};

export const getCategoryColor = (category: TaskCategory): string => {
  const colors: Record<TaskCategory, string> = {
    evangelism: 'bg-primary text-primary-foreground',
    prayer: 'bg-accent text-accent-foreground',
    bible_study: 'bg-success text-success-foreground',
    meditation: 'bg-secondary text-secondary-foreground',
    literature: 'bg-muted text-muted-foreground',
    fellowship: 'bg-warning text-warning-foreground',
    other: 'bg-muted text-muted-foreground',
  };
  return colors[category];
};

export const calculateTotalTime = (task: Task): number => {
  let total = task.sessions.reduce((acc, session) => acc + session.duration, 0);
  
  if (task.isActive && task.currentSessionStart) {
    const currentDuration = Math.floor(
      (new Date().getTime() - new Date(task.currentSessionStart).getTime()) / 1000
    );
    total += currentDuration;
  }
  
  return total;
};

export const getDailySummary = (tasks: Task[], date: Date): DailySummary => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const dayTasks = tasks.filter(task => 
    isWithinInterval(new Date(task.createdAt), { start: dayStart, end: dayEnd })
  );

  const categoryBreakdown: Record<TaskCategory, number> = {
    evangelism: 0,
    prayer: 0,
    bible_study: 0,
    meditation: 0,
    literature: 0,
    fellowship: 0,
    other: 0,
  };

  let totalTime = 0;

  dayTasks.forEach(task => {
    const taskTime = calculateTotalTime(task);
    totalTime += taskTime;
    categoryBreakdown[task.category] += taskTime;
  });

  return {
    date,
    tasks: dayTasks,
    totalTime,
    categoryBreakdown,
  };
};

export const getWeeklySummary = (tasks: Task[], date: Date): WeeklySummary => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });

  const dailySummaries: DailySummary[] = [];
  const categoryBreakdown: Record<TaskCategory, number> = {
    evangelism: 0,
    prayer: 0,
    bible_study: 0,
    meditation: 0,
    literature: 0,
    fellowship: 0,
    other: 0,
  };

  let totalTime = 0;

  for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
    const dailySummary = getDailySummary(tasks, new Date(d));
    dailySummaries.push(dailySummary);
    totalTime += dailySummary.totalTime;
    
    Object.keys(dailySummary.categoryBreakdown).forEach((category) => {
      categoryBreakdown[category as TaskCategory] += dailySummary.categoryBreakdown[category as TaskCategory];
    });
  }

  return {
    weekStart,
    weekEnd,
    dailySummaries,
    totalTime,
    categoryBreakdown,
  };
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
