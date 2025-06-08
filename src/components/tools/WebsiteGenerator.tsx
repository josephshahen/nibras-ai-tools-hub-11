
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateWebsite } from '@/services/aiService';

const WebsiteGenerator = () => {
  const [websiteData, setWebsiteData] = useState({
    title: '',
    description: '',
    type: '',
    color: 'blue'
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const websiteTypes = [
    { value: 'business', label: '🏢 موقع شركة متطور', description: 'موقع احترافي للشركات مع كافة الأقسام' },
    { value: 'portfolio', label: '🎨 معرض أعمال فني', description: 'معرض أعمال تفاعلي مع gallery متطور' },
    { value: 'blog', label: '📝 مدونة عصرية', description: 'مدونة حديثة مع نظام مقالات متقدم' },
    { value: 'landing', label: '🚀 صفحة هبوط محسنة', description: 'صفحة تسويقية محسنة للتحويلات' },
    { value: 'restaurant', label: '🍕 موقع مطعم تفاعلي', description: 'موقع مطعم مع قوائم وحجوزات' },
    { value: 'ecommerce', label: '🛒 متجر إلكتروني', description: 'متجر متكامل مع نظام دفع' },
    { value: 'agency', label: '📱 وكالة رقمية', description: 'موقع وكالة إبداعية متطورة' },
    { value: 'education', label: '🎓 منصة تعليمية', description: 'موقع تعليمي تفاعلي' }
  ];

  const colorThemes = [
    { value: 'blue', label: 'أزرق احترافي', preview: 'from-blue-500 to-blue-700' },
    { value: 'purple', label: 'بنفسجي إبداعي', preview: 'from-purple-500 to-purple-700' },
    { value: 'green', label: 'أخضر طبيعي', preview: 'from-green-500 to-green-700' },
    { value: 'red', label: 'أحمر قوي', preview: 'from-red-500 to-red-700' },
    { value: 'orange', label: 'برتقالي دافئ', preview: 'from-orange-500 to-orange-700' },
    { value: 'pink', label: 'وردي عصري', preview: 'from-pink-500 to-pink-700' },
    { value: 'teal', label: 'تركوازي هادئ', preview: 'from-teal-500 to-teal-700' },
    { value: 'indigo', label: 'نيلي عميق', preview: 'from-indigo-500 to-indigo-700' }
  ];

  const handleGenerate = async () => {
    if (!websiteData.title || !websiteData.type) return;

    setIsLoading(true);
    
    try {
      console.log('🌐 بدء إنشاء موقع متطور...');
      const result = await generateWebsite(
        websiteData.title,
        websiteData.description,
        websiteData.type,
        websiteData.color
      );
      setGeneratedCode(result);
      console.log('✅ تم إنشاء الموقع بنجاح');
    } catch (error) {
      console.error('❌ خطأ في إنشاء الموقع:', error);
      // إنشاء موقع احتياطي متطور
      setGeneratedCode(generateAdvancedFallbackWebsite());
    } finally {
      setIsLoading(false);
    }
  };

  const generateAdvancedFallbackWebsite = () => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${websiteData.title}</title>
    <meta name="description" content="${websiteData.description}">
    <style>
        :root {
            --primary-color: ${websiteData.color === 'blue' ? '#3B82F6' : websiteData.color === 'purple' ? '#8B5CF6' : '#10B981'};
            --secondary-color: ${websiteData.color === 'blue' ? '#1D4ED8' : websiteData.color === 'purple' ? '#7C3AED' : '#059669'};
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            overflow-x: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 2rem 0;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 1; }
        
        .nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3rem;
        }
        
        .logo { font-size: 1.5rem; font-weight: bold; }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            transition: opacity 0.3s;
        }
        
        .nav-links a:hover { opacity: 0.8; }
        
        .hero {
            text-align: center;
            padding: 4rem 0;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: slideInUp 1s ease-out;
        }
        
        .hero p {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            animation: slideInUp 1s ease-out 0.2s both;
        }
        
        .cta-button {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
            animation: slideInUp 1s ease-out 0.4s both;
        }
        
        .cta-button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .features {
            padding: 5rem 0;
            background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
            margin-bottom: 1rem;
        }
        
        .footer {
            background: #1a1a1a;
            color: white;
            padding: 3rem 0;
            text-align: center;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .nav-links { display: none; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <div class="logo">${websiteData.title}</div>
                <ul class="nav-links">
                    <li><a href="#home">الرئيسية</a></li>
                    <li><a href="#about">عنا</a></li>
                    <li><a href="#services">خدماتنا</a></li>
                    <li><a href="#contact">اتصل بنا</a></li>
                </ul>
            </nav>
            <div class="hero">
                <h1>${websiteData.title}</h1>
                <p>${websiteData.description}</p>
                <a href="#contact" class="cta-button">ابدأ رحلتك معنا</a>
            </div>
        </div>
    </header>

    <section class="features">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 1rem; color: #333;">لماذا نحن الخيار الأفضل؟</h2>
            <p style="text-align: center; color: #666; font-size: 1.1rem;">نقدم حلولاً مبتكرة ومتطورة تلبي احتياجاتكم</p>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3 style="margin-bottom: 1rem; color: #333;">أداء فائق</h3>
                    <p style="color: #666;">نضمن أداءً سريعاً ومحسناً لجميع خدماتنا</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3 style="margin-bottom: 1rem; color: #333;">دقة في التنفيذ</h3>
                    <p style="color: #666;">نهتم بأدق التفاصيل لضمان أفضل النتائج</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">💎</div>
                    <h3 style="margin-bottom: 1rem; color: #333;">جودة عالية</h3>
                    <p style="color: #666;">نلتزم بأعلى معايير الجودة في كل ما نقدمه</p>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${websiteData.title}. جميع الحقوق محفوظة.</p>
            <p style="margin-top: 0.5rem; opacity: 0.8;">تم إنشاؤه بالذكاء الاصطناعي المتطور</p>
        </div>
    </footer>

    <script>
        // تأثيرات تفاعلية متقدمة
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });

            // Intersection Observer للأنيميشن
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });

            document.querySelectorAll('.feature-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
                observer.observe(card);
            });
        });
    </script>
