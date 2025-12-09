import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Task, TaskCategory, EvangelismDetails, BibleStudyDetails, PrayerDetails, MeditationDetails, LiteratureDetails } from '@/types/task';
import { getCategoryLabel, getCategoryIcon } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import { MapPin, FileText, Plus, Minus } from 'lucide-react';

interface CreateTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Partial<Task>) => void;
}

const categories: TaskCategory[] = [
  'evangelism',
  'prayer',
  'bible_study',
  'meditation',
  'literature',
  'fellowship',
  'other',
];

export const CreateTaskSheet = ({ isOpen, onClose, onCreateTask }: CreateTaskSheetProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('evangelism');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Evangelism specific
  const [tractsShared, setTractsShared] = useState(0);
  const [peoplePrayed, setPeoplePrayed] = useState(0);
  const [repentances, setRepentances] = useState(0);
  const [invitations, setInvitations] = useState(0);

  // Bible Study specific
  const [chaptersRead, setChaptersRead] = useState(0);
  const [book, setBook] = useState('');

  // Literature specific
  const [literatureTitle, setLiteratureTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pagesRead, setPagesRead] = useState(0);

  // Meditation specific
  const [scripture, setScripture] = useState('');

  const resetForm = () => {
    setTitle('');
    setCategory('evangelism');
    setLocation('');
    setNotes('');
    setTractsShared(0);
    setPeoplePrayed(0);
    setRepentances(0);
    setInvitations(0);
    setChaptersRead(0);
    setBook('');
    setLiteratureTitle('');
    setAuthor('');
    setPagesRead(0);
    setScripture('');
  };

  const handleSubmit = () => {
    const taskData: Partial<Task> = {
      title: title || getCategoryLabel(category),
      category,
      location,
      notes,
    };

    if (category === 'evangelism') {
      taskData.evangelismDetails = {
        tractsShared,
        peoplePrayed,
        repentances,
        invitations,
        location,
      };
    }

    if (category === 'bible_study') {
      taskData.bibleStudyDetails = {
        chaptersRead,
        book,
        notes,
      };
    }

    if (category === 'literature') {
      taskData.literatureDetails = {
        title: literatureTitle,
        author,
        pagesRead,
      };
    }

    if (category === 'meditation') {
      taskData.meditationDetails = {
        scripture,
        revelation: notes,
      };
    }

    onCreateTask(taskData);
    resetForm();
    onClose();
  };

  const CounterInput = ({
    label,
    value,
    onChange,
    icon,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon?: string;
  }) => (
    <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
      <span className="text-sm font-medium flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.max(0, value - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center font-mono font-semibold">{value}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(value + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display text-2xl">New Ministry Task</SheetTitle>
          <SheetDescription>
            Track your time serving the Lord
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-8">
          {/* Category Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-left',
                    category === cat
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  )}
                >
                  <span className="text-xl">{getCategoryIcon(cat)}</span>
                  <span className="text-sm font-medium">{getCategoryLabel(cat)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium mb-2 block">
              Task Title (Optional)
            </Label>
            <Input
              id="title"
              placeholder={`e.g., ${getCategoryLabel(category)} at Church`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium mb-2 block">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </span>
            </Label>
            <Input
              id="location"
              placeholder="Where are you serving?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Category-specific fields */}
          {category === 'evangelism' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium mb-2 block">Evangelism Details</Label>
              <CounterInput
                label="Gospel Tracts Shared"
                value={tractsShared}
                onChange={setTractsShared}
                icon="📄"
              />
              <CounterInput
                label="People Preached To"
                value={peoplePrayed}
                onChange={setPeoplePrayed}
                icon="🗣️"
              />
              <CounterInput
                label="Souls Won (Repentances)"
                value={repentances}
                onChange={setRepentances}
                icon="✨"
              />
              <CounterInput
                label="Church Invitations Given"
                value={invitations}
                onChange={setInvitations}
                icon="💌"
              />
            </div>
          )}

          {category === 'bible_study' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium mb-2 block">Bible Study Details</Label>
              <Input
                placeholder="Book of the Bible (e.g., Matthew)"
                value={book}
                onChange={(e) => setBook(e.target.value)}
                className="h-12"
              />
              <CounterInput
                label="Chapters Read"
                value={chaptersRead}
                onChange={setChaptersRead}
                icon="📖"
              />
            </div>
          )}

          {category === 'literature' && (
            <div className="space-y-3">
              <Label className="text-sm font-medium mb-2 block">Literature Details</Label>
              <Input
                placeholder="Book Title"
                value={literatureTitle}
                onChange={(e) => setLiteratureTitle(e.target.value)}
                className="h-12"
              />
              <Input
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="h-12"
              />
              <CounterInput
                label="Pages Read"
                value={pagesRead}
                onChange={setPagesRead}
                icon="📚"
              />
            </div>
          )}

          {category === 'meditation' && (
            <div>
              <Label htmlFor="scripture" className="text-sm font-medium mb-2 block">
                Scripture Reference
              </Label>
              <Input
                id="scripture"
                placeholder="e.g., John 3:16"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or revelations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="hero"
            className="w-full"
            onClick={handleSubmit}
          >
            <Plus className="h-5 w-5" />
            Start Task & Timer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
