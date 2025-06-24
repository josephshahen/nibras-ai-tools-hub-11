// OpenAI Service - Updated to use Gemini for website generation

import { generateWebsiteWithGemini, checkBackendHealth } from './geminiService';
import { supabase } from '@/integrations/supabase/client';

// Check if Gemini backend is available
let isGeminiAvailable = false;

// Initialize backend availability check
(async () => {
  isGeminiAvailable = await checkBackendHealth();
  console.log('🔍 Gemini Backend Status for OpenAI Service:', isGeminiAvailable ? 'Available' : 'Unavailable');
})();

export const generateImageWithOpenAI = async (prompt: string, style: string): Promise<string> => {
  try {
    console.log('🎨 بدء عملية توليد الصورة...');
    console.log('📝 الوصف الأصلي:', prompt);
    console.log('🎭 النمط المختار:', style);
    
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('يرجى إدخال وصف للصورة');
    }

    console.log('📡 إرسال طلب إلى Edge Function...');
    
    const { data, error } = await supabase.functions.invoke('generate-image-openai', {
      body: { prompt: prompt.trim(), style }
    });

    console.log('📦 رد Edge Function:', data);
    console.log('❌ خطأ Edge Function:', error);

    if (error) {
      console.error('❌ خطأ في Supabase Edge Function:', error);
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('خطأ في الاتصال بالخادم - تحقق من الإنترنت');
      } else if (error.message.includes('FunctionsHttpError')) {
        throw new Error('خطأ في خادم الوظائف - حاول مرة أخرى');
      } else {
        throw new Error(`خطأ في الاتصال: ${error.message}`);
      }
    }

    if (!data) {
      throw new Error('لم يتم استلام رد من الخادم');
    }

    if (!data.success) {
      console.error('❌ فشل في توليد الصورة:', data);
      const errorMsg = data.error || 'فشل في توليد الصورة';
      const details = data.details ? ` - ${data.details}` : '';
      throw new Error(`${errorMsg}${details}`);
    }

    if (!data.imageUrl) {
      throw new Error('لم يتم إرجاع رابط الصورة من الخادم');
    }

    console.log('✅ تم توليد الصورة بنجاح');
    console.log('🔗 رابط الصورة موجود:', !!data.imageUrl);
    
    return data.imageUrl;
  } catch (error) {
    console.error('❌ خطأ في generateImageWithOpenAI:', error);
    
    // تحسين رسائل الخطأ
    if (error.message.includes('insufficient_quota')) {
      throw new Error('انتهت حصة OpenAI API - يرجى التحقق من رصيدك');
    } else if (error.message.includes('invalid_api_key')) {
      throw new Error('مفتاح OpenAI API غير صالح - يرجى التحقق من الإعدادات');
    } else if (error.message.includes('content_policy_violation')) {
      throw new Error('المحتوى ينتهك سياسة OpenAI - يرجى تعديل الوصف');
    } else if (error.message.includes('rate_limit_exceeded')) {
      throw new Error('تم تجاوز حد الطلبات - يرجى المحاولة لاحقاً');
    }
    
    throw error;
  }
};

export const generateWebsiteWithOpenAI = async (
  title: string, 
  description: string, 
  type: string, 
  color: string,
  editRequest?: string
): Promise<string> => {
  try {
    console.log('🌐 Generating website...');
    console.log('📋 Data:', { title, description, type, color, editRequest });
    
    // Try Gemini first if available
    if (isGeminiAvailable) {
      console.log('🤖 Using Gemini for website generation...');
      return await generateWebsiteWithGemini(title, description, type, color, editRequest);
    }
    
    // Check if Gemini backend is available
    isGeminiAvailable = await checkBackendHealth();
    if (isGeminiAvailable) {
      console.log('🤖 Gemini backend reconnected, using Gemini...');
      return await generateWebsiteWithGemini(title, description, type, color, editRequest);
    }
    
    // Fallback to Supabase Edge Function (OpenAI)
    console.log('🔄 Falling back to OpenAI Edge Function...');
    
    const { data, error } = await supabase.functions.invoke('generate-website-openai', {
      body: { title, description, type, color, editRequest }
    });

    if (error) {
      console.error('❌ Edge Function error:', error);
      throw new Error(`خطأ في الاتصال: ${error.message}`);
    }

    if (data.error) {
      console.error('❌ OpenAI error:', data.error);
      throw new Error(data.details || data.error);
    }

    if (!data.websiteCode) {
      throw new Error('لم يتم إرجاع كود الموقع من الخادم');
    }

    console.log('✅ Website generated successfully, length of code:', data.websiteCode.length);
    return data.websiteCode;
  } catch (error) {
    console.error('❌ Error generating website:', error);
    
    // Provide a fallback HTML template
    const fallbackWebsite = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Cairo', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, ${color}22, ${color}11);
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            background: ${color};
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-bottom: 2rem;
        }
        h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        .content {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .error-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>${title}</h1>
        </div>
    </header>
    
    <div class="container">
        <div class="error-notice">
            <strong>ملاحظة:</strong> تم إنشاء هذا الموقع كنموذج أساسي بسبب عدم توفر خدمة الذكاء الاصطناعي حالياً.
        </div>
        
        <div class="content">
            <h2>مرحباً بكم في ${title}</h2>
            <p>${description}</p>
            <p>هذا موقع من نوع: ${type}</p>
            <p>يمكنك تطوير هذا الموقع وإضافة المزيد من المحتوى والميزات حسب احتياجاتك.</p>
        </div>
    </div>
</body>
</html>`;

    console.log('🔄 Using fallback website template');
    return fallbackWebsite;
  }
};