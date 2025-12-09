import { useState } from 'react';
import { Task, TaskCategory } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { TaskDetailSheet } from '@/components/TaskDetailSheet';
import { getCategoryLabel, getCategoryIcon } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TasksViewProps {
  tasks: Task[];
  onStartTimer: (taskId: string) => void;
  onPauseTimer: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const categories: (TaskCategory | 'all')[] = [
  'all',
  'evangelism',
  'prayer',
  'bible_study',
  'meditation',
  'literature',
  'fellowship',
  'other',
];

export const TasksView = ({
  tasks,
  onStartTimer,
  onPauseTimer,
  onDeleteTask,
}: TasksViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24">
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">
          All Tasks
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {tasks.length} total tasks recorded
        </p>
      </header>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {category !== 'all' && <span>{getCategoryIcon(category)}</span>}
              <span>{category === 'all' ? 'All' : getCategoryLabel(category)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="px-4 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
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
          ))
        )}
      </div>

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
