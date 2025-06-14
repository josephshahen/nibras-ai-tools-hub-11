
import { supabase } from '@/integrations/supabase/client';

export const generateImageWithOpenAI = async (prompt: string, style: string): Promise<string> => {
  try {
    console.log('🎨 استدعاء Edge Function لتوليد الصورة...');
    console.log('📝 الوصف:', prompt);
    console.log('🎭 النمط:', style);
    
    const { data, error } = await supabase.functions.invoke('generate-image-openai', {
      body: { prompt, style }
    });

    if (error) {
      console.error('❌ خطأ في Edge Function:', error);
      throw new Error(`خطأ في الاتصال: ${error.message}`);
    }

    if (data.error) {
      console.error('❌ خطأ من OpenAI:', data.error);
      throw new Error(data.details || data.error);
    }

    if (!data.imageUrl) {
      throw new Error('لم يتم إرجاع رابط الصورة من الخادم');
    }

    console.log('✅ تم توليد الصورة بنجاح');
    return data.imageUrl;
  } catch (error) {
    console.error('❌ خطأ في توليد الصورة:', error);
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
    console.log('🌐 استدعاء Edge Function لتوليد الموقع...');
    console.log('📋 البيانات:', { title, description, type, color, editRequest });
    
    const { data, error } = await supabase.functions.invoke('generate-website-openai', {
      body: { title, description, type, color, editRequest }
    });

    if (error) {
      console.error('❌ خطأ في Edge Function:', error);
      throw new Error(`خطأ في الاتصال: ${error.message}`);
    }

    if (data.error) {
      console.error('❌ خطأ من OpenAI:', data.error);
      throw new Error(data.details || data.error);
    }

    if (!data.websiteCode) {
      throw new Error('لم يتم إرجاع كود الموقع من الخادم');
    }

    console.log('✅ تم توليد الموقع بنجاح، طول الكود:', data.websiteCode.length);
    return data.websiteCode;
  } catch (error) {
    console.error('❌ خطأ في توليد الموقع:', error);
    throw error;
  }
};
