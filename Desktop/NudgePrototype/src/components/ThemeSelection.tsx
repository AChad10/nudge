import { motion } from 'motion/react';
import { Heart, Sparkles, Zap, Coffee, Music, Camera, Palette, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  pulseColor: string;
}

interface ThemeSelectionProps {
  onThemeSelected: (theme: ThemeOption) => void;
}

const themes: ThemeOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless and elegant',
    icon: Heart,
    color: 'text-pink-500',
    gradient: 'from-pink-500/20 to-rose-500/20',
    pulseColor: 'bg-pink-500',
  },
  {
    id: 'electric',
    name: 'Electric',
    description: 'Bold and energetic',
    icon: Zap,
    color: 'text-yellow-500',
    gradient: 'from-yellow-500/20 to-orange-500/20',
    pulseColor: 'bg-yellow-500',
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    description: 'Dreamy and mystical',
    icon: Sparkles,
    color: 'text-purple-500',
    gradient: 'from-purple-500/20 to-indigo-500/20',
    pulseColor: 'bg-purple-500',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    description: 'Warm and cozy',
    icon: Coffee,
    color: 'text-amber-600',
    gradient: 'from-amber-600/20 to-yellow-600/20',
    pulseColor: 'bg-amber-600',
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Rhythmic and cool',
    icon: Music,
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    pulseColor: 'bg-blue-500',
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative and colorful',
    icon: Palette,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    pulseColor: 'bg-emerald-500',
  },
];

export function ThemeSelection({ onThemeSelected }: ThemeSelectionProps) {
  return (
    <motion.div
      className="flex flex-col h-full p-6 bg-gradient-to-br from-background to-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mb-3">Choose Your Vibe</h1>
          <p className="text-muted-foreground">
            Pick a theme that represents your energy
          </p>
        </motion.div>
      </div>

      {/* Theme Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {themes.map((theme, index) => {
            const Icon = theme.icon;
            
            return (
              <motion.div
                key={theme.id}
                className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${theme.gradient} p-6 cursor-pointer group hover:border-primary/50 transition-all duration-300`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onThemeSelected(theme)}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                  <div className={`absolute top-2 right-2 w-16 h-16 ${theme.pulseColor} rounded-full blur-xl`} />
                  <div className={`absolute bottom-2 left-2 w-12 h-12 ${theme.pulseColor} rounded-full blur-lg`} />
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 ${theme.pulseColor} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-medium mb-1">{theme.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {theme.description}
                    </p>
                    
                    {/* Preview pulse */}
                    <div className="relative">
                      <div className={`w-8 h-8 ${theme.pulseColor} rounded-full opacity-60`} />
                      <div className={`absolute inset-0 w-8 h-8 ${theme.pulseColor} rounded-full animate-pulse`} />
                    </div>
                  </div>
                </div>

                {/* Hover arrow */}
                <motion.div
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        className="text-center pt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-xs text-muted-foreground">
          You can always change this later in settings
        </p>
      </motion.div>
    </motion.div>
  );
}