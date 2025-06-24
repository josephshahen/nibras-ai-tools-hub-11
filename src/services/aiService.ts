// AI Service - Updated to use Gemini as primary with OpenRouter fallback

import { 
  chatWithGemini, 
  translateWithGemini, 
  summarizeWithGemini, 
  generateWebsiteWithGemini,
  generateCodeWithGemini,
  searchGamesWithGemini,
  checkBackendHealth
} from './geminiService';

// Check if Gemini backend is available
let isGeminiAvailable = false;

// Initialize backend availability check
(async () => {
  isGeminiAvailable = await checkBackendHealth();
  console.log('🔍 Gemini Backend Status:', isGeminiAvailable ? 'Available' : 'Unavailable');
})();

// Fallback responses for when APIs are unavailable
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('مرحبا') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'مرحباً! أنا مساعدك الذكي. يمكنني مساعدتك في العديد من المهام مثل الترجمة، تلخيص النصوص، إنشاء المواقع، والبرمجة. كيف يمكنني مساعدتك اليوم؟';
  }
  
  if (lowerMessage.includes('برمجة') || lowerMessage.includes('كود') || lowerMessage.includes('programming')) {
    return 'يمكنني مساعدتك في البرمجة! استخدم أداة "مساعد البرمجة" من القائمة الرئيسية للحصول على مساعدة متخصصة في كتابة وتطوير الكود بلغات مختلفة.';
  }
  
  if (lowerMessage.includes('ترجمة') || lowerMessage.includes('translate')) {
    return 'للترجمة، يمكنك استخدام أداة "المترجم الفوري" من القائمة الرئيسية. تدعم الأداة أكثر من 100 لغة مع ترجمة فورية عالية الجودة.';
  }
  
  if (lowerMessage.includes('موقع') || lowerMessage.includes('website')) {
    return 'لإنشاء موقع ويب، استخدم أداة "مولد المواقع" من القائمة. يمكنها إنشاء مواقع احترافية كاملة بناءً على وصفك ومتطلباتك.';
  }
  
  if (lowerMessage.includes('صورة') || lowerMessage.includes('image')) {
    return 'لإنشاء الصور، استخدم أداة "مولد الصور" من القائمة الرئيسية. يمكنها إنشاء صور فنية وإبداعية بناءً على وصفك.';
  }
  
  return 'عذراً، أواجه صعوبة في الاتصال بخدمة الذكاء الاصطناعي حالياً. يمكنك تجربة الأدوات المختلفة المتاحة في الموقع مثل المترجم، مولد المواقع، مساعد البرمجة، ومولد الصور. أو حاول مرة أخرى لاحقاً.';
}

// Main chat function with Gemini primary and fallback
export async function chatWithAI(message: string, conversationHistory: any[] = []): Promise<string> {
  try {
    // Try Gemini first if available
    if (isGeminiAvailable) {
      console.log('🤖 Using Gemini for chat...');
      return await chatWithGemini(message, conversationHistory);
    }
    
    // If Gemini is not available, check again
    isGeminiAvailable = await checkBackendHealth();
    if (isGeminiAvailable) {
      console.log('🤖 Gemini backend reconnected, using Gemini...');
      return await chatWithGemini(message, conversationHistory);
    }
    
    // Fallback to local response
    console.log('🔄 Using fallback response...');
    return generateFallbackResponse(message);
    
  } catch (error) {
    console.error('❌ Chat error:', error);
    return generateFallbackResponse(message);
  }
}

// Translation function with Gemini
export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    if (isGeminiAvailable) {
      return await translateWithGemini(text, sourceLang, targetLang);
    }
    
    // Check if backend is available
    isGeminiAvailable = await checkBackendHealth();
    if (isGeminiAvailable) {
      return await translateWithGemini(text, sourceLang, targetLang);
    }
    
    throw new Error('خدمة الترجمة غير متاحة حالياً');
  } catch (error) {
    console.error('❌ Translation error:', error);
    throw new Error(`فشل في الترجمة: ${error.message}`);
  }
}

// Summarization function with Gemini
export async function summarizeText(text: string, length: string = 'medium'): Promise<string> {
  try {
    if (isGeminiAvailable) {
      return await summarizeWithGemini(text, length);
    }
    
    // Check if backend is available
    isGeminiAvailable = await checkBackendHealth();
    if (isGeminiAvailable) {
      return await summarizeWithGemini(text, length);
    }
    
    throw new Error('خدمة التلخيص غير متاحة حالياً');
  } catch (error) {
    console.error('❌ Summarization error:', error);
    throw new Error(`فشل في التلخيص: ${error.message}`);
  }
}

// Code generation function with Gemini
export async function generateCodeWithOpenAI(prompt: string, language: string, editRequest?: string): Promise<string> {
  try {
    if (isGeminiAvailable) {
      return await generateCodeWithGemini(prompt, language, editRequest);
    }
    
    // Check if backend is available
    isGeminiAvailable = await checkBackendHealth();
    if (isGeminiAvailable) {
      return await generateCodeWithGemini(prompt, language, editRequest);
    }
    
    // Fallback code example
    return `// كود ${language} للمطلب: ${prompt}
// عذراً، خدمة توليد الكود غير متاحة حالياً
// يرجى المحاولة مرة أخرى لاحقاً

console.log("مرحباً! هذا مثال بسيط");
// TODO: تنفيذ ${prompt}`;
  } catch (error) {
    console.error('❌ Code generation error:', error);
    throw new Error(`فشل في إنشاء الكود: ${error.message}`);
  }
}

// Games search function with Gemini
export async function searchGames(gameName: string, platform: string): Promise<any> {
  try {
    if (isGeminiAvailable) {
      return await searchGamesWithGemini(gameName, platform);
    }
    
    // Check if backend is available
    isGeminiAvailable = await checkBackendHealth();
    if (isGeminiAvailable) {
      return await searchGamesWithGemini(gameName, platform);
    }
    
    // Fallback game info
    return {
      name: gameName,
      description: `معلومات عن لعبة ${gameName} غير متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.`,
      platform: platform,
      rating: 0,
      size: 'غير معروف',
      category: 'لعبة',
      releaseYear: 'غير معروف',
      developer: 'غير معروف',
      publisher: 'غير معروف',
      downloadLinks: {
        official: `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`,
        free: 'غير متوفر',
        demos: 'تحقق من المتجر الرسمي'
      },
      features: ['معلومات غير متاحة حالياً'],
      alternatives: ['ألعاب مشابهة متاحة في المتاجر الرسمية']
    };
  } catch (error) {
    console.error('❌ Games search error:', error);
    throw new Error(`فشل في البحث عن اللعبة: ${error.message}`);
  }
}