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
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// خدمة Replicate لتوليد الصور
export const generateImageWithReplicate = async (prompt: string, style: string = 'realistic') => {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
      input: {
        prompt: `${prompt}, ${style} style, high quality, detailed`,
        negative_prompt: 'blurry, low quality, distorted',
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

// توليد الكود
export const generateCode = async (prompt: string, language: string) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `أنت مطور برمجيات خبير. أنشئ كود ${language} نظيف ومعلق باللغة العربية حسب الطلب.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];
    
    return await openRouterRequest(messages, 'deepseek/deepseek-coder');
  } catch (error) {
    console.error('Code generation error:', error);
    return 'عذراً، حدث خطأ في توليد الكود.';
  }
};

// توليد مواقع الويب
export const generateWebsite = async (title: string, description: string, type: string, color: string) => {
  try {
    const messages = [
      {
        role: 'system',
        content: 'أنت مطور مواقع ويب خبير. أنشئ كود HTML كامل مع CSS مدمج.'
      },
      {
        role: 'user',
        content: `أنشئ موقع ويب ${type} باسم "${title}" ووصف "${description}" بلون ${color}. يجب أن يكون الموقع متجاوب وجميل.`
      }
    ];
    
    return await openRouterRequest(messages);
  } catch (error) {
    console.error('Website generation error:', error);
    return 'عذراً، حدث خطأ في توليد الموقع.';
  }
};

// مساعد المحادثة
export const chatWithAI = async (message: string, conversationHistory: any[] = []) => {
  try {
    const messages = [
      {
        role: 'system',
        content: 'أنت مساعد ذكي مفيد. أجب بالعربية وكن مفيداً ودقيقاً.'
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
