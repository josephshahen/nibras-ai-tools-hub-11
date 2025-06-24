// Gemini API Service - Local Backend Integration

const BACKEND_URL = 'http://localhost:3001';

// Helper function to make API requests
async function makeRequest(endpoint: string, data: any) {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
}

// Chat with Gemini AI
export async function chatWithGemini(message: string, history: any[] = []): Promise<string> {
  try {
    console.log('🤖 Sending message to Gemini:', message);
    
    const data = await makeRequest('/api/chatbot', {
      message,
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    });

    console.log('✅ Received response from Gemini');
    return data.reply;
  } catch (error) {
    console.error('❌ Gemini chat error:', error);
    throw new Error(`فشل في الاتصال بـ Gemini: ${error.message}`);
  }
}

// Translate text using Gemini
export async function translateWithGemini(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    console.log('🌐 Translating with Gemini:', { text, sourceLang, targetLang });
    
    const data = await makeRequest('/api/translator', {
      text,
      sourceLang,
      targetLang
    });

    console.log('✅ Translation completed');
    return data.translatedText;
  } catch (error) {
    console.error('❌ Gemini translation error:', error);
    throw new Error(`فشل في الترجمة: ${error.message}`);
  }
}

// Summarize text using Gemini
export async function summarizeWithGemini(article: string, summaryLength: string = 'medium'): Promise<string> {
  try {
    console.log('📝 Summarizing with Gemini:', { length: summaryLength });
    
    const data = await makeRequest('/api/summarizer', {
      article,
      summaryLength
    });

    console.log('✅ Summarization completed');
    return data.summary;
  } catch (error) {
    console.error('❌ Gemini summarization error:', error);
    throw new Error(`فشل في التلخيص: ${error.message}`);
  }
}

// Generate website using Gemini
export async function generateWebsiteWithGemini(
  title: string, 
  description: string, 
  type: string, 
  color: string,
  editRequest?: string
): Promise<string> {
  try {
    console.log('🌐 Generating website with Gemini:', { title, type, color });
    
    const data = await makeRequest('/api/website-generator', {
      title,
      description,
      type,
      color,
      editRequest
    });

    console.log('✅ Website generation completed');
    return data.websiteCode;
  } catch (error) {
    console.error('❌ Gemini website generation error:', error);
    throw new Error(`فشل في إنشاء الموقع: ${error.message}`);
  }
}

// Generate code using Gemini
export async function generateCodeWithGemini(prompt: string, language: string, editRequest?: string): Promise<string> {
  try {
    console.log('💻 Generating code with Gemini:', { prompt, language });
    
    const data = await makeRequest('/api/code-assistant', {
      prompt,
      language,
      editRequest
    });

    console.log('✅ Code generation completed');
    return data.code;
  } catch (error) {
    console.error('❌ Gemini code generation error:', error);
    throw new Error(`فشل في إنشاء الكود: ${error.message}`);
  }
}

// Search for games using Gemini
export async function searchGamesWithGemini(gameName: string, platform: string): Promise<any> {
  try {
    console.log('🎮 Searching games with Gemini:', { gameName, platform });
    
    const data = await makeRequest('/api/games-search', {
      gameName,
      platform
    });

    console.log('✅ Game search completed');
    return data;
  } catch (error) {
    console.error('❌ Gemini game search error:', error);
    throw new Error(`فشل في البحث عن اللعبة: ${error.message}`);
  }
}

// Generate image description using Gemini (for use with other image generation APIs)
export async function generateImageDescriptionWithGemini(prompt: string, style: string): Promise<string> {
  try {
    console.log('🎨 Generating image description with Gemini:', { prompt, style });
    
    const data = await makeRequest('/api/image-generator', {
      prompt,
      style
    });

    console.log('✅ Image description generated');
    return data.imageDescription;
  } catch (error) {
    console.error('❌ Gemini image description error:', error);
    throw new Error(`فشل في وصف الصورة: ${error.message}`);
  }
}

// Check backend health
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
    return false;
  }
}