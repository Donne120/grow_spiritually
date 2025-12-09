import { Button } from '@/components/ui/button';
import { Trash2, Download, Heart, Church, Users } from 'lucide-react';
import { toast } from 'sonner';
import { MeetingSchedule } from '@/components/UpcomingMeeting';

interface SettingsViewProps {
  onClearAllData: () => void;
  tasksCount: number;
}

export const SettingsView = ({ onClearAllData, tasksCount }: SettingsViewProps) => {
  const handleExportData = () => {
    const data = localStorage.getItem('cysmf_ministry_tasks');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cysmf-ministry-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully!');
    } else {
      toast.error('No data to export');
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your ministry data? This action cannot be undone.')) {
      localStorage.removeItem('cysmf_ministry_tasks');
      onClearAllData();
      toast.success('All data cleared');
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="px-4 pt-6 pb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your app preferences
        </p>
      </header>

      <div className="px-4 space-y-4">
        {/* About Card */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Church className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg">CYSMF Ministry Tracker</h2>
              <p className="text-sm opacity-80">Christian Youths & Student Missionary Fellowship</p>
            </div>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">
            Track your ministry activities, evangelism efforts, prayer time, and spiritual growth. 
            This app helps you steward your time for the Lord.
          </p>
        </div>

        {/* Community Card */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold">Community & Meetings</h3>
          </div>
          <MeetingSchedule />
        </div>

        {/* Stats Card */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="font-display font-semibold mb-4">Your Ministry Data</h3>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-3xl font-bold text-primary">{tasksCount}</p>
            <p className="text-sm text-muted-foreground">Total Tasks Recorded</p>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="font-display font-semibold mb-4">Data Management</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Ministry Data
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleClearData}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Scripture */}
        <div className="bg-secondary/30 rounded-xl p-5 text-center">
          <Heart className="h-6 w-6 text-primary mx-auto mb-3" />
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters"
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-medium">— Colossians 3:23</p>
        </div>

        {/* Version */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground">Built with ❤️ for CYSMF</p>
        </div>
      </div>
    </div>
  );
};
