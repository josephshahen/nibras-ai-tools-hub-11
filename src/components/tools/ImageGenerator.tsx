import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, AlertCircle, RefreshCw } from 'lucide-react';
import { generateImageWithOpenAI } from '@/services/openaiService';
import FloatingAIAssistant from '@/components/common/FloatingAIAssistant';
import { toast } from 'sonner';

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
  const [lastError, setLastError] = useState<string>('');

  const artStyles = [
    { value: 'realistic', label: '📸 واقعي فائق الجودة', description: 'صور فوتوغرافية احترافية عالية الدقة' },
    { value: 'anime', label: '🌸 أنمي احترافي', description: 'أسلوب الأنمي الياباني المتطور' },
    { value: 'cartoon', label: '🎨 كرتوني ثلاثي الأبعاد', description: 'رسوم متحركة احترافية بجودة ديزني' },
    { value: 'digital-art', label: '💻 فن رقمي متقدم', description: 'أعمال فنية رقمية احترافية ومبدعة' },
    { value: 'oil-painting', label: '🖼️ لوحة زيتية كلاسيكية', description: 'فن كلاسيكي بأسلوب الماسترز' },
    { value: 'watercolor', label: '🎭 ألوان مائية فنية', description: 'فن الألوان المائية الراقي' }
  ];

  const promptExamples = [
    "قطة بيضاء جميلة تجلس في حديقة مليئة بالورود الملونة",
    "منظر طبيعي خلاب لجبال مغطاة بالثلوج عند غروب الشمس",
    "رائد فضاء يستكشف كوكباً غريباً مليئاً بالنباتات الفضائية المضيئة",
    "قلعة من القرون الوسطى على قمة جبل في ضوء القمر"
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('يرجى إدخال وصف للصورة');
      return;
    }

    setIsLoading(true);
    setLastError('');
    
    try {
      console.log('🎨 بدء توليد الصورة...');
      console.log('📝 الوصف:', prompt);
      console.log('🎭 النمط:', style);
      
      const imageUrl = await generateImageWithOpenAI(prompt, style);
      
      // إضافة timestamp لضمان تحديث الصورة
      const uniqueImageUrl = `${imageUrl}?t=${Date.now()}`;
      
      setGeneratedImages([uniqueImageUrl]);
      setCurrentImageIndex(0);
      
      toast.success('تم توليد الصورة بنجاح! 🎨');
      console.log('✅ تم توليد الصورة بنجاح');
    } catch (error) {
      console.error('❌ خطأ في توليد الصورة:', error);
      const errorMessage = error.message || 'خطأ غير معروف في توليد الصورة';
      setLastError(errorMessage);
      
      // رسائل خطأ محسنة ومفصلة
      if (errorMessage.includes('مفتاح') || errorMessage.includes('API')) {
        toast.error('❌ مشكلة في مفتاح OpenAI API - تحقق من الإعدادات في Supabase');
      } else if (errorMessage.includes('حصة') || errorMessage.includes('رصيد')) {
        toast.error('💳 انتهت حصة OpenAI - تحقق من رصيدك');
      } else if (errorMessage.includes('سياسة')) {
        toast.error('⚠️ المحتوى ينتهك سياسة OpenAI - عدّل الوصف');
      } else if (errorMessage.includes('اتصال') || errorMessage.includes('خادم')) {
        toast.error('🌐 مشكلة في الاتصال - تحقق من الإنترنت وحاول مرة أخرى');
      } else {
        toast.error(`❌ خطأ: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const editCurrentImage = async () => {
    if (!editPrompt.trim() || generatedImages.length === 0) {
      toast.error('يرجى إدخال تعديلات على الصورة');
      return;
    }

    setIsLoading(true);
    setLastError('');
    
    try {
      console.log('✏️ بدء تعديل الصورة...');
      
      const combinedPrompt = `${prompt}, ${editPrompt}`;
      const editedImageUrl = await generateImageWithOpenAI(combinedPrompt, style);
      
      // إضافة timestamp لضمان تحديث الصورة
      const uniqueImageUrl = `${editedImageUrl}?t=${Date.now()}`;

      const updatedImages = [...generatedImages];
      updatedImages[currentImageIndex] = uniqueImageUrl;
      setGeneratedImages(updatedImages);
      
      setEditMode(false);
      setEditPrompt('');
      toast.success('تم تعديل الصورة بنجاح! ✨');
      console.log('✅ Image edited successfully');
    } catch (error) {
      console.error('❌ خطأ في تعديل الصورة:', error);
      const errorMessage = error.message || 'خطأ في تعديل الصورة';
      setLastError(errorMessage);
      toast.error(`فشل في تعديل الصورة: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const retryGeneration = () => {
    setLastError('');
    generateImage();
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
      toast.success('تم تحميل الصورة بنجاح! 📥');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('فشل في تحميل الصورة');
    }
  };

  const handleAIApply = (suggestion: string) => {
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
            أنشئ وعدّل صوراً مذهلة بتقنية DALL-E 3 من OpenAI
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
                    {isLoading ? '🎨 جاري الإنشاء...' : '✨ أنشئ صورة جديدة'}
                  </Button>

                  {lastError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-start gap-2 text-red-400 text-sm font-cairo">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">❌ خطأ في توليد الصورة:</div>
                          <div className="mb-2">{lastError}</div>
                          {lastError.includes('مفتاح') && (
                            <div className="text-xs text-gray-300 mt-2 p-2 bg-red-500/5 rounded">
                              💡 تلميح: تأكد من إضافة مفتاح OpenAI API في إعدادات Supabase Edge Function Secrets
                            </div>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={retryGeneration}
                        variant="outline"
                        size="sm"
                        className="mt-3 border-red-500/20 hover:bg-red-500/10 text-red-400"
                      >
                        <RefreshCw size={14} className="ml-1" />
                        حاول مرة أخرى
                      </Button>
                    </div>
                  )}
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
                      onClick={() => {setEditMode(false); setEditPrompt(''); setLastError('');}}
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
              <CardTitle className="text-right font-cairo text-white flex items-center justify-between">
                <div className="flex gap-2 text-sm">
                  {generatedImages.length > 0 && (
                    <span className="px-2 py-1 bg-green-500/20 rounded text-green-400">
                      DALL-E 3
                    </span>
                  )}
                </div>
                <span>🖼️ الصورة المولدة</span>
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
                    <p className="text-xs text-gray-500 font-cairo">باستخدام DALL-E 3</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <img 
                    src={generatedImages[currentImageIndex]} 
                    alt="Generated"
                    className="w-full h-full object-cover rounded-lg"
                    key={generatedImages[currentImageIndex]}
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-gray-400 font-cairo">الصورة ستظهر هنا</p>
                    <p className="text-xs text-gray-500 font-cairo mt-2">املأ الوصف واضغط "أنشئ صورة جديدة"</p>
                  </div>
                )}
              </div>
              
              {generatedImages.length > 0 && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 font-cairo space-y-1">
                    <div><strong>الوصف:</strong> {prompt}</div>
                    <div><strong>النمط:</strong> {artStyles.find(s => s.value === style)?.label}</div>
                    <div><strong>المولد:</strong> DALL-E 3 من OpenAI</div>
                    <div><strong>الوقت:</strong> {new Date().toLocaleString('ar-SA')}</div>
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
