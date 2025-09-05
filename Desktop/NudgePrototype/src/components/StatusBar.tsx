import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, MapPin, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MapSetupInstructions } from './MapSetupInstructions';

export function StatusBar() {
  const [isConnected, setIsConnected] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [showMapSetup, setShowMapSetup] = useState(false);

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime
      setUserCount(Math.floor(Math.random() * 12) + 3); // 3-15 users
    }, 5000);

    // Initial values
    setUserCount(Math.floor(Math.random() * 12) + 3);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-sm">
          <div className="flex items-center gap-3 text-xs">
            {/* Connection Status */}
            <div className="flex items-center gap-1.5">
              {isConnected ? (
                <Wifi className="w-3 h-3 text-green-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-500" />
              )}
              <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                {isConnected ? 'Connected' : 'Reconnecting...'}
              </span>
            </div>

            {/* Separator */}
            <div className="w-px h-3 bg-border" />

            {/* User Count */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-blue-500" />
              <span className="text-muted-foreground">
                {userCount} nearby
              </span>
            </div>

            {/* Separator */}
            <div className="w-px h-3 bg-border" />

            {/* Map Setup Button */}
            <button
              onClick={() => setShowMapSetup(true)}
              className="flex items-center gap-1.5 hover:bg-accent/50 rounded-full px-2 py-1 -mx-2 -my-1 transition-colors"
              title="Configure Maps"
            >
              <Settings className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Maps</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Map Setup Instructions Modal */}
      <AnimatePresence>
        {showMapSetup && (
          <MapSetupInstructions onClose={() => setShowMapSetup(false)} />
        )}
      </AnimatePresence>
    </>
  );
}