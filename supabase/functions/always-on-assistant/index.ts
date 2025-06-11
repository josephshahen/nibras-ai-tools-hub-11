
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

    console.log('Always-on assistant background task started');

    // Get all active persistent users
    const { data: users, error: usersError } = await supabaseClient
      .from('persistent_users')
      .select('*')
      .eq('status', 'active');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    console.log(`Found ${users?.length || 0} active users`);

    // Simulate AI finding new content for each user
    const activities = [
      {
        type: 'search',
        title: 'وجدت 3 أدوات جديدة للذكاء الاصطناعي',
        description: 'تم اكتشاف أدوات جديدة في مجال الترجمة وتوليد المحتوى'
      },
      {
        type: 'analysis',
        title: 'تحليل جديد لاتجاهات التقنية',
        description: 'رصدت تطورات مهمة في مجال البرمجة بالذكاء الاصطناعي'
      },
      {
        type: 'suggestion',
        title: 'اقتراح تحسين لمشاريعك',
        description: 'يمكنني مساعدتك في تطوير مشاريعك بتقنيات جديدة'
      },
      {
        type: 'search',
        title: 'محتوى جديد متاح',
        description: 'وجدت مقالات ومصادر جديدة قد تهمك'
      }
    ];

    for (const user of users || []) {
      // Randomly select an activity for each user
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      
      // Insert new activity for the user
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

      // Update user's last_active timestamp
      const { error: updateError } = await supabaseClient
        .from('persistent_users')
        .update({ last_active: new Date().toISOString() })
        .eq('user_id', user.user_id);

      if (updateError) {
        console.error('Error updating user:', updateError);
      }
    }

    // Clean up inactive users (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error: cleanupError } = await supabaseClient
      .from('persistent_users')
      .update({ status: 'expired' })
      .lt('last_active', thirtyDaysAgo.toISOString())
      .eq('status', 'active');

    if (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    } else {
      console.log('Cleaned up inactive users');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Background task completed successfully',
        processedUsers: users?.length || 0
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
