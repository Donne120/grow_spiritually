import { useState } from 'react';
import { Task } from '@/types/task';
import { Header } from '@/components/Header';
import { TaskCard } from '@/components/TaskCard';
import { CreateTaskSheet } from '@/components/CreateTaskSheet';
import { TaskDetailSheet } from '@/components/TaskDetailSheet';
import { DailySummaryCard } from '@/components/DailySummaryCard';
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
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">🙏</div>
            <h3 className="font-display text-xl font-semibold mb-2">
              Start Your Ministry Day
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
              Track your evangelism, prayer time, Bible study, and more
            </p>
            <Button variant="hero" onClick={() => setIsCreateSheetOpen(true)}>
              <Plus className="h-5 w-5" />
              Create First Task
            </Button>
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
