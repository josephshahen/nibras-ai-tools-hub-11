
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

    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'مفتاح OpenAI API غير موجود',
        details: 'يرجى التأكد من إضافة OPENAI_API_KEY في إعدادات المشروع'
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

    console.log('📡 OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', errorText);
      
      let errorMessage = 'خطأ غير معروف من OpenAI';
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          if (errorData.error.code === 'invalid_api_key') {
            errorMessage = 'مفتاح OpenAI API غير صالح. يرجى التحقق من صحة المفتاح.';
          } else if (errorData.error.code === 'insufficient_quota') {
            errorMessage = 'انتهت حصة OpenAI API. يرجى التحقق من رصيدك.';
          } else if (errorData.error.message) {
            errorMessage = errorData.error.message;
          }
        }
      } catch (e) {
        console.error('Error parsing OpenAI response:', e);
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      return new Response(JSON.stringify({ 
        success: false,
        error: 'فشل في توليد الصورة من OpenAI', 
        details: errorMessage,
        status: response.status
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      console.error('❌ Invalid OpenAI response:', data);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'رد غير صالح من OpenAI', 
        details: 'لم يتم إرجاع رابط الصورة'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const imageUrl = data.data[0].url;
    console.log('✅ Image generated successfully');

    return new Response(JSON.stringify({ 
      success: true,
      imageUrl,
      prompt: enhancedPrompt,
      style,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ General error in Edge Function:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'خطأ داخلي في الخادم', 
      details: error.message || 'خطأ غير معروف',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
