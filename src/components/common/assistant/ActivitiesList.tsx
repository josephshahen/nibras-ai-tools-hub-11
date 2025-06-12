
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Eye } from 'lucide-react';
import { AssistantActivity } from './types';
import { formatRelativeTime } from './utils';

interface ActivitiesListProps {
  activities: AssistantActivity[];
  newActivitiesCount: number;
  onMarkAsRead: () => void;
}

const ActivitiesList = ({ activities, newActivitiesCount, onMarkAsRead }: ActivitiesListProps) => {
  return (
    <div className="max-h-80 overflow-y-auto space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400 font-cairo">
          <Eye size={14} className="inline mr-1" />
          النشاطات الأخيرة
        </div>
        {newActivitiesCount > 0 && (
          <Button 
            onClick={onMarkAsRead} 
            variant="outline" 
            size="sm"
            className="text-xs font-cairo border-blue-400/40 hover:bg-blue-400/10"
          >
            تم قراءة الكل ({newActivitiesCount})
          </Button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center text-gray-400 py-8 font-cairo">
          <Clock className="mx-auto mb-3" size={32} />
          <div className="text-lg mb-2">مساعدك يعمل في الخلفية...</div>
          <div className="text-sm">سيظهر هنا كل ما يجده من محتوى جديد</div>
        </div>
      ) : (
        activities.map((activity) => (
          <Card key={activity.id} className={`bg-black/40 border-white/10 transition-all duration-300 ${activity.isNew ? 'border-blue-400/50 shadow-lg shadow-blue-400/20' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${activity.isNew ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`} />
                <div className="flex-1">
                  <h4 className="text-sm font-cairo text-white mb-1">{activity.title}</h4>
                  <p className="text-xs text-gray-400 font-cairo mb-2 leading-relaxed">{activity.description}</p>
                  <span className="text-xs text-gray-500 font-cairo flex items-center gap-1">
                    <Clock size={10} />
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ActivitiesList;
