import { supabase } from '@/integrations/supabase/client';

export const generateImageWithOpenAI = async (prompt: string, style: string): Promise<string> => {
  try {
    console.log('🎨 Starting image generation process...');
    console.log('📝 Original prompt:', prompt);
    console.log('🎭 Selected style:', style);
    
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('يرجى إدخال وصف للصورة');
    }

    const { data, error } = await supabase.functions.invoke('generate-image-openai', {
      body: { prompt: prompt.trim(), style }
    });

    console.log('📡 Edge Function response:', data);
    console.log('❌ Edge Function error:', error);

    if (error) {
      console.error('❌ Supabase Edge Function error:', error);
      throw new Error(`خطأ في الاتصال بالخادم: ${error.message}`);
    }

    if (!data) {
      throw new Error('لم يتم استلام رد من الخادم');
    }

    if (!data.success) {
      console.error('❌ OpenAI generation failed:', data);
      const errorMsg = data.error || 'فشل في توليد الصورة';
      const details = data.details ? ` - ${data.details}` : '';
      throw new Error(`${errorMsg}${details}`);
    }

    if (!data.imageUrl) {
      throw new Error('لم يتم إرجاع رابط الصورة من الخادم');
    }

    console.log('✅ Image generation completed successfully');
    console.log('🔗 Generated image URL exists:', !!data.imageUrl);
    
    return data.imageUrl;
  } catch (error) {
    console.error('❌ Error in generateImageWithOpenAI:', error);
    
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
    console.log('🌐 Calling Edge Function to generate website...');
    console.log('📋 Data:', { title, description, type, color, editRequest });
    
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
    throw error;
  }
};
