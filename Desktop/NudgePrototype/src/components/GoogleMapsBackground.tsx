import { motion } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

interface GoogleMapsBackgroundProps {
  direction?: number; // Direction in degrees (0 = North, 90 = East, etc.)
}

interface UserLocation {
  lat: number;
  lng: number;
}

export function GoogleMapsBackground({ direction = 0 }: GoogleMapsBackgroundProps) {
  const [currentDirection, setCurrentDirection] = useState(direction);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  // Minimal white/grey map style matching the reference image
  const mapStyle = [
    {
      "featureType": "all",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        { "color": "#ffffff" }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry",
      "stylers": [
        { "color": "#f5f5f5" }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        { "color": "#ffffff" }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        { "color": "#e5e5e5" },
        { "visibility": "simplified" }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        { "color": "#d0d0d0" }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        { "color": "#e5e5e5" }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        { "color": "#f0f0f0" }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        { "visibility": "off" }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        { "color": "#e8e8e8" }
      ]
    }
  ];

  // Update direction when prop changes
  useEffect(() => {
    setCurrentDirection(direction);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setHeading(direction);
    }
  }, [direction]);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        return Promise.resolve();
      }

      // Check if API key is configured
      const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
      if (apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        console.info('Google Maps API key not configured. Using fallback background.');
        setError('Maps unavailable');
        setIsLoading(false);
        return Promise.reject(new Error('API key not configured'));
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps'));
        
        document.head.appendChild(script);
      });
    };

    loadGoogleMapsScript().catch(() => {
      console.warn('Google Maps failed to load. Using fallback background.');
      setError('Maps unavailable');
      setIsLoading(false);
    });
  }, []);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setIsLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setError(null);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Use San Francisco as fallback location
        setUserLocation({ lat: 37.7749, lng: -122.4194 });
        setError('Using approximate location');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!userLocation || !mapRef.current || !window.google?.maps || error === 'Maps unavailable') {
      if (userLocation && error !== 'Maps unavailable') {
        setIsLoading(false);
      }
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 16,
      heading: currentDirection,
      tilt: 0,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      gestureHandling: 'none',
      keyboardShortcuts: false,
      styles: mapStyle,
      backgroundColor: '#ffffff',
    });

    mapInstanceRef.current = map;
    setIsLoading(false);

    return () => {
      mapInstanceRef.current = null;
    };
  }, [userLocation, error]);

  // Fallback background for when maps are unavailable
  if (error === 'Maps unavailable' || !window.google?.maps) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${currentDirection}deg, 
              rgba(248, 248, 248, 1) 0%, 
              rgba(255, 255, 255, 1) 50%, 
              rgba(245, 245, 245, 1) 100%)`
          }}
          animate={{ 
            background: `linear-gradient(${currentDirection}deg, 
              rgba(248, 248, 248, 1) 0%, 
              rgba(255, 255, 255, 1) 50%, 
              rgba(245, 245, 245, 1) 100%)` 
          }}
          transition={{ duration: 1 }}
        />
        
        {/* Abstract street-like pattern */}
        <motion.div 
          className="absolute inset-0"
          animate={{ rotate: -currentDirection }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Horizontal streets */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute bg-gray-200/60"
              style={{
                left: '0%',
                right: '0%',
                top: `${20 + i * 15}%`,
                height: i % 2 === 0 ? '2px' : '1px',
                transform: `rotate(${Math.random() * 4 - 2}deg)`,
              }}
            />
          ))}
          
          {/* Vertical streets */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute bg-gray-200/60"
              style={{
                top: '0%',
                bottom: '0%',
                left: `${25 + i * 15}%`,
                width: i % 2 === 0 ? '2px' : '1px',
                transform: `rotate(${Math.random() * 4 - 2}deg)`,
              }}
            />
          ))}
          
          {/* Building blocks */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`block-${i}`}
              className="absolute bg-gray-100/80"
              style={{
                left: `${10 + (i % 4) * 20}%`,
                top: `${15 + Math.floor(i / 4) * 25}%`,
                width: `${12 + Math.random() * 8}%`,
                height: `${8 + Math.random() * 12}%`,
                borderRadius: '2px',
                transform: `rotate(${Math.random() * 2 - 1}deg)`,
              }}
            />
          ))}
        </motion.div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:40px_40px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <div className="text-muted-foreground">Loading map...</div>
        </div>
      )}

      {/* Google Maps container */}
      <motion.div 
        ref={mapRef} 
        className="absolute inset-0 w-full h-full"
        style={{
          filter: 'grayscale(20%) contrast(90%) brightness(110%)',
        }}
        animate={{ 
          rotate: 0 // Map handles rotation internally
        }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Overlay for additional atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

      {/* Subtle floating particles for ambiance */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            x: [0, Math.random() * 30 - 15],
            y: [0, Math.random() * 30 - 15],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Location status indicator (for debugging, can be removed) */}
      {error && error !== 'Maps unavailable' && (
        <div className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
          {error}
        </div>
      )}
    </div>
  );
}