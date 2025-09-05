import { motion } from 'motion/react';
import { Heart, MessageCircle, Users } from 'lucide-react';

export function RadarLegend() {
  return (
    <motion.div
      className="absolute top-4 right-4 z-30 bg-card/90 backdrop-blur-md rounded-2xl p-3 border border-border/50 shadow-lg"
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-muted-foreground">Available</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-yellow-500 rounded-full">
            <Heart className="w-2 h-2 text-white ml-0.5 mt-0.5" />
          </div>
          <span className="text-muted-foreground">Nudged you</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-purple-500 rounded-full">
            <Heart className="w-2 h-2 text-white fill-current ml-0.5 mt-0.5" />
          </div>
          <span className="text-muted-foreground">You nudged</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-green-500 rounded-full">
            <MessageCircle className="w-2 h-2 text-white ml-0.5 mt-0.5" />
          </div>
          <span className="text-muted-foreground">Chat unlocked</span>
        </div>
      </div>
    </motion.div>
  );
}