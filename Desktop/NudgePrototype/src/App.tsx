import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RadarInterface } from './components/RadarInterface';
import { ChatInterface } from './components/ChatInterface';
import { FullProfile } from './components/FullProfile';
import { StatusBar } from './components/StatusBar';

type Screen = 'welcome' | 'radar' | 'chat' | 'profile';

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [chatUser, setChatUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<FullProfileUser | null>(null);
  const [isMiniProfileOpen, setIsMiniProfileOpen] = useState(false);

  const handleStart = () => {
    setCurrentScreen('radar');
  };

  const handleChatOpen = (user: User) => {
    setChatUser(user);
    setCurrentScreen('chat');
  };

  const handleViewProfile = (miniProfileUser: any) => {
    // Convert mini profile user to full profile user with additional data
    const fullUser: FullProfileUser = {
      ...miniProfileUser,
      bio: generateBio(miniProfileUser.name, miniProfileUser.interests),
      recentActivity: generateRecentActivity(),
      suggestedActivities: generateSuggestedActivities(),
      compatibilityBreakdown: generateCompatibilityBreakdown(),
    };
    setProfileUser(fullUser);
    setCurrentScreen('profile');
  };

  const handleBackToRadar = () => {
    setCurrentScreen('radar');
    setChatUser(null);
    setProfileUser(null);
    setIsMiniProfileOpen(false);
  };

  const handleMiniProfileStateChange = (isOpen: boolean) => {
    setIsMiniProfileOpen(isOpen);
  };

  const generateUserName = (userId: string) => {
    const names = ['Alex', 'Sam', 'Casey', 'Jordan', 'Taylor', 'Morgan', 'Riley', 'Avery'];
    const index = parseInt(userId.split('-')[1]) || 0;
    return names[index % names.length];
  };

  const generateBio = (name: string, interests: string[]) => {
    const bios = [
      `Love exploring the city and finding hidden gems. Always up for good conversations over coffee!`,
      `Creative soul who enjoys capturing moments and creating memories. Let's discover something new together.`,
      `Bookworm by day, music lover by night. Looking for someone to share adventures with.`,
      `Life's too short for boring conversations. Let's talk about everything and nothing.`,
      `Passionate about art, culture, and connecting with interesting people in this amazing city.`
    ];
    const index = name.charCodeAt(0) % bios.length;
    return bios[index];
  };

  const generateRecentActivity = () => {
    const activities = [
      'Just finished reading an amazing book at the park',
      'Discovered a new coffee shop with incredible pastries',
      'Attended a local art exhibition last weekend',
      'Went on a photo walk around the neighborhood',
      'Tried a new restaurant in the Mission District',
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  const generateSuggestedActivities = () => {
    const activities = [
      { activity: 'Coffee & conversation at Blue Bottle', location: 'Hayes Valley', reason: 'You both appreciate quality coffee and meaningful chats', emoji: '☕' },
      { activity: 'Explore the street art murals', location: 'Mission District', reason: 'Your shared creative interests make this perfect', emoji: '🎨' },
      { activity: 'Browse vintage books together', location: 'Green Apple Books', reason: 'Both of you love discovering hidden literary gems', emoji: '📚' },
    ];
    return activities.slice(0, 2 + Math.floor(Math.random() * 2));
  };

  const generateCompatibilityBreakdown = () => {
    return {
      humor: 70 + Math.floor(Math.random() * 25),
      adventure: 65 + Math.floor(Math.random() * 30),
      intellect: 75 + Math.floor(Math.random() * 20),
      creativity: 80 + Math.floor(Math.random() * 15),
    };
  };

  return (
    <div className="size-full flex items-center justify-center bg-background">
      {/* Status Bar - only show on radar screen */}
      {currentScreen === 'radar' && <StatusBar />}
      
      <div className="w-full max-w-md h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentScreen === 'welcome' && (
            <WelcomeScreen key="welcome" onStart={handleStart} />
          )}
          
          {currentScreen === 'radar' && (
            <div key="radar" className="flex flex-col items-center justify-center h-full p-6 relative">
              {!isMiniProfileOpen && (
                <div className="mb-8 text-center z-20 relative">
                  <div className="bg-card/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-border/50">
                    <h2 className="mb-1">Nearby People</h2>
                    <p className="text-muted-foreground text-sm">
                      Tap a pulse to see their profile
                    </p>
                  </div>
                </div>
              )}
              
              <RadarInterface 
                onChatOpen={handleChatOpen} 
                onViewProfile={handleViewProfile}
                onMiniProfileStateChange={handleMiniProfileStateChange}
              />
              
              {!isMiniProfileOpen && (
                <div className="mt-8 text-center z-20 relative">
                  <div className="bg-card/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-border/50">
                    <p className="text-xs text-muted-foreground">
                      When you both nudge, a chat unlocks
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {currentScreen === 'chat' && chatUser && (
            <ChatInterface 
              key="chat"
              userName={generateUserName(chatUser.id)}
              onBack={handleBackToRadar}
            />
          )}
          
          {currentScreen === 'profile' && profileUser && (
            <FullProfile
              key="profile"
              user={profileUser}
              onBack={handleBackToRadar}
              onNudge={() => {
                // Handle nudge from profile
                console.log('Nudged from profile');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}