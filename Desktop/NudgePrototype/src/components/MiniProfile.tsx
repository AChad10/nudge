import { motion } from 'motion/react';
import { Heart, User, MapPin, Sparkles, Coffee, Music, Camera, Book, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MiniProfileUser {
  id: string;
  name: string;
  age: number;
  distance: string;
  interests: string[];
  personalityMatch: number;
  commonInterests: number;
  vibe: string;
  suggestedActivity: {
    activity: string;
    location: string;
    reason: string;
    emoji: string;
  };
  hasNudged: boolean;
  youNudged: boolean;
}

interface MiniProfileProps {
  user: MiniProfileUser;
  isOpen: boolean;
  onClose: () => void;
  onNudge: () => void;
  onViewProfile: () => void;
  position: { x: number; y: number };
}

const interestIcons: Record<string, any> = {
  coffee: Coffee,
  music: Music,
  photography: Camera,
  reading: Book,
  art: Sparkles,
  hiking: MapPin,
};

export function MiniProfile({ user, isOpen, onClose, onNudge, onViewProfile, position }: MiniProfileProps) {
  if (!isOpen) return null;

  const compatibilityColor = 
    user.personalityMatch >= 80 ? 'text-green-500' :
    user.personalityMatch >= 60 ? 'text-yellow-500' : 'text-gray-500';

  const generateGradient = (name: string) => {
    // Generate consistent gradient based on name
    const colors = [
      'from-blue-500 to-purple-600',
      'from-pink-500 to-rose-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-red-600',
      'from-indigo-500 to-blue-600',
      'from-purple-500 to-pink-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Profile Card */}
      <motion.div
        className="relative bg-card border border-border rounded-3xl shadow-2xl p-6 w-80 mx-4"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${generateGradient(user.name)} rounded-2xl flex items-center justify-center shadow-lg`}>
            <span className="text-white text-xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-medium">{user.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">{user.age} • {user.distance} away</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {user.vibe}
              </Badge>
              {user.hasNudged && !user.youNudged && (
                <Badge variant="outline" className="text-xs px-2 py-1 border-yellow-500 text-yellow-600">
                  Nudged you!
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Compatibility Metrics */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Personality Match</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${user.personalityMatch >= 80 ? 'bg-green-500' : user.personalityMatch >= 60 ? 'bg-yellow-500' : 'bg-gray-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${user.personalityMatch}%` }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                />
              </div>
              <span className={`text-sm ${compatibilityColor}`}>{user.personalityMatch}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Common Interests</span>
            <span className="text-sm">{user.commonInterests} shared</span>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <h4 className="text-sm text-muted-foreground mb-3">Shared Interests</h4>
          <div className="flex flex-wrap gap-2">
            {user.interests.slice(0, 4).map((interest) => {
              const Icon = interestIcons[interest.toLowerCase()] || Sparkles;
              return (
                <motion.div
                  key={interest}
                  className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + Math.random() * 0.2 }}
                >
                  <Icon className="w-3 h-3" />
                  {interest}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Suggested Activity */}
        <motion.div
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 mb-6 border border-purple-100 dark:border-purple-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{user.suggestedActivity.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Suggested</span>
              </div>
              <h5 className="font-medium text-sm mb-1">{user.suggestedActivity.activity}</h5>
              <p className="text-xs text-muted-foreground mb-1">📍 {user.suggestedActivity.location}</p>
              <p className="text-xs text-muted-foreground italic">"{user.suggestedActivity.reason}"</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onNudge}
            disabled={user.youNudged}
            className="flex-1 rounded-full"
            variant={user.youNudged ? "outline" : "default"}
          >
            <Heart className={`w-4 h-4 mr-2 ${user.youNudged ? 'fill-current' : ''}`} />
            {user.youNudged ? 'Nudged' : 'Send Nudge'}
          </Button>
          
          <Button
            onClick={onViewProfile}
            variant="outline"
            className="rounded-full"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}