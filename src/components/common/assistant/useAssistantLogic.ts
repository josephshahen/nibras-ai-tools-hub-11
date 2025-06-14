
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AssistantActivity, UserPreferences } from './types';
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
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkExistingAccount();
    const interval = setInterval(checkAssistantActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkExistingAccount = async () => {
    try {
      const storedUserId = localStorage.getItem('lovableAI_userId');
      const assistantActive = localStorage.getItem('lovableAI_active') === 'true';
      const storedCategory = localStorage.getItem('lovableAI_searchCategory') || 'general';
      const storedCustomSearch = localStorage.getItem('lovableAI_customSearch') || '';
      
      console.log('🔍 فحص الحساب الموجود...', { storedUserId, assistantActive });
      
      if (storedUserId && assistantActive) {
        // التحقق من وجود المستخدم في قاعدة البيانات
        const { data: userExists, error } = await supabase
          .from('persistent_users')
          .select('*')
          .eq('user_id', storedUserId)
          .single();

        console.log('👤 بيانات المستخدم من قاعدة البيانات:', userExists);

        if (error && error.code !== 'PGRST116') {
          console.error('❌ خطأ في فحص المستخدم:', error);
          return;
        }

        if (userExists) {
          // Type cast the preferences to UserPreferences
          const preferences = userExists.preferences as UserPreferences | null;
          
          setUserId(storedUserId);
          setIsActive(true);
          setSearchCategory(preferences?.searchCategory || storedCategory);
          setCustomSearch(preferences?.customSearch || storedCustomSearch);
          setLastActiveTime(userExists.last_active || new Date().toISOString());
          
          await loadActivities(storedUserId);
          await loadRecommendations(storedUserId);
          
          console.log('✅ تم تحميل حساب موجود بنجاح');
          
          // تحديث آخر نشاط
          await supabase
            .from('persistent_users')
            .update({ last_active: new Date().toISOString() })
            .eq('user_id', storedUserId);
        } else {
          console.log('⚠️ المستخدم غير موجود في قاعدة البيانات، إعادة إنشاء...');
          localStorage.removeItem('lovableAI_userId');
          localStorage.removeItem('lovableAI_active');
        }
      }
    } catch (error) {
      console.error('❌ خطأ في فحص الحساب الموجود:', error);
    }
  };

  const checkAssistantActivity = async () => {
    if (isActive && userId) {
      console.log('🔄 فحص نشاط المساعد للمستخدم:', userId);
      setLastActiveTime(new Date().toISOString());
      await loadActivities(userId);
      await loadRecommendations(userId);
      
      try {
        await supabase
          .from('persistent_users')
          .update({ last_active: new Date().toISOString() })
          .eq('user_id', userId);
      } catch (error) {
        console.error('❌ خطأ في تحديث آخر نشاط:', error);
      }
    }
  };

  const loadActivities = async (userId: string) => {
    try {
      console.log('📋 تحميل الأنشطة للمستخدم:', userId);
      
      const { data, error } = await supabase
        .from('assistant_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('❌ خطأ في تحميل الأنشطة:', error);
        throw error;
      }

      console.log('📊 تم تحميل الأنشطة:', data?.length || 0);

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
      
      console.log('✅ تم تحديث الأنشطة بنجاح، عدد الجديدة:', mappedActivities.filter(a => a.isNew).length);
    } catch (error) {
      console.error('❌ خطأ في تحميل الأنشطة:', error);
    }
  };

  const loadRecommendations = async (userId: string) => {
    try {
      console.log('🎯 تحميل التوصيات للمستخدم:', userId);
      
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ خطأ في تحميل التوصيات:', error);
        throw error;
      }

      console.log('🎯 تم تحميل التوصيات:', data?.length || 0);
      setRecommendations(data || []);
      
      // إظهار إشعار إذا كان هناك توصيات جديدة
      if (data && data.length > 0) {
        toast({
          title: `🔎 المساعد وجد ${data.length} توصية جديدة!`,
          description: "تم العثور على أدوات ومحتوى جديد قد يهمك",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل التوصيات:', error);
    }
  };

  const createPersistentAccount = async () => {
    try {
      const newUserId = generateUserId();
      
      console.log('🆕 إنشاء حساب دائم جديد:', newUserId);
      
      const preferences = { 
        searchCategory,
        ...(searchCategory === 'custom' && { customSearch })
      } as UserPreferences;
      
      const { data, error } = await supabase
        .from('persistent_users')
        .insert({
          user_id: newUserId,
          status: 'active',
          preferences: preferences as any, // Cast to any for Json compatibility
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ خطأ في إنشاء المستخدم:', error);
        throw error;
      }

      console.log('✅ تم إنشاء المستخدم بنجاح:', data);

      // حفظ في localStorage
      localStorage.setItem('lovableAI_userId', newUserId);
      localStorage.setItem('lovableAI_active', 'true');
      localStorage.setItem('lovableAI_searchCategory', searchCategory);
      if (searchCategory === 'custom') {
        localStorage.setItem('lovableAI_customSearch', customSearch);
      }
      
      setUserId(newUserId);
      setIsActive(true);
      setLastActiveTime(new Date().toISOString());

      // إنشاء نشاط ترحيبي
      const selectedCategory = searchCategories.find(cat => cat.value === searchCategory);
      const searchText = searchCategory === 'custom' ? customSearch : selectedCategory?.label;
      
      const welcomeActivity = {
        activity_type: 'suggestion',
        title: '🎉 تم تفعيل المساعد الذكي الدائم بنجاح!',
        description: `سيبحث لك المساعد عن كل جديد في "${searchText}" باستمرار ولن يتوقف أبداً. ستجد التوصيات هنا عند عودتك.`,
        user_id: newUserId
      };

      const { error: activityError } = await supabase
        .from('assistant_activities')
        .insert(welcomeActivity);

      if (activityError) {
        console.error('❌ خطأ في إنشاء نشاط الترحيب:', activityError);
      } else {
        console.log('✅ تم إنشاء نشاط الترحيب');
      }

      // تحميل الأنشطة والتوصيات
      await loadActivities(newUserId);
      await loadRecommendations(newUserId);

      toast({
        title: "🚀 تم تفعيل المساعد الذكي الدائم!",
        description: `سيعمل إلى الأبد ولن يتوقف عن البحث في "${searchText}"`,
      });

    } catch (error) {
      console.error('❌ خطأ في إنشاء الحساب الدائم:', error);
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
      console.error('❌ خطأ في وضع علامة مقروء على الأنشطة:', error);
    }
  };

  const markRecommendationsAsRead = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('recommendations')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;

      setRecommendations([]);
    } catch (error) {
      console.error('❌ خطأ في وضع علامة مقروء على التوصيات:', error);
    }
  };

  const updateSearchCategory = async (newCategory: string) => {
    if (!userId) return;

    try {
      const preferences = { 
        searchCategory: newCategory,
        ...(newCategory === 'custom' && { customSearch })
      } as UserPreferences;

      const { error } = await supabase
        .from('persistent_users')
        .update({ 
          preferences: preferences as any, // Cast to any for Json compatibility
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
        description: `سأبحث لك الآن في "${searchText}" إلى الأبد`,
      });
    } catch (error) {
      console.error('❌ خطأ في تحديث فئة البحث:', error);
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

      localStorage.setItem('lovableAI_active', 'false');
      
      setIsActive(false);
      setActivities([]);
      setNewActivitiesCount(0);
      setRecommendations([]);

      toast({
        title: "⏸️ تم إيقاف المساعد مؤقتاً",
        description: "البيانات محفوظة للأبد. يمكنك إعادة تفعيله في أي وقت",
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
    recommendations,
    setSearchCategory,
    setCustomSearch,
    createPersistentAccount,
    markActivitiesAsRead,
    markRecommendationsAsRead,
    updateSearchCategory,
    deactivateAssistant
  };
};
