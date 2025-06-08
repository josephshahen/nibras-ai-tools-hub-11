
// خدمة الذكاء الاصطناعي المركزية
const OPENROUTER_API_KEY = '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';
const REPLICATE_API_KEY = 'r8_crQmT4Z2cEljF7RKmDoiZQJ9jnTltXu0Q0REm';
const HUGGINGFACE_API_KEY = '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';

// خدمة OpenRouter للنصوص والمحادثة
export const openRouterRequest = async (messages: any[], model: string = 'meta-llama/llama-3.2-3b-instruct:free') => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// خدمة Replicate لتوليد الصور المحسنة
export const generateImageWithReplicate = async (prompt: string, style: string = 'realistic') => {
  // تحسين الوصف حسب النمط المطلوب
  let enhancedPrompt = prompt;
  let negativePrompt = 'blurry, low quality, distorted, ugly, deformed';
  
  switch (style) {
    case 'anime':
      enhancedPrompt = `anime style, ${prompt}, beautiful anime art, studio quality, detailed anime illustration, vibrant colors`;
      negativePrompt += ', realistic, photographic, 3d render';
      break;
    case 'cartoon':
      enhancedPrompt = `cartoon style, ${prompt}, colorful cartoon art, disney style, animated, fun and bright`;
      negativePrompt += ', realistic, dark, photographic';
      break;
    case 'digital-art':
      enhancedPrompt = `digital art, ${prompt}, concept art, artstation quality, digital painting, highly detailed`;
      negativePrompt += ', traditional media, pencil drawing';
      break;
    case 'oil-painting':
      enhancedPrompt = `oil painting, ${prompt}, classical art style, painterly, brush strokes, renaissance style`;
      negativePrompt += ', digital, cartoon, anime';
      break;
    case 'watercolor':
      enhancedPrompt = `watercolor painting, ${prompt}, soft colors, flowing paint, artistic, delicate`;
      negativePrompt += ', harsh lines, digital, photographic';
      break;
    default: // realistic
      enhancedPrompt = `photorealistic, ${prompt}, high resolution, detailed, professional photography, sharp focus`;
      negativePrompt += ', cartoon, anime, painting, drawing';
  }

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
      input: {
        prompt: enhancedPrompt,
        negative_prompt: negativePrompt,
        width: 1024,
        height: 1024,
        num_inference_steps: 50,
        guidance_scale: 7.5,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.statusText}`);
  }

  const prediction = await response.json();
  
  // انتظار اكتمال التوليد
  let result = prediction;
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
      },
    });
    
    result = await statusResponse.json();
  }

  if (result.status === 'succeeded') {
    return result.output[0];
  } else {
    throw new Error('Image generation failed');
  }
};

// خدمة HuggingFace للتلخيص
export const huggingFaceRequest = async (inputs: any, model: string) => {
  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs }),
  });

  if (!response.ok) {
    throw new Error(`HuggingFace API error: ${response.statusText}`);
  }

  return await response.json();
};

// ترجمة النصوص باستخدام Google Translate المجاني
export const translateText = async (text: string, sourceLang: string, targetLang: string) => {
  try {
    // استخدام Google Translate API المجاني
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const data = await response.json();
    
    // استخراج النص المترجم من الاستجابة
    let translatedText = '';
    if (data && data[0]) {
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i][0]) {
          translatedText += data[0][i][0];
        }
      }
    }
    
    return translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    
    // احتياطي: استخدام الترجمة بواسطة الذكاء الاصطناعي
    try {
      const messages = [
        {
          role: 'system',
          content: `أنت مترجم محترف. ترجم النص من ${sourceLang} إلى ${targetLang}. أرجع فقط النص المترجم بدون أي إضافات.`
        },
        {
          role: 'user',
          content: text
        }
      ];
      
      return await openRouterRequest(messages);
    } catch (aiError) {
      console.error('AI translation error:', aiError);
      return `خطأ في الترجمة: ${text}`;
    }
  }
};

// تلخيص المقالات
export const summarizeText = async (text: string, length: string = 'medium') => {
  try {
    const messages = [
      {
        role: 'system',
        content: `أنت مساعد ذكي متخصص في تلخيص النصوص. لخص النص التالي بطريقة ${length === 'short' ? 'مختصرة جداً' : length === 'medium' ? 'متوسطة' : 'مفصلة'}.`
      },
      {
        role: 'user',
        content: `لخص هذا النص: ${text}`
      }
    ];
    
    return await openRouterRequest(messages);
  } catch (error) {
    console.error('Summarization error:', error);
    return 'عذراً، حدث خطأ في تلخيص النص.';
  }
};

// توليد الكود المحسن
export const generateCode = async (prompt: string, language: string) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `أنت مطور برمجيات خبير متخصص في ${language}. أنشئ كود ${language} نظيف ومفصل وعملي. اجعل الكود:
        1. مكتمل وجاهز للتشغيل
        2. مع التعليقات باللغة العربية
        3. يتبع أفضل الممارسات
        4. مع معالجة الأخطاء إذا لزم الأمر
        5. مع أمثلة للاستخدام إذا كان مناسباً`
      },
      {
        role: 'user',
        content: `أنشئ كود ${language} للمطلب التالي: ${prompt}`
      }
    ];
    
    return await openRouterRequest(messages, 'deepseek/deepseek-coder');
  } catch (error) {
    console.error('Code generation error:', error);
    return 'عذراً، حدث خطأ في توليد الكود.';
  }
};

// توليد مواقع الويب المحسن
export const generateWebsite = async (title: string, description: string, type: string, color: string) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `أنت مطور مواقع ويب محترف. أنشئ موقع ويب HTML كامل ومتقدم مع:
        1. HTML5 semantically correct
        2. CSS متقدم مع animations وtransitions
        3. JavaScript تفاعلي للميزات الديناميكية
        4. تصميم متجاوب (responsive) لجميع الأجهزة
        5. ألوان متناسقة وجميلة
        6. تخطيط احترافي مع header, main, footer
        7. نظام grid أو flexbox للتخطيط
        8. أيقونات وعناصر بصرية جميلة
        9. تأثيرات hover وانتقالات سلسة
        10. كود نظيف ومنظم مع تعليقات`
      },
      {
        role: 'user',
        content: `أنشئ موقع ويب ${type} احترافي وجميل:
        - الاسم: ${title}
        - الوصف: ${description}
        - اللون الأساسي: ${color}
        - يجب أن يكون الموقع متكامل وجاهز للنشر`
      }
    ];
    
    return await openRouterRequest(messages);
  } catch (error) {
    console.error('Website generation error:', error);
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-align: center; padding: 4rem 2rem; }
        .header h1 { font-size: 3rem; margin-bottom: 1rem; }
        .content { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
        .section { margin: 3rem 0; padding: 2rem; border-radius: 10px; background: #f8f9fa; }
        .footer { background: #333; color: white; text-align: center; padding: 2rem; }
        .btn { display: inline-block; padding: 1rem 2rem; background: #667eea; color: white; text-decoration: none; border-radius: 5px; transition: all 0.3s; }
        .btn:hover { background: #5a6fd8; transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>${description}</p>
        <a href="#" class="btn">ابدأ الآن</a>
    </div>
    <div class="content">
        <div class="section">
            <h2>مرحباً بكم</h2>
            <p>هذا موقع احترافي تم إنشاؤه باستخدام الذكاء الاصطناعي.</p>
        </div>
    </div>
    <div class="footer">
        <p>&copy; 2024 ${title}. جميع الحقوق محفوظة.</p>
    </div>
</body>
</html>`;
  }
};

