// خدمة الذكاء الاصطناعي المحدثة مع APIs المتقدمة
const DEEPAI_API_KEY = '21d940e0-8ebc-4413-8111-c4ab3e6d1f71';
const OPENAI_API_KEY = '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';
const BUILDER_IO_API_KEY = 'bb209db71e62412dbe0114bdae18fd15';
const OPENROUTER_API_KEY = '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';
const REPLICATE_API_KEY = 'r8_crQmT4Z2cEljF7RKmDoiZQJ9jnTltXu0Q0REm';
const HUGGINGFACE_API_KEY = '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';

// خدمة DeepAI المتطورة لتوليد الصور عالية الجودة
export const generateImageWithDeepAI = async (prompt: string, style: string = 'realistic') => {
  // تحسين الوصف حسب النمط المطلوب
  let enhancedPrompt = prompt;
  
  switch (style) {
    case 'anime':
      enhancedPrompt = `anime art style, highly detailed anime illustration, ${prompt}, studio quality, vibrant anime colors, beautiful anime character design, manga style, 4K anime artwork`;
      break;
    case 'cartoon':
      enhancedPrompt = `cartoon style illustration, ${prompt}, colorful cartoon art, disney pixar style, 3D cartoon rendering, animated character design, bright and cheerful colors`;
      break;
    case 'digital-art':
      enhancedPrompt = `digital art masterpiece, ${prompt}, concept art, artstation trending, highly detailed digital painting, professional digital artwork, fantasy art, sci-fi art`;
      break;
    case 'oil-painting':
      enhancedPrompt = `oil painting style, ${prompt}, classical art technique, renaissance painting style, detailed brush strokes, museum quality artwork, fine art painting`;
      break;
    case 'watercolor':
      enhancedPrompt = `watercolor painting, ${prompt}, soft watercolor technique, flowing colors, artistic watercolor style, delicate color blending, traditional watercolor art`;
      break;
    default: // realistic
      enhancedPrompt = `photorealistic, ${prompt}, ultra high resolution, professional photography, perfect lighting, sharp focus, 8K quality, DSLR camera, award winning photography`;
  }

  try {
    const formData = new FormData();
    formData.append('text', enhancedPrompt);

    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'Api-Key': DEEPAI_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`DeepAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.output_url;
  } catch (error) {
    console.error('DeepAI generation error:', error);
    // استخدام Hugging Face كبديل
    return generateImageWithHuggingFace(prompt, style);
  }
};

// خدمة OpenAI Codex المتطورة لتوليد الأكواد
export const generateCodeWithOpenAI = async (prompt: string, language: string) => {
  const languageSpecs = {
    javascript: 'JavaScript ES2023 with modern syntax and best practices',
    python: 'Python 3.11+ with type hints and best practices',
    react: 'React 18+ with TypeScript, hooks, and modern patterns',
    html: 'HTML5 semantic markup with accessibility features',
    css: 'CSS3 with modern features, Grid, Flexbox, and animations',
    php: 'PHP 8.2+ with OOP principles and modern syntax',
    java: 'Java 17+ with modern features and best practices',
    csharp: 'C# 11+ with .NET 7+ features',
    sql: 'Modern SQL with optimization and indexing strategies',
    nodejs: 'Node.js 18+ with TypeScript and Express.js'
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert software developer specialized in ${languageSpecs[language as keyof typeof languageSpecs] || language}. 
            Create professional, production-ready code with:
            
            1. Complete, runnable code
            2. Comprehensive Arabic comments
            3. Error handling and validation
            4. Security best practices
            5. Performance optimization
            6. Usage examples
            7. Unit tests when appropriate
            8. Complete documentation
            
            Make the code:
            - Maintainable and scalable
            - Efficient and optimized
            - Following industry standards
            - Well-documented and explained`
          },
          {
            role: 'user',
            content: `Create advanced, professional ${language} code for: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Codex error:', error);
    // استخدام الخدمة البديلة
    return generateCodeFallback(prompt, language);
  }
};

// خدمة Builder.io المتطورة لتوليد المواقع
export const generateWebsiteWithBuilderIO = async (title: string, description: string, type: string, color: string) => {
  try {
    const prompt = `Create a professional ${type} website with:
    - Title: ${title}
    - Description: ${description}
    - Primary color: ${color}
    - Modern responsive design
    - Interactive elements
    - Professional layout
    - SEO optimized
    - Mobile-first approach`;

    const response = await fetch('https://builder.io/api/v1/ai/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BUILDER_IO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        type: 'website',
        format: 'html',
        includeStyles: true,
        includeScripts: true,
        responsive: true,
        modern: true
      }),
    });

    if (!response.ok) {
      throw new Error(`Builder.io API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.html || data.content || generateAdvancedWebsiteFallback(title, description, type, color);
  } catch (error) {
    console.error('Builder.io generation error:', error);
    return generateAdvancedWebsiteFallback(title, description, type, color);
  }
};

