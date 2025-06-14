
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
    // إزالة الفحص الدوري - المستخدم يزور متى يريد
  }, []);

  // فحص الحساب الموجود والتأكد من إنشاء زيارة دائمة
  const checkExistingAccount = async () => {
    try {
      const storedUserId = localStorage.getItem('lovableAI_userId');
      const assistantActive = localStorage.getItem('lovableAI_active') === 'true';
      const storedCategory = localStorage.getItem('lovableAI_searchCategory') || 'general';
      const storedCustomSearch = localStorage.getItem('lovableAI_customSearch') || '';
      
      console.log('🔍 فحص الحساب الموجود...', { storedUserId, assistantActive });
      
      if (storedUserId) {
        // التحقق من وجود المستخدم في قاعدة البيانات وإنشاء زيارة دائمة
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
          setIsActive(assistantActive); // يعتمد على التفضيلات المحفوظة
          setSearchCategory(preferences?.searchCategory || storedCategory);
          setCustomSearch(preferences?.customSearch || storedCustomSearch);
          setLastActiveTime(userExists.last_active || new Date().toISOString());
          
          // تحميل البيانات حسب حالة التفعيل
          if (assistantActive) {
            await loadActivities(storedUserId);
            await loadRecommendations(storedUserId);
          } else {
            await loadActivities(storedUserId); // تحميل الأنشطة السابقة فقط
          }
          
          console.log('✅ تم تحميل حساب موجود بنجاح');
          
          // تحديث آخر زيارة دائماً (زيارة دائمة للموقع)
          await supabase
            .from('persistent_users')
            .update({ last_active: new Date().toISOString() })
            .eq('user_id', storedUserId);
            
          console.log('🏠 تم تسجيل زيارة دائمة للموقع');
        } else {
          console.log('⚠️ المستخدم غير موجود في قاعدة البيانات، إعادة إنشاء...');
          // إنشاء حساب دائم حتى لو لم يكن موجود
          await createPermanentAccount(storedUserId, storedCategory, storedCustomSearch, false);
        }
      }
    } catch (error) {
      console.error('❌ خطأ في فحص الحساب الموجود:', error);
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
      
      // إظهار إشعار إذا كان هناك توصيات جديدة (فقط إذا كان المساعد نشط)
      if (data && data.length > 0 && isActive) {
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

  // إنشاء حساب دائم في الموقع
  const createPermanentAccount = async (existingUserId?: string, category?: string, customSearchText?: string, activate: boolean = true) => {
    try {
      const newUserId = existingUserId || generateUserId();
      const finalCategory = category || searchCategory;
      const finalCustomSearch = customSearchText || customSearch;
      
      console.log('🆕 إنشاء حساب دائم في الموقع:', newUserId);
      
      const preferences = { 
        searchCategory: finalCategory,
        ...(finalCategory === 'custom' && { customSearch: finalCustomSearch })
      } as UserPreferences;
      
      const { data, error } = await supabase
        .from('persistent_users')
        .insert({
          user_id: newUserId,
          status: activate ? 'active' : 'inactive', // يعتمد على رغبة المستخدم
          preferences: preferences as any,
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ خطأ في إنشاء المستخدم:', error);
        throw error;
      }

      console.log('✅ تم إنشاء حساب دائم بنجاح:', data);

      // حفظ في localStorage
      localStorage.setItem('lovableAI_userId', newUserId);
      localStorage.setItem('lovableAI_active', activate.toString());
      localStorage.setItem('lovableAI_searchCategory', finalCategory);
      if (finalCategory === 'custom') {
        localStorage.setItem('lovableAI_customSearch', finalCustomSearch);
      }
      
      setUserId(newUserId);
      setIsActive(activate);
      setLastActiveTime(new Date().toISOString());

      // إنشاء نشاط ترحيبي
      const selectedCategory = searchCategories.find(cat => cat.value === finalCategory);
      const searchText = finalCategory === 'custom' ? finalCustomSearch : selectedCategory?.label;
      
      const welcomeActivity = {
        activity_type: 'suggestion',
        title: activate ? '🎉 تم تفعيل المساعد الذكي الدائم بنجاح!' : '🏠 تم إنشاء حساب دائم في الموقع!',
        description: activate 
          ? `سيبحث لك المساعد عن كل جديد في "${searchText}" باستمرار ولن يتوقف أبداً. ستجد التوصيات هنا عند عودتك.`
          : `تم إنشاء حسابك الدائم في الموقع. يمكنك تفعيل المساعد في أي وقت للبحث في "${searchText}".`,
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

      // تحميل الأنشطة
      await loadActivities(newUserId);
      if (activate) {
        await loadRecommendations(newUserId);
      }

      toast({
        title: activate ? "🚀 تم تفعيل المساعد الذكي الدائم!" : "🏠 تم إنشاء حسابك الدائم!",
        description: activate 
          ? `سيعمل إلى الأبد ولن يتوقف عن البحث في "${searchText}"`
          : `حسابك محفوظ للأبد. يمكنك تفعيل المساعد في أي وقت`,
      });

    } catch (error) {
      console.error('❌ خطأ في إنشاء الحساب الدائم:', error);
      toast({
        title: "❌ خطأ في التفعيل",
        description: "حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  // تفعيل المساعد للحساب الموجود
  const createPersistentAccount = async () => {
    if (userId) {
      // تحديث الحساب الموجود لتفعيل المساعد
      await updateAccountStatus(true);
    } else {
      // إنشاء حساب جديد مع تفعيل المساعد
      await createPermanentAccount(undefined, undefined, undefined, true);
    }
  };

  // تحديث حالة الحساب
  const updateAccountStatus = async (activate: boolean) => {
    if (!userId) return;

    try {
      const preferences = { 
        searchCategory,
        ...(searchCategory === 'custom' && { customSearch })
      } as UserPreferences;

      const { error } = await supabase
        .from('persistent_users')
        .update({ 
          status: activate ? 'active' : 'inactive',
          preferences: preferences as any,
          last_active: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      localStorage.setItem('lovableAI_active', activate.toString());
      localStorage.setItem('lovableAI_searchCategory', searchCategory);
      if (searchCategory === 'custom') {
        localStorage.setItem('lovableAI_customSearch', customSearch);
      }
      
      setIsActive(activate);

      if (activate) {
        await loadRecommendations(userId);
        const searchText = getCurrentSearchText(searchCategory, customSearch, searchCategories);
        toast({
          title: "✅ تم تفعيل المساعد",
          description: `سأبحث لك الآن في "${searchText}" إلى الأبد`,
        });
      } else {
        setRecommendations([]);
        toast({
          title: "⏸️ تم إيقاف المساعد مؤقتاً",
          description: "حسابك محفوظ للأبد. يمكنك إعادة تفعيله في أي وقت",
        });
      }
    } catch (error) {
      console.error('❌ خطأ في تحديث حالة الحساب:', error);
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
          preferences: preferences as any,
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
    // إيقاف المساعد مع الحفاظ على الحساب
    await updateAccountStatus(false);
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
