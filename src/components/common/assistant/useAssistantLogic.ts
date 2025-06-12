
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AssistantActivity } from './types';
import { generateUserId, getCurrentSearchText } from './utils';
import { searchCategories } from './constants';

export const useAssistantLogic = () => {
  const [isActive, setIsActive] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activities, setActivities] = useState<AssistantActivity[]>([]);
  const [newActivitiesCount, setNewActivitiesCount] = useState(0);
  const [searchCategory, setSearchCategory] = useState<string>('general');
  const [customSearch, setCustomSearch] = useState<string>('');
  const [lastActiveTime, setLastActiveTime] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    checkExistingAccount();
    const interval = setInterval(checkAssistantActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkExistingAccount = () => {
    const storedUserId = localStorage.getItem('lovableAI_userId');
    const assistantActive = localStorage.getItem('lovableAI_active') === 'true';
    const storedCategory = localStorage.getItem('lovableAI_searchCategory') || 'general';
    const storedCustomSearch = localStorage.getItem('lovableAI_customSearch') || '';
    
    if (storedUserId && assistantActive) {
      setUserId(storedUserId);
      setIsActive(true);
      setSearchCategory(storedCategory);
      setCustomSearch(storedCustomSearch);
      loadActivities(storedUserId);
      setLastActiveTime(new Date().toISOString());
    }
  };

  const checkAssistantActivity = async () => {
    if (isActive && userId) {
      setLastActiveTime(new Date().toISOString());
      await loadActivities(userId);
      
      try {
        await supabase
          .from('persistent_users')
          .update({ last_active: new Date().toISOString() })
          .eq('user_id', userId);
      } catch (error) {
        console.error('Error updating last_active:', error);
      }
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

  const createPersistentAccount = async () => {
    try {
      const newUserId = generateUserId();
      
      const preferences = { 
        searchCategory,
        ...(searchCategory === 'custom' && { customSearch })
      };
      
      const { error } = await supabase
        .from('persistent_users')
        .insert({
          user_id: newUserId,
          status: 'active',
          preferences,
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        });

      if (error) throw error;

      localStorage.setItem('lovableAI_userId', newUserId);
      localStorage.setItem('lovableAI_active', 'true');
      localStorage.setItem('lovableAI_searchCategory', searchCategory);
      if (searchCategory === 'custom') {
        localStorage.setItem('lovableAI_customSearch', customSearch);
      }
      
      setUserId(newUserId);
      setIsActive(true);
      setLastActiveTime(new Date().toISOString());

      const selectedCategory = searchCategories.find(cat => cat.value === searchCategory);
      const searchText = searchCategory === 'custom' ? customSearch : selectedCategory?.label;
      
      const welcomeActivity: AssistantActivity = {
        id: '1',
        type: 'suggestion',
        title: '🎉 تم تفعيل المساعد الذكي الدائم بنجاح!',
        description: `سيبحث لك المساعد عن كل جديد في "${searchText}" كل 6 ساعات، حتى عند مغادرة الموقع. ستجد النتائج هنا عند عودتك.`,
        timestamp: new Date().toISOString(),
        isNew: true
      };

      setActivities([welcomeActivity]);

      toast({
        title: "🚀 تم تفعيل المساعد الذكي الدائم!",
        description: `سيبحث لك في "${searchText}" حتى عند مغادرة الموقع`,
      });

    } catch (error) {
      console.error('Error creating persistent account:', error);
      toast({
        title: "❌ خطأ في التفعيل",
        description: "حدث خطأ في تفعيل المساعد. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
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
      const preferences = { 
        searchCategory: newCategory,
        ...(newCategory === 'custom' && { customSearch })
      };

      const { error } = await supabase
        .from('persistent_users')
        .update({ 
          preferences,
          last_active: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      setSearchCategory(newCategory);
      localStorage.setItem('lovableAI_searchCategory', newCategory);
      if (newCategory === 'custom') {
        localStorage.setItem('lovableAI_customSearch', customSearch);
      }

      const searchText = getCurrentSearchText(newCategory, customSearch, searchCategories);
      
      toast({
        title: "✅ تم تحديث التفضيلات",
        description: `سأبحث لك الآن في "${searchText}"`,
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
      localStorage.removeItem('lovableAI_customSearch');
      
      setIsActive(false);
      setUserId(null);
      setActivities([]);
      setNewActivitiesCount(0);
      setCustomSearch('');

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

  return {
    isActive,
    userId,
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
  };
};
