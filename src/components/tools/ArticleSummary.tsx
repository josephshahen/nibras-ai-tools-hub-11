import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { summarizeText } from '@/services/aiService';

const ArticleSummary = () => {
  const [articleText, setArticleText] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!articleText.trim()) return;

    setIsLoading(true);
    
    try {
      const result = await summarizeText(articleText, summaryLength);
      setSummary(result);
    } catch (error) {
      setSummary('عذراً، حدث خطأ في تلخيص النص. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleArticles = [
    {
      title: "مقال تقني عن الذكاء الاصطناعي",
      content: "الذكاء الاصطناعي هو مجال متطور في علوم الحاسوب يهدف إلى إنشاء أنظمة قادرة على أداء مهام تتطلب ذكاءً بشرياً. يشمل هذا المجال العديد من التقنيات مثل التعلم الآلي والشبكات العصبية والمعالجة الطبيعية للغة. تطبيقات الذكاء الاصطناعي موجودة في كل مكان حولنا، من محركات البحث إلى السيارات ذاتية القيادة والمساعدات الصوتية الذكية."
    },
    {
      title: "مقال عن تطوير الويب",
      content: "تطوير الويب الحديث يشمل العديد من التقنيات والأدوات المتقدمة مثل React وVue وAngular لتطوير واجهات المستخدم، بالإضافة إلى Node.js وPython لتطوير الخادم. أصبحت مواقع الويب اليوم أكثر تفاعلية وديناميكية من أي وقت مضى، مع استخدام تقنيات مثل Progressive Web Apps وSingle Page Applications."
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">تلخيص</span> المقالات
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            لخص المقالات الطويلة والمستندات في ثوانٍ معدودة
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-center font-cairo text-white flex items-center justify-center gap-2">
              📰 أداة التلخيص الذكي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-cairo text-white mb-2">طول الملخص</label>
                <Select value={summaryLength} onValueChange={setSummaryLength}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    <SelectItem value="short" className="font-cairo">📝 مختصر (2-3 جمل)</SelectItem>
                    <SelectItem value="medium" className="font-cairo">📄 متوسط (فقرة واحدة)</SelectItem>
                    <SelectItem value="long" className="font-cairo">📋 مفصل (عدة فقرات)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-cairo text-white mb-2">النص أو المقال</label>
                <Textarea
                  value={articleText}
                  onChange={(e) => setArticleText(e.target.value)}
                  placeholder="الصق المقال أو النص هنا..."
                  className="h-64 resize-none font-cairo bg-white/5 border-white/20"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400 font-cairo">
                    {articleText.length} حرف
                  </span>
                  <span className="text-xs text-gray-400 font-cairo">
                    ~{Math.floor(articleText.length / 5)} كلمة
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-cairo text-white mb-2">الملخص</label>
                <div className="h-64 p-3 bg-white/5 border border-white/20 rounded-md font-cairo text-white overflow-y-auto">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="flex gap-1 mb-4">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <p className="text-sm text-gray-400">جاري تحليل النص وإنتاج الملخص...</p>
                    </div>
                  ) : (
                    summary || 'الملخص سيظهر هنا بعد إدخال النص والضغط على "لخص النص"'
                  )}
                </div>
                {summary && (
                  <div className="text-xs text-gray-400 mt-2 font-cairo">
                    نسبة الضغط: {Math.round((1 - summary.length / articleText.length) * 100)}%
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleSummarize}
              disabled={isLoading || !articleText.trim()}
              className="btn-gradient w-full mt-6"
            >
              {isLoading ? 'جاري التلخيص...' : 'لخص النص'}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white">⚡ أمثلة سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleArticles.map((article, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="font-cairo font-semibold text-white mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-400 font-cairo mb-3 line-clamp-2">
                    {article.content}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-cairo border-white/20 hover:bg-white/10"
                    onClick={() => setArticleText(article.content)}
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

export default ArticleSummary;
