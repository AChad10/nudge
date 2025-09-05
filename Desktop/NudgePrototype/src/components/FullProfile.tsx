import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Clock, Heart, Sparkles, Coffee, Music, Camera, Book, Zap, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface FullProfileUser {
  id: string;
  name: string;
  age: number;
  distance: string;
  bio: string;
  interests: string[];
  personalityMatch: number;
  commonInterests: number;
  vibe: string;
  recentActivity: string;
  suggestedActivities: {
    activity: string;
    location: string;
    reason: string;
    emoji: string;
  }[];
  compatibilityBreakdown: {
    humor: number;
    adventure: number;
    intellect: number;
    creativity: number;
  };
  hasNudged: boolean;
  youNudged: boolean;
}

interface FullProfileProps {
  user: FullProfileUser;
  onBack: () => void;
  onNudge: () => void;
}

const interestIcons: Record<string, any> = {
  coffee: Coffee,
  music: Music,
  photography: Camera,
  reading: Book,
  art: Sparkles,
  hiking: MapPin,
};

export function FullProfile({ user, onBack, onNudge }: FullProfileProps) {
  const generateGradient = (name: string) => {
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
      className="flex flex-col h-full bg-background"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-medium">{user.name}'s Profile</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className={`w-24 h-24 bg-gradient-to-br ${generateGradient(user.name)} rounded-3xl flex items-center justify-center shadow-lg mx-auto`}>
            <span className="text-white text-3xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div>
            <h1>{user.name}</h1>
            <p className="text-muted-foreground">{user.age} • {user.distance} away</p>
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              {user.vibe}
            </Badge>
            {user.hasNudged && !user.youNudged && (
              <Badge variant="outline" className="px-3 py-1 border-yellow-500 text-yellow-600">
                <Heart className="w-3 h-3 mr-1 fill-current" />
                Nudged you!
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            About
          </h3>
          <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Activity
          </h3>
          <p className="text-sm text-muted-foreground">{user.recentActivity}</p>
        </div>

        {/* Compatibility Breakdown */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Compatibility Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Humor</span>
                <span className="text-sm text-muted-foreground">{user.compatibilityBreakdown.humor}%</span>
              </div>
              <Progress value={user.compatibilityBreakdown.humor} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Adventure</span>
                <span className="text-sm text-muted-foreground">{user.compatibilityBreakdown.adventure}%</span>
              </div>
              <Progress value={user.compatibilityBreakdown.adventure} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Intellect</span>
                <span className="text-sm text-muted-foreground">{user.compatibilityBreakdown.intellect}%</span>
              </div>
              <Progress value={user.compatibilityBreakdown.intellect} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Creativity</span>
                <span className="text-sm text-muted-foreground">{user.compatibilityBreakdown.creativity}%</span>
              </div>
              <Progress value={user.compatibilityBreakdown.creativity} className="h-2" />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <h3 className="font-medium">Interests & Hobbies</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => {
              const Icon = interestIcons[interest.toLowerCase()] || Sparkles;
              const isShared = index < user.commonInterests;
              return (
                <motion.div
                  key={interest}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm ${
                    isShared 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="w-4 h-4" />
                  {interest}
                  {isShared && <span className="text-xs">✨</span>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Suggested Activities */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            AI Suggested Activities
          </h3>
          
          <div className="space-y-3">
            {user.suggestedActivities.map((activity, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-100 dark:border-purple-800"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{activity.emoji}</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm mb-1">{activity.activity}</h5>
                    <p className="text-xs text-muted-foreground mb-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {activity.location}
                    </p>
                    <p className="text-xs text-muted-foreground italic">"{activity.reason}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={onNudge}
          disabled={user.youNudged}
          className="w-full rounded-full py-3"
          variant={user.youNudged ? "outline" : "default"}
        >
          <Heart className={`w-4 h-4 mr-2 ${user.youNudged ? 'fill-current' : ''}`} />
          {user.youNudged ? 'Already Nudged' : 'Send Nudge'}
        </Button>
      </div>
    </motion.div>
  );
}