import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle } from 'lucide-react';
import { GoogleMapsBackground } from './GoogleMapsBackground';
import { MiniProfile } from './MiniProfile';
import { RadarLegend } from './RadarLegend';

interface User {
  id: string;
  x: number;
  y: number;
  distance: number;
  hasNudged: boolean;
  youNudged: boolean;
  mutualNudge: boolean;
  chatUnlocked: boolean;
}

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

interface RadarInterfaceProps {
  onChatOpen: (user: User) => void;
  onViewProfile: (user: MiniProfileUser) => void;
  onMiniProfileStateChange?: (isOpen: boolean) => void;
}

export function RadarInterface({ onChatOpen, onViewProfile, onMiniProfileStateChange }: RadarInterfaceProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [pulseRadius, setPulseRadius] = useState(100);
  const [selectedUser, setSelectedUser] = useState<MiniProfileUser | null>(null);
  const [showMiniProfile, setShowMiniProfile] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(0);

  // Generate user profile data
  const generateUserProfile = (user: User): MiniProfileUser => {
    const names = ['Alex', 'Sam', 'Casey', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Avery'];
    const vibes = ['Chill', 'Adventurous', 'Creative', 'Intellectual', 'Funny', 'Mysterious'];
    const interests = ['Coffee', 'Music', 'Photography', 'Reading', 'Art', 'Hiking', 'Cooking', 'Gaming'];
    const activities = [
      { activity: 'Grab coffee at the corner café', location: 'Blue Bottle Coffee', reason: 'You both love artisanal coffee and cozy conversations', emoji: '☕' },
      { activity: 'Check out the street art in the alley', location: 'Mission District', reason: 'Your shared love for art and photography', emoji: '🎨' },
      { activity: 'Browse books at the local bookstore', location: 'City Lights Books', reason: 'You both enjoy literary discussions', emoji: '📚' },
      { activity: 'Take photos at the rooftop garden', location: 'Salesforce Park', reason: 'Perfect for your photography interests', emoji: '📸' },
    ];

    const index = parseInt(user.id.split('-')[1]) || 0;
    const name = names[index % names.length];
    const shuffledInterests = [...interests].sort(() => Math.random() - 0.5);
    const commonInterests = Math.floor(Math.random() * 3) + 2;

    return {
      id: user.id,
      name,
      age: 22 + Math.floor(Math.random() * 10),
      distance: `${user.distance}m`,
      interests: shuffledInterests.slice(0, 5),
      personalityMatch: 65 + Math.floor(Math.random() * 25),
      commonInterests,
      vibe: vibes[index % vibes.length],
      suggestedActivity: activities[index % activities.length],
      hasNudged: user.hasNudged,
      youNudged: user.youNudged,
    };
  };

  // Generate random nearby users
  useEffect(() => {
    const generateUsers = () => {
      const newUsers: User[] = [];
      const numUsers = Math.floor(Math.random() * 6) + 3; // 3-8 users
      
      for (let i = 0; i < numUsers; i++) {
        const angle = (Math.PI * 2 * i) / numUsers + Math.random() * 0.5;
        const distance = 50 + Math.random() * 120; // 50-170px from center
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        newUsers.push({
          id: `user-${i}`,
          x,
          y,
          distance: Math.floor(distance / 10) * 10, // Simplified distance in "meters"
          hasNudged: false,
          youNudged: false,
          mutualNudge: false,
          chatUnlocked: false,
        });
      }
      
      setUsers(newUsers);
    };

    generateUsers();
    
    // Simulate users moving slightly
    const moveInterval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        x: user.x + (Math.random() - 0.5) * 4,
        y: user.y + (Math.random() - 0.5) * 4,
      })));
    }, 3000);

    // Simulate compass/orientation changes
    const compassInterval = setInterval(() => {
      setCurrentDirection(prev => (prev + 15) % 360);
    }, 5000);

    return () => {
      clearInterval(moveInterval);
      clearInterval(compassInterval);
    };
  }, []);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseRadius(prev => prev === 100 ? 120 : 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleNudge = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const youNudged = true;
        // Simulate 30% chance the other person has already nudged
        const hasNudged = user.hasNudged || Math.random() < 0.3;
        const mutualNudge = youNudged && hasNudged;
        const chatUnlocked = mutualNudge;
        
        return {
          ...user,
          youNudged,
          hasNudged,
          mutualNudge,
          chatUnlocked,
        };
      }
      return user;
    }));
  };

  const handleChatOpen = (user: User) => {
    if (user.chatUnlocked) {
      onChatOpen(user);
    }
  };

  const handleUserClick = (user: User) => {
    if (user.chatUnlocked) {
      handleChatOpen(user);
    } else {
      const profileUser = generateUserProfile(user);
      setSelectedUser(profileUser);
      setShowMiniProfile(true);
      onMiniProfileStateChange?.(true);
    }
  };

  const handleNudgeFromProfile = () => {
    if (selectedUser) {
      handleNudge(selectedUser.id);
      setSelectedUser(prev => prev ? { ...prev, youNudged: true } : null);
    }
  };

  const handleViewFullProfile = () => {
    if (selectedUser) {
      onViewProfile(selectedUser);
      setShowMiniProfile(false);
      setSelectedUser(null);
    }
  };

  const closeMiniProfile = () => {
    setShowMiniProfile(false);
    setSelectedUser(null);
    onMiniProfileStateChange?.(false);
  };

  return (
    <>
      <GoogleMapsBackground direction={currentDirection} />
      <RadarLegend />
      <div className="relative w-80 h-80 mx-auto z-10">
      {/* Radar circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[60, 120, 180].map((radius, i) => (
          <motion.div
            key={radius}
            className="absolute border border-muted-foreground/20 rounded-full"
            style={{
              width: radius * 2,
              height: radius * 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Center pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-3 h-3 bg-primary rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-6 h-6 border-2 border-primary/30 rounded-full"
          animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Users */}
      <AnimatePresence>
        {users.map((user) => (
          <motion.div
            key={user.id}
            className="absolute flex items-center justify-center cursor-pointer"
            style={{
              left: `calc(50% + ${user.x}px)`,
              top: `calc(50% + ${user.y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleUserClick(user)}
          >
            {/* User pulse */}
            <motion.div
              className={`w-3 h-3 rounded-full ${
                user.mutualNudge 
                  ? 'bg-green-500' 
                  : user.youNudged 
                    ? 'bg-purple-500' 
                    : user.hasNudged 
                      ? 'bg-yellow-500' 
                      : 'bg-blue-500'
              }`}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ 
                duration: 2 + Math.random(), 
                repeat: Infinity,
                delay: Math.random() * 2 
              }}
            />
            
            {/* Pulse ring */}
            <motion.div
              className={`absolute w-8 h-8 border rounded-full ${
                user.mutualNudge 
                  ? 'border-green-500/40' 
                  : user.youNudged 
                    ? 'border-purple-500/40' 
                    : user.hasNudged 
                      ? 'border-yellow-500/40' 
                      : 'border-blue-500/30'
              }`}
              animate={{ 
                scale: [1, 2, 1], 
                opacity: [0.6, 0, 0.6] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                delay: Math.random() * 3 
              }}
            />

            {/* Status indicators */}
            {user.youNudged && !user.mutualNudge && (
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Heart className="w-3 h-3 text-purple-500 fill-purple-500" />
              </motion.div>
            )}
            
            {user.chatUnlocked && (
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <MessageCircle className="w-3 h-3 text-green-500 fill-green-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>


      
      {/* Mini Profile */}
      <AnimatePresence>
        {showMiniProfile && selectedUser && (
          <MiniProfile
            user={selectedUser}
            isOpen={showMiniProfile}
            onClose={closeMiniProfile}
            onNudge={handleNudgeFromProfile}
            onViewProfile={handleViewFullProfile}
            position={{ x: 0, y: 0 }} // We'll position it centered
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}