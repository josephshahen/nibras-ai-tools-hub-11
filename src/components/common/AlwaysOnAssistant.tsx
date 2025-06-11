
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Settings, Bot, Clock, Gift, X, Check } from 'lucide-react';
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
  const { toast } = useToast();

  useEffect(() => {
    checkExistingAccount();
  }, []);

  const checkExistingAccount = () => {
    const storedUserId = localStorage.getItem('lovableAI_userId');
    const assistantActive = localStorage.getItem('lovableAI_active') === 'true';
    
    if (storedUserId && assistantActive) {
      setUserId(storedUserId);
      setIsActive(true);
      loadActivities(storedUserId);
    }
  };

  const generateUserId = () => {
    return 'user-' + crypto.randomUUID().substring(0, 8);
  };

  const createPersistentAccount = async () => {
    try {
      const newUserId = generateUserId();
      
      // Store in Supabase using raw query to avoid type issues
      const { error } = await supabase.rpc('exec', {
        sql: `
          INSERT INTO persistent_users (user_id, status, preferences, created_at, last_active)
          VALUES ('${newUserId}', 'active', '{}', NOW(), NOW())
        `
      }).catch(async () => {
        // Fallback to direct table insert
        const { error: insertError } = await supabase
          .from('persistent_users' as any)
          .insert({
            user_id: newUserId,
            status: 'active',
            preferences: {},
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString()
          });
        return { error: insertError };
      });

      if (error) throw error;

      // Store locally
      localStorage.setItem('lovableAI_userId', newUserId);
      localStorage.setItem('lovableAI_active', 'true');
      
      setUserId(newUserId);
      setIsActive(true);
      setShowDialog(false);

      // Create welcome activity
      const welcomeActivity: AssistantActivity = {
        id: '1',
        type: 'suggestion',
        title: 'مرحباً! مساعدك الذكي جاهز',
        description: 'بدأت في تتبع اهتماماتك وسأقوم بالبحث عن محتوى جديد كل 6 ساعات',
        timestamp: new Date().toISOString(),
        isNew: true
      };

      setActivities([welcomeActivity]);

      toast({
        title: "تم تفعيل المساعد الدائم!",
        description: "سيعمل مساعدك الذكي الآن في الخلفية ويجد لك كل جديد",
      });

    } catch (error) {
      console.error('Error creating persistent account:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تفعيل المساعد. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const loadActivities = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('assistant_activities' as any)
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
      await supabase
        .from('assistant_activities' as any)
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      setActivities(prev => prev.map(a => ({ ...a, isNew: false })));
      setNewActivitiesCount(0);
    } catch (error) {
      console.error('Error marking activities as read:', error);
    }
  };

  const deactivateAssistant = async () => {
    try {
      if (userId) {
        await supabase
          .from('persistent_users' as any)
          .update({ status: 'inactive' })
          .eq('user_id', userId);
      }

      localStorage.removeItem('lovableAI_userId');
      localStorage.removeItem('lovableAI_active');
      
      setIsActive(false);
      setUserId(null);
      setActivities([]);
      setNewActivitiesCount(0);

      toast({
        title: "تم إيقاف المساعد",
        description: "يمكنك إعادة تفعيله في أي وقت",
      });
    } catch (error) {
      toast({
        title: "خطأ",
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

  return (
    <>
      {/* Floating Status Icon */}
      <div className="fixed bottom-6 left-6 z-50">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-green-500 hover:bg-green-600 animate-pulse' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              <div className="flex flex-col items-center">
                <Bot size={20} />
                {isActive && newActivitiesCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white min-w-[20px] h-5 rounded-full text-xs">
                    {newActivitiesCount}
                  </Badge>
                )}
              </div>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md bg-black/95 border-white/20" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right font-cairo text-gradient flex items-center gap-2">
                <Bot className="text-blue-400" />
                المساعد الذكي الدائم
              </DialogTitle>
              {!isActive && (
                <DialogDescription className="text-right font-cairo text-gray-300">
                  مساعد ذكي يعمل لك حتى عند مغادرة الموقع
                </DialogDescription>
              )}
            </DialogHeader>

            {!isActive ? (
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-cairo text-right flex items-center gap-2">
                      <Gift className="text-yellow-400" size={16} />
                      مكافأة التفعيل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-green-400" />
                      <span>يحفظ تفضيلاتك - حتى عند الخروج</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-green-400" />
                      <span>يبحث لك تلقائياً عن كل جديد</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-green-400" />
                      <span>يعمل كـ "حساب خفي" آمن</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button onClick={createPersistentAccount} className="btn-gradient flex-1 font-cairo">
                    🚀 نعم، أريد المساعد الدائم
                  </Button>
                  <Button variant="outline" onClick={() => setShowDialog(false)} className="font-cairo">
                    لاحقاً
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                    نشط ويعمل
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={deactivateAssistant}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {activities.length === 0 ? (
                    <div className="text-center text-gray-400 py-4 font-cairo text-sm">
                      <Clock className="mx-auto mb-2" size={24} />
                      مساعدك يعمل في الخلفية...
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <Card key={activity.id} className={`bg-black/40 border-white/10 ${activity.isNew ? 'border-blue-400/30' : ''}`}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full mt-2 ${activity.isNew ? 'bg-blue-400' : 'bg-gray-600'}`} />
                            <div className="flex-1">
                              <h4 className="text-sm font-cairo text-white">{activity.title}</h4>
                              <p className="text-xs text-gray-400 font-cairo mt-1">{activity.description}</p>
                              <span className="text-xs text-gray-500 font-cairo">{formatRelativeTime(activity.timestamp)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {newActivitiesCount > 0 && (
                  <Button 
                    onClick={markActivitiesAsRead} 
                    variant="outline" 
                    className="w-full text-sm font-cairo"
                  >
                    تم قراءة جميع التحديثات
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AlwaysOnAssistant;
