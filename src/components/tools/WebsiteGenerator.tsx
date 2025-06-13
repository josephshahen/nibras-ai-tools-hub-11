
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home } from 'lucide-react';
import { generateWebsiteWithOpenAI } from '@/services/openaiService';
import FloatingAIAssistant from '@/components/common/FloatingAIAssistant';

interface WebsiteGeneratorProps {
  onNavigate?: (section: string) => void;
}

const WebsiteGenerator = ({ onNavigate }: WebsiteGeneratorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('business');
  const [color, setColor] = useState('blue');
  const [generatedWebsite, setGeneratedWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const websiteTypes = [
    { value: 'business', label: '🏢 موقع شركة', description: 'موقع احترافي للشركات والأعمال' },
    { value: 'portfolio', label: '🎨 معرض أعمال', description: 'عرض المهارات والمشاريع' },
    { value: 'blog', label: '📝 مدونة', description: 'موقع للمقالات والمحتوى' },
    { value: 'landing', label: '🚀 صفحة هبوط', description: 'صفحة تسويقية لمنتج أو خدمة' },
    { value: 'restaurant', label: '🍽️ مطعم', description: 'موقع مطعم مع قائمة الطعام' },
    { value: 'ecommerce', label: '🛒 متجر إلكتروني', description: 'متجر لبيع المنتجات أونلاين' }
  ];

  const colors = [
    { value: 'blue', label: '🔵 أزرق', hex: '#3B82F6' },
    { value: 'purple', label: '🟣 بنفسجي', hex: '#8B5CF6' },
    { value: 'green', label: '🟢 أخضر', hex: '#10B981' },
    { value: 'red', label: '🔴 أحمر', hex: '#EF4444' },
    { value: 'orange', label: '🟠 برتقالي', hex: '#F97316' },
    { value: 'pink', label: '🩷 وردي', hex: '#EC4899' },
    { value: 'teal', label: '🟦 أزرق مخضر', hex: '#14B8A6' },
    { value: 'indigo', label: '🟦 نيلي', hex: '#6366F1' }
  ];

  const websiteExamples = [
    { title: 'شركة التقنية المبدعة', description: 'نقدم حلول تقنية مبتكرة للشركات والمؤسسات', type: 'business' },
    { title: 'مصمم جرافيك محترف', description: 'معرض أعمالي في التصميم والإبداع البصري', type: 'portfolio' },
    { title: 'مدونة التقنية', description: 'آخر أخبار التكنولوجيا والبرمجة', type: 'blog' },
    { title: 'تطبيق الصحة الذكي', description: 'تطبيق يساعدك على متابعة صحتك يومياً', type: 'landing' }
  ];

  const generateWebsite = async () => {
    if (!title.trim() || !description.trim()) return;

    setIsLoading(true);
    try {
      console.log(`🌐 إنشاء موقع ${type} باسم: ${title}`);
      const website = await generateWebsiteWithOpenAI(title, description, type, color);
      setGeneratedWebsite(website);
      console.log('✅ تم إنشاء الموقع بنجاح');
    } catch (error) {
      console.error('❌ خطأ في إنشاء الموقع:', error);
      setGeneratedWebsite(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        h1 { font-size: 3rem; margin-bottom: 20px; }
        p { font-size: 1.2rem; line-height: 1.6; }
        .cta { background: rgba(255,255,255,0.2); padding: 15px 30px; border: none; border-radius: 25px; color: white; font-size: 1rem; margin-top: 30px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <p>${description}</p>
        <button class="cta">ابدأ الآن</button>
    </div>
</body>
</html>`);
    } finally {
      setIsLoading(false);
    }
  };

  const editWebsite = async () => {
    if (!editPrompt.trim() || !generatedWebsite) return;

    setIsLoading(true);
    try {
      console.log('✏️ تعديل الموقع...');
      const editedWebsite = await generateWebsiteWithOpenAI(title, description, type, color, editPrompt);
      setGeneratedWebsite(editedWebsite);
      setEditMode(false);
      setEditPrompt('');
      console.log('✅ تم تعديل الموقع بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تعديل الموقع:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadWebsite = () => {
    const blob = new Blob([generatedWebsite], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '-')}-website.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const previewWebsite = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(generatedWebsite);
      newWindow.document.close();
    }
  };

  const handleAIApply = (suggestion: string) => {
    if (suggestion.includes('تعديل') || suggestion.includes('عدل')) {
      setEditPrompt(suggestion);
      setEditMode(true);
    } else if (suggestion.includes('اسم') || suggestion.includes('عنوان')) {
      setTitle(suggestion);
    } else if (suggestion.includes('وصف') || suggestion.includes('محتوى')) {
      setDescription(suggestion);
    }
  };

  const getCurrentContext = () => {
    return `مولد المواقع - الاسم: ${title} - الوصف: ${description} - النوع: ${type} - ${generatedWebsite ? 'تم إنشاء موقع' : 'لم يتم إنشاء موقع بعد'}`;
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => onNavigate?.('home')}
              variant="outline"
              className="border-white/20 hover:bg-white/10 flex items-center gap-2"
            >
              <Home size={16} />
              العودة للرئيسية
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مولد المواقع</span> الاحترافي
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            أنشئ وعدّل مواقع ويب احترافية بتقنية Builder.io المتطورة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                🌐 إعدادات الموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!editMode ? (
                <>
                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">اسم الموقع</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: شركة الإبداع التقني"
                      className="bg-white/5 border-white/20 font-cairo text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">وصف الموقع والمحتوى</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="اكتب وصفاً شاملاً للموقع والخدمات المقدمة..."
                      className="h-24 resize-none font-cairo bg-white/5 border-white/20 text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">نوع الموقع</label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        {websiteTypes.map((websiteType) => (
                          <SelectItem key={websiteType.value} value={websiteType.value} className="font-cairo">
                            <div className="text-right">
                              <div className="font-semibold">{websiteType.label}</div>
                              <div className="text-xs text-gray-400">{websiteType.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">اللون الأساسي</label>
                    <Select value={color} onValueChange={setColor}>
                      <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        {colors.map((colorOption) => (
                          <SelectItem key={colorOption.value} value={colorOption.value} className="font-cairo">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: colorOption.hex }}
                              ></div>
                              {colorOption.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateWebsite}
                    disabled={isLoading || !title.trim() || !description.trim()}
                    className="btn-gradient w-full py-3"
                  >
                    {isLoading ? '🌐 جاري الإنشاء...' : '✨ أنشئ الموقع'}
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">تعديلات على الموقع</label>
                    <Textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="اكتب التعديلات المطلوبة: أضف قسم، غيّر التصميم، عدّل المحتوى..."
                      className="h-32 resize-none font-cairo bg-white/5 border-white/20 text-right"
                    />
                    <div className="text-xs text-gray-400 mt-2 font-cairo">
                      مثال: "أضف قسم اتصل بنا"، "غيّر الألوان لتكون أكثر دفئاً"، "أضف معرض صور"
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={editWebsite}
                      disabled={isLoading || !editPrompt.trim()}
                      className="btn-gradient"
                    >
                      {isLoading ? '✏️ جاري التعديل...' : '✅ طبق التعديل'}
                    </Button>
                    <Button 
                      onClick={() => {setEditMode(false); setEditPrompt('');}}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      إلغاء
                    </Button>
                  </div>
                </>
              )}

              {generatedWebsite && !editMode && (
                <div className="space-y-2">
                  <Button 
                    onClick={() => setEditMode(true)}
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/10"
                  >
                    ✏️ عدّل الموقع
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={previewWebsite}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      👁️ معاينة
                    </Button>
                    <Button 
                      onClick={downloadWebsite}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      📥 حمّل
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-between">
                <div className="flex gap-2 text-sm">
                  {generatedWebsite && (
                    <>
                      <span className="px-2 py-1 bg-primary/20 rounded text-primary">
                        {websiteTypes.find(t => t.value === type)?.label}
                      </span>
                      <span className="px-2 py-1 bg-green-500/20 rounded text-green-400">
                        OpenAI GPT-4.1
                      </span>
                    </>
                  )}
                </div>
                <span className="flex items-center gap-2">
                  🖥️ معاينة الموقع
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded-lg border border-white/10 overflow-hidden" style={{ height: '500px' }}>
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-white border-r-blue-400 border-b-purple-400 border-l-pink-400 rounded-full animate-spin"></div>
                      </div>
                      <p className="text-sm text-gray-400 font-cairo mb-2">
                        {editMode ? '✏️ جاري تعديل الموقع...' : '🌐 جاري إنشاء الموقع...'}
                      </p>
                      <p className="text-xs text-gray-500 font-cairo">باستخدام OpenAI GPT-4.1</p>
                    </div>
                  </div>
                ) : generatedWebsite ? (
                  <iframe
                    srcDoc={generatedWebsite}
                    className="w-full h-full border-0"
                    title="Website Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🌐</div>
                      <p className="text-gray-400 font-cairo">معاينة الموقع ستظهر هنا</p>
                      <p className="text-xs text-gray-500 font-cairo mt-2">املأ البيانات واضغط "أنشئ الموقع"</p>
                    </div>
                  </div>
                )}
              </div>
              
              {generatedWebsite && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 font-cairo space-y-1">
                    <div><strong>الاسم:</strong> {title}</div>
                    <div><strong>النوع:</strong> {websiteTypes.find(t => t.value === type)?.label}</div>
                    <div><strong>اللون:</strong> {colors.find(c => c.value === color)?.label}</div>
                    <div><strong>المولد:</strong> OpenAI GPT-4.1 مع تحسينات ذكية</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white">⚡ أمثلة جاهزة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {websiteExamples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-right font-cairo border-white/20 hover:bg-white/10 h-auto py-4 flex flex-col items-end"
                  onClick={() => {
                    setTitle(example.title);
                    setDescription(example.description);
                    setType(example.type);
                  }}
                >
                  <div className="font-semibold mb-1">{example.title}</div>
                  <div className="text-xs text-gray-400">{example.description}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <FloatingAIAssistant 
        context={getCurrentContext()}
        onApply={handleAIApply}
      />
    </div>
  );
};

export default WebsiteGenerator;
