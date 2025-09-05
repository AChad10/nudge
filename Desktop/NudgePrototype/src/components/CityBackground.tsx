import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Building {
  id: string;
  height: number;
  width: number;
  x: number;
  color: string;
  windows: { x: number; y: number; lit: boolean }[];
}

interface CityBackgroundProps {
  direction?: number; // Direction in degrees (0 = North, 90 = East, etc.)
}

export function CityBackground({ direction = 0 }: CityBackgroundProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [currentDirection, setCurrentDirection] = useState(direction);

  useEffect(() => {
    setCurrentDirection(direction);
  }, [direction]);

  useEffect(() => {
    // Generate buildings around the perimeter
    const newBuildings: Building[] = [];
    const numBuildings = 16; // More buildings for better coverage
    
    for (let i = 0; i < numBuildings; i++) {
      const angle = (Math.PI * 2 * i) / numBuildings;
      const distance = 180 + Math.random() * 120; // Buildings further from center
      const height = 30 + Math.random() * 100;
      const width = 15 + Math.random() * 35;
      
      // Vary building types based on direction
      const buildingType = Math.floor(Math.random() * 4);
      let buildingColor = '#2d3748';
      
      switch (buildingType) {
        case 0: buildingColor = '#2d3748'; break; // Dark gray
        case 1: buildingColor = '#4a5568'; break; // Medium gray  
        case 2: buildingColor = '#1a202c'; break; // Very dark
        case 3: buildingColor = '#2c5282'; break; // Dark blue
      }
      
      // Generate windows
      const windows: { x: number; y: number; lit: boolean }[] = [];
      const windowRows = Math.floor(height / 12);
      const windowCols = Math.floor(width / 8);
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          windows.push({
            x: col * 8 + 2,
            y: row * 12 + 4,
            lit: Math.random() > 0.6, // 40% chance of lit window
          });
        }
      }
      
      newBuildings.push({
        id: `building-${i}`,
        height,
        width,
        x: Math.cos(angle) * distance,
        color: buildingColor,
        windows,
      });
    }
    
    setBuildings(newBuildings);
    
    // Animate window lights occasionally
    const interval = setInterval(() => {
      setBuildings(prev => prev.map(building => ({
        ...building,
        windows: building.windows.map(window => ({
          ...window,
          lit: Math.random() > 0.7 ? !window.lit : window.lit,
        })),
      })));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sky gradient - changes based on direction */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${currentDirection}deg, 
            rgba(59, 130, 246, 0.1) 0%, 
            rgba(147, 197, 253, 0.05) 50%, 
            rgba(254, 202, 202, 0.1) 100%)`
        }}
        animate={{ 
          background: `linear-gradient(${currentDirection}deg, 
            rgba(59, 130, 246, 0.1) 0%, 
            rgba(147, 197, 253, 0.05) 50%, 
            rgba(254, 202, 202, 0.1) 100%)` 
        }}
        transition={{ duration: 1 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100/30 to-blue-50/30 dark:from-slate-900/80 dark:to-slate-800/80" />
      
      {/* Buildings */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: -currentDirection }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {buildings.map((building) => (
          <motion.div
            key={building.id}
            className="absolute"
            style={{
              left: `calc(50% + ${building.x}px)`,
              bottom: '20px',
              transform: 'translateX(-50%)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: Math.random() * 2 }}
          >
            {/* Building structure */}
            <div
              className="relative"
              style={{
                width: building.width,
                height: building.height,
                backgroundColor: building.color,
                borderRadius: '2px 2px 0 0',
              }}
            >
              {/* Windows */}
              {building.windows.map((window, idx) => (
                <motion.div
                  key={idx}
                  className={`absolute w-2 h-2 ${
                    window.lit ? 'bg-yellow-200' : 'bg-slate-600'
                  }`}
                  style={{
                    left: window.x,
                    top: window.y,
                    borderRadius: '1px',
                  }}
                  animate={{
                    backgroundColor: window.lit ? '#fef3c7' : '#475569',
                  }}
                  transition={{ duration: 0.5 }}
                />
              ))}
              
              {/* Antenna/roof details */}
              {Math.random() > 0.6 && (
                <div
                  className="absolute bg-gray-400 w-px"
                  style={{
                    height: '8px',
                    left: '50%',
                    top: '-8px',
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Floating particles/dust */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            x: [0, Math.random() * 20 - 10],
            y: [0, Math.random() * 20 - 10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}