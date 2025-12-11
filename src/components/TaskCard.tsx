import { Task } from '@/types/task';
import { Timer } from '@/components/Timer';
import { SubCategorySelector, SubCategoryBreakdown } from '@/components/SubCategorySelector';
import { getCategoryLabel, getCategoryIcon, getCategoryColor, formatTimeCompact } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import { MapPin, Clock, ChevronRight, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onStart: () => void;
  onPause: () => void;
  onClick?: () => void;
  onUpdateTask?: (updates: Partial<Task>) => void;
  onChangeSubCategory?: (subCategory: string) => void;
  onAddCustomSubCategory?: (subCategory: string) => void;
  compact?: boolean;
}

// Counter button component
const CounterButton = ({ 
  label, 
  emoji, 
  value, 
  onIncrement, 
  onDecrement,
  color = 'primary'
}: { 
  label: string; 
  emoji: string; 
  value: number; 
  onIncrement: () => void;
  onDecrement: () => void;
  color?: 'primary' | 'accent' | 'success' | 'amber';
}) => {
  const colors = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    amber: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  };

  return (
    <div className={cn('flex items-center gap-1 px-2 py-1.5 rounded-xl border', colors[color])}>
      <button
        onClick={(e) => { e.stopPropagation(); onDecrement(); }}
        className="w-6 h-6 rounded-lg bg-white/50 dark:bg-white/10 flex items-center justify-center hover:bg-white/80 dark:hover:bg-white/20 transition-colors"
        disabled={value <= 0}
      >
        <Minus className="h-3 w-3" />
      </button>
      <div className="flex items-center gap-1 px-2 min-w-[60px] justify-center">
        <span className="text-sm">{emoji}</span>
        <span className="font-bold text-sm">{value}</span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onIncrement(); }}
        className="w-6 h-6 rounded-lg bg-white/50 dark:bg-white/10 flex items-center justify-center hover:bg-white/80 dark:hover:bg-white/20 transition-colors active:scale-95"
      >
        <Plus className="h-3 w-3" />
      </button>
      <span className="text-[10px] font-medium ml-1">{label}</span>
    </div>
  );
};

