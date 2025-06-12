
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getActivityStatusText } from './utils';

interface FloatingButtonProps {
  isActive: boolean;
  newActivitiesCount: number;
  lastActiveTime: string;
  onClick: () => void;
}

const FloatingButton = ({ isActive, newActivitiesCount, lastActiveTime, onClick }: FloatingButtonProps) => {
  return (
    <div className="relative">
      <Button
        onClick={onClick}
        className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isActive 
            ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 animate-pulse' 
            : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
        }`}
      >
        <div className="flex flex-col items-center">
          <Bot size={24} className="mb-1" />
          <span className="text-xs font-cairo font-bold">
            {isActive ? 'نشط' : 'خامل'}
          </span>
          {isActive && newActivitiesCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[24px] h-6 rounded-full text-xs animate-bounce">
              {newActivitiesCount}
            </Badge>
          )}
        </div>
      </Button>
      
      {/* Status indicator */}
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 text-white px-2 py-1 rounded-full font-cairo whitespace-nowrap">
          {getActivityStatusText(isActive, lastActiveTime)}
        </div>
      )}
    </div>
  );
};

export default FloatingButton;
