
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WebsiteGenerator = () => {
  const [websiteData, setWebsiteData] = useState({
    title: '',
    description: '',
    type: '',
    color: 'blue'
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const websiteTypes = [
    { value: 'business', label: '🏢 موقع تجاري', description: 'موقع للشركات والأعمال' },
    { value: 'portfolio', label: '🎨 معرض أعمال', description: 'موقع لعرض الأعمال والمشاريع' },
    { value: 'blog', label: '📝 مدونة', description: 'موقع للمقالات والمحتوى' },
    { value: 'landing', label: '🚀 صفحة هبوط', description: 'صفحة تسويقية لمنتج أو خدمة' },
    { value: 'restaurant', label: '🍕 مطعم', description: 'موقع للمطاعم والمقاهي' },
    { value: 'ecommerce', label: '🛒 متجر إلكتروني', description: 'موقع لبيع المنتجات' }
  ];

  const colorThemes = [
    { value: 'blue', label: 'أزرق', preview: 'bg-blue-500' },
    { value: 'purple', label: 'بنفسجي', preview: 'bg-purple-500' },
    { value: 'green', label: 'أخضر', preview: 'bg-green-500' },
    { value: 'red', label: 'أحمر', preview: 'bg-red-500' },
    { value: 'orange', label: 'برتقالي', preview: 'bg-orange-500' },
    { value: 'pink', label: 'وردي', preview: 'bg-pink-500' }
  ];

  const handleGenerate = async () => {
    if (!websiteData.title || !websiteData.type) return;

    setIsLoading(true);
    
    // محاكاة توليد الموقع
    setTimeout(() => {
      const sampleCode = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${websiteData.title}</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-align: center; padding: 2rem; }
        .content { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .footer { background: #333; color: white; text-align: center; padding: 1rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${websiteData.title}</h1>
        <p>${websiteData.description}</p>
    </div>
    <div class="content">
        <h2>مرحباً بكم في موقعنا</h2>
        <p>هذا مثال على موقع تم إنشاؤه باستخدام مولد المواقع الذكي.</p>
    </div>
    <div class="footer">
        <p>&copy; 2024 ${websiteData.title}. جميع الحقوق محفوظة.</p>
    </div>
</body>
</html>`;
      
      setGeneratedCode(sampleCode);
      setIsLoading(false);
    }, 2000);
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

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مولد</span> المواقع
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            أنشئ موقع ويب احترافي بالذكاء الاصطناعي في دقائق
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* نموذج إنشاء الموقع */}
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                🖥️ معلومات الموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* اسم الموقع */}
              <div>
                <label className="block text-sm font-cairo text-white mb-2">اسم الموقع</label>
                <Input
                  value={websiteData.title}
                  onChange={(e) => setWebsiteData({...websiteData, title: e.target.value})}
                  placeholder="مثال: شركة التقنية المتقدمة"
                  className="bg-white/5 border-white/20 font-cairo text-right"
                />
              </div>

              {/* وصف الموقع */}
              <div>
                <label className="block text-sm font-cairo text-white mb-2">وصف الموقع</label>
                <Textarea
                  value={websiteData.description}
                  onChange={(e) => setWebsiteData({...websiteData, description: e.target.value})}
                  placeholder="وصف مختصر لموقعك وخدماتك..."
                  className="h-20 resize-none font-cairo bg-white/5 border-white/20 text-right"
                />
              </div>

              {/* نوع الموقع */}
              <div>
                <label className="block text-sm font-cairo text-white mb-2">نوع الموقع</label>
                <Select value={websiteData.type} onValueChange={(value) => setWebsiteData({...websiteData, type: value})}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue placeholder="اختر نوع الموقع" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {websiteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="font-cairo">
                        <div className="text-right">
                          <div>{type.label}</div>
                          <div className="text-xs text-gray-400">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* لون التصميم */}
              <div>
                <label className="block text-sm font-cairo text-white mb-2">لون التصميم</label>
                <div className="grid grid-cols-3 gap-2">
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
                      <div className={`w-6 h-6 rounded-full ${color.preview} mx-auto mb-1`}></div>
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isLoading || !websiteData.title || !websiteData.type}
                className="btn-gradient w-full"
              >
                {isLoading ? 'جاري إنشاء الموقع...' : 'أنشئ الموقع'}
              </Button>
            </CardContent>
          </Card>

          {/* معاينة الكود */}
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                💻 الكود المولد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-black/50 rounded-lg p-4 overflow-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="flex gap-1 mb-4">
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-sm text-gray-400 font-cairo">جاري إنشاء الموقع...</p>
                  </div>
                ) : generatedCode ? (
                  <pre className="text-sm text-green-400 font-mono overflow-auto whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                ) : (
                  <div className="text-gray-400 font-cairo text-center">
                    الكود سيظهر هنا بعد إنشاء الموقع
                  </div>
                )}
              </div>
              
              {generatedCode && (
                <div className="mt-4 space-y-3">
                  <Button onClick={downloadCode} className="w-full btn-gradient">
                    📥 تحميل الموقع
                  </Button>
                  <div className="text-xs text-gray-400 font-cairo text-center">
                    ملف HTML جاهز للنشر على أي استضافة ويب
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
