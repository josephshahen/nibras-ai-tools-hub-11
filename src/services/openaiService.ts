import { supabase } from '@/integrations/supabase/client';

export const generateImageWithOpenAI = async (prompt: string, style: string): Promise<string> => {
  try {
    console.log('🎨 Calling Edge Function to generate image...');
    console.log('📝 Prompt:', prompt);
    console.log('🎭 Style:', style);
    
    const { data, error } = await supabase.functions.invoke('generate-image-openai', {
      body: { prompt, style }
    });

    if (error) {
      console.error('❌ Edge Function error:', error);
      throw new Error(`خطأ في الاتصال: ${error.message}`);
    }

    if (!data.success) {
      console.error('❌ OpenAI error:', data.error);
      throw new Error(data.details || data.error);
    }

    if (!data.imageUrl) {
      throw new Error('لم يتم إرجاع رابط الصورة من الخادم');
    }

    console.log('✅ Image generated successfully');
    return data.imageUrl;
  } catch (error) {
    console.error('❌ Error generating image:', error);
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
