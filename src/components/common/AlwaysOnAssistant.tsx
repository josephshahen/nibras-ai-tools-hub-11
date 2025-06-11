
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bot, Clock, Gift, X, Check, Search, Eye, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AssistantActivity {
  id: string;
  type: 'search' | 'analysis' | 'suggestion';
  title: string;
  description: string;
  timestamp: string;
  isNew: boolean;
}

const AlwaysOnAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activities, setActivities] = useState<AssistantActivity[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newActivitiesCount, setNewActivitiesCount] = useState(0);
  const [searchCategory, setSearchCategory] = useState<string>('general');
  const [lastActiveTime, setLastActiveTime] = useState<string>('');
  const { toast } = useToast();

  const searchCategories = [
    { value: 'technology', label: 'التكنولوجيا والبرمجة' },
    { value: 'design', label: 'التصميم والفنون' },
    { value: 'business', label: 'الأعمال والتجارة' },
    { value: 'education', label: 'التعليم والكورسات' },
    { value: 'news', label: 'الأخبار والأحداث' },
    { value: 'entertainment', label: 'الترفيه والألعاب' },
    { value: 'health', label: 'الصحة واللياقة' },
    { value: 'general', label: 'عام - كل المجالات' }
  ];

  useEffect(() => {
    checkExistingAccount();
    // Check activity every 30 seconds to show real-time updates
    const interval = setInterval(checkAssistantActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkExistingAccount = () => {
    const storedUserId = localStorage.getItem('lovableAI_userId');
    const assistantActive = localStorage.getItem('lovableAI_active') === 'true';
    const storedCategory = localStorage.getItem('lovableAI_searchCategory') || 'general';
    
    if (storedUserId && assistantActive) {
      setUserId(storedUserId);
      setIsActive(true);
      setSearchCategory(storedCategory);
      loadActivities(storedUserId);
      setLastActiveTime(new Date().toISOString());
    }
  };

  const checkAssistantActivity = () => {
    if (isActive && userId) {
      setLastActiveTime(new Date().toISOString());
      // Simulate checking for new activities
      loadActivities(userId);
    }
  };

  const generateUserId = () => {
    return 'user-' + crypto.randomUUID().substring(0, 8);
  };

  const createPersistentAccount = async () => {
    try {
      const newUserId = generateUserId();
      
      // Store in Supabase
      const { error } = await supabase
        .from('persistent_users')
        .insert({
          user_id: newUserId,
          status: 'active',
          preferences: { searchCategory },
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        });

      if (error) throw error;

      // Store locally
      localStorage.setItem('lovableAI_userId', newUserId);
      localStorage.setItem('lovableAI_active', 'true');
      localStorage.setItem('lovableAI_searchCategory', searchCategory);
      
      setUserId(newUserId);
      setIsActive(true);
      setShowDialog(false);
      setLastActiveTime(new Date().toISOString());

      // Create welcome activity
      const selectedCategory = searchCategories.find(cat => cat.value === searchCategory);
      const welcomeActivity: AssistantActivity = {
        id: '1',
        type: 'suggestion',
        title: '🎉 مرحباً! مساعدك الذكي جاهز للعمل',
        description: `بدأت في تتبع المحتوى الجديد في مجال "${selectedCategory?.label}" - سأقوم بالبحث لك كل 6 ساعات حتى عند مغادرة الموقع`,
        timestamp: new Date().toISOString(),
        isNew: true
      };

      setActivities([welcomeActivity]);

      toast({
        title: "🚀 تم تفعيل المساعد الدائم!",
        description: `سيبحث لك في "${selectedCategory?.label}" حتى عند الخروج من الموقع`,
      });

    } catch (error) {
      console.error('Error creating persistent account:', error);
      toast({
        title: "❌ خطأ",
        description: "حدث خطأ في تفعيل المساعد. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const loadActivities = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('assistant_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const mappedActivities: AssistantActivity[] = (data || []).map((item: any) => ({
        id: item.id,
        type: item.activity_type,
        title: item.title,
        description: item.description,
        timestamp: item.created_at,
        isNew: !item.is_read
      }));

      setActivities(mappedActivities);
      setNewActivitiesCount(mappedActivities.filter(a => a.isNew).length);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const markActivitiesAsRead = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('assistant_activities')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      setActivities(prev => prev.map(a => ({ ...a, isNew: false })));
      setNewActivitiesCount(0);
    } catch (error) {
      console.error('Error marking activities as read:', error);
    }
  };

  const updateSearchCategory = async (newCategory: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('persistent_users')
        .update({ 
          preferences: { searchCategory: newCategory },
          last_active: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      setSearchCategory(newCategory);
      localStorage.setItem('lovableAI_searchCategory', newCategory);

      const selectedCategory = searchCategories.find(cat => cat.value === newCategory);
      toast({
        title: "✅ تم تحديث التفضيلات",
        description: `سأبحث لك الآن في "${selectedCategory?.label}"`,
      });
    } catch (error) {
      console.error('Error updating search category:', error);
    }
  };

  const deactivateAssistant = async () => {
    try {
      if (userId) {
        const { error } = await supabase
          .from('persistent_users')
          .update({ status: 'inactive' })
          .eq('user_id', userId);

        if (error) throw error;
      }

      localStorage.removeItem('lovableAI_userId');
      localStorage.removeItem('lovableAI_active');
      localStorage.removeItem('lovableAI_searchCategory');
      
      setIsActive(false);
      setUserId(null);
      setActivities([]);
      setNewActivitiesCount(0);

      toast({
        title: "⏹️ تم إيقاف المساعد",
        description: "يمكنك إعادة تفعيله في أي وقت",
      });
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: "حدث خطأ في إيقاف المساعد",
        variant: "destructive"
      });
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'منذ دقائق';
    if (hours === 1) return 'منذ ساعة';
    if (hours < 24) return `منذ ${hours} ساعات`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return 'منذ يوم';
    return `منذ ${days} أيام`;
  };

  const getActivityStatusText = () => {
    if (!isActive) return '';
    const lastActive = new Date(lastActiveTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
    
    if (diffMinutes < 2) return '🟢 يعمل الآن';
    if (diffMinutes < 60) return `🟡 آخر نشاط منذ ${diffMinutes} دقيقة`;
    return '🔴 غير نشط حالياً';
  };

  return (
    <>
      {/* Enhanced Floating Status Icon */}
      <div className="fixed bottom-6 left-6 z-50">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <div className="relative">
              <Button
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
                  {getActivityStatusText()}
                </div>
              )}
            </div>
          </DialogTrigger>

          <DialogContent className="max-w-2xl bg-gradient-to-br from-black/95 to-gray-900/95 border-2 border-blue-400/30 backdrop-blur-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right font-cairo text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                <Bot className="text-blue-400" size={28} />
                🤖 المساعد الذكي الدائم
              </DialogTitle>
              {!isActive && (
                <DialogDescription className="text-right font-cairo text-gray-300 text-lg">
                  مساعد ذكي يعمل لك حتى عند مغادرة الموقع ويبحث عن كل جديد في المجال الذي تختاره
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
                      ماذا نبحث لك أثناء غيابك؟
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300 font-cairo text-right">
                      اختر المجال الذي تريد أن يبحث لك فيه المساعد الذكي كل 6 ساعات:
                    </p>
                    <Select value={searchCategory} onValueChange={setSearchCategory}>
                      <SelectTrigger className="w-full bg-black/40 border-white/20 text-right font-cairo">
                        <SelectValue placeholder="اختر مجال البحث" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        {searchCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="text-right font-cairo">
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-600/20 to-green-600/20 border-blue-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-cairo text-right flex items-center gap-2">
                      <Gift className="text-yellow-400" size={20} />
                      ✨ مزايا التفعيل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-300 space-y-3">
                    <div className="flex items-center gap-3">
                      <Check size={16} className="text-green-400 flex-shrink-0" />
                      <span className="font-cairo">يحفظ تفضيلاتك ويبقى نشطاً حتى عند إغلاق المتصفح</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check size={16} className="text-green-400 flex-shrink-0" />
                      <span className="font-cairo">يبحث تلقائياً كل 6 ساعات عن المحتوى الجديد في مجالك</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check size={16} className="text-green-400 flex-shrink-0" />
                      <span className="font-cairo">يعمل كحساب مؤقت آمن بدون تسجيل</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check size={16} className="text-green-400 flex-shrink-0" />
                      <span className="font-cairo">إشعارات فورية عند العثور على محتوى مهم</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button onClick={createPersistentAccount} className="btn-gradient flex-1 font-cairo text-lg py-3">
                    🚀 نعم، أريد المساعد الدائم
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
                      {getActivityStatusText()}
                    </Badge>
                    <div className="text-sm text-gray-300 font-cairo">
                      البحث في: {searchCategories.find(cat => cat.value === searchCategory)?.label}
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
                    <Select value={searchCategory} onValueChange={updateSearchCategory}>
                      <SelectTrigger className="w-full bg-black/40 border-white/20 text-right font-cairo">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/20">
                        {searchCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="text-right font-cairo">
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Activities List */}
                <div className="max-h-80 overflow-y-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400 font-cairo">
                      <Eye size={14} className="inline mr-1" />
                      النشاطات الأخيرة
                    </div>
                    {newActivitiesCount > 0 && (
                      <Button 
                        onClick={markActivitiesAsRead} 
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
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AlwaysOnAssistant;
