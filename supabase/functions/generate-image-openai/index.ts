
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

    console.log('🔑 API Key check:', openAIApiKey ? 'exists' : 'missing');
    console.log('🎨 Generating image with prompt:', prompt);
    console.log('🎭 Style:', style);

    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'مفتاح OpenAI API غير موجود في إعدادات المشروع',
        details: 'يرجى إضافة OPENAI_API_KEY في Supabase Edge Function Secrets'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    console.log('✨ Enhanced prompt:', enhancedPrompt);

    // استدعاء DALL-E 3 API مع معالجة أفضل للأخطاء
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

    console.log('📡 OpenAI response status:', response.status);
    console.log('📡 OpenAI response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error response:', errorText);
      
      let errorMessage = 'خطأ غير معروف من OpenAI';
      let errorDetails = '';
      
      try {
        const errorData = JSON.parse(errorText);
        console.log('📋 Parsed error data:', errorData);
        
        if (errorData.error) {
          const error = errorData.error;
          
          if (error.code === 'invalid_api_key') {
            errorMessage = 'مفتاح OpenAI API غير صالح';
            errorDetails = 'يرجى التحقق من صحة مفتاح API في إعدادات Supabase';
          } else if (error.code === 'insufficient_quota') {
            errorMessage = 'انتهت حصة OpenAI API';
            errorDetails = 'يرجى التحقق من رصيدك في حساب OpenAI';
          } else if (error.code === 'content_policy_violation') {
            errorMessage = 'المحتوى المطلوب ينتهك سياسة OpenAI';
            errorDetails = 'يرجى تعديل وصف الصورة ليتوافق مع سياسات OpenAI';
          } else if (error.code === 'rate_limit_exceeded') {
            errorMessage = 'تم تجاوز حد الطلبات';
            errorDetails = 'يرجى المحاولة مرة أخرى بعد قليل';
          } else if (error.message) {
            errorMessage = error.message;
            errorDetails = error.type || 'خطأ من OpenAI API';
          }
        }
      } catch (parseError) {
        console.error('❌ Error parsing OpenAI response:', parseError);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        errorDetails = errorText.substring(0, 200);
      }

      return new Response(JSON.stringify({ 
        success: false,
        error: errorMessage,
        details: errorDetails,
        status: response.status,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('📊 OpenAI success response keys:', Object.keys(data));
    
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      console.error('❌ Invalid OpenAI response structure:', data);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'رد غير صالح من OpenAI',
        details: 'لم يتم إرجاع بيانات الصورة في الرد',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageData = data.data[0];
    if (!imageData.url) {
      console.error('❌ No image URL in OpenAI response:', imageData);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'لم يتم إرجاع رابط الصورة',
        details: 'OpenAI لم يرجع رابط صالح للصورة',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageUrl = imageData.url;
    console.log('✅ Image generated successfully, URL length:', imageUrl.length);

    return new Response(JSON.stringify({ 
      success: true,
      imageUrl,
      prompt: enhancedPrompt,
      originalPrompt: prompt,
      style,
      revised_prompt: imageData.revised_prompt || enhancedPrompt,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ General error in Edge Function:', error);
    console.error('❌ Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'خطأ داخلي في خادم الصور',
      details: `${error.name}: ${error.message}`,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
