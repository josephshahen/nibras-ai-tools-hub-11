
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, X, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ResultsViewer from './assistant/ResultsViewer';

const SearchResultsWelcome = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasCheckedResults, setHasCheckedResults] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    checkForNewResults();
  }, []);

  const checkForNewResults = async () => {
    try {
      const storedUserId = localStorage.getItem('lovableAI_userId');
      const hasShownWelcome = localStorage.getItem('lovableAI_welcomeShown');
      const assistantActive = localStorage.getItem('lovableAI_active') === 'true';
      
      console.log('🔍 فحص النتائج الجديدة...', { storedUserId, assistantActive, hasShownWelcome });
      
      if (!storedUserId || hasShownWelcome || !assistantActive) {
        setHasCheckedResults(true);
        return;
      }

      setUserId(storedUserId);

      // البحث عن نتائج جديدة غير مقروءة
      const { data: results, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', storedUserId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('خطأ في تحميل النتائج:', error);
        setHasCheckedResults(true);
        return;
      }

      console.log('📊 النتائج الموجودة:', results?.length || 0);

      if (results && results.length > 0) {
        setSearchResults(results);
        setShowDialog(true);
      } else {
        // إذا لم توجد نتائج، تحقق من وقت آخر نشاط
        const { data: userData } = await supabase
          .from('persistent_users')
          .select('last_active, preferences')
          .eq('user_id', storedUserId)
          .single();

        if (userData) {
          const lastActive = new Date(userData.last_active);
          const now = new Date();
          const minutesSinceLastActive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
          
          console.log('⏰ الوقت منذ آخر نشاط:', minutesSinceLastActive, 'دقيقة');
          
          // إذا مر أكثر من 3 دقائق، اعرض رسالة البحث
          if (minutesSinceLastActive >= 3) {
            setIsSearching(true);
            setShowDialog(true);
            
            // تشغيل البحث الفوري
            await triggerSearch(storedUserId, userData.preferences);
          }
        }
      }
      
      setHasCheckedResults(true);
    } catch (error) {
      console.error('خطأ في فحص النتائج:', error);
      setHasCheckedResults(true);
    }
  };

  const triggerSearch = async (userId: string, preferences: any) => {
    try {
      console.log('🚀 تشغيل البحث الفوري...');
      
      // استدعاء دالة البحث
      const { data, error } = await supabase.functions.invoke('always-on-assistant', {
        body: { user_id: userId }
      });

      if (error) {
        console.error('خطأ في تشغيل البحث:', error);
        return;
      }

      console.log('✅ تم تشغيل البحث بنجاح');
      
      // انتظار قليل ثم إعادة تحميل النتائج
      setTimeout(async () => {
        const { data: newResults } = await supabase
          .from('recommendations')
          .select('*')
          .eq('user_id', userId)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(5);

        if (newResults && newResults.length > 0) {
          setSearchResults(newResults);
          setIsSearching(false);
        }
      }, 5000); // انتظار 5 ثوان

    } catch (error) {
      console.error('خطأ في تشغيل البحث:', error);
      setIsSearching(false);
    }
  };

  const handleViewResults = () => {
    // لا نغلق الحوار هنا، المستخدم يمكنه مراجعة النتائج
  };

  const handleDismiss = () => {
    localStorage.setItem('lovableAI_welcomeShown', 'true');
    setShowDialog(false);
  };

  const markResultsAsRead = async () => {
    if (!userId) return;

    try {
      await supabase
        .from('recommendations')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      setSearchResults([]);
      handleDismiss();
    } catch (error) {
      console.error('خطأ في وضع علامة مقروء:', error);
    }
  };

  if (!showDialog) {
    return null;
  }

  return (
    <Dialog open={showDialog} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-black/95 to-gray-900/95 border-2 border-blue-400/30 backdrop-blur-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right font-cairo text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <Search className="text-blue-400" size={24} />
            {isSearching ? '🔍 جاري البحث عن نتائج جديدة...' : '🎯 نتائج بحثك جاهزة!'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isSearching ? (
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30">
              <CardContent className="pt-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Clock className="text-blue-400 animate-spin" size={24} />
                  <p className="text-blue-200 font-cairo text-lg">
                    المساعد الذكي يبحث لك الآن...
                  </p>
                </div>
                <p className="text-gray-300 font-cairo text-sm mb-4">
                  سيتم عرض النتائج خلال دقائق قليلة
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={handleDismiss}
                    className="border-white/20 hover:bg-white/10 font-cairo"
                  >
                    سأرجع لاحقاً
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-400/30">
                <CardContent className="pt-4 text-center">
                  <p className="text-green-200 font-cairo mb-4">
                    المساعد الذكي وجد {searchResults.length} نتيجة جديدة لك
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={handleViewResults}
                      className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 font-cairo"
                    >
                      <Eye size={16} className="ml-2" />
                      مراجعة نتائج البحث
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleDismiss}
                      className="border-white/20 hover:bg-white/10 font-cairo"
                    >
                      ليس الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* عرض النتائج */}
              <ResultsViewer
                results={searchResults}
                onMarkAsRead={markResultsAsRead}
              />
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="absolute top-4 left-4 text-gray-400 hover:text-white"
        >
          <X size={16} />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SearchResultsWelcome;
