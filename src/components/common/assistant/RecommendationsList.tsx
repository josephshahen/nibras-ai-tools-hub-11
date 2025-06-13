
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, Star } from 'lucide-react';
import { formatRelativeTime } from './utils';

interface RecommendationsListProps {
  recommendations: any[];
  onMarkAsRead: () => void;
}

const RecommendationsList = ({ recommendations, onMarkAsRead }: RecommendationsListProps) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-blue-400 font-cairo flex items-center gap-2">
          <Star size={14} />
          توصيات جديدة وجدها المساعد ({recommendations.length})
        </div>
        <Button 
          onClick={onMarkAsRead} 
          variant="outline" 
          size="sm"
          className="text-xs font-cairo border-blue-400/40 hover:bg-blue-400/10"
        >
          <Eye size={12} className="mr-1" />
          تم مراجعة الكل
        </Button>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg shadow-blue-400/20">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-cairo text-white mb-1 font-semibold">{rec.title}</h4>
                  <p className="text-xs text-blue-200 font-cairo mb-2 leading-relaxed">{rec.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-300 font-cairo">
                      {formatRelativeTime(rec.created_at)}
                    </span>
                    {rec.url && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-300 hover:text-blue-200 hover:bg-blue-400/10 text-xs"
                        onClick={() => window.open(rec.url, '_blank')}
                      >
                        <ExternalLink size={12} className="mr-1" />
                        زيارة
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsList;
