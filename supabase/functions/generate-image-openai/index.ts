
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

    console.log('🔑 التحقق من مفتاح API:', openAIApiKey ? 'موجود' : 'غير موجود');
    console.log('📝 Prompt:', prompt);
    console.log('🎨 Style:', style);

    if (!openAIApiKey) {
      console.error('❌ مفتاح OpenAI غير موجود');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'مفتاح OpenAI API غير موجود',
        details: 'يرجى إضافة OPENAI_API_KEY في إعدادات Supabase Edge Function Secrets'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!prompt || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'يرجى إدخال وصف للصورة',
        details: 'الوصف فارغ أو غير صالح'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // تحسين الوصف حسب النمط
    let enhancedPrompt = prompt.trim();
    
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

    console.log('✨ Enhanced prompt:', enhancedPrompt);

    // استدعاء DALL-E 3 API
    console.log('📡 إرسال طلب إلى OpenAI...');
    
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

    console.log('📊 OpenAI Response Status:', response.status);
    console.log('📊 OpenAI Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API Error:', errorText);
      
      let errorMessage = 'خطأ من OpenAI API';
      let errorDetails = '';
      
      try {
        const errorData = JSON.parse(errorText);
        console.log('📋 Error Data:', errorData);
        
        if (errorData.error) {
          const error = errorData.error;
          
          switch (error.code) {
            case 'invalid_api_key':
              errorMessage = 'مفتاح OpenAI API غير صالح';
              errorDetails = 'تحقق من صحة مفتاح API في إعدادات Supabase';
              break;
            case 'insufficient_quota':
              errorMessage = 'انتهت حصة OpenAI API';
              errorDetails = 'تحقق من رصيدك في حساب OpenAI';
              break;
            case 'content_policy_violation':
              errorMessage = 'المحتوى ينتهك سياسة OpenAI';
              errorDetails = 'يرجى تعديل وصف الصورة';
              break;
            case 'rate_limit_exceeded':
              errorMessage = 'تم تجاوز حد الطلبات';
              errorDetails = 'انتظر قليلاً ثم حاول مرة أخرى';
              break;
            default:
              errorMessage = error.message || 'خطأ غير معروف من OpenAI';
              errorDetails = error.type || `HTTP ${response.status}`;
          }
        }
      } catch (parseError) {
        console.error('❌ خطأ في تحليل رد OpenAI:', parseError);
        errorMessage = `خطأ HTTP ${response.status}: ${response.statusText}`;
        errorDetails = errorText.substring(0, 200);
      }

      return new Response(JSON.stringify({ 
        success: false,
        error: errorMessage,
        details: errorDetails,
        status: response.status
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('📊 OpenAI Success Response:', Object.keys(data));
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error('❌ رد غير صالح من OpenAI:', data);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'رد غير صالح من OpenAI',
        details: 'لم يتم إرجاع بيانات الصورة'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageData = data.data[0];
    if (!imageData.url) {
      console.error('❌ لا يوجد رابط للصورة:', imageData);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'لم يتم إرجاع رابط الصورة',
        details: 'OpenAI لم يرجع رابط صالح للصورة'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageUrl = imageData.url;
    console.log('✅ تم توليد الصورة بنجاح، رابط الصورة موجود');

    return new Response(JSON.stringify({ 
      success: true,
      imageUrl,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      style,
      revised_prompt: imageData.revised_prompt || enhancedPrompt
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ خطأ عام في Edge Function:', error);
    console.error('❌ Stack trace:', error.stack);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'خطأ داخلي في خادم الصور',
      details: `${error.name}: ${error.message}`
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
