import { useState, useEffect, useCallback } from 'react';
import { Task, TaskSession, TaskCategory, SubCategoryTime } from '@/types/task';
import { generateId, calculateTotalTime } from '@/lib/taskUtils';

const STORAGE_KEY = 'cysmf_ministry_tasks';

export const useTaskStore = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const tasksWithDates = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          currentSessionStart: task.currentSessionStart ? new Date(task.currentSessionStart) : undefined,
          sessions: task.sessions.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined,
          })),
        }));
        setTasks(tasksWithDates);
      } catch (e) {
        console.error('Failed to parse stored tasks:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const createTask = useCallback((taskData: Partial<Task>): Task => {
    const newTask: Task = {
      id: generateId(),
      title: taskData.title || 'Untitled Task',
      category: taskData.category || 'other',
      description: taskData.description,
      location: taskData.location,
      notes: taskData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      sessions: [],
      totalTime: 0,
      isActive: false,
      evangelismDetails: taskData.evangelismDetails,
      prayerDetails: taskData.prayerDetails,
      bibleStudyDetails: taskData.bibleStudyDetails,
      meditationDetails: taskData.meditationDetails,
      literatureDetails: taskData.literatureDetails,
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const startTimer = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.isActive) {
        return {
          ...task,
          isActive: true,
          currentSessionStart: new Date(),
          updatedAt: new Date(),
        };
      }
      return task;
    }));
  }, []);

  const pauseTimer = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && task.isActive && task.currentSessionStart) {
        const endTime = new Date();
        const duration = Math.floor(
          (endTime.getTime() - new Date(task.currentSessionStart).getTime()) / 1000
        );
        
        const newSession: TaskSession = {
          id: generateId(),
          startTime: task.currentSessionStart,
          endTime,
          duration,
          subCategory: task.currentSubCategory,
        };

        // Update sub-category breakdown
        let subCategoryBreakdown = [...(task.subCategoryBreakdown || [])];
        if (task.currentSubCategory) {
          const existingIndex = subCategoryBreakdown.findIndex(
            s => s.subCategory === task.currentSubCategory
          );
          if (existingIndex >= 0) {
            subCategoryBreakdown[existingIndex] = {
              ...subCategoryBreakdown[existingIndex],
              duration: subCategoryBreakdown[existingIndex].duration + duration
            };
          } else {
            subCategoryBreakdown.push({
              subCategory: task.currentSubCategory,
              duration
            });
          }
        }

        return {
          ...task,
          isActive: false,
          currentSessionStart: undefined,
          sessions: [...task.sessions, newSession],
          totalTime: task.totalTime + duration,
          subCategoryBreakdown,
          updatedAt: new Date(),
        };
      }
      return task;
    }));
  }, []);

  const getActiveTasks = useCallback(() => {
    return tasks.filter(task => task.isActive);
  }, [tasks]);

  const getTodayTasks = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });
  }, [tasks]);

  const getTasksByCategory = useCallback((category: TaskCategory) => {
    return tasks.filter(task => task.category === category);
  }, [tasks]);

  const getTasksByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= startDate && taskDate <= endDate;
    });
  }, [tasks]);

  // Change sub-category on an active task (saves current progress and switches)
  const changeSubCategory = useCallback((taskId: string, newSubCategory: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        // If task is active, save the current session time to the old sub-category
        if (task.isActive && task.currentSessionStart) {
          const now = new Date();
          const duration = Math.floor(
            (now.getTime() - new Date(task.currentSessionStart).getTime()) / 1000
          );

          // Only save if there's actual time spent
          if (duration > 0 && task.currentSubCategory) {
            let subCategoryBreakdown = [...(task.subCategoryBreakdown || [])];
            const existingIndex = subCategoryBreakdown.findIndex(
              s => s.subCategory === task.currentSubCategory
            );
            if (existingIndex >= 0) {
              subCategoryBreakdown[existingIndex] = {
                ...subCategoryBreakdown[existingIndex],
                duration: subCategoryBreakdown[existingIndex].duration + duration
              };
            } else {
              subCategoryBreakdown.push({
                subCategory: task.currentSubCategory,
                duration
              });
            }

            // Create session for the old sub-category
            const newSession: TaskSession = {
              id: generateId(),
              startTime: task.currentSessionStart,
              endTime: now,
              duration,
              subCategory: task.currentSubCategory,
            };

            return {
              ...task,
              currentSubCategory: newSubCategory,
              currentSessionStart: now, // Reset timer for new sub-category
              sessions: [...task.sessions, newSession],
              totalTime: task.totalTime + duration,
              subCategoryBreakdown,
              updatedAt: new Date(),
            };
          }
        }

        // Just change the sub-category if not active or no time spent
        return {
          ...task,
          currentSubCategory: newSubCategory,
          currentSessionStart: task.isActive ? new Date() : task.currentSessionStart,
          updatedAt: new Date(),
        };
      }
      return task;
    }));
  }, []);

  // Add a custom sub-category to a task
  const addCustomSubCategory = useCallback((taskId: string, subCategory: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const customSubCategories = task.customSubCategories || [];
        if (!customSubCategories.includes(subCategory)) {
          return {
            ...task,
            customSubCategories: [...customSubCategories, subCategory],
            updatedAt: new Date(),
          };
        }
      }
      return task;
    }));
  }, []);

  return {
    tasks,
    isLoaded,
    createTask,
    updateTask,
    deleteTask,
    startTimer,
    pauseTimer,
    getActiveTasks,
    getTodayTasks,
    getTasksByCategory,
    getTasksByDateRange,
    changeSubCategory,
    addCustomSubCategory,
  };
};
