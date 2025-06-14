
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Settings, Bot, Search, X, Activity, ExternalLink, Infinity, Timer } from 'lucide-react';
import { useAssistantLogic } from './assistant/useAssistantLogic';
import { searchCategories } from './assistant/constants';
import { getCurrentSearchText, getActivityStatusText } from './assistant/utils';
import { toast } from '@/hooks/use-toast';
import FloatingButton from './assistant/FloatingButton';
import SearchCategorySelector from './assistant/SearchCategorySelector';
import FeatureCards from './assistant/FeatureCards';
import ActivitiesList from './assistant/ActivitiesList';
import ResultsViewer from './assistant/ResultsViewer';

const AlwaysOnAssistant = () => {
  const [showDialog, setShowDialog] = useState(false);
  const {
    isActive,
    activities,
    newActivitiesCount,
    searchCategory,
    customSearch,
    lastActiveTime,
    recommendations,
    setSearchCategory,
    setCustomSearch,
    createPersistentAccount,
    markActivitiesAsRead,
    markRecommendationsAsRead,
    updateSearchCategory,
    deactivateAssistant
  } = useAssistantLogic();

  const handleActivate = async () => {
    await createPersistentAccount();
    
    toast({
      title: "تم تفعيل المساعد الدائم! ♾️",
      description: "سيبدأ البحث خلال دقائق قليلة ويعطيك النتائج بناءً على اهتماماتك",
      duration: 5000,
    });
    
    setShowDialog(false);
  };

  const getSearchTimeInfo = () => {
    if (!lastActiveTime) return 'سيبدأ البحث قريباً';
    
    const now = new Date();
    const lastActive = new Date(lastActiveTime);
    const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
    
    if (diffInMinutes <= 5) return 'بحث سريع (5 دقائق)';
    if (diffInMinutes <= 60) return 'بحث دقيق (ساعة)';
    if (diffInMinutes <= 1440) return 'بحث شامل (يوم)';
    return 'بحث متخصص (أسبوع)';
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <FloatingButton
            isActive={isActive}
            newActivitiesCount={newActivitiesCount + recommendations.length}
            lastActiveTime={lastActiveTime}
            onClick={() => setShowDialog(true)}
          />
        </DialogTrigger>

        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-black/95 to-gray-900/95 border-2 border-blue-400/30 backdrop-blur-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-cairo text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <Bot className="text-blue-400" size={28} />
              🤖 المساعد الذكي الدائم
              <Infinity className="text-green-400" size={20} />
            </DialogTitle>
            {!isActive && (
              <DialogDescription className="text-right font-cairo text-gray-300 text-lg">
                سيبحث لك تلقائياً عن:
                <ul className="mt-3 space-y-2 text-blue-200">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">🔍</span>
                    نتائج فورية خلال 5 دقائق - بحث سريع
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">🎯</span>
                    نتائج دقيقة خلال ساعة - بحث متقدم
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">📚</span>
                    نتائج شاملة خلال يوم - بحث عميق
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">⭐</span>
                    نتائج متخصصة خلال أسبوع - بحث خبير
                  </li>
                </ul>
              </DialogDescription>
            )}
          </DialogHeader>

          {!isActive ? (
            <div className="space-y-6">
              {/* Search Category Selection */}
              <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-400/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-cairo text-right flex items-center gap-2">
                    <Search className="text-purple-400" size={20} />
                    🔍 اختر مجال اهتمامك للبحث الذكي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SearchCategorySelector
                    searchCategory={searchCategory}
                    customSearch={customSearch}
                    searchCategories={searchCategories}
                    onCategoryChange={setSearchCategory}
                    onCustomSearchChange={setCustomSearch}
                  />
                </CardContent>
              </Card>

              <FeatureCards />

              {/* Search Timing Info */}
              <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-400/30">
                <CardContent className="pt-4">
                  <div className="text-center text-sm text-green-200 space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Timer className="text-green-400" size={16} />
                      <span className="font-cairo font-semibold">توقيتات البحث الذكي</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-blue-500/20 p-2 rounded border border-blue-400/30">
                        <div className="font-semibold">5 دقائق</div>
                        <div>بحث سريع</div>
                      </div>
                      <div className="bg-green-500/20 p-2 rounded border border-green-400/30">
                        <div className="font-semibold">60 دقيقة</div>
                        <div>بحث دقيق</div>
                      </div>
                      <div className="bg-purple-500/20 p-2 rounded border border-purple-400/30">
                        <div className="font-semibold">24 ساعة</div>
                        <div>بحث شامل</div>
                      </div>
                      <div className="bg-yellow-500/20 p-2 rounded border border-yellow-400/30">
                        <div className="font-semibold">أسبوع</div>
                        <div>بحث متخصص</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy and Terms */}
              <Card className="bg-black/40 border-white/10">
                <CardContent className="pt-4">
                  <div className="text-center text-sm text-gray-400 space-y-2">
                    <p>♾️ بياناتك ونتائج البحث محفوظة للأبد</p>
                    <p>🔒 نحترم خصوصيتك - البيانات مجهولة ومشفرة</p>
                    <div className="flex justify-center gap-4">
                      <a 
                        href="/privacy" 
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-cairo"
                      >
                        <ExternalLink size={14} />
                        سياسة الخصوصية
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleActivate} 
                  className="btn-gradient flex-1 font-cairo text-lg py-3"
                  disabled={searchCategory === 'custom' && !customSearch.trim()}
                >
                  ♾️ تفعيل البحث الذكي الدائم
                </Button>
                <Button variant="outline" onClick={() => setShowDialog(false)} className="font-cairo border-white/20 hover:bg-white/10">
                  لاحقاً
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Status Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-400/30">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      deactivateAssistant();
                    }}
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                  >
                    <X size={16} />
                  </Button>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30 mb-2">
                    <Infinity size={14} className="mr-1" />
                    {getActivityStatusText(isActive, lastActiveTime)} - نشط
                  </Badge>
                  <div className="text-sm text-gray-300 font-cairo">
                    البحث في: {getCurrentSearchText(searchCategory, customSearch, searchCategories)}
                  </div>
                  <div className="text-xs text-blue-400 font-cairo">
                    {getSearchTimeInfo()}
                  </div>
                </div>
              </div>

              {/* Search Results Section */}
              {recommendations.length > 0 && (
                <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-cairo text-right flex items-center gap-2">
                      <Search className="text-yellow-400" size={20} />
                      🎯 نتائج البحث الذكي
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResultsViewer
                      results={recommendations}
                      onMarkAsRead={() => {
                        markRecommendationsAsRead();
                        toast({
                          title: "تم مراجعة النتائج",
                          description: "تم وضع علامة 'مراجع' على كل النتائج",
                          duration: 2000,
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Search Category Change */}
              <Card className="bg-black/40 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-cairo text-right flex items-center gap-2">
                    <Settings className="text-blue-400" size={16} />
                    تغيير مجال البحث الدائم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SearchCategorySelector
                    searchCategory={searchCategory}
                    customSearch={customSearch}
                    searchCategories={searchCategories}
                    onCategoryChange={updateSearchCategory}
                    onCustomSearchChange={setCustomSearch}
                  />
                </CardContent>
              </Card>

              {/* Activities List */}
              <ActivitiesList
                activities={activities}
                newActivitiesCount={newActivitiesCount}
                onMarkAsRead={() => {
                  markActivitiesAsRead();
                  toast({
                    title: "تم وضع علامة 'مقروء'",
                    description: "تم تحديث حالة النشاطات",
                    duration: 2000,
                  });
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlwaysOnAssistant;