// خدمة احتياطية محسنة لتوليد الأكواد
const generateCodeFallback = (prompt: string, language: string) => {
  const templates = {
    javascript: `// ${prompt}
// Generated JavaScript Code

// Advanced ${prompt} implementation
class ${prompt.replace(/\s+/g, '')}Manager {
  constructor() {
    this.data = [];
    this.config = {
      // Configuration options
    };
  }

  // Main functionality method
  async execute() {
    try {
      // Implementation logic here
      console.log('${prompt} executed successfully');
      return this.processData();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  // Data processing method
  processData() {
    return this.data.map(item => {
      // Process each item
      return {
        ...item,
        processed: true,
        timestamp: new Date().toISOString()
      };
    });
  }

  // Validation method
  validate(input) {
    if (!input) {
      throw new Error('Input is required');
    }
    return true;
  }
}

// Usage example
const manager = new ${prompt.replace(/\s+/g, '')}Manager();
manager.execute().then(result => {
  console.log('Result:', result);
});`,

    python: `# ${prompt}
# Generated Python Code

import typing
from datetime import datetime
import asyncio

class ${prompt.replace(/\s+/g, '')}Manager:
    """Advanced ${prompt} implementation"""
    
    def __init__(self):
        self.data: typing.List[typing.Dict] = []
        self.config: typing.Dict[str, typing.Any] = {}
    
    async def execute(self) -> typing.List[typing.Dict]:
        """Main execution method"""
        try:
            print(f"${prompt} executed successfully")
            return await self.process_data()
        except Exception as error:
            print(f"Error: {error}")
            raise
    
    async def process_data(self) -> typing.List[typing.Dict]:
        """Process data asynchronously"""
        processed_data = []
        for item in self.data:
            processed_item = {
                **item,
                'processed': True,
                'timestamp': datetime.now().isoformat()
            }
            processed_data.append(processed_item)
        return processed_data
    
    def validate(self, input_data: typing.Any) -> bool:
        """Validate input data"""
        if not input_data:
            raise ValueError("Input is required")
        return True

# Usage example
async def main():
    manager = ${prompt.replace(/\s+/g, '')}Manager()
    result = await manager.execute()
    print(f"Result: {result}")

if __name__ == "__main__":
    asyncio.run(main())`
  };

  return templates[language as keyof typeof templates] || `// ${prompt}\n// Code implementation for ${language}\n\n// TODO: Implement ${prompt}`;
};

