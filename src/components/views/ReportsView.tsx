import { useState } from 'react';
import { Task, TaskCategory } from '@/types/task';
import { getDailySummary, getWeeklySummary, getCategoryLabel, getCategoryIcon, formatTimeCompact } from '@/lib/taskUtils';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReportsViewProps {
  tasks: Task[];
}

type ViewType = 'daily' | 'weekly';

export const ReportsView = ({ tasks }: ReportsViewProps) => {
  const [viewType, setViewType] = useState<ViewType>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dailySummary = getDailySummary(tasks, selectedDate);
  const weeklySummary = getWeeklySummary(tasks, selectedDate);

  const navigateDate = (direction: 'prev' | 'next') => {
    const days = viewType === 'daily' ? 1 : 7;
    const newDate = direction === 'prev' 
      ? subDays(selectedDate, days)
      : new Date(selectedDate.getTime() + days * 24 * 60 * 60 * 1000);
    setSelectedDate(newDate);
  };

  const summary = viewType === 'daily' ? dailySummary : weeklySummary;
  const categoryBreakdown = summary.categoryBreakdown;

  const topCategories = Object.entries(categoryBreakdown)
    .filter(([_, time]) => time > 0)
    .sort((a, b) => b[1] - a[1]);

  // Calculate evangelism totals if there are evangelism tasks
  const evangelismTasks = (viewType === 'daily' ? dailySummary.tasks : 
    weeklySummary.dailySummaries.flatMap(d => d.tasks))
    .filter(t => t.category === 'evangelism' && t.evangelismDetails);

  const evangelismTotals = evangelismTasks.reduce(
    (acc, task) => {
      if (task.evangelismDetails) {
        acc.tractsShared += task.evangelismDetails.tractsShared;
        acc.peoplePrayed += task.evangelismDetails.peoplePrayed;
        acc.repentances += task.evangelismDetails.repentances;
        acc.invitations += task.evangelismDetails.invitations;
      }
      return acc;
    },
    { tractsShared: 0, peoplePrayed: 0, repentances: 0, invitations: 0 }
  );

  // Calculate Bible study totals
  const bibleStudyTasks = (viewType === 'daily' ? dailySummary.tasks :
    weeklySummary.dailySummaries.flatMap(d => d.tasks))
    .filter(t => t.category === 'bible_study' && t.bibleStudyDetails);

  const bibleStudyTotals = bibleStudyTasks.reduce(
    (acc, task) => {
      if (task.bibleStudyDetails) {
        acc.chaptersRead += task.bibleStudyDetails.chaptersRead;
      }
      return acc;
    },
    { chaptersRead: 0 }
  );

  return (
    <div className="min-h-screen pb-24">
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Ministry Reports
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your growth in serving the Lord
        </p>
      </header>

      {/* View Toggle */}
      <div className="px-4 mb-4">
        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => setViewType('daily')}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              viewType === 'daily'
                ? 'bg-card shadow-md text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Daily
          </button>
          <button
            onClick={() => setViewType('weekly')}
            className={cn(
              'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              viewType === 'weekly'
                ? 'bg-card shadow-md text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between bg-card rounded-xl p-3 border border-border">
          <Button variant="ghost" size="icon" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {viewType === 'daily'
                  ? format(selectedDate, 'MMMM d, yyyy')
                  : `${format(startOfWeek(selectedDate), 'MMM d')} - ${format(endOfWeek(selectedDate), 'MMM d, yyyy')}`}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigateDate('next')}
            disabled={selectedDate >= new Date()}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Total Time Card */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 opacity-80" />
            <span className="text-sm opacity-80">Total Ministry Time</span>
          </div>
          <p className="text-4xl font-bold font-mono">
            {formatTimeCompact(summary.totalTime)}
          </p>
          <p className="text-sm opacity-70 mt-1">
            {viewType === 'daily' 
              ? `${dailySummary.tasks.length} tasks today`
              : `${weeklySummary.dailySummaries.reduce((acc, d) => acc + d.tasks.length, 0)} tasks this week`}
          </p>
        </div>

        {/* Category Breakdown */}
        {topCategories.length > 0 && (
          <div className="bg-card rounded-xl p-5 border border-border">
            <h3 className="font-display font-semibold mb-4">Time by Category</h3>
            <div className="space-y-4">
              {topCategories.map(([category, time]) => {
                const percentage = Math.round((time / summary.totalTime) * 100);
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(category as TaskCategory)}</span>
                        <span className="font-medium">{getCategoryLabel(category as TaskCategory)}</span>
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-semibold">{formatTimeCompact(time)}</span>
                        <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Evangelism Report */}
        {evangelismTasks.length > 0 && (
          <div className="bg-card rounded-xl p-5 border border-border">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <span>📢</span>
              Evangelism Impact
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-primary">{evangelismTotals.tractsShared}</p>
                <p className="text-xs text-muted-foreground mt-1">Tracts Shared</p>
              </div>
              <div className="bg-accent/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-accent">{evangelismTotals.peoplePrayed}</p>
                <p className="text-xs text-muted-foreground mt-1">People Reached</p>
              </div>
              <div className="bg-success/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-success">{evangelismTotals.repentances}</p>
                <p className="text-xs text-muted-foreground mt-1">Souls Won</p>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{evangelismTotals.invitations}</p>
                <p className="text-xs text-muted-foreground mt-1">Invitations</p>
              </div>
            </div>
          </div>
        )}

        {/* Bible Study Report */}
        {bibleStudyTasks.length > 0 && (
          <div className="bg-card rounded-xl p-5 border border-border">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <span>📖</span>
              Bible Study Progress
            </h3>
            <div className="bg-success/10 rounded-xl p-6 text-center">
              <p className="text-5xl font-bold text-success">{bibleStudyTotals.chaptersRead}</p>
              <p className="text-sm text-muted-foreground mt-2">Chapters Read</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {summary.totalTime === 0 && (
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-muted-foreground">
              No ministry activities recorded for this {viewType === 'daily' ? 'day' : 'week'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
