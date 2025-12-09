import { DailySummary } from '@/types/task';
import { getCategoryLabel, getCategoryIcon, formatTimeCompact } from '@/lib/taskUtils';
import { format } from 'date-fns';
import { TaskCategory } from '@/types/task';
import { Clock, CheckCircle2, TrendingUp } from 'lucide-react';

interface DailySummaryCardProps {
  summary: DailySummary;
}

export const DailySummaryCard = ({ summary }: DailySummaryCardProps) => {
  const categories = Object.entries(summary.categoryBreakdown)
    .filter(([_, time]) => time > 0)
    .sort((a, b) => b[1] - a[1]);

  if (summary.totalTime === 0) {
    return (
      <div className="relative bg-gradient-to-br from-card to-secondary/30 rounded-2xl p-8 border border-border/50 text-center overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-20 h-20 rounded-full border-2 border-primary" />
          <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full border-2 border-accent" />
        </div>
        
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <Clock className="h-8 w-8 text-primary/60" />
          </div>
          <p className="text-foreground font-medium">No ministry activities recorded today</p>
          <p className="text-sm text-muted-foreground mt-2">Start a task to begin tracking your faithful work</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-card via-card to-secondary/20 rounded-2xl p-6 border border-border/50 animate-fade-in overflow-hidden">
      {/* Subtle corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-display font-bold text-xl text-foreground">
              {format(summary.date, 'EEEE')}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {format(summary.date, 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-2xl font-bold font-mono text-primary">
                {formatTimeCompact(summary.totalTime)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Total Ministry Time</p>
          </div>
        </div>

        <div className="space-y-4">
          {categories.map(([category, time], index) => {
            const percentage = Math.round((time / summary.totalTime) * 100);
            const colors = [
              'from-primary to-primary/70',
              'from-accent to-accent/70', 
              'from-success to-success/70',
              'from-warning to-warning/70'
            ];
            return (
              <div key={category} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2.5 text-sm font-medium">
                    <span className="text-lg">{getCategoryIcon(category as TaskCategory)}</span>
                    <span>{getCategoryLabel(category as TaskCategory)}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{percentage}%</span>
                    <span className="text-sm font-semibold font-mono">{formatTimeCompact(time)}</span>
                  </div>
                </div>
                <div className="h-2.5 bg-secondary/80 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>{summary.tasks.length} task{summary.tasks.length !== 1 ? 's' : ''} completed</span>
          </div>
          <span className="text-xs text-muted-foreground">Keep up the great work! 🙌</span>
        </div>
      </div>
    </div>
  );
};