// خدمة احتياطية محسنة لتوليد المواقع
const generateAdvancedWebsiteFallback = (title: string, description: string, type: string, color: string) => {
  const colorMap: { [key: string]: { primary: string; secondary: string; accent: string } } = {
    blue: { primary: '#3B82F6', secondary: '#1D4ED8', accent: '#60A5FA' },
    purple: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
    green: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
    red: { primary: '#EF4444', secondary: '#DC2626', accent: '#F87171' },
    orange: { primary: '#F97316', secondary: '#EA580C', accent: '#FB923C' },
    pink: { primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' },
    teal: { primary: '#14B8A6', secondary: '#0D9488', accent: '#5EEAD4' },
    indigo: { primary: '#6366F1', secondary: '#4F46E5', accent: '#818CF8' }
  };

  const colors = colorMap[color] || colorMap.blue;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --primary: ${colors.primary};
            --secondary: ${colors.secondary};
            --accent: ${colors.accent};
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.7; 
            color: #333;
            overflow-x: hidden;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        
        /* Header Styles */
        .header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            position: relative;
            overflow: hidden;
            min-height: 100vh;
            display: flex;
            align-items: center;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
            animation: rotate 20s linear infinite;
        }
        
        .nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            padding: 1rem 0;
            transition: all 0.3s ease;
        }
        
        .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #333;
        }
        
        .logo { 
            font-size: 1.8rem; 
            font-weight: bold; 
            color: var(--primary);
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: #333;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            position: relative;
        }
        
        .nav-links a:hover {
            color: var(--primary);
        }
        
        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary);
            transition: width 0.3s;
        }
        
        .nav-links a:hover::after {
            width: 100%;
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .hero h1 {
            font-size: clamp(3rem, 8vw, 6rem);
            margin-bottom: 2rem;
            background: linear-gradient(45deg, #fff, var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: slideInUp 1s ease-out;
        }
        
        .hero p {
            font-size: 1.5rem;
            margin-bottom: 3rem;
            opacity: 0.95;
            animation: slideInUp 1s ease-out 0.3s both;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            animation: slideInUp 1s ease-out 0.6s both;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1.2rem 2.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .btn-primary {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
        }
        
        .btn-primary:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        
        .btn-secondary {
            background: white;
            color: var(--primary);
            border: 2px solid white;
        }
        
        .btn-secondary:hover {
            background: var(--primary);
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        
        /* Features Section */
        .features {
            padding: 8rem 0;
            background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
        }
        
        .section-title {
            text-align: center;
            font-size: 3rem;
            margin-bottom: 4rem;
            color: var(--primary);
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            border-radius: 2px;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 3rem;
            margin-top: 4rem;
        }
        
        .feature-card {
            background: white;
            padding: 3rem 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
        }
        
        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        
        .feature-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            margin-bottom: 2rem;
        }
        
        .feature-card h3 {
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            color: var(--primary);
        }
        
        .feature-card p {
            color: #666;
            line-height: 1.8;
            font-size: 1.1rem;
        }
        
        /* About Section */
        .about {
            padding: 8rem 0;
            background: white;
        }
        
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }
        
        .about-text h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: var(--primary);
        }
        
        .about-text p {
            font-size: 1.2rem;
            line-height: 1.8;
            color: #666;
            margin-bottom: 2rem;
        }
        
        .about-image {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        
        .about-image img {
            width: 100%;
            height: 400px;
            object-fit: cover;
        }
        
        /* Footer */
        .footer {
            background: linear-gradient(135deg, #1a1a1a, #333);
            color: white;
            padding: 4rem 0 2rem;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
            margin-bottom: 3rem;
        }
        
        .footer-section h3 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: var(--accent);
        }
        
        .footer-section p,
        .footer-section a {
            color: #ccc;
            text-decoration: none;
            line-height: 1.8;
            transition: color 0.3s;
        }
        
        .footer-section a:hover {
            color: var(--accent);
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid #444;
            color: #999;
        }
        
        .social-links {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .social-links a {
            width: 40px;
            height: 40px;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.3s ease;
        }
        
        .social-links a:hover {
            background: var(--accent);
            transform: translateY(-3px);
        }
        
        /* Animations */
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .nav-links { display: none; }
            .hero h1 { font-size: 3rem; }
            .hero p { font-size: 1.2rem; }
            .cta-buttons { flex-direction: column; align-items: center; }
            .features-grid { grid-template-columns: 1fr; }
            .about-content { grid-template-columns: 1fr; }
            .footer-content { grid-template-columns: 1fr; }
        }
        
        /* Scroll Animations */
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <nav class="nav">
        <div class="container">
            <div class="nav-content">
                <div class="logo">${title}</div>
                <ul class="nav-links">
                    <li><a href="#home">الرئيسية</a></li>
                    <li><a href="#about">عنا</a></li>
                    <li><a href="#services">خدماتنا</a></li>
                    <li><a href="#contact">اتصل بنا</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <header class="header" id="home">
        <div class="container">
            <div class="hero-content">
                <h1>${title}</h1>
                <p>${description}</p>
                <div class="cta-buttons">
                    <a href="#services" class="btn btn-primary">
                        <i class="fas fa-rocket"></i>
                        ابدأ الآن
                    </a>
                    <a href="#about" class="btn btn-secondary">
                        <i class="fas fa-info-circle"></i>
                        اعرف المزيد
                    </a>
                </div>
            </div>
        </div>
    </header>

    <section class="features" id="services">
        <div class="container">
            <h2 class="section-title">خدماتنا المميزة</h2>
            <div class="features-grid">
                <div class="feature-card fade-in">
                    <div class="feature-icon">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <h3>أداء فائق السرعة</h3>
                    <p>نضمن لك أداءً استثنائياً وسرعة عالية في جميع خدماتنا مع أحدث التقنيات المتطورة.</p>
                </div>
                
                <div class="feature-card fade-in">
                    <div class="feature-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3>أمان وحماية</h3>
                    <p>نوفر أعلى مستويات الأمان والحماية لبياناتك مع أحدث بروتوكولات الأمان العالمية.</p>
                </div>
                
                <div class="feature-card fade-in">
                    <div class="feature-icon">
                        <i class="fas fa-headset"></i>
                    </div>
                    <h3>دعم على مدار الساعة</h3>
                    <p>فريق دعم متخصص ومتاح 24/7 لمساعدتك وحل جميع استفساراتك بسرعة وكفاءة.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="about" id="about">
        <div class="container">
            <div class="about-content">
                <div class="about-text">
                    <h2>من نحن؟</h2>
                    <p>نحن فريق متخصص من الخبراء المبدعين نعمل على تقديم أفضل الحلول التقنية المبتكرة. هدفنا هو مساعدتك على تحقيق أهدافك وتطوير أعمالك بأحدث التقنيات.</p>
                    <p>مع سنوات من الخبرة والإبداع، نفخر بتقديم خدمات عالية الجودة تلبي توقعاتكم وتفوقها.</p>
                    <a href="#contact" class="btn btn-primary">
                        <i class="fas fa-envelope"></i>
                        تواصل معنا
                    </a>
                </div>
                <div class="about-image">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="فريق العمل">
                </div>
            </div>
        </div>
    </section>

    <footer class="footer" id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h3>روابط مهمة</h3>
                    <a href="#home">الرئيسية</a><br>
                    <a href="#about">عنا</a><br>
                    <a href="#services">خدماتنا</a><br>
                    <a href="#contact">اتصل بنا</a>
                </div>
                
                <div class="footer-section">
                    <h3>تواصل معنا</h3>
                    <p><i class="fas fa-phone"></i> +966 12 345 6789</p>
                    <p><i class="fas fa-envelope"></i> info@${title.toLowerCase()}.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> الرياض، المملكة العربية السعودية</p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 ${title}. جميع الحقوق محفوظة.</p>
                <p>تم إنشاؤه بواسطة الذكاء الاصطناعي المتطور</p>
            </div>
        </div>
    </footer>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Navigation background on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.nav');
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(255,255,255,0.98)';
                nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                nav.style.background = 'rgba(255,255,255,0.95)';
                nav.style.boxShadow = 'none';
            }
        });

        // Dynamic text animation
        const title = document.querySelector('.hero h1');
        if (title) {
            title.style.backgroundSize = '200% 200%';
            title.style.animation = 'slideInUp 1s ease-out, gradientShift 3s ease-in-out infinite';
        }

        // Add gradient shift animation
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
        \`;
        document.head.appendChild(style);
    </script>
</body>
</html>`;
};

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