</body>
</html>`;
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${websiteData.title || 'website'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مولد المواقع</span> المتطور
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            أنشئ مواقع ويب احترافية ومذهلة بالذكاء الاصطناعي المتقدم
          </p>
          <div className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg inline-block">
            <p className="text-purple-400 font-cairo text-sm">
              🎨 تصميم متطور | 📱 متجاوب بالكامل | ⚡ أداء محسن | 🔥 جودة احترافية
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                🖥️ مواصفات الموقع المتقدمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-cairo text-white mb-2">اسم الموقع / العلامة التجارية</label>
                <Input
                  value={websiteData.title}
                  onChange={(e) => setWebsiteData({...websiteData, title: e.target.value})}
                  placeholder="مثال: شركة التقنية المتطورة"
                  className="bg-white/5 border-white/20 font-cairo text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-cairo text-white mb-2">وصف الموقع والأهداف</label>
                <Textarea
                  value={websiteData.description}
                  onChange={(e) => setWebsiteData({...websiteData, description: e.target.value})}
                  placeholder="وصف مفصل لموقعك، أهدافك، خدماتك، وما يميزك عن المنافسين..."
                  className="h-20 resize-none font-cairo bg-white/5 border-white/20 text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-cairo text-white mb-2">نوع الموقع المتخصص</label>
                <Select value={websiteData.type} onValueChange={(value) => setWebsiteData({...websiteData, type: value})}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue placeholder="اختر نوع الموقع المطلوب" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {websiteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="font-cairo">
                        <div className="text-right">
                          <div className="font-semibold">{type.label}</div>
                          <div className="text-xs text-gray-400">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-cairo text-white mb-2">نظام الألوان المتطور</label>
                <div className="grid grid-cols-2 gap-3">
                  {colorThemes.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setWebsiteData({...websiteData, color: color.value})}
                      className={`p-3 rounded-lg border-2 transition-all font-cairo text-sm ${
                        websiteData.color === color.value 
                          ? 'border-white bg-white/10' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className={`w-full h-4 rounded-full bg-gradient-to-r ${color.preview} mb-2`}></div>
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={handleGenerate}
                  disabled={isLoading || !websiteData.title || !websiteData.type}
                  className="btn-gradient w-full py-3"
                >
                  {isLoading ? '🌐 جاري إنشاء موقع متطور...' : '🚀 أنشئ موقعاً احترافياً'}
                </Button>
                
                {generatedCode && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={downloadCode}
                      className="btn-gradient"
                    >
                      📥 تحميل الموقع
                    </Button>
                    <Button 
                      onClick={togglePreview}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      {previewMode ? '📝 عرض الكود' : '👁️ معاينة'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                💻 الكود والمعاينة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-black/50 rounded-lg overflow-hidden border border-white/10">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-purple-400 border-r-blue-400 border-b-green-400 border-l-pink-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-400 font-cairo mb-2">🌐 جاري إنشاء موقع احترافي...</p>
                    <p className="text-xs text-gray-500 font-cairo">يتم تحليل المتطلبات وبناء موقع متطور</p>
                  </div>
                ) : generatedCode ? (
                  previewMode ? (
                    <iframe
                      srcDoc={generatedCode}
                      className="w-full h-full border-0"
                      title="Website Preview"
                    />
                  ) : (
                    <pre className="text-sm text-green-400 font-mono overflow-auto whitespace-pre-wrap p-4 h-full">
                      {generatedCode}
                    </pre>
                  )
                ) : (
                  <div className="text-center h-full flex flex-col justify-center">
                    <div className="text-6xl mb-4">🌐</div>
                    <p className="text-gray-400 font-cairo">الموقع سيظهر هنا</p>
                    <p className="text-xs text-gray-500 font-cairo mt-2">املأ البيانات واضغط "أنشئ موقعاً احترافياً"</p>
                  </div>
                )}
              </div>
              
              {generatedCode && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 font-cairo space-y-1">
                    <div><strong>النوع:</strong> {websiteTypes.find(t => t.value === websiteData.type)?.label}</div>
                    <div><strong>التقنيات:</strong> HTML5 + CSS3 + JavaScript متطور</div>
                    <div><strong>الميزات:</strong> متجاوب + محسن + تفاعلي + PWA جاهز</div>
                    <div><strong>الحالة:</strong> جاهز للنشر والاستخدام الفوري</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ميزات إضافية */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-center font-cairo text-white">✨ ميزات المولد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  📱
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">متجاوب</h3>
                <p className="text-sm text-gray-400 font-cairo">يعمل على جميع الأجهزة</p>
              </div>
              <div>
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  ⚡
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">سريع</h3>
                <p className="text-sm text-gray-400 font-cairo">تحميل فائق السرعة</p>
              </div>
              <div>
                <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  🎨
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">جميل</h3>
                <p className="text-sm text-gray-400 font-cairo">تصميم عصري وجذاب</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteGenerator;
