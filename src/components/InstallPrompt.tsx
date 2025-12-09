import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay (don't be too aggressive)
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For iOS, show instructions after delay
    if (isIOSDevice && !isStandaloneMode) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 5000);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed
  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-fade-in-up">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xl max-w-md mx-auto">
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
            <Smartphone className="h-7 w-7 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-foreground mb-1">
              Install CYSMF Tracker
            </h3>
            
            {isIOS ? (
              <p className="text-sm text-muted-foreground mb-3">
                Tap the <span className="inline-flex items-center px-1.5 py-0.5 bg-secondary rounded text-xs font-medium">Share</span> button, 
                then <span className="inline-flex items-center px-1.5 py-0.5 bg-secondary rounded text-xs font-medium">Add to Home Screen</span>
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Install the app for offline access and a better experience!
                </p>
                <Button 
                  onClick={handleInstall}
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Install App
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

