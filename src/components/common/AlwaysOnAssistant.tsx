
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Settings, Bot, Search, X, Activity } from 'lucide-react';
import { useAssistantLogic } from './assistant/useAssistantLogic';
import { searchCategories } from './assistant/constants';
import { getCurrentSearchText, getActivityStatusText } from './assistant/utils';
import FloatingButton from './assistant/FloatingButton';
import SearchCategorySelector from './assistant/SearchCategorySelector';
import FeatureCards from './assistant/FeatureCards';
import ActivitiesList from './assistant/ActivitiesList';

const AlwaysOnAssistant = () => {
  const [showDialog, setShowDialog] = useState(false);
  const {
    isActive,
    activities,
    newActivitiesCount,
    searchCategory,
    customSearch,
    lastActiveTime,
    setSearchCategory,
    setCustomSearch,
    createPersistentAccount,
    markActivitiesAsRead,
    updateSearchCategory,
    deactivateAssistant
  } = useAssistantLogic();

  const handleActivate = async () => {
    await createPersistentAccount();
    setShowDialog(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <FloatingButton
            isActive={isActive}
            newActivitiesCount={newActivitiesCount}
            lastActiveTime={lastActiveTime}
            onClick={() => setShowDialog(true)}
          />
        </DialogTrigger>

        <DialogContent className="max-w-2xl bg-gradient-to-br from-black/95 to-gray-900/95 border-2 border-blue-400/30 backdrop-blur-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-cairo text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <Bot className="text-blue-400" size={28} />
              🤖 المساعد الذكي الدائم
            </DialogTitle>
            {!isActive && (
              <DialogDescription className="text-right font-cairo text-gray-300 text-lg">
                وفر وقتك! هذا المساعد سيبحث لك تلقائيًا عن كل ما تحتاجه حتى عند مغادرة الموقع.
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
                    🔍 ماذا نبحث لك أثناء غيابك؟
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

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleActivate} 
                  className="btn-gradient flex-1 font-cairo text-lg py-3"
                  disabled={searchCategory === 'custom' && !customSearch.trim()}
                >
                  🎯 تفعيل المساعد
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
                    onClick={deactivateAssistant}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X size={16} />
                  </Button>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30 mb-2">
                    <Activity size={14} className="mr-1" />
                    {getActivityStatusText(isActive, lastActiveTime)}
                  </Badge>
                  <div className="text-sm text-gray-300 font-cairo">
                    البحث في: {getCurrentSearchText(searchCategory, customSearch, searchCategories)}
                  </div>
                </div>
              </div>

              {/* Search Category Change */}
              <Card className="bg-black/40 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-cairo text-right flex items-center gap-2">
                    <Settings className="text-blue-400" size={16} />
                    تغيير مجال البحث
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
                onMarkAsRead={markActivitiesAsRead}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlwaysOnAssistant;
