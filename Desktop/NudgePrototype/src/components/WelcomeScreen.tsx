import { motion } from 'motion/react';
import { Radar, Heart, MessageCircle, Users } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo/Icon */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <div className="relative">
          <Radar className="w-16 h-16 text-primary mx-auto" />
          <motion.div
            className="absolute -inset-4 border-2 border-primary/20 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Welcome to Nudge
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-muted-foreground mb-8 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Spark real-world friendships through gentle nudges. 
        No profiles, no pressure — just authentic connections.
      </motion.p>

      {/* Features */}
      <motion.div
        className="space-y-4 mb-8 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-3 text-left">
          <Users className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm">See nearby people as gentle pulses</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-left">
          <Heart className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm">Send subtle nudges to show interest</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-left">
          <MessageCircle className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm">Chat unlocks when both people nudge</p>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Button 
          onClick={onStart}
          className="px-8 py-2 rounded-full"
        >
          Start Exploring
        </Button>
      </motion.div>

      {/* Footer note */}
      <motion.p
        className="text-xs text-muted-foreground mt-8 max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Your location is kept private and only used to find nearby connections
      </motion.p>
    </motion.div>
  );
}