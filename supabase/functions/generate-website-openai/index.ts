
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, type, color, editRequest } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('🌐 توليد موقع بـ OpenAI:', title);

    let systemPrompt = `أنت مطور مواقع خبير. أنشئ موقع ويب كامل وجاهز للاستخدام بـ HTML, CSS, JavaScript.

المتطلبات:
- موقع مكتمل وجاهز للعمل
- تصميم عصري وجذاب
- متجاوب مع جميع الأجهزة  
- ألوان متناسقة حسب اللون المطلوب
- JavaScript تفاعلي
- أيقونات وعناصر بصرية جميلة
- كود نظيف ومنظم
- يدعم اللغة العربية
- استخدم Bootstrap أو CSS Grid/Flexbox للتخطيط

نوع الموقع: ${type}
اللون الأساسي: ${color}

أنشئ موقع كامل فقط بدون شرح أو تعليقات خارجية.`;

    let userPrompt = `اسم الموقع: ${title}
وصف الموقع: ${description}

${editRequest ? `تعديل مطلوب: ${editRequest}` : ''}

أنشئ الكود الكامل للموقع.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const websiteCode = data.choices[0].message.content;

    console.log('✅ تم توليد الموقع بنجاح');

    return new Response(JSON.stringify({ websiteCode }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ خطأ في توليد الموقع:', error);
    return new Response(JSON.stringify({ 
      error: 'فشل في توليد الموقع', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
