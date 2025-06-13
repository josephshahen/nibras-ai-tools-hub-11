
import { supabase } from '@/integrations/supabase/client';

export const generateImageWithOpenAI = async (prompt: string, style: string): Promise<string> => {
  try {
    console.log('🎨 استدعاء Edge Function لتوليد الصورة...');
    
    const { data, error } = await supabase.functions.invoke('generate-image-openai', {
      body: { prompt, style }
    });

    if (error) {
      console.error('خطأ في Edge Function:', error);
      throw new Error(error.message);
    }

    if (!data.imageUrl) {
      throw new Error('لم يتم إرجاع رابط الصورة');
    }

    return data.imageUrl;
  } catch (error) {
    console.error('خطأ في توليد الصورة:', error);
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
    
    const { data, error } = await supabase.functions.invoke('generate-website-openai', {
      body: { title, description, type, color, editRequest }
    });

    if (error) {
      console.error('خطأ في Edge Function:', error);
      throw new Error(error.message);
    }

    if (!data.websiteCode) {
      throw new Error('لم يتم إرجاع كود الموقع');
    }

    return data.websiteCode;
  } catch (error) {
    console.error('خطأ في توليد الموقع:', error);
    throw error;
  }
};
