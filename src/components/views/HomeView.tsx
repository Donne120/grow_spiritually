import { useState } from 'react';
import { Task } from '@/types/task';
import { Header } from '@/components/Header';
import { TaskCard } from '@/components/TaskCard';
import { CreateTaskSheet } from '@/components/CreateTaskSheet';
import { TaskDetailSheet } from '@/components/TaskDetailSheet';
import { DailySummaryCard } from '@/components/DailySummaryCard';
import { UpcomingMeeting } from '@/components/UpcomingMeeting';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getDailySummary } from '@/lib/taskUtils';

interface HomeViewProps {
  tasks: Task[];
  todayTasks: Task[];
  activeTasks: Task[];
  onCreateTask: (task: Partial<Task>) => Task;
  onStartTimer: (taskId: string) => void;
  onPauseTimer: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const HomeView = ({
  tasks,
  todayTasks,
  activeTasks,
  onCreateTask,
  onStartTimer,
  onPauseTimer,
  onDeleteTask,
}: HomeViewProps) => {
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask = onCreateTask(taskData);
    onStartTimer(newTask.id);
  };

  const todaySummary = getDailySummary(tasks, new Date());

  return (
    <div className="min-h-screen pb-24">
      <Header />

      <div className="px-4 space-y-6">
        {/* Upcoming Meeting */}
        <section className="animate-fade-in">
          <UpcomingMeeting />
        </section>

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <section className="animate-fade-in">
            <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Active Now
            </h2>
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStart={() => onStartTimer(task.id)}
                  onPause={() => onPauseTimer(task.id)}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsDetailSheetOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Today's Summary */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="font-display text-lg font-semibold mb-3">Today's Summary</h2>
          <DailySummaryCard summary={todaySummary} />
        </section>

        {/* Today's Tasks */}
        {todayTasks.filter(t => !t.isActive).length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-display text-lg font-semibold mb-3">Today's Tasks</h2>
            <div className="space-y-3">
              {todayTasks
                .filter(t => !t.isActive)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStart={() => onStartTimer(task.id)}
                    onPause={() => onPauseTimer(task.id)}
                    onClick={() => {
                      setSelectedTask(task);
                      setIsDetailSheetOpen(true);
                    }}
                  />
                ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {todayTasks.length === 0 && activeTasks.length === 0 && (
          <div className="relative text-center py-16 animate-fade-in overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-pulse-slow" />
            </div>
            <div className="absolute top-8 left-1/4 w-2 h-2 rounded-full bg-accent animate-float" style={{ animationDelay: '0s' }} />
            <div className="absolute top-16 right-1/4 w-1.5 h-1.5 rounded-full bg-primary animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-12 left-1/3 w-2.5 h-2.5 rounded-full bg-success animate-float" style={{ animationDelay: '2s' }} />
            
            <div className="relative">
              <div className="text-7xl mb-6 animate-float">🙏</div>
              <h3 className="font-display text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Start Your Ministry Day
              </h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                Track your evangelism, prayer time, Bible study, and watch how God moves through your faithful service
              </p>
              <Button variant="hero" onClick={() => setIsCreateSheetOpen(true)} className="group">
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                Create First Task
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      {(todayTasks.length > 0 || activeTasks.length > 0) && (
        <Button
          variant="fab"
          className="fixed bottom-24 right-4 z-40 animate-scale-in"
          onClick={() => setIsCreateSheetOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      {/* Sheets */}
      <CreateTaskSheet
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        onCreateTask={handleCreateTask}
      />

      <TaskDetailSheet
        task={selectedTask}
        isOpen={isDetailSheetOpen}
        onClose={() => {
          setIsDetailSheetOpen(false);
          setSelectedTask(null);
        }}
        onStart={() => selectedTask && onStartTimer(selectedTask.id)}
        onPause={() => selectedTask && onPauseTimer(selectedTask.id)}
        onDelete={() => selectedTask && onDeleteTask(selectedTask.id)}
      />
    </div>
  );
};
