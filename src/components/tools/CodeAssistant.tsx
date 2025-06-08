import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateCode } from '@/services/aiService';

const CodeAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);

  const programmingLanguages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'react', label: 'React', icon: '⚛️' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'php', label: 'PHP', icon: '🐘' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'csharp', label: 'C#', icon: '💜' },
    { value: 'sql', label: 'SQL', icon: '🗄️' },
    { value: 'nodejs', label: 'Node.js', icon: '🟢' }
  ];

  const codeExamples = [
    {
      title: "إنشاء API بسيط",
      prompt: "أنشئ API بسيط باستخدام Express.js للحصول على قائمة المستخدمين",
      language: "nodejs"
    },
    {
      title: "مكون React للعداد",
      prompt: "أنشئ مكون React لعداد بأزرار زيادة ونقصان",
      language: "react"
    },
    {
      title: "دالة Python لفرز القائمة",
      prompt: "اكتب دالة Python لفرز قائمة من الأرقام",
      language: "python"
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    try {
      const result = await generateCode(prompt, language);
      setGeneratedCode(result);
    } catch (error) {
      setGeneratedCode('عذراً، حدث خطأ في توليد الكود. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مساعد</span> البرمجة
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            مولد أكواد ذكي بـ 30+ لغة برمجية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                💻 طلب البرمجة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-cairo text-white mb-2">لغة البرمجة</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {programmingLanguages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="font-cairo">
                        {lang.icon} {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-cairo text-white mb-2">وصف الكود المطلوب</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="اكتب وصفاً مفصلاً للكود الذي تريده..."
                  className="h-32 resize-none font-cairo bg-white/5 border-white/20 text-right"
                />
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="btn-gradient w-full"
              >
                {isLoading ? 'جاري توليد الكود...' : 'ولد الكود'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-between">
                <Button 
                  onClick={copyCode}
                  variant="outline"
                  size="sm"
                  disabled={!generatedCode}
                  className="border-white/20 hover:bg-white/10"
                >
                  📋 نسخ
                </Button>
                <span className="flex items-center gap-2">
                  🔧 الكود المولد
                </span>
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
                    <p className="text-sm text-gray-400 font-cairo">جاري توليد الكود...</p>
                  </div>
                ) : generatedCode ? (
                  <pre className="text-sm text-green-400 font-mono overflow-auto whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                ) : (
                  <div className="text-gray-400 font-cairo text-center">
                    الكود سيظهر هنا بعد كتابة الطلب
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white">⚡ أمثلة سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {codeExamples.map((example, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="font-cairo font-semibold text-white mb-2">{example.title}</h3>
                  <p className="text-sm text-gray-400 font-cairo mb-3">
                    {example.prompt}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-cairo border-white/20 hover:bg-white/10"
                    onClick={() => {
                      setPrompt(example.prompt);
                      setLanguage(example.language);
                    }}
                  >
                    استخدم هذا المثال
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeAssistant;
