import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home } from 'lucide-react';
import { generateImageWithDeepAI } from '@/services/aiService';
import FloatingAIAssistant from '@/components/common/FloatingAIAssistant';

interface ImageGeneratorProps {
  onNavigate?: (section: string) => void;
}

const ImageGenerator = ({ onNavigate }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const artStyles = [
    { value: 'realistic', label: '📸 واقعي فائق الجودة', description: 'صور فوتوغرافية احترافية عالية الدقة' },
    { value: 'anime', label: '🌸 أنمي احترافي', description: 'أسلوب الأنمي الياباني المتطور' },
    { value: 'cartoon', label: '🎨 كرتوني ثلاثي الأبعاد', description: 'رسوم متحركة احترافية بجودة ديزني' },
    { value: 'digital-art', label: '💻 فن رقمي متقدم', description: 'أعمال فنية رقمية احترافية ومبدعة' },
    { value: 'oil-painting', label: '🖼️ لوحة زيتية كلاسيكية', description: 'فن كلاسيكي بأسلوب الماسترز' },
    { value: 'watercolor', label: '🎭 ألوان مائية فنية', description: 'فن الألوان المائية الراقي' }
  ];

  const promptExamples = [
    "قطة بيضاء جميلة تجلس في حديقة مليئة بالورود الملونة، إضاءة ذهبية، جودة عالية، 8K",
    "منظر طبيعي خلاب لجبال مغطاة بالثلوج عند غروب الشمس، ألوان دافئة، تفاصيل مذهلة",
    "رائد فضاء يستكشف كوكباً غريباً مليئاً بالنباتات الفضائية المضيئة، خيال علمي متطور",
    "قلعة من القرون الوسطى على قمة جبل في ضوء القمر، أجواء غامضة ورومانسية"
  ];

  const enhancePrompt = (originalPrompt: string) => {
    const enhancementWords = [
      "عالي الجودة", "8K resolution", "masterpiece", "detailed", "professional",
      "beautiful lighting", "perfect composition", "award winning"
    ];
    
    return `${originalPrompt}, ${enhancementWords.join(', ')}`;
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setGeneratedImages([]);
    
    try {
      console.log('🎨 بدء توليد الصورة بـ DeepAI...');
      
      const enhancedPrompt = enhancePrompt(prompt);
      const imageUrl = await generateImageWithDeepAI(enhancedPrompt, style);

      setGeneratedImages([imageUrl]);
      setCurrentImageIndex(0);
      console.log('✅ تم توليد الصورة بنجاح');
    } catch (error) {
      console.error('❌ خطأ في توليد الصورة:', error);
      const fallbackImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop';
      setGeneratedImages([fallbackImage]);
      setCurrentImageIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  const editCurrentImage = async () => {
    if (!editPrompt.trim() || generatedImages.length === 0) return;

    setIsLoading(true);
    
    try {
      console.log('✏️ بدء تعديل الصورة...');
      
      const combinedPrompt = `${prompt}, ${editPrompt}`;
      const enhancedPrompt = enhancePrompt(combinedPrompt);
      const editedImageUrl = await generateImageWithDeepAI(enhancedPrompt, style);

      const updatedImages = [...generatedImages];
      updatedImages[currentImageIndex] = editedImageUrl;
      setGeneratedImages(updatedImages);
      
      setEditMode(false);
      setEditPrompt('');
      console.log('✅ تم تعديل الصورة بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تعديل الصورة:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCurrentImage = async () => {
    if (!generatedImages[currentImageIndex]) return;
    
    try {
      const response = await fetch(generatedImages[currentImageIndex]);
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

  const handleAIApply = (suggestion: string) => {
    // تطبيق اقتراحات المساعد الذكي
    if (suggestion.includes('تعديل') || suggestion.includes('عدل')) {
      setEditPrompt(suggestion);
      setEditMode(true);
    } else {
      setPrompt(suggestion);
    }
  };

  const getCurrentContext = () => {
    return `مولد الصور - الوصف الحالي: ${prompt} - النمط: ${style} - ${generatedImages.length > 0 ? 'تم إنشاء صورة' : 'لم يتم إنشاء صورة بعد'}`;
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
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
            <span className="text-gradient">مولد الصور</span> المتطور
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            أنشئ وعدّل صوراً مذهلة بتقنية الذكاء الاصطناعي - بدعم DeepAI
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
              {!editMode ? (
                <>
                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">وصف الصورة</label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="صف الصورة التي تريدها بالتفصيل..."
                      className="h-32 resize-none font-cairo bg-white/5 border-white/20 text-right"
                    />
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
                              <div className="font-semibold">{styleOption.label}</div>
                              <div className="text-xs text-gray-400">{styleOption.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateImage}
                    disabled={isLoading || !prompt.trim()}
                    className="btn-gradient w-full py-3"
                  >
                    {isLoading ? '🎨 جاري الإنشاء...' : '✨ أنشئ الصورة'}
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">تعديلات على الصورة</label>
                    <Textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="اكتب التعديلات المطلوبة: أضف، غيّر، احذف..."
                      className="h-32 resize-none font-cairo bg-white/5 border-white/20 text-right"
                    />
                    <div className="text-xs text-gray-400 mt-2 font-cairo">
                      مثال: "أضف قطة صغيرة"، "غيّر اللون إلى أزرق"، "احذف الخلفية"
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={editCurrentImage}
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

              {generatedImages.length > 0 && !editMode && (
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={() => setEditMode(true)}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                  >
                    ✏️ عدّل الصورة
                  </Button>
                  <Button 
                    onClick={downloadCurrentImage}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                  >
                    📥 حمّل
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white">
                🖼️ الصورة المولدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-black/50 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                {isLoading ? (
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-white border-r-blue-400 border-b-purple-400 border-l-pink-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-400 font-cairo mb-2">
                      {editMode ? '✏️ جاري تعديل الصورة...' : '🎨 جاري إنشاء الصورة...'}
                    </p>
                    <p className="text-xs text-gray-500 font-cairo">قد يستغرق 15-30 ثانية</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <img 
                    src={generatedImages[currentImageIndex]} 
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
              
              {generatedImages.length > 0 && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 font-cairo space-y-1">
                    <div><strong>الوصف:</strong> {prompt}</div>
                    <div><strong>النمط:</strong> {artStyles.find(s => s.value === style)?.label}</div>
                    <div><strong>المولد:</strong> DeepAI API</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white">⚡ أمثلة للإلهام</CardTitle>
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

      <FloatingAIAssistant 
        context={getCurrentContext()}
        onApply={handleAIApply}
      />
    </div>
  );
};

export default ImageGenerator;
