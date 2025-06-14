
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
      console.error('❌ OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    console.log('🌐 توليد موقع جديد بـ GPT-4 لـ:', title);
    console.log('📋 الوصف:', description);
    console.log('🎨 النوع:', type, 'اللون:', color);

    const systemPrompt = `أنت مطور ويب خبير متخصص في إنشاء مواقع ويب كاملة وجاهزة للاستخدام.

قم بإنشاء موقع ويب كامل بـ HTML، CSS، JavaScript يتضمن:

1. HTML5 كامل مع DOCTYPE وجميع العناصر المطلوبة
2. CSS مدمج في الـ <style> داخل <head> مع تصميم عصري وجذاب
3. JavaScript تفاعلي مدمج في <script> داخل الصفحة
4. تصميم متجاوب مع جميع الأجهزة (Mobile-First)
5. ألوان متناسقة باستخدام اللون الأساسي: ${color}
6. أيقونات Font Awesome (مضمنة من CDN)
7. تأثيرات CSS متقدمة (animations, transitions, gradients, hover effects)
8. محتوى واقعي ومناسب لنوع الموقع: ${type}
9. دعم اللغة العربية مع direction: rtl عند الحاجة
10. SEO-friendly مع meta tags مناسبة

متطلبات إضافية حسب النوع:
- موقع شركة: header، hero section، خدمات، about us، contact، footer
- معرض أعمال: gallery، مهارات، خبرات، مشاريع، معلومات شخصية
- مدونة: قائمة مقالات، sidebar، categories، search
- صفحة هبوط: hero قوي، مميزات، testimonials، call-to-action، pricing
- مطعم: قائمة طعام، معرض صور، معلومات، حجز طاولة
- متجر: عرض منتجات، فئات، سلة تسوق، checkout

أنشئ الكود الكامل فقط بدون أي شرح خارجي.`;

    let userPrompt = `اسم الموقع: ${title}
وصف الموقع: ${description}
نوع الموقع: ${type}
اللون الأساسي: ${color}

${editRequest ? `تعديل مطلوب: ${editRequest}` : ''}

أنشئ موقع ويب كامل وجاهز للاستخدام مع جميع المتطلبات.`;

    console.log('🤖 إرسال الطلب إلى GPT-4...');

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
        temperature: 0.8,
      }),
    });

    console.log('📡 استجابة OpenAI API:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ خطأ من OpenAI API:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let websiteCode = data.choices[0].message.content;

    console.log('📝 تم استلام الكود، الطول:', websiteCode.length);

    // تنظيف الكود من markdown formatting
    websiteCode = websiteCode.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();

    // التأكد من وجود DOCTYPE
    if (!websiteCode.includes('<!DOCTYPE html>')) {
      websiteCode = `<!DOCTYPE html>\n${websiteCode}`;
    }

    // التأكد من وجود charset UTF-8
    if (!websiteCode.includes('charset=')) {
      websiteCode = websiteCode.replace('<head>', '<head>\n  <meta charset="UTF-8">');
    }

    console.log('✅ تم توليد الموقع بنجاح');

    return new Response(JSON.stringify({ 
      websiteCode,
      title,
      type,
      color,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ خطأ في Edge Function:', error.message);
    console.error('🔍 تفاصيل الخطأ:', error);
    
    return new Response(JSON.stringify({ 
      error: 'فشل في توليد الموقع', 
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
