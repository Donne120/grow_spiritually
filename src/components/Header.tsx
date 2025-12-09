import { format } from 'date-fns';

export const Header = () => {
  const today = new Date();
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <header className="px-4 pt-6 pb-4">
      <p className="text-sm text-muted-foreground font-medium">
        {format(today, 'EEEE, MMMM d')}
      </p>
      <h1 className="font-display text-2xl font-bold text-foreground mt-1">
        {greeting()}, Missionary
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        "Go into all the world and preach the gospel" — Mark 16:15
      </p>
    </header>
  );
};
