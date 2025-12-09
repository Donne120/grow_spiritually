import { Task } from '@/types/task';
import { Timer } from '@/components/Timer';
import { getCategoryLabel, getCategoryIcon, getCategoryColor, formatTimeCompact } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onStart: () => void;
  onPause: () => void;
  onClick?: () => void;
  compact?: boolean;
}

export const TaskCard = ({
  task,
  onStart,
  onPause,
  onClick,
  compact = false,
}: TaskCardProps) => {
  return (
    <div
      className={cn(
        'glass-card rounded-xl p-4 transition-all duration-300 hover:shadow-lg cursor-pointer animate-fade-in',
        task.isActive && 'ring-2 ring-primary/50 glow-primary'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                getCategoryColor(task.category)
              )}
            >
              <span>{getCategoryIcon(task.category)}</span>
              <span>{getCategoryLabel(task.category)}</span>
            </span>
            {task.isActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Active
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-foreground truncate mb-1">
            {task.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{format(new Date(task.createdAt), 'h:mm a')}</span>
            </div>
            {task.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate max-w-[120px]">{task.location}</span>
              </div>
            )}
          </div>

          {/* Evangelism Stats */}
          {task.category === 'evangelism' && task.evangelismDetails && (
            <div className="flex flex-wrap gap-2 mt-3">
              {task.evangelismDetails.tractsShared > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                  📄 {task.evangelismDetails.tractsShared} tracts
                </span>
              )}
              {task.evangelismDetails.peoplePrayed > 0 && (
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md">
                  🙏 {task.evangelismDetails.peoplePrayed} people
                </span>
              )}
              {task.evangelismDetails.repentances > 0 && (
                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-md">
                  ✨ {task.evangelismDetails.repentances} souls
                </span>
              )}
            </div>
          )}

          {/* Bible Study Stats */}
          {task.category === 'bible_study' && task.bibleStudyDetails && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-md">
                📖 {task.bibleStudyDetails.chaptersRead} chapters - {task.bibleStudyDetails.book}
              </span>
            </div>
          )}
        </div>

        {/* Timer Section */}
        <div className="flex flex-col items-end gap-2">
          {!compact && (
            <Timer
              isActive={task.isActive}
              totalTime={task.totalTime}
              currentSessionStart={task.currentSessionStart}
              onStart={onStart}
              onPause={onPause}
              size="sm"
            />
          )}
          {compact && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium text-muted-foreground">
                {formatTimeCompact(task.totalTime)}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
