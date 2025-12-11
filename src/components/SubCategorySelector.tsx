import { useState } from 'react';
import { TaskCategory, SUB_CATEGORIES } from '@/types/task';
import { Plus, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubCategorySelectorProps {
  category: TaskCategory;
  currentSubCategory?: string;
  customSubCategories?: string[];
  onSelect: (subCategory: string) => void;
  onAddCustom: (subCategory: string) => void;
}

export const SubCategorySelector = ({
  category,
  currentSubCategory,
  customSubCategories = [],
  onSelect,
  onAddCustom,
}: SubCategorySelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState('');

  const defaultSubCategories = SUB_CATEGORIES[category] || [];
  const allSubCategories = [...defaultSubCategories, ...customSubCategories];

  const handleAddCustom = () => {
    if (newSubCategory.trim()) {
      onAddCustom(newSubCategory.trim());
      onSelect(newSubCategory.trim());
      setNewSubCategory('');
      setIsAdding(false);
    }
  };

  return (
    <div className="mt-3" onClick={(e) => e.stopPropagation()}>
      {/* Current Selection Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Current:</span>
          <span className="font-medium text-sm text-primary">
            {currentSubCategory || 'Select sub-category'}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-primary transition-transform",
          isExpanded && "rotate-180"
        )} />
      </button>

      {/* Expanded Selection */}
      {isExpanded && (
        <div className="mt-2 p-2 rounded-xl bg-card border border-border shadow-lg animate-fade-in">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold px-2 mb-2">
            Switch to:
          </p>
          
          {/* Sub-category buttons */}
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {allSubCategories.map((subCat) => (
              <button
                key={subCat}
                onClick={() => {
                  onSelect(subCat);
                  setIsExpanded(false);
                }}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                  currentSubCategory === subCat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                )}
              >
                {currentSubCategory === subCat && (
                  <Check className="h-3 w-3 inline mr-1" />
                )}
                {subCat}
              </button>
            ))}
          </div>

          {/* Add Custom */}
          <div className="mt-2 pt-2 border-t border-border">
            {!isAdding ? (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors w-full"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Custom
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                  placeholder="Enter name..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
                <button
                  onClick={handleAddCustom}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewSubCategory('');
                  }}
                  className="px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Compact version showing sub-category breakdown
export const SubCategoryBreakdown = ({ 
  breakdown 
}: { 
  breakdown: { subCategory: string; duration: number }[] 
}) => {
  if (!breakdown || breakdown.length === 0) return null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const total = breakdown.reduce((sum, b) => sum + b.duration, 0);

  return (
    <div className="mt-3 space-y-1.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
        Time Breakdown:
      </p>
      {breakdown.map((item, index) => {
        const percentage = total > 0 ? Math.round((item.duration / total) * 100) : 0;
        return (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground min-w-[80px]">
              {item.subCategory}
            </span>
            <span className="text-xs font-mono font-medium text-foreground min-w-[40px] text-right">
              {formatTime(item.duration)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

