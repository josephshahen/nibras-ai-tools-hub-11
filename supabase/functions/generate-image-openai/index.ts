
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
      throw new Error('OpenAI API key not configured');
    }

    console.log('🎨 توليد صورة بـ OpenAI:', prompt);

    // تحسين الوصف حسب النمط
    let enhancedPrompt = prompt;
    if (style === 'realistic') {
      enhancedPrompt = `${prompt}, photorealistic, high quality, 8K resolution, professional photography`;
    } else if (style === 'anime') {
      enhancedPrompt = `${prompt}, anime style, Japanese animation, detailed artwork`;
    } else if (style === 'cartoon') {
      enhancedPrompt = `${prompt}, cartoon style, 3D animation, colorful, Disney-like quality`;
    } else if (style === 'digital-art') {
      enhancedPrompt = `${prompt}, digital art, concept art, detailed illustration`;
    } else if (style === 'oil-painting') {
      enhancedPrompt = `${prompt}, oil painting style, classical art, masterpiece`;
    } else if (style === 'watercolor') {
      enhancedPrompt = `${prompt}, watercolor painting, artistic, soft colors`;
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'high'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    // gpt-image-1 يرجع base64 مباشرة
    const imageBase64 = data.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    console.log('✅ تم توليد الصورة بنجاح');

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ خطأ في توليد الصورة:', error);
    return new Response(JSON.stringify({ 
      error: 'فشل في توليد الصورة', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