// مساعد المحادثة
export const chatWithAI = async (message: string, conversationHistory: any[] = []) => {
  try {
    const messages = [
      {
        role: 'system',
        content: 'أنت مساعد ذكي مفيد ومتقدم. أجب بالعربية وكن مفيداً ودقيقاً ومفصلاً. قدم إجابات شاملة ومفيدة.'
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];
    
    return await openRouterRequest(messages);
  } catch (error) {
    console.error('Chat error:', error);
    return 'عذراً، حدث خطأ في المحادثة.';
  }
};

// البحث عن الألعاب بالذكاء الاصطناعي
export const searchGames = async (gameName: string, platform: string) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `أنت خبير في الألعاب. ابحث عن اللعبة المطلوبة وقدم معلومات مفصلة عنها بصيغة JSON مع الحقول التالية:
        {
          "name": "اسم اللعبة",
          "description": "وصف مفصل للعبة",
          "platform": "المنصة",
          "size": "حجم اللعبة",
          "rating": "التقييم من 5",
          "category": "فئة اللعبة",
          "releaseYear": "سنة الإصدار",
          "developer": "المطور",
          "downloadLink": "رابط التحميل إذا كان متاحاً مجاناً",
          "systemRequirements": "متطلبات النظام",
          "screenshots": ["روابط الصور"],
          "features": ["مميزات اللعبة"],
          "emulators": ["محاكيات مجانية لتشغيل اللعبة إذا لزم الأمر"]
        }`
      },
      {
        role: 'user',
        content: `ابحث عن لعبة "${gameName}" لمنصة ${platform}. قدم معلومات مفصلة وروابط تحميل مجانية إذا كانت متاحة، ومحاكيات مجانية إذا لزم الأمر.`
      }
    ];
    
    const result = await openRouterRequest(messages);
    
    // محاولة تحليل JSON
    try {
      return JSON.parse(result);
    } catch {
      // إذا فشل التحليل، إرجاع النتيجة كما هي
      return {
        name: gameName,
        description: result,
        platform: platform,
        size: "غير معروف",
        rating: 0,
        category: "متنوع",
        releaseYear: "غير معروف",
        developer: "غير معروف",
        downloadLink: "غير متاح",
        systemRequirements: "غير محدد",
        screenshots: [],
        features: [],
        emulators: []
      };
    }
  } catch (error) {
    console.error('Game search error:', error);
    return {
      name: gameName,
      description: 'عذراً، حدث خطأ في البحث عن اللعبة.',
      platform: platform,
      size: "غير معروف",
      rating: 0,
      category: "خطأ",
      releaseYear: "غير معروف",
      developer: "غير معروف",
      downloadLink: "غير متاح",
      systemRequirements: "غير محدد",
      screenshots: [],
      features: [],
      emulators: []
    };
  }
};
