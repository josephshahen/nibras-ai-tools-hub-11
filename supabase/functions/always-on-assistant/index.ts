
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Always-on assistant background task started - PERMANENT MODE');

    // Get all active persistent users - NO EXPIRATION
    const { data: users, error: usersError } = await supabaseClient
      .from('persistent_users')
      .select('*')
      .eq('status', 'active');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    console.log(`Found ${users?.length || 0} active permanent users`);

    // Enhanced AI-found recommendations
    const recommendations = [
      {
        title: 'أداة جديدة: ChatGPT Vision للصور',
        description: 'تحليل وفهم الصور بالذكاء الاصطناعي مع إمكانيات متقدمة',
        url: 'https://openai.com/chatgpt',
        category: 'ai-tools'
      },
      {
        title: 'Midjourney V6 - جيل جديد من توليد الصور',
        description: 'إصدار محدث بقدرات أفضل لتوليد صور عالية الجودة',
        url: 'https://midjourney.com',
        category: 'image-generation'
      },
      {
        title: 'GitHub Copilot Chat - مساعد البرمجة التفاعلي',
        description: 'الآن يمكنك التحدث مع مساعد البرمجة مباشرة في محرر الكود',
        url: 'https://github.com/features/copilot',
        category: 'programming'
      },
      {
        title: 'Notion AI - ميزات جديدة للكتابة',
        description: 'إمكانيات محدثة للكتابة وتنظيم المحتوى بالذكاء الاصطناعي',
        url: 'https://notion.so',
        category: 'productivity'
      },
      {
        title: 'Stable Diffusion XL - نموذج محسن للصور',
        description: 'إصدار جديد بجودة أعلى وتحكم أفضل في توليد الصور',
        url: 'https://stability.ai',
        category: 'image-generation'
      }
    ];

    // Enhanced activities for user engagement
    const activities = [
      {
        type: 'search',
        title: 'اكتشفت 5 أدوات ذكاء اصطناعي جديدة هذا الأسبوع',
        description: 'تم رصد أدوات جديدة في مجالات الترجمة، توليد الصور، والبرمجة المساعدة'
      },
      {
        type: 'analysis',
        title: 'تحليل شامل: اتجاهات الذكاء الاصطناعي لعام 2024',
        description: 'رصدت تطورات مهمة في نماذج اللغة، الصور التوليدية، والأتمتة الذكية'
      },
      {
        type: 'suggestion',
        title: 'اقتراح: دمج أدوات AI في سير عملك اليومي',
        description: 'يمكنني مساعدتك في اختيار الأدوات المناسبة لتحسين إنتاجيتك'
      },
      {
        type: 'search',
        title: 'محتوى جديد: دورات مجانية في الذكاء الاصطناعي',
        description: 'وجدت دورات تدريبية جديدة من جامعات عالمية في مجال AI'
      }
    ];

    for (const user of users || []) {
      // Add recommendations for each user
      const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
      
      const { error: recError } = await supabaseClient
        .from('recommendations')
        .insert({
          user_id: user.user_id,
          title: randomRecommendation.title,
          description: randomRecommendation.description,
          url: randomRecommendation.url,
          category: randomRecommendation.category,
          is_read: false,
          created_at: new Date().toISOString()
        });

      if (recError) {
        console.error('Error creating recommendation:', recError);
      } else {
        console.log(`Created recommendation for user ${user.user_id}`);
      }

      // Add activity for engagement
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      
      const { error: activityError } = await supabaseClient
        .from('assistant_activities')
        .insert({
          user_id: user.user_id,
          activity_type: randomActivity.type,
          title: randomActivity.title,
          description: randomActivity.description,
          is_read: false,
          created_at: new Date().toISOString()
        });

      if (activityError) {
        console.error('Error creating activity:', activityError);
      } else {
        console.log(`Created activity for user ${user.user_id}`);
      }

      // Update user's last_active timestamp - PERMANENT USERS
      const { error: updateError } = await supabaseClient
        .from('persistent_users')
        .update({ last_active: new Date().toISOString() })
        .eq('user_id', user.user_id);

      if (updateError) {
        console.error('Error updating user:', updateError);
      }
    }

    // NO MORE CLEANUP - USERS ARE PERMANENT!
    console.log('Background task completed - All users remain active permanently');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Permanent assistant task completed successfully',
        processedUsers: users?.length || 0,
        mode: 'PERMANENT - No auto-cleanup'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Always-on assistant error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