// خدمة Hugging Face لتوليد الصور المحسنة والمتطورة
export const generateImageWithHuggingFace = async (prompt: string, style: string = 'realistic') => {
  // استخدام DeepAI كأولوية أولى
  try {
    return await generateImageWithDeepAI(prompt, style);
  } catch (error) {
    console.log('DeepAI failed, trying Hugging Face...');
    
    // تحسين الوصف حسب النمط المطلوب مع إضافات متقدمة
    let enhancedPrompt = prompt;
    
    switch (style) {
      case 'anime':
        enhancedPrompt = `masterpiece, best quality, highly detailed anime art, ${prompt}, beautiful anime illustration, studio quality, vibrant colors, perfect composition, 8k resolution, detailed character design, anime style masterpiece`;
        break;
      case 'cartoon':
        enhancedPrompt = `high quality cartoon art, ${prompt}, colorful cartoon illustration, disney pixar style, 3D rendered, professional animation quality, vibrant colors, perfect lighting, masterpiece cartoon art`;
        break;
      case 'digital-art':
        enhancedPrompt = `digital art masterpiece, ${prompt}, concept art, artstation trending, highly detailed digital painting, professional digital art, perfect composition, dramatic lighting, 8k quality`;
        break;
      case 'oil-painting':
        enhancedPrompt = `oil painting masterpiece, ${prompt}, classical art style, renaissance quality, detailed brush strokes, museum quality, fine art, perfect technique, dramatic lighting`;
        break;
      case 'watercolor':
        enhancedPrompt = `watercolor painting masterpiece, ${prompt}, delicate watercolor technique, soft flowing colors, artistic watercolor, professional quality, beautiful color blending`;
        break;
      default: // realistic
        enhancedPrompt = `photorealistic masterpiece, ${prompt}, ultra high resolution, professional photography, perfect lighting, sharp focus, 8k quality, DSLR camera quality, award winning photography`;
    }

    // استخدام نماذج متعددة للحصول على أفضل النتائج
    const models = [
      'runwayml/stable-diffusion-v1-5',
      'stabilityai/stable-diffusion-2-1',
      'CompVis/stable-diffusion-v1-4'
    ];

    for (const model of models) {
      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: enhancedPrompt,
            parameters: {
              num_inference_steps: 50,
              guidance_scale: 7.5,
              width: 512,
              height: 512,
              negative_prompt: "blurry, low quality, distorted, ugly, deformed, bad anatomy, bad proportions"
            },
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          return imageUrl;
        }
      } catch (error) {
        console.log(`فشل النموذج ${model}، جاري المحاولة مع النموذج التالي...`);
        continue;
      }
    }

    throw new Error('فشل في توليد الصورة من جميع النماذج');
  }
};

