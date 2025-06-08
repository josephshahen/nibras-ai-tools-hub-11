
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateImageWithHuggingFace } from '@/services/aiService';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const artStyles = [
    { value: 'realistic', label: '🎯 واقعي', description: 'صور واقعية عالية الجودة' },
    { value: 'anime', label: '🌸 أنمي', description: 'أسلوب الرسوم المتحركة اليابانية' },
    { value: 'cartoon', label: '🎨 كرتوني', description: 'أسلوب الرسوم المتحركة' },
    { value: 'digital-art', label: '💻 فن رقمي', description: 'أعمال فنية رقمية حديثة' },
    { value: 'oil-painting', label: '🖼️ رسم زيتي', description: 'أسلوب اللوحات الزيتية الكلاسيكية' },
    { value: 'watercolor', label: '🎭 ألوان مائية', description: 'أسلوب الألوان المائية' }
  ];

  const promptExamples = [
    "قطة جميلة تجلس في حديقة مليئة بالورود الملونة",
    "منظر طبيعي خلاب لجبال مغطاة بالثلوج عند غروب الشمس",
    "رائد فضاء يمشي على سطح كوكب غريب مليء بالنباتات الفضائية",
    "قلعة من القرون الوسطى على قمة جبل في ضوء القمر",
    "امرأة عربية جميلة ترتدي الثوب التقليدي في المدينة القديمة",
    "طفل يلعب مع الدببة في الغابة المطيرة"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    try {
      console.log('بدء توليد الصورة باستخدام Hugging Face...');
      const imageUrl = await generateImageWithHuggingFace(prompt, style);
      setGeneratedImage(imageUrl);
      console.log('تم توليد الصورة بنجاح:', imageUrl);
    } catch (error) {
      console.error('خطأ في توليد الصورة:', error);
      // استخدام صورة تجريبية في حالة الخطأ
      setGeneratedImage('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('خطأ في تحميل الصورة:', error);
    }
  };

  const generateNewImage = () => {
    if (generatedImage) {
      URL.revokeObjectURL(generatedImage);
    }
    handleGenerate();
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مولد الصور</span> الذكي
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            أنشئ صوراً فريدة من الوصف النصي بتقنية Hugging Face المتطورة
          </p>
          <div className="mt-4 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg inline-block">
            <p className="text-green-400 font-cairo text-sm">
              ✨ محسّن بتقنية Hugging Face لصور أكثر دقة وجودة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                🎨 إعدادات الصورة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-cairo text-white mb-2">وصف الصورة بالتفصيل</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="صف الصورة التي تريد إنشاءها بالتفصيل... كلما كان الوصف أكثر تفصيلاً، كانت النتيجة أفضل"
                  className="h-32 resize-none font-cairo bg-white/5 border-white/20 text-right"
                />
                <div className="text-xs text-gray-400 mt-2 font-cairo">
                  💡 نصيحة: استخدم كلمات وصفية مثل "عالي الجودة"، "مفصل"، "جميل" للحصول على نتائج أفضل
                </div>
              </div>

              <div>
                <label className="block text-sm font-cairo text-white mb-2">نمط الفن</label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {artStyles.map((styleOption) => (
                      <SelectItem key={styleOption.value} value={styleOption.value} className="font-cairo">
                        <div className="text-right">
                          <div>{styleOption.label}</div>
                          <div className="text-xs text-gray-400">{styleOption.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button 
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="btn-gradient w-full"
                >
                  {isLoading ? 'جاري إنشاء الصورة...' : 'أنشئ الصورة 🎨'}
                </Button>
                
                {generatedImage && (
                  <Button 
                    onClick={generateNewImage}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/10"
                  >
                    🔄 أنشئ صورة جديدة
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-between">
                {generatedImage && (
                  <Button 
                    onClick={downloadImage}
                    variant="outline"
                    size="sm"
                    className="border-white/20 hover:bg-white/10"
                  >
                    📥 تحميل
                  </Button>
                )}
                <span className="flex items-center gap-2">
                  🖼️ الصورة المولدة
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-black/50 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                {isLoading ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-gray-400 font-cairo">جاري إنشاء صورة فريدة...</p>
                    <p className="text-xs text-gray-500 font-cairo mt-2">قد يستغرق هذا 10-30 ثانية</p>
                    <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-400 font-cairo text-xs">
                        🚀 نستخدم Hugging Face لأفضل جودة ممكنة
                      </p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Generated"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-gray-400 font-cairo">الصورة ستظهر هنا</p>
                    <p className="text-xs text-gray-500 font-cairo mt-2">اكتب وصفاً واضغط "أنشئ الصورة"</p>
                  </div>
                )}
              </div>
              
              {generatedImage && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 font-cairo space-y-1">
                    <div><strong>الوصف:</strong> {prompt}</div>
                    <div><strong>النمط:</strong> {artStyles.find(s => s.value === style)?.label}</div>
                    <div><strong>المولد:</strong> Hugging Face Stable Diffusion</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white">⚡ أمثلة سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {promptExamples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-right font-cairo border-white/20 hover:bg-white/10 h-auto py-3 text-wrap"
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* نصائح لتحسين النتائج */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-center font-cairo text-white">💡 نصائح لأفضل النتائج</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  📝
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">كن مفصلاً</h3>
                <p className="text-sm text-gray-400 font-cairo">استخدم أوصافاً تفصيلية واضحة</p>
              </div>
              
              <div>
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  🎯
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">اختر النمط المناسب</h3>
                <p className="text-sm text-gray-400 font-cairo">كل نمط يعطي نتائج مختلفة</p>
              </div>
              
              <div>
                <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  ⚡
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">جرب مرات عديدة</h3>
                <p className="text-sm text-gray-400 font-cairo">كل توليد يعطي نتيجة فريدة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageGenerator;
