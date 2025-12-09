import { DailySummary } from '@/types/task';
import { getCategoryLabel, getCategoryIcon, formatTimeCompact } from '@/lib/taskUtils';
import { format } from 'date-fns';
import { TaskCategory } from '@/types/task';

interface DailySummaryCardProps {
  summary: DailySummary;
}

export const DailySummaryCard = ({ summary }: DailySummaryCardProps) => {
  const categories = Object.entries(summary.categoryBreakdown)
    .filter(([_, time]) => time > 0)
    .sort((a, b) => b[1] - a[1]);

  if (summary.totalTime === 0) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border text-center">
        <p className="text-muted-foreground">No ministry activities recorded today</p>
        <p className="text-sm text-muted-foreground mt-1">Start a task to begin tracking</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg">
            {format(summary.date, 'EEEE')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {format(summary.date, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono text-primary">
            {formatTimeCompact(summary.totalTime)}
          </p>
          <p className="text-xs text-muted-foreground">Total Time</p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map(([category, time]) => {
          const percentage = Math.round((time / summary.totalTime) * 100);
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-2 text-sm">
                  <span>{getCategoryIcon(category as TaskCategory)}</span>
                  <span>{getCategoryLabel(category as TaskCategory)}</span>
                </span>
                <span className="text-sm font-medium">{formatTimeCompact(time)}</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {summary.tasks.length} task{summary.tasks.length !== 1 ? 's' : ''} completed
        </p>
      </div>
    </div>
  );
};
