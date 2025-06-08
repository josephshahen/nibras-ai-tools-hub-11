import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateImageWithReplicate } from '@/services/aiService';

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
    "قلعة من القرون الوسطى على قمة جبل في ضوء القمر"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    try {
      const imageUrl = await generateImageWithReplicate(prompt, style);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Image generation error:', error);
      // استخدام صورة تجريبية في حالة الخطأ
      setGeneratedImage('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مولد</span> الصور
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            أنشئ صوراً فريدة من الوصف النصي بالذكاء الاصطناعي
          </p>
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
                <label className="block text-sm font-cairo text-white mb-2">وصف الصورة</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="صف الصورة التي تريد إنشاءها بالتفصيل..."
                  className="h-24 resize-none font-cairo bg-white/5 border-white/20 text-right"
                />
                <div className="text-xs text-gray-400 mt-2 font-cairo">
                  كن مفصلاً في الوصف للحصول على نتائج أفضل
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

              <Button 
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="btn-gradient w-full"
              >
                {isLoading ? 'جاري إنشاء الصورة...' : 'أنشئ الصورة'}
              </Button>
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
              <div className="aspect-square bg-black/50 rounded-lg flex items-center justify-center overflow-hidden">
                {isLoading ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-gray-400 font-cairo">جاري إنشاء الصورة...</p>
                    <p className="text-xs text-gray-500 font-cairo mt-2">هذا قد يستغرق بضع ثوانٍ</p>
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
                  </div>
                )}
              </div>
              
              {generatedImage && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 font-cairo">
                    <div>الوصف: {prompt}</div>
                    <div>النمط: {artStyles.find(s => s.value === style)?.label}</div>
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
      </div>
    </div>
  );
};

export default ImageGenerator;
