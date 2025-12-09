import { useState, useEffect } from 'react';
import { useTaskStore } from '@/hooks/useTaskStore';
import { Navigation } from '@/components/Navigation';
import { HomeView } from '@/components/views/HomeView';
import { TasksView } from '@/components/views/TasksView';
import { ReportsView } from '@/components/views/ReportsView';
import { SettingsView } from '@/components/views/SettingsView';
import { InstallPrompt } from '@/components/InstallPrompt';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const {
    tasks,
    isLoaded,
    createTask,
    updateTask,
    deleteTask,
    startTimer,
    pauseTimer,
    getActiveTasks,
    getTodayTasks,
  } = useTaskStore();

  const [activeTasks, setActiveTasks] = useState(getActiveTasks());
  const [todayTasks, setTodayTasks] = useState(getTodayTasks());

  useEffect(() => {
    if (isLoaded) {
      setActiveTasks(getActiveTasks());
      setTodayTasks(getTodayTasks());
    }
  }, [tasks, isLoaded, getActiveTasks, getTodayTasks]);

  // Update active tasks every second for real-time timer updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTasks(getActiveTasks());
    }, 1000);
    return () => clearInterval(interval);
  }, [getActiveTasks]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative text-center">
          <div className="relative">
            <div className="text-6xl mb-6 animate-float">🙏</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-primary/20 animate-ping" />
            </div>
          </div>
          <p className="text-lg font-display font-medium text-foreground">Preparing your ministry</p>
          <p className="text-sm text-muted-foreground mt-1">Loading your faithful work...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            tasks={tasks}
            todayTasks={todayTasks}
            activeTasks={activeTasks}
            onCreateTask={createTask}
            onStartTimer={startTimer}
            onPauseTimer={pauseTimer}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            onStartTimer={startTimer}
            onPauseTimer={pauseTimer}
            onDeleteTask={deleteTask}
          />
        );
      case 'reports':
        return <ReportsView tasks={tasks} onUpdateTask={updateTask} />;
      case 'settings':
        return (
          <SettingsView
            tasksCount={tasks.length}
            onClearAllData={() => window.location.reload()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-accent/3 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="relative">
        {renderView()}
      </div>
      <InstallPrompt />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
