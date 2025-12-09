import { useState, useEffect } from 'react';
import { useTaskStore } from '@/hooks/useTaskStore';
import { Navigation } from '@/components/Navigation';
import { HomeView } from '@/components/views/HomeView';
import { TasksView } from '@/components/views/TasksView';
import { ReportsView } from '@/components/views/ReportsView';
import { SettingsView } from '@/components/views/SettingsView';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const {
    tasks,
    isLoaded,
    createTask,
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-pulse">
          <div className="text-4xl mb-4">🙏</div>
          <p className="text-muted-foreground">Loading your ministry data...</p>
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
        return <ReportsView tasks={tasks} />;
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
    <div className="min-h-screen bg-background">
      {renderView()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
