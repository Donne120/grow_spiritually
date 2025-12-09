import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { Timer } from '@/components/Timer';
import { getCategoryLabel, getCategoryIcon, formatTime, formatTimeCompact } from '@/lib/taskUtils';
import { format } from 'date-fns';
import { MapPin, Clock, Calendar, FileText, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailSheetProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  onPause: () => void;
  onDelete: () => void;
}

export const TaskDetailSheet = ({
  task,
  isOpen,
  onClose,
  onStart,
  onPause,
  onDelete,
}: TaskDetailSheetProps) => {
  if (!task) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getCategoryIcon(task.category)}</span>
            <div>
              <SheetTitle className="font-display text-2xl text-left">
                {task.title}
              </SheetTitle>
              <p className="text-sm text-muted-foreground">{getCategoryLabel(task.category)}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 pb-8">
          {/* Main Timer */}
          <div className="bg-secondary/30 rounded-2xl p-6 flex flex-col items-center justify-center">
            <Timer
              isActive={task.isActive}
              totalTime={task.totalTime}
              currentSessionStart={task.currentSessionStart}
              onStart={onStart}
              onPause={onPause}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-4">
              {task.isActive ? 'Timer running...' : 'Tap to start tracking'}
            </p>
          </div>

          {/* Task Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">Created</span>
              </div>
              <p className="font-medium">{format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
              <p className="text-sm text-muted-foreground">{format(new Date(task.createdAt), 'h:mm a')}</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">Sessions</span>
              </div>
              <p className="font-medium">{task.sessions.length} sessions</p>
              <p className="text-sm text-muted-foreground">Total: {formatTimeCompact(task.totalTime)}</p>
            </div>
          </div>

          {/* Location */}
          {task.location && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="font-medium">{task.location}</p>
            </div>
          )}

          {/* Evangelism Details */}
          {task.category === 'evangelism' && task.evangelismDetails && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <h4 className="font-display font-semibold mb-4">Evangelism Report</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {task.evangelismDetails.tractsShared}
                  </p>
                  <p className="text-xs text-muted-foreground">Tracts Shared</p>
                </div>
                <div className="bg-accent/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-accent">
                    {task.evangelismDetails.peoplePrayed}
                  </p>
                  <p className="text-xs text-muted-foreground">People Preached To</p>
                </div>
                <div className="bg-success/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-success">
                    {task.evangelismDetails.repentances}
                  </p>
                  <p className="text-xs text-muted-foreground">Souls Won</p>
                </div>
                <div className="bg-secondary rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-secondary-foreground">
                    {task.evangelismDetails.invitations}
                  </p>
                  <p className="text-xs text-muted-foreground">Invitations</p>
                </div>
              </div>
            </div>
          )}

          {/* Bible Study Details */}
          {task.category === 'bible_study' && task.bibleStudyDetails && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <h4 className="font-display font-semibold mb-4">Bible Study Report</h4>
              <div className="flex items-center gap-4">
                <div className="bg-success/10 rounded-lg p-4 text-center flex-1">
                  <p className="text-3xl font-bold text-success">
                    {task.bibleStudyDetails.chaptersRead}
                  </p>
                  <p className="text-xs text-muted-foreground">Chapters Read</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-4 flex-1">
                  <p className="font-semibold text-primary">{task.bibleStudyDetails.book}</p>
                  <p className="text-xs text-muted-foreground">Book</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Notes</span>
              </div>
              <p className="text-foreground whitespace-pre-wrap">{task.notes}</p>
            </div>
          )}

          {/* Sessions History */}
          {task.sessions.length > 0 && (
            <div className="bg-card rounded-xl p-4 border border-border">
              <h4 className="font-display font-semibold mb-4">Session History</h4>
              <div className="space-y-2">
                {task.sessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">Session {index + 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(session.startTime), 'h:mm a')} -{' '}
                        {session.endTime ? format(new Date(session.endTime), 'h:mm a') : 'In progress'}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-medium">
                      {formatTime(session.duration)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete Button */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete Task
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