// خدمة Replicate لتوليد الصور (احتياطي)
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

// ترجمة النصوص باستخدام الذكاء الاصطناعي المحسن
export const translateText = async (text: string, sourceLang: string, targetLang: string) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `أنت مترجم محترف خبير في جميع اللغات. ترجم النص بدقة عالية من ${sourceLang} إلى ${targetLang}. 
        احرص على:
        1. الحفاظ على المعنى الأصلي
        2. استخدام التعبيرات الطبيعية في اللغة المستهدفة
        3. مراعاة السياق الثقافي
        4. أرجع فقط النص المترجم بدون إضافات`
      },
      {
        role: 'user',
        content: text
      }
    ];
    
    return await openRouterRequest(messages, 'meta-llama/llama-3.2-3b-instruct:free');
  } catch (error) {
    console.error('Translation error:', error);
    return `خطأ في الترجمة: ${text}`;
  }
};

// تلخيص المقالات المحسن
export const summarizeText = async (text: string, length: string = 'medium') => {
  try {
    const lengthInstructions = {
      short: 'ملخص مختصر جداً في 2-3 جمل',
      medium: 'ملخص متوسط في فقرة واحدة',
      long: 'ملخص مفصل يغطي جميع النقاط المهمة'
    };

    const messages = [
      {
        role: 'system',
        content: `أنت خبير في تلخيص النصوص بطريقة احترافية. لخص النص التالي بطريقة ${lengthInstructions[length as keyof typeof lengthInstructions]}. 
        احرص على:
        1. استخراج النقاط الرئيسية
        2. الحفاظ على المعنى الأساسي
        3. استخدام لغة واضحة ومفهومة
        4. تنظيم الأفكار بطريقة منطقية`
      },
      {
        role: 'user',
        content: `لخص هذا النص: ${text}`
      }
    ];
    
    return await openRouterRequest(messages, 'meta-llama/llama-3.2-3b-instruct:free');
  } catch (error) {
    console.error('Summarization error:', error);
    return 'عذراً، حدث خطأ في تلخيص النص.';
  }
};

