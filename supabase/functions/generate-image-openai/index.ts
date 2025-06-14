
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

    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    console.log('🎨 توليد صورة جديدة بـ DALL-E 3 للوصف:', prompt);
    console.log('🎭 النمط المطلوب:', style);

    // تحسين الوصف حسب النمط المطلوب
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

    console.log('📡 استجابة OpenAI API:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ خطأ من OpenAI API:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    console.log('✅ تم توليد الصورة بنجاح، URL:', imageUrl.substring(0, 50) + '...');

    return new Response(JSON.stringify({ 
      imageUrl,
      prompt: enhancedPrompt,
      style,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ خطأ في Edge Function:', error.message);
    console.error('🔍 تفاصيل الخطأ:', error);
    
    return new Response(JSON.stringify({ 
      error: 'فشل في توليد الصورة', 
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
