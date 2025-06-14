
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔍 بدء عملية البحث للمساعد الذكي الدائم...');

    // جلب جميع المستخدمين النشطين
    const { data: activeUsers, error: usersError } = await supabase
      .from('persistent_users')
      .select('*')
      .eq('status', 'active');

    if (usersError) {
      console.error('❌ خطأ في جلب المستخدمين:', usersError);
      throw usersError;
    }

    console.log(`👥 تم العثور على ${activeUsers?.length || 0} مستخدم نشط`);

    if (!activeUsers || activeUsers.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'لا يوجد مستخدمين نشطين' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // معالجة كل مستخدم
    for (const user of activeUsers) {
      try {
        console.log(`🔍 معالجة المستخدم: ${user.user_id}`);
        
        const preferences = user.preferences || {};
        const searchCategory = preferences.searchCategory || 'general';
        const customSearch = preferences.customSearch || '';

        let searchQuery = '';
        
        // تحديد نص البحث حسب التفضيلات
        if (searchCategory === 'custom' && customSearch) {
          searchQuery = customSearch;
        } else {
          const categoryMap = {
            'web-development': 'تطوير الويب والبرمجة',
            'mobile-development': 'تطوير التطبيقات المحمولة',
            'data-science': 'علم البيانات والذكاء الاصطناعي',
            'design': 'التصميم والجرافيك',
            'marketing': 'التسويق الرقمي',
            'business': 'الأعمال وريادة الأعمال',
            'education': 'التعليم والتدريب',
            'health': 'الصحة والطب',
            'finance': 'المالية والاستثمار',
            'technology': 'التكنولوجيا والابتكار',
            'general': 'التكنولوجيا العامة'
          };
          searchQuery = categoryMap[searchCategory] || 'التكنولوجيا العامة';
        }

        console.log(`🔍 البحث عن: "${searchQuery}" للمستخدم ${user.user_id}`);

        // إنشاء أنشطة تجريبية واقعية
        const activities = [
          {
            activity_type: 'discovery',
            title: `🔍 تم العثور على أدوات جديدة في ${searchQuery}`,
            description: `اكتشفت 3 أدوات جديدة قد تساعدك في تطوير مهاراتك في ${searchQuery}. تحقق من الروابط في قسم التوصيات.`,
            user_id: user.user_id
          },
          {
            activity_type: 'suggestion',
            title: `💡 اقتراح مخصص بناءً على اهتمامك في ${searchQuery}`,
            description: `بناءً على بحثك المستمر في ${searchQuery}، أقترح عليك التركيز على تعلم أحدث التقنيات في هذا المجال.`,
            user_id: user.user_id
          }
        ];

        // إدراج الأنشطة
        for (const activity of activities) {
          const { error: activityError } = await supabase
            .from('assistant_activities')
            .insert(activity);

          if (activityError) {
            console.error(`❌ خطأ في إدراج النشاط للمستخدم ${user.user_id}:`, activityError);
          } else {
            console.log(`✅ تم إدراج نشاط للمستخدم ${user.user_id}: ${activity.title}`);
          }
        }

        // إنشاء توصيات
        const recommendations = [
          {
            title: `أداة جديدة في ${searchQuery}`,
            description: `أداة رائعة تساعدك في تحسين أدائك في ${searchQuery}`,
            url: 'https://example.com/tool1',
            category: searchQuery,
            user_id: user.user_id
          },
          {
            title: `مقال متقدم حول ${searchQuery}`,
            description: `دليل شامل يغطي أحدث الطرق والتقنيات`,
            url: 'https://example.com/article1',
            category: searchQuery,
            user_id: user.user_id
          },
          {
            title: `كورس مجاني في ${searchQuery}`,
            description: `كورس تدريبي مجاني لتطوير مهاراتك`,
            url: 'https://example.com/course1',
            category: searchQuery,
            user_id: user.user_id
          }
        ];

        // إدراج التوصيات
        for (const recommendation of recommendations) {
          const { error: recError } = await supabase
            .from('recommendations')
            .insert(recommendation);

          if (recError) {
            console.error(`❌ خطأ في إدراج التوصية للمستخدم ${user.user_id}:`, recError);
          } else {
            console.log(`✅ تم إدراج توصية للمستخدم ${user.user_id}: ${recommendation.title}`);
          }
        }

        // تحديث آخر نشاط للمستخدم
        const { error: updateError } = await supabase
          .from('persistent_users')
          .update({ last_active: new Date().toISOString() })
          .eq('user_id', user.user_id);

        if (updateError) {
          console.error(`❌ خطأ في تحديث آخر نشاط للمستخدم ${user.user_id}:`, updateError);
        }

      } catch (userError) {
        console.error(`❌ خطأ في معالجة المستخدم ${user.user_id}:`, userError);
      }
    }

    console.log('✅ تم إنهاء معالجة جميع المستخدمين');

    return new Response(JSON.stringify({ 
      success: true,
      processedUsers: activeUsers.length,
      message: `تمت معالجة ${activeUsers.length} مستخدم نشط`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ خطأ عام في المساعد الذكي:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'خطأ في تشغيل المساعد الذكي',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