export const TaskCard = ({
  task,
  onStart,
  onPause,
  onClick,
  onUpdateTask,
  onChangeSubCategory,
  onAddCustomSubCategory,
  compact = false,
}: TaskCardProps) => {
  
  // Evangelism counter handlers
  const updateEvangelismDetail = (field: string, delta: number) => {
    if (!onUpdateTask) return;
    const current = task.evangelismDetails || { tractsShared: 0, peoplePrayed: 0, repentances: 0, invitations: 0, location: '' };
    const newValue = Math.max(0, (current[field as keyof typeof current] as number || 0) + delta);
    onUpdateTask({
      evangelismDetails: { ...current, [field]: newValue }
    });
  };

  // Bible study counter handlers
  const updateBibleStudyDetail = (field: string, delta: number) => {
    if (!onUpdateTask) return;
    const current = task.bibleStudyDetails || { chaptersRead: 0, book: '', notes: '' };
    const newValue = Math.max(0, (current[field as keyof typeof current] as number || 0) + delta);
    onUpdateTask({
      bibleStudyDetails: { ...current, [field]: newValue }
    });
  };

  // Literature counter handlers
  const updateLiteratureDetail = (field: string, delta: number) => {
    if (!onUpdateTask) return;
    const current = task.literatureDetails || { title: '', author: '', pagesRead: 0 };
    const newValue = Math.max(0, (current[field as keyof typeof current] as number || 0) + delta);
    onUpdateTask({
      literatureDetails: { ...current, [field]: newValue }
    });
  };

  return (
    <div
      className={cn(
        'relative glass-card rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer animate-fade-in overflow-hidden',
        task.isActive && 'ring-2 ring-primary/50 glow-primary'
      )}
      onClick={onClick}
    >
      {/* Active task indicator gradient */}
      {task.isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-success/5 pointer-events-none" />
      )}
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

          {/* Sub-Category Selector (only when active) */}
          {task.isActive && onChangeSubCategory && (
            <SubCategorySelector
              category={task.category}
              currentSubCategory={task.currentSubCategory}
              customSubCategories={task.customSubCategories}
              onSelect={onChangeSubCategory}
              onAddCustom={onAddCustomSubCategory || (() => {})}
            />
          )}

          {/* Sub-Category Breakdown (when not active and has breakdown) */}
          {!task.isActive && task.subCategoryBreakdown && task.subCategoryBreakdown.length > 0 && (
            <SubCategoryBreakdown breakdown={task.subCategoryBreakdown} />
          )}

          {/* Live Counters for Active Evangelism Tasks */}
          {task.category === 'evangelism' && task.isActive && onUpdateTask && (
            <div className="flex flex-wrap gap-2 mt-3">
              <CounterButton
                label="Tracts"
                emoji="📄"
                value={task.evangelismDetails?.tractsShared || 0}
                onIncrement={() => updateEvangelismDetail('tractsShared', 1)}
                onDecrement={() => updateEvangelismDetail('tractsShared', -1)}
                color="primary"
              />
              <CounterButton
                label="Prayed"
                emoji="🙏"
                value={task.evangelismDetails?.peoplePrayed || 0}
                onIncrement={() => updateEvangelismDetail('peoplePrayed', 1)}
                onDecrement={() => updateEvangelismDetail('peoplePrayed', -1)}
                color="accent"
              />
              <CounterButton
                label="Souls"
                emoji="✨"
                value={task.evangelismDetails?.repentances || 0}
                onIncrement={() => updateEvangelismDetail('repentances', 1)}
                onDecrement={() => updateEvangelismDetail('repentances', -1)}
                color="success"
              />
            </div>
          )}

          {/* Static Evangelism Stats (when not active) */}
          {task.category === 'evangelism' && !task.isActive && task.evangelismDetails && (
            <div className="flex flex-wrap gap-2 mt-3">
              {task.evangelismDetails.tractsShared > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                  📄 {task.evangelismDetails.tractsShared} tracts
                </span>
              )}
              {task.evangelismDetails.peoplePrayed > 0 && (
                <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md">
                  🙏 {task.evangelismDetails.peoplePrayed} prayed
                </span>
              )}
              {task.evangelismDetails.repentances > 0 && (
                <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-md">
                  ✨ {task.evangelismDetails.repentances} souls
                </span>
              )}
            </div>
          )}

          {/* Live Counter for Bible Study */}
          {task.category === 'bible_study' && task.isActive && onUpdateTask && (
            <div className="flex flex-wrap gap-2 mt-3">
              <CounterButton
                label="Chapters"
                emoji="📖"
                value={task.bibleStudyDetails?.chaptersRead || 0}
                onIncrement={() => updateBibleStudyDetail('chaptersRead', 1)}
                onDecrement={() => updateBibleStudyDetail('chaptersRead', -1)}
                color="success"
              />
              {task.bibleStudyDetails?.book && (
                <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-xl flex items-center">
                  📚 {task.bibleStudyDetails.book}
                </span>
              )}
            </div>
          )}

          {/* Static Bible Study Stats (when not active) */}
          {task.category === 'bible_study' && !task.isActive && task.bibleStudyDetails && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-md">
                📖 {task.bibleStudyDetails.chaptersRead} chapters
                {task.bibleStudyDetails.book && ` - ${task.bibleStudyDetails.book}`}
              </span>
            </div>
          )}

          {/* Live Counter for Literature */}
          {task.category === 'literature' && task.isActive && onUpdateTask && (
            <div className="flex flex-wrap gap-2 mt-3">
              <CounterButton
                label="Pages"
                emoji="📚"
                value={task.literatureDetails?.pagesRead || 0}
                onIncrement={() => updateLiteratureDetail('pagesRead', 1)}
                onDecrement={() => updateLiteratureDetail('pagesRead', -1)}
                color="amber"
              />
            </div>
          )}

          {/* Static Literature Stats (when not active) */}
          {task.category === 'literature' && !task.isActive && task.literatureDetails && task.literatureDetails.pagesRead > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded-md">
                📚 {task.literatureDetails.pagesRead} pages
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
