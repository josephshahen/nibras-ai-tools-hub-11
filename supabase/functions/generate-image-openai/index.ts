
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
    const { prompt, style } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    console.log('🔑 التحقق من API Key:', openAIApiKey ? 'موجود' : 'غير موجود');

    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key غير مضبوط في إعدادات المشروع', 
        details: 'يرجى إضافة OPENAI_API_KEY في Supabase Secrets'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🎨 طلب توليد صورة جديدة');
    console.log('📝 الوصف:', prompt);
    console.log('🎭 النمط:', style);

    // تحسين الوصف حسب النمط
    let enhancedPrompt = prompt;
    
    if (style === 'realistic') {
      enhancedPrompt = `${prompt}, photorealistic, high quality, detailed, professional photography, 8K resolution`;
    } else if (style === 'anime') {
      enhancedPrompt = `${prompt}, anime style, Japanese animation, detailed artwork, manga style`;
    } else if (style === 'cartoon') {
      enhancedPrompt = `${prompt}, cartoon style, 3D animation, colorful, Disney-Pixar style`;
    } else if (style === 'digital-art') {
      enhancedPrompt = `${prompt}, digital art, concept art, detailed illustration, artstation quality`;
    } else if (style === 'oil-painting') {
      enhancedPrompt = `${prompt}, oil painting style, classical art, renaissance masterpiece`;
    } else if (style === 'watercolor') {
      enhancedPrompt = `${prompt}, watercolor painting, artistic, soft colors, traditional art`;
    }

    console.log('✨ الوصف المحسن:', enhancedPrompt);

    // استدعاء DALL-E 3 API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: style === 'realistic' ? 'natural' : 'vivid'
      }),
    });

    console.log('📡 استجابة OpenAI:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ خطأ من OpenAI API:', errorText);
      
      let errorMessage = 'خطأ غير معروف من OpenAI';
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          if (errorData.error.code === 'invalid_api_key') {
            errorMessage = 'مفتاح OpenAI API غير صالح. تحقق من صحة المفتاح.';
          } else if (errorData.error.code === 'insufficient_quota') {
            errorMessage = 'انتهت حصة OpenAI API. تحقق من رصيدك.';
          } else if (errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        }
      } catch (e) {
        console.error('خطأ في تحليل رد OpenAI:', e);
        errorMessage = `خطأ HTTP ${response.status}: ${response.statusText}`;
      }

      return new Response(JSON.stringify({ 
        error: 'فشل في توليد الصورة من OpenAI', 
        details: errorMessage,
        status: response.status
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.error('❌ رد غير متوقع من OpenAI:', data);
      return new Response(JSON.stringify({ 
        error: 'رد غير صالح من OpenAI', 
        details: 'لم يتم إرجاع رابط الصورة'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageUrl = data.data[0].url;
    console.log('✅ تم توليد الصورة بنجاح');

    return new Response(JSON.stringify({ 
      imageUrl,
      prompt: enhancedPrompt,
      style,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ خطأ عام في Edge Function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'خطأ داخلي في الخادم', 
      details: error.message || 'خطأ غير معروف',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