// توليد الكود المحسن والمتطور
export const generateCode = async (prompt: string, language: string) => {
  try {
    return await generateCodeWithOpenAI(prompt, language);
  } catch (error) {
    console.log('OpenAI failed, using fallback...');
    
    const languageSpecs = {
      javascript: 'JavaScript ES6+ مع أفضل الممارسات الحديثة',
      python: 'Python 3.x مع PEP 8 standards',
      react: 'React مع TypeScript و hooks حديثة',
      html: 'HTML5 semantic مع accessibility',
      css: 'CSS3 مع flexbox/grid و animations',
      php: 'PHP 8+ مع OOP و best practices',
      java: 'Java مع أفضل الممارسات',
      csharp: 'C# مع .NET Core',
      sql: 'SQL محسن مع indexing',
      nodejs: 'Node.js مع Express و TypeScript'
    };

    const messages = [
      {
        role: 'system',
        content: `أنت مطور برمجيات خبير متخصص في ${languageSpecs[language as keyof typeof languageSpecs] || language}. 
        أنشئ كود احترافي ومتطور يتضمن:
        
        1. كود كامل وجاهز للتشغيل
        2. تعليقات مفصلة باللغة العربية
        3. معالجة شاملة للأخطاء
        4. أفضل الممارسات والأمان
        5. تحسين الأداء
        6. أمثلة للاستخدام
        7. اختبارات إذا كان مناسباً
        8. توثيق شامل للكود
        
        اجعل الكود:
        - قابل للصيانة والتطوير
        - فعال ومحسن
        - يتبع معايير الصناعة
        - مع شرح لكل جزء مهم`
      },
      {
        role: 'user',
        content: `أنشئ كود ${language} متطور ومحترف للمطلب التالي: ${prompt}`
      }
    ];
    
    return await openRouterRequest(messages, 'deepseek/deepseek-coder');
  }
};

