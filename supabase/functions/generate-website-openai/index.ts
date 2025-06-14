
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

    console.log('🌐 توليد موقع بـ GPT-4:', title);

    let systemPrompt = `أنت مطور مواقع خبير متخصص في إنشاء مواقع ويب كاملة وجاهزة للاستخدام.

أنشئ موقع ويب كامل بـ HTML، CSS، JavaScript يتضمن:

1. HTML كامل مع جميع العناصر المطلوبة
2. CSS مدمج في الـ head مع تصميم عصري وجذاب
3. JavaScript تفاعلي مدمج في الصفحة
4. تصميم متجاوب مع جميع الأجهزة (Mobile-First)
5. ألوان متناسقة باستخدام اللون الأساسي المطلوب
6. أيقونات وعناصر بصرية (استخدم Font Awesome)
7. تأثيرات CSS متقدمة (animations, transitions, gradients)
8. محتوى واقعي ومناسب لنوع الموقع
9. دعم اللغة العربية مع direction: rtl
10. SEO-friendly مع meta tags

نوع الموقع: ${type}
اللون الأساسي: ${color}

المتطلبات الإضافية حسب نوع الموقع:
- إذا كان موقع شركة: أضف header، hero section، خدمات، فريق العمل، footer
- إذا كان معرض أعمال: أضف gallery للأعمال، قسم المهارات، معلومات شخصية
- إذا كان مدونة: أضف قائمة مقالات، sidebar، نظام تعليقات
- إذا كان صفحة هبوط: أضف عرض قوي، مميزات، testimonials، call-to-action
- إذا كان مطعم: أضف قائمة الطعام، معرض صور، معلومات التواصل
- إذا كان متجر: أضف عرض منتجات، سلة تسوق، نظام دفع

أنشئ الكود الكامل للموقع فقط بدون أي شرح أو تعليقات خارجية.`;

    let userPrompt = `اسم الموقع: ${title}
وصف الموقع: ${description}

${editRequest ? `تعديل مطلوب: ${editRequest}` : ''}

أنشئ موقع ويب كامل وجاهز للاستخدام مع جميع المتطلبات المذكورة.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
    let websiteCode = data.choices[0].message.content;

    // تنظيف الكود من markdown formatting إذا وُجد
    websiteCode = websiteCode.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    // التأكد من وجود DOCTYPE إذا لم يكن موجود
    if (!websiteCode.includes('<!DOCTYPE html>')) {
      websiteCode = `<!DOCTYPE html>\n${websiteCode}`;
    }

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
