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

      <div className="px-4 space-y-6 -mt-4">
        {/* Upcoming Meeting */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📅</span>
            <h2 className="font-display text-lg font-bold text-foreground">Upcoming Meeting</h2>
          </div>
          <UpcomingMeeting />
        </section>

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 relative block"></span>
              </div>
              <h2 className="font-display text-lg font-bold text-foreground">Active Now</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 text-xs font-bold">
                {activeTasks.length}
              </span>
            </div>
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
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📊</span>
            <h2 className="font-display text-lg font-bold text-foreground">Today's Summary</h2>
          </div>
          <DailySummaryCard summary={todaySummary} />
        </section>

        {/* Today's Tasks */}
        {todayTasks.filter(t => !t.isActive).length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">✅</span>
              <h2 className="font-display text-lg font-bold text-foreground">Today's Tasks</h2>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                {todayTasks.filter(t => !t.isActive).length}
              </span>
            </div>
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

        {/* Empty State - Beautiful Card */}
        {todayTasks.length === 0 && activeTasks.length === 0 && (
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🚀</span>
              <h2 className="font-display text-lg font-bold text-foreground">Get Started</h2>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" />
              
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 text-4xl animate-float">✨</div>
                <div className="absolute top-8 right-8 text-3xl animate-float" style={{ animationDelay: '0.5s' }}>🌟</div>
                <div className="absolute bottom-8 left-8 text-3xl animate-float" style={{ animationDelay: '1s' }}>💫</div>
                <div className="absolute bottom-12 right-12 text-2xl animate-float" style={{ animationDelay: '1.5s' }}>⭐</div>
              </div>
              
              {/* Blur circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              
              {/* Content */}
              <div className="relative px-6 py-10 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/30">
                  <span className="text-4xl">🙏</span>
                </div>
                
                <h3 className="font-display text-2xl font-bold text-white mb-3 drop-shadow-lg">
                  Start Your Ministry Day
                </h3>
                
                <p className="text-white/80 mb-8 max-w-xs mx-auto leading-relaxed">
                  Track your evangelism, prayer time, Bible study, and watch how God moves through your faithful service
                </p>
                
                <Button 
                  onClick={() => setIsCreateSheetOpen(true)} 
                  className="bg-white text-purple-600 hover:bg-white/90 font-bold px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create First Task
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Quick Stats Row */}
        {(todayTasks.length > 0 || activeTasks.length > 0) && (
          <section className="animate-fade-in grid grid-cols-3 gap-3" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-4 text-center border border-blue-200/50 dark:border-blue-500/20">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{todayTasks.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Today</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-4 text-center border border-emerald-200/50 dark:border-emerald-500/20">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeTasks.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Active</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-4 text-center border border-amber-200/50 dark:border-amber-500/20">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{tasks.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Total</p>
            </div>
          </section>
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