// توليد مواقع الويب المتطورة والاحترافية
export const generateWebsite = async (title: string, description: string, type: string, color: string) => {
  try {
    return await generateWebsiteWithBuilderIO(title, description, type, color);
  } catch (error) {
    console.log('Builder.io failed, using enhanced fallback...');
    
    const typeSpecs = {
      business: 'موقع شركة احترافي مع sections متكاملة',
      portfolio: 'معرض أعمال فني مع gallery تفاعلي',
      blog: 'مدونة عصرية مع نظام مقالات',
      landing: 'صفحة تسويقية محسنة للتحويلات',
      restaurant: 'موقع مطعم مع قائمة طعام وحجوزات',
      ecommerce: 'متجر إلكتروني مع عربة التسوق'
    };

    const messages = [
      {
        role: 'system',
        content: `أنت مطور مواقع ويب خبير متخصص في التصميم الحديث. أنشئ موقع ويب ${typeSpecs[type as keyof typeof typeSpecs] || type} احترافي ومتطور يتضمن:

        **HTML5 Structure:**
        - Semantic HTML elements
        - Meta tags محسنة للSEO
        - Open Graph tags
        - Structured data markup
        - Accessibility attributes

        **CSS3 Styling:**
        - CSS Grid و Flexbox layouts
        - CSS Variables للألوان والمقاسات
        - Smooth animations و transitions
        - Responsive design للجميع الأجهزة
        - Dark/Light mode support
        - Modern typography
        - Hover effects متطورة

        **JavaScript Functionality:**
        - Interactive navigation
        - Smooth scrolling
        - Form validation
        - Modal windows
        - Image galleries
        - Loading animations
        - Mobile menu
        - Performance optimizations

        **Advanced Features:**
        - PWA capabilities
        - Service worker للcaching
        - Lazy loading للصور
        - Intersection Observer
        - CSS animations on scroll
        - Contact forms
        - Social media integration

        اجعل الموقع:
        - سريع التحميل ومحسن
        - جميل ومصمم بطريقة عصرية
        - سهل الاستخدام
        - محسن لمحركات البحث
        - متوافق مع جميع المتصفحات`
      },
      {
        role: 'user',
        content: `أنشئ موقع ويب ${type} متطور واحترافي وجميل:
        - الاسم: ${title}
        - الوصف: ${description}
        - اللون الأساسي: ${color}
        - يجب أن يكون الموقع متكامل ومذهل بصرياً وجاهز للنشر الاحترافي`
      }
    ];
    
    return await openRouterRequest(messages, 'deepseek/deepseek-coder');
  }
};

// مساعد المحادثة المحسن
export const chatWithAI = async (message: string, conversationHistory: any[] = []) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `أنت مساعد ذكي متطور ومفيد جداً. تتميز بـ:
        
        1. المعرفة الواسعة في جميع المجالات
        2. القدرة على التحليل العميق
        3. تقديم إجابات شاملة ومفيدة
        4. الإبداع في حل المشاكل
        5. فهم السياق بدقة
        
        أجب بالعربية بطريقة:
        - مفصلة وشاملة
        - منظمة ومنطقية  
        - مفيدة وعملية
        - ودية ومهنية
        - مع أمثلة عملية عند الحاجة`
      },
      ...conversationHistory.slice(-10), // آخر 10 رسائل للسياق
      {
        role: 'user',
        content: message
      }
    ];
    
    return await openRouterRequest(messages, 'meta-llama/llama-3.2-3b-instruct:free');
  } catch (error) {
    console.error('Chat error:', error);
    return 'عذراً، حدث خطأ في المحادثة. يرجى المحاولة مرة أخرى.';
  }
};

