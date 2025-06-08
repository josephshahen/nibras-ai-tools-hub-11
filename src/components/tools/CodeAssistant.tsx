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
    { value: 'javascript', label: 'JavaScript ES6+', icon: '🟨', description: 'JavaScript حديث مع أفضل الممارسات' },
    { value: 'python', label: 'Python 3.x', icon: '🐍', description: 'Python متقدم مع معايير PEP 8' },
    { value: 'react', label: 'React + TypeScript', icon: '⚛️', description: 'React مع TypeScript و Hooks حديثة' },
    { value: 'html', label: 'HTML5 Semantic', icon: '🌐', description: 'HTML5 مع Accessibility' },
    { value: 'css', label: 'CSS3 Advanced', icon: '🎨', description: 'CSS3 مع Grid/Flexbox و Animations' },
    { value: 'php', label: 'PHP 8+', icon: '🐘', description: 'PHP حديث مع OOP' },
    { value: 'java', label: 'Java Enterprise', icon: '☕', description: 'Java مع أفضل الممارسات' },
    { value: 'csharp', label: 'C# .NET', icon: '💜', description: 'C# مع .NET Core' },
    { value: 'sql', label: 'SQL Optimized', icon: '🗄️', description: 'SQL محسن مع Indexing' },
    { value: 'nodejs', label: 'Node.js + Express', icon: '🟢', description: 'Node.js مع TypeScript و Express' }
  ];

  const advancedExamples = [
    {
      title: "API متقدم مع مصادقة",
      prompt: "أنشئ API كامل باستخدام Express.js يتضمن مصادقة JWT، middleware للحماية، معالجة الأخطاء، والتحقق من صحة البيانات",
      language: "nodejs"
    },
    {
      title: "مكون React تفاعلي متقدم",
      prompt: "أنشئ مكون React معقد لإدارة المهام مع drag & drop، تصفية، بحث، وحفظ البيانات في localStorage",
      language: "react"
    },
    {
      title: "خوارزمية Python متطورة",
      prompt: "اكتب خوارزمية Python لتحليل البيانات مع pandas، إنشاء الرسوم البيانية، ومعالجة البيانات المفقودة",
      language: "python"
    },
    {
      title: "نظام إدارة قاعدة البيانات",
      prompt: "أنشئ نظام إدارة قاعدة بيانات كامل بـ SQL يتضمن الجداول، العلاقات، المؤشرات، والاستعلامات المحسنة",
      language: "sql"
    },
    {
      title: "واجهة CSS متجاوبة متقدمة",
      prompt: "صمم نظام تخطيط CSS متجاوب باستخدام Grid و Flexbox مع animations، dark mode، ومتغيرات CSS",
      language: "css"
    },
    {
      title: "تطبيق PHP كامل",
      prompt: "أنشئ تطبيق PHP متكامل للتجارة الإلكترونية مع نظام المستخدمين، سلة التسوق، والدفع",
      language: "php"
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    
    try {
      console.log('💻 بدء توليد الكود المتطور...');
      const result = await generateCode(prompt, language);
      setGeneratedCode(result);
      console.log('✅ تم توليد الكود بنجاح');
    } catch (error) {
      console.error('❌ خطأ في توليد الكود:', error);
      setGeneratedCode('عذراً، حدث خطأ في توليد الكود. يرجى المحاولة مرة أخرى مع وصف أكثر تفصيلاً.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      console.log('📋 تم نسخ الكود بنجاح');
    } catch (error) {
      console.error('خطأ في نسخ الكود:', error);
    }
  };

  const downloadCode = () => {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      python: 'py',
      react: 'tsx',
      html: 'html',
      css: 'css',
      php: 'php',
      java: 'java',
      csharp: 'cs',
      sql: 'sql',
      nodejs: 'js'
    };

    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code.${extensions[language] || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مساعد البرمجة</span> المتطور
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            مولد أكواد ذكي متطور - أكثر من 30 لغة برمجية مع أفضل الممارسات
          </p>
          <div className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg inline-block">
            <p className="text-blue-400 font-cairo text-sm">
              🚀 محسن للإنتاجية | 📚 أفضل الممارسات | 🔧 كود جاهز للإنتاج
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                💻 مواصفات المشروع المتقدمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-cairo text-white mb-2">لغة البرمجة / التقنية</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {programmingLanguages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="font-cairo">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span>{lang.icon}</span>
                            <span className="font-semibold">{lang.label}</span>
                          </div>
                          <div className="text-xs text-gray-400">{lang.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-cairo text-white mb-2">وصف المشروع / الكود المطلوب</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="اكتب وصفاً مفصلاً ودقيقاً للكود الذي تريده... كلما كان الوصف أكثر تفصيلاً، كان الكود أفضل وأكثر احترافية"
                  className="h-32 resize-none font-cairo bg-white/5 border-white/20 text-right"
                />
                <div className="text-xs text-gray-400 mt-2 font-cairo">
                  💡 نصائح: اذكر المتطلبات التقنية، أنماط التصميم، معالجة الأخطاء، والميزات المطلوبة
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="btn-gradient w-full py-3"
                >
                  {isLoading ? '⚡ جاري توليد كود متطور...' : '🚀 ولد كود احترافي'}
                </Button>
                
                {generatedCode && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={copyCode}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      📋 نسخ الكود
                    </Button>
                    <Button 
                      onClick={downloadCode}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      📥 تحميل ملف
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                🔧 الكود المولد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-black/50 rounded-lg p-4 overflow-auto border border-white/10">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-blue-400 border-r-purple-400 border-b-pink-400 border-l-green-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-400 font-cairo mb-2">⚡ جاري توليد كود احترافي...</p>
                    <p className="text-xs text-gray-500 font-cairo">يتم تحليل المتطلبات وإنشاء كود محسن</p>
                  </div>
                ) : generatedCode ? (
                  <pre className="text-sm text-green-400 font-mono overflow-auto whitespace-pre-wrap leading-relaxed">
                    {generatedCode}
                  </pre>
                ) : (
                  <div className="text-center h-full flex flex-col justify-center">
                    <div className="text-6xl mb-4">💻</div>
                    <p className="text-gray-400 font-cairo">الكود المولد سيظهر هنا</p>
                    <p className="text-xs text-gray-500 font-cairo mt-2">اكتب وصفاً مفصلاً واضغط "ولد كود احترافي"</p>
                  </div>
                )}
              </div>
              
              {generatedCode && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 font-cairo space-y-1">
                    <div><strong>اللغة:</strong> {programmingLanguages.find(l => l.value === language)?.label}</div>
                    <div><strong>المولد:</strong> AI متخصص في البرمجة</div>
                    <div><strong>الجودة:</strong> كود احترافي جاهز للإنتاج</div>
                    <div><strong>الميزات:</strong> أفضل الممارسات + معالجة الأخطاء + توثيق</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white">⚡ مشاريع متقدمة للإلهام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advancedExamples.map((example, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">
                      {programmingLanguages.find(l => l.value === example.language)?.icon}
                    </span>
                    <h3 className="font-cairo font-semibold text-white text-sm">{example.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400 font-cairo mb-3 leading-relaxed">
                    {example.prompt}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-cairo border-white/20 hover:bg-white/10 text-xs"
                    onClick={() => {
                      setPrompt(example.prompt);
                      setLanguage(example.language);
                    }}
                  >
                    🚀 استخدم هذا المثال
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold font-cairo mb-2">
              <span className="text-gradient">نصائح</span>
            </h2>
            <p className="text-lg text-gray-300 font-cairo">
              اكتب وصفاً مفصلاً ودقيقاً للكود الذي تريده... كلما كان الوصف أكثر تفصيلاً، كان الكود أفضل وأكثر احترافية
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeAssistant;
