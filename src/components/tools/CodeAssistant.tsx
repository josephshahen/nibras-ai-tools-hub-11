import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home } from 'lucide-react';
import { generateCodeWithOpenAI } from '@/services/aiService';
import FloatingAIAssistant from '@/components/common/FloatingAIAssistant';

interface CodeAssistantProps {
  onNavigate?: (section: string) => void;
}

const CodeAssistant = ({ onNavigate }: CodeAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');

  const languages = [
    { value: 'javascript', label: '🟨 JavaScript', description: 'ES6+, Modern JS' },
    { value: 'python', label: '🐍 Python', description: 'Python 3.x' },
    { value: 'react', label: '⚛️ React', description: 'React with hooks' },
    { value: 'html', label: '🌐 HTML', description: 'HTML5 Semantic' },
    { value: 'css', label: '🎨 CSS', description: 'CSS3, Flexbox, Grid' },
    { value: 'php', label: '🐘 PHP', description: 'PHP 8+' },
    { value: 'java', label: '☕ Java', description: 'Java 17+' },
    { value: 'csharp', label: '#️⃣ C#', description: 'C# .NET' },
    { value: 'sql', label: '🗄️ SQL', description: 'Database queries' },
    { value: 'nodejs', label: '🟢 Node.js', description: 'Node.js with Express' }
  ];

  const codeExamples = [
    'إنشاء API للمصادقة باستخدام JWT',
    'نظام إدارة المستخدمين مع قاعدة البيانات',
    'تطبيق To-Do List تفاعلي',
    'نظام حجز التذاكر الإلكترونية',
    'متجر إلكتروني بسيط مع عربة التسوق',
    'نظام إدارة المخزون',
    'تطبيق دردشة فورية',
    'نظام تقييم المنتجات'
  ];

  const generateCode = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      console.log(`💻 توليد كود ${language} للمطلب: ${prompt}`);
      const code = await generateCodeWithOpenAI(prompt, language);
      setGeneratedCode(code);
      console.log('✅ تم توليد الكود بنجاح');
    } catch (error) {
      console.error('❌ خطأ في توليد الكود:', error);
      setGeneratedCode(`// خطأ في توليد الكود للمطلب: ${prompt}
// يرجى المحاولة مرة أخرى أو تبسيط الطلب

console.log("مرحباً! هذا مثال بسيط");
// TODO: تنفيذ ${prompt}`);
    } finally {
      setIsLoading(false);
    }
  };

  const editCode = async () => {
    if (!editPrompt.trim() || !generatedCode) return;

    setIsLoading(true);
    try {
      console.log('✏️ تعديل الكود...');
      const fullPrompt = `عدّل الكود التالي:\n\n${generatedCode}\n\nالتعديل المطلوب: ${editPrompt}`;
      const editedCode = await generateCodeWithOpenAI(fullPrompt, language);
      setGeneratedCode(editedCode);
      setEditMode(false);
      setEditPrompt('');
      console.log('✅ تم تعديل الكود بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تعديل الكود:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const downloadCode = () => {
    const fileExtensions: { [key: string]: string } = {
      javascript: 'js',
      python: 'py',
      react: 'jsx',
      html: 'html',
      css: 'css',
      php: 'php',
      java: 'java',
      csharp: 'cs',
      sql: 'sql',
      nodejs: 'js'
    };

    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-code-${Date.now()}.${fileExtensions[language] || 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleAIApply = (suggestion: string) => {
    if (suggestion.includes('تعديل') || suggestion.includes('عدل')) {
      setEditPrompt(suggestion);
      setEditMode(true);
    } else if (suggestion.includes('كود') || suggestion.includes('برمج')) {
      setPrompt(suggestion);
    } else {
      setGeneratedCode(suggestion);
    }
  };

  const getCurrentContext = () => {
    return `مساعد البرمجة - الوصف: ${prompt} - اللغة: ${language} - ${generatedCode ? 'تم إنشاء كود' : 'لم يتم إنشاء كود بعد'}`;
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
            <span className="text-gradient">مساعد البرمجة</span> الذكي
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            أنشئ وعدّل أكواد احترافية بتقنية OpenAI Codex المتطورة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                💻 إعدادات الكود
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!editMode ? (
                <>
                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">وصف المطلوب برمجته</label>
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="اكتب بالتفصيل ما تريد برمجته... كلما كان الوصف أوضح، كان الكود أفضل"
                      className="h-32 resize-none font-cairo bg-white/5 border-white/20 text-right"
                    />
                    <div className="text-xs text-gray-400 mt-2 font-cairo">
                      💡 نصيحة: اذكر المتطلبات والوظائف المطلوبة بوضوح
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">لغة البرمجة</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value} className="font-cairo">
                            <div className="text-right">
                              <div className="font-semibold">{lang.label}</div>
                              <div className="text-xs text-gray-400">{lang.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateCode}
                    disabled={isLoading || !prompt.trim()}
                    className="btn-gradient w-full py-3"
                  >
                    {isLoading ? '💻 جاري البرمجة...' : '✨ أنشئ الكود'}
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-cairo text-white mb-2">تعديلات على الكود</label>
                    <Textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="اكتب التعديلات المطلوبة: أضف ميزة، غيّر منطق، أصلح خطأ..."
                      className="h-32 resize-none font-cairo bg-white/5 border-white/20 text-right"
                    />
                    <div className="text-xs text-gray-400 mt-2 font-cairo">
                      مثال: "أضف validation"، "غيّر إلى async/await"، "أضف error handling"
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={editCode}
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

              {generatedCode && !editMode && (
                <div className="space-y-2">
                  <Button 
                    onClick={() => setEditMode(true)}
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/10"
                  >
                    ✏️ عدّل الكود
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={copyCode}
                      variant="outline"
                      className="border-white/20 hover:bg-white/10"
                    >
                      📋 نسخ
                    </Button>
                    <Button 
                      onClick={downloadCode}
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
                  {generatedCode && (
                    <>
                      <span className="px-2 py-1 bg-primary/20 rounded text-primary">
                        {languages.find(l => l.value === language)?.label}
                      </span>
                      <span className="px-2 py-1 bg-green-500/20 rounded text-green-400">
                        OpenAI Codex
                      </span>
                    </>
                  )}
                </div>
                <span className="flex items-center gap-2">
                  📝 الكود المولد
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/50 rounded-lg border border-white/10 overflow-hidden">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-white border-r-blue-400 border-b-purple-400 border-l-pink-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-400 font-cairo mb-2">
                      {editMode ? '✏️ جاري تعديل الكود...' : '💻 جاري إنشاء الكود...'}
                    </p>
                    <p className="text-xs text-gray-500 font-cairo">يتم استخدام OpenAI Codex للحصول على أفضل النتائج</p>
                  </div>
                ) : generatedCode ? (
                  <div className="relative">
                    <pre className="p-4 text-sm text-gray-100 font-mono overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">💻</div>
                    <p className="text-gray-400 font-cairo">الكود سيظهر هنا</p>
                    <p className="text-xs text-gray-500 font-cairo mt-2">اكتب وصفاً للمطلوب واضغط "أنشئ الكود"</p>
                  </div>
                )}
              </div>
              
              {generatedCode && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 font-cairo space-y-1">
                    <div><strong>الوصف:</strong> {prompt}</div>
                    <div><strong>اللغة:</strong> {languages.find(l => l.value === language)?.label}</div>
                    <div><strong>المولد:</strong> OpenAI Codex GPT-4</div>
                    <div><strong>الميزات:</strong> كود احترافي، تعليقات عربية، معالجة أخطاء</div>
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
              {codeExamples.map((example, index) => (
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

export default CodeAssistant;
