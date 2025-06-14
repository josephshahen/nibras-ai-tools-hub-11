
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, Search, Star } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  created_at: string;
  is_read: boolean;
}

interface ResultsViewerProps {
  results: SearchResult[];
  onMarkAsRead: () => void;
}

const ResultsViewer = ({ results, onMarkAsRead }: ResultsViewerProps) => {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedResults(newExpanded);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  const getQualityBadge = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 5) return { label: 'سريع', color: 'bg-blue-500/20 text-blue-400' };
    if (diffInMinutes <= 60) return { label: 'دقيق', color: 'bg-green-500/20 text-green-400' };
    if (diffInMinutes <= 1440) return { label: 'شامل', color: 'bg-purple-500/20 text-purple-400' };
    return { label: 'متخصص', color: 'bg-yellow-500/20 text-yellow-400' };
  };

  if (results.length === 0) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardContent className="pt-6 text-center">
          <Search className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-cairo text-white mb-2">جاري البحث...</h3>
          <p className="text-gray-400 font-cairo">
            المساعد يبحث لك الآن. ستظهر النتائج خلال دقائق قليلة.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-cairo text-white flex items-center gap-2">
          <Star className="text-yellow-400" size={20} />
          نتائج البحث الذكي ({results.length})
        </h3>
        {results.some(r => !r.is_read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAsRead}
            className="border-white/20 hover:bg-white/10 font-cairo"
          >
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {results.map((result) => {
          const isExpanded = expandedResults.has(result.id);
          const qualityBadge = getQualityBadge(result.created_at);
          
          return (
            <Card 
              key={result.id} 
              className={`bg-black/40 border-white/10 transition-all hover:border-white/20 ${
                !result.is_read ? 'border-blue-400/30 bg-blue-500/5' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-right font-cairo text-white text-base leading-relaxed">
                      {result.title}
                      {!result.is_read && (
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      )}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge className={qualityBadge.color}>
                        {qualityBadge.label}
                      </Badge>
                      <Badge variant="outline" className="text-gray-400 border-gray-600">
                        {result.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={12} />
                    {formatTimeAgo(result.created_at)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-300 font-cairo text-sm leading-relaxed mb-3">
                  {isExpanded 
                    ? result.description 
                    : `${result.description.substring(0, 120)}${result.description.length > 120 ? '...' : ''}`
                  }
                </p>
                
                <div className="flex gap-2">
                  {result.description.length > 120 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(result.id)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 font-cairo"
                    >
                      {isExpanded ? 'أقل' : 'المزيد'}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(result.url, '_blank')}
                    className="border-white/20 hover:bg-white/10 flex items-center gap-2 font-cairo"
                  >
                    <ExternalLink size={14} />
                    فتح الرابط
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center text-xs text-gray-400 font-cairo bg-black/20 p-3 rounded-lg">
        💡 جودة النتائج تتحسن كلما زاد الوقت بين عمليات البحث
      </div>
    </div>
  );
};

export default ResultsViewer;
