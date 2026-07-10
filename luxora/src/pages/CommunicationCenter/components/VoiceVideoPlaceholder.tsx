import { Phone, Video, X, Users, Mic, MicOff, VideoOff, MonitorUp } from 'lucide-react';
import { GhostButton } from '../../../components/ui/ui';
import { clsx } from 'clsx';
import { useState } from 'react';

interface VoiceVideoPlaceholderProps {
  type: 'voice' | 'video';
  onClose: () => void;
  title: string;
}

export const VoiceVideoPlaceholder = ({ type, onClose, title }: VoiceVideoPlaceholderProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'voice');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={clsx(
        "bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col",
        type === 'video' ? "w-full max-w-4xl aspect-video" : "w-full max-w-sm aspect-[4/5]"
      )}>
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center space-x-2 text-white">
            {type === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
            <span className="font-medium">{title}</span>
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-500 text-white ml-4 animate-pulse">
              Recording
            </span>
          </div>
          <GhostButton size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </GhostButton>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center relative">
          {isVideoOff ? (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gold-600 flex items-center justify-center text-3xl text-white font-bold mb-4 shadow-lg ring-4 ring-gold-500/30">
                {title.substring(0, 2).toUpperCase()}
              </div>
              <p className="text-white font-medium">{title}</p>
              <p className="text-gray-400 text-sm mt-1">Connecting...</p>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-500">
              <span className="text-lg">Video Stream Placeholder</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center space-x-4 absolute bottom-0 left-0 right-0">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={clsx("w-12 h-12 rounded-full flex items-center justify-center transition-colors", isMuted ? "bg-red-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-white")}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={clsx("w-12 h-12 rounded-full flex items-center justify-center transition-colors", isVideoOff ? "bg-red-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-white")}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
            <MonitorUp className="w-5 h-5" />
          </button>

          <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
            <Users className="w-5 h-5" />
          </button>

          <button 
            onClick={onClose}
            className="w-16 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors ml-4 shadow-lg shadow-red-500/20"
          >
            <Phone className="w-6 h-6 rotate-[135deg]" />
          </button>
        </div>

      </div>
    </div>
  );
};