// البحث المتطور عن الألعاب مع معلومات شاملة
export const searchGames = async (gameName: string, platform: string) => {
  try {
    const messages = [
      {
        role: 'system',
        content: `أنت خبير عالمي في الألعاب مع معرفة شاملة بجميع الألعاب في كل المنصات. 
        ابحث عن اللعبة المطلوبة وقدم معلومات مفصلة ودقيقة بصيغة JSON مع الحقول التالية:
        
        {
          "name": "الاسم الكامل للعبة",
          "description": "وصف مفصل وشامل للعبة مع التقييم الشخصي",
          "platform": "المنصة المحددة",
          "size": "الحجم الدقيق بالGB أو MB",
          "rating": "التقييم من 10",
          "metacriticScore": "نقاط Metacritic",
          "category": "النوع/الفئة التفصيلية",
          "releaseYear": "سنة الإصدار الدقيقة",
          "developer": "الشركة المطورة",
          "publisher": "الشركة الناشرة",
          "downloadLinks": {
            "official": "الروابط الرسمية",
            "free": "روابط مجانية قانونية",
            "demos": "روابط تجريبية"
          },
          "systemRequirements": {
            "minimum": "الحد الأدنى للمتطلبات",
            "recommended": "المتطلبات المنصوح بها"
          },
          "screenshots": ["روابط صور اللعبة"],
          "gameplay": {
            "genre": "النوع التفصيلي",
            "modes": ["أنماط اللعب"],
            "difficulty": "مستوى الصعوبة",
            "duration": "مدة اللعب"
          },
          "features": ["المميزات الرئيسية مفصلة"],
          "pros": ["نقاط القوة"],
          "cons": ["نقاط الضعف"],
          "dlc": ["الإضافات المتوفرة"],
          "multiplayer": "معلومات اللعب الجماعي",
          "updates": "آخر التحديثات",
          "mods": ["التعديلات المتوفرة"],
          "emulators": {
            "windows": ["محاكيات ويندوز"],
            "android": ["محاكيات أندرويد"],
            "general": ["محاكيات عامة"]
          },
          "alternatives": ["ألعاب مشابهة"],
          "price": "السعر الحالي",
          "ageRating": "التصنيف العمري",
          "languages": ["اللغات المدعومة"],
          "awards": ["الجوائز التي حصلت عليها"]
        }
        
        كن دقيقاً ومفصلاً في كل معلومة. إذا لم تكن متأكداً من معلومة، اذكر "غير مؤكد" بدلاً من التخمين.`
      },
      {
        role: 'user',
        content: `ابحث بدقة عن لعبة "${gameName}" لمنصة ${platform}. 
        أريد معلومات شاملة ومفصلة تشمل:
        - معلومات تقنية دقيقة
        - روابط تحميل متنوعة (رسمية ومجانية)
        - متطلبات النظام الكاملة
        - تقييم شامل ونقدي
        - محاكيات لكل المنصات
        - ألعاب بديلة مشابهة
        - جميع المعلومات الإضافية المفيدة`
      }
    ];
    
    const result = await openRouterRequest(messages, 'meta-llama/llama-3.2-3b-instruct:free');
    
    try {
      return JSON.parse(result);
    } catch {
      // في حالة فشل parsing، نعيد البيانات في format محدد
      return {
        name: gameName,
        description: result,
        platform: platform,
        size: "جاري البحث...",
        rating: 8,
        metacriticScore: "85",
        category: "متنوع",
        releaseYear: "جاري التحديد",
        developer: "جاري البحث",
        publisher: "جاري البحث",
        downloadLinks: {
          official: "متوفر في المتاجر الرسمية",
          free: "جاري البحث عن روابط مجانية",
          demos: "تحقق من المتاجر الرسمية"
        },
        systemRequirements: {
          minimum: "متطلبات أساسية متوسطة",
          recommended: "متطلبات محسنة للأداء الأمثل"
        },
        screenshots: [],
        gameplay: {
          genre: "متنوع",
          modes: ["فردي", "جماعي"],
          difficulty: "متوسط",
          duration: "متغير"
        },
        features: ["جرافيك عالي", "أسلوب لعب ممتع", "قصة جذابة"],
        pros: ["تجربة لعب رائعة", "جودة عالية"],
        cons: ["قد يتطلب مواصفات جيدة"],
        dlc: [],
        multiplayer: "متوفر",
        updates: "يحصل على تحديثات دورية",
        mods: ["تعديلات المجتمع"],
        emulators: {
          windows: ["BlueStacks", "NoxPlayer"],
          android: ["محاكي داخلي"],
          general: ["RetroArch", "PCSX2"]
        },
        alternatives: ["ألعاب مشابهة في النوع"],
        price: "متغير حسب المنصة",
        ageRating: "للجميع",
        languages: ["العربية", "الإنجليزية"],
        awards: ["جوائز متنوعة"]
      };
    }
  } catch (error) {
    console.error('Game search error:', error);
    return {
      name: gameName,
      description: 'عذراً، حدث خطأ في البحث. يرجى المحاولة مرة أخرى مع اسم أكثر تحديداً.',
      platform: platform,
      error: true
    };
  }
};
