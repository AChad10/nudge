import { motion } from 'motion/react';
import { MapPin, Key, ExternalLink } from 'lucide-react';

interface MapSetupInstructionsProps {
  onClose: () => void;
}

export function MapSetupInstructions({ onClose }: MapSetupInstructionsProps) {
  return (
    <motion.div
      className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card rounded-2xl p-6 max-w-md w-full border border-border shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">Enable Live Maps</h3>
            <p className="text-sm text-muted-foreground">Add your Google Maps API key</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">1</span>
            </div>
            <div>
              <p className="text-sm">
                Get a Google Maps API key from the{' '}
                <a 
                  href="https://console.cloud.google.com/google/maps-apis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline inline-flex items-center gap-1"
                >
                  Google Cloud Console
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">2</span>
            </div>
            <div>
              <p className="text-sm">
                Enable the "Maps JavaScript API" for your project
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Key className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="text-sm">
                Replace "YOUR_GOOGLE_MAPS_API_KEY_HERE" in{' '}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  /components/GoogleMapsBackground.tsx
                </code>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-yellow-700">
            <strong>Note:</strong> For production use, secure your API key with domain restrictions and enable only required APIs.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 px-4 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}