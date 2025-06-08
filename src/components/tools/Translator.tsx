import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translateText } from '@/services/aiService';

const Translator = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('ar');
  const [targetLang, setTargetLang] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: 'auto', name: 'كشف تلقائي', flag: '🌐' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'zh-cn', name: '中文 (简体)', flag: '🇨🇳' },
    { code: 'zh-tw', name: '中文 (繁體)', flag: '🇹🇼' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'pt-br', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
    { code: 'sr', name: 'Српски', flag: '🇷🇸' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsLoading(true);
    
    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (error) {
      setTranslatedText('عذراً، حدث خطأ في الترجمة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const quickPhrases = [
    "مرحباً، كيف حالك؟",
    "شكراً لك",
    "أين يمكنني أن أجد...؟",
    "كم السعر؟",
    "أعتذر، لا أتحدث هذه اللغة",
    "هل يمكنك مساعدتي؟"
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مترجم</span> فوري
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            ترجمة فورية بين أكثر من 100 لغة حول العالم
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-center font-cairo text-white flex items-center justify-center gap-2">
              🌐 أداة الترجمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              <div className="flex-1 w-full">
                <label className="block text-sm font-cairo text-white mb-2">من</label>
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="font-cairo">
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={swapLanguages}
                variant="outline"
                size="icon"
                className="border-white/20 hover:bg-white/10 self-end"
              >
                🔄
              </Button>

              <div className="flex-1 w-full">
                <label className="block text-sm font-cairo text-white mb-2">إلى</label>
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="font-cairo">
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-cairo text-white mb-2">النص المراد ترجمته</label>
                <Textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="اكتب النص هنا..."
                  className="h-40 resize-none font-cairo bg-white/5 border-white/20"
                />
                <div className="text-xs text-gray-400 mt-2 font-cairo">
                  {sourceText.length} حرف
                </div>
              </div>

              <div>
                <label className="block text-sm font-cairo text-white mb-2">النص المترجم</label>
                <div className="h-40 p-3 bg-white/5 border border-white/20 rounded-md font-cairo text-white overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  ) : (
                    translatedText || 'الترجمة ستظهر هنا...'
                  )}
                </div>
                {translatedText && (
                  <div className="text-xs text-gray-400 mt-2 font-cairo">
                    {translatedText.length} حرف
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleTranslate}
              disabled={isLoading || !sourceText.trim()}
              className="btn-gradient w-full mt-6"
            >
              {isLoading ? 'جاري الترجمة...' : 'ترجم النص'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white">⚡ عبارات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickPhrases.map((phrase, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-right font-cairo border-white/20 hover:bg-white/10 h-auto py-3"
                  onClick={() => setSourceText(phrase)}
                >
                  {phrase}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Translator;
