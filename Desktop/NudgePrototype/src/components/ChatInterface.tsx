import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'you' | 'them';
  timestamp: Date;
}

interface ChatInterfaceProps {
  userName: string;
  onBack: () => void;
}

export function ChatInterface({ userName, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! 👋",
      sender: 'them',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate responses
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === 'you') {
      const timeout = setTimeout(() => {
        const responses = [
          "Nice to meet you!",
          "Cool, what brings you to this area?",
          "I'm just grabbing coffee nearby ☕",
          "Love the vibe here!",
          "Are you from around here?",
          "This place is always so busy!",
          "Hope you're having a good day! 😊"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: randomResponse,
          sender: 'them',
          timestamp: new Date()
        }]);
      }, 1000 + Math.random() * 2000);

      return () => clearTimeout(timeout);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'you',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="p-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{userName}</h3>
            <p className="text-xs text-muted-foreground">Nearby • Just nudged</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-2xl ${
                  message.sender === 'you'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 opacity-70 ${
                  message.sender === 'you' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Say hello..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}