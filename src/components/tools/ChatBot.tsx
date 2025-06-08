
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const ChatBot = () => {
  const [messages, setMessages] = useState<Array<{id: number, text: string, isBot: boolean}>>([
    { id: 1, text: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟', isBot: true }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = { id: Date.now(), text: currentMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // محاكاة استجابة الشات بوت
    setTimeout(() => {
      const botResponse = { 
        id: Date.now() + 1, 
        text: `شكراً لك على سؤالك: "${currentMessage}". هذا مثال على رد الشات بوت. في النسخة الكاملة، سيتم ربط الموقع بخدمة ذكاء اصطناعي حقيقية لتقديم إجابات مفيدة ودقيقة.`, 
        isBot: true 
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const quickQuestions = [
    "ما هو الذكاء الاصطناعي؟",
    "كيف أتعلم البرمجة؟",
    "اشرح لي الفرق بين React و Vue",
    "ما هي أفضل لغات البرمجة للمبتدئين؟"
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">شات بوت</span> ذكي
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            تحدث مع مساعدك الذكي واحصل على إجابات فورية
          </p>
        </div>

        {/* منطقة المحادثة */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
              💬 المحادثة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-black/20 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg font-cairo ${
                      message.isBot
                        ? 'bg-white/10 text-white'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white p-3 rounded-lg font-cairo">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="resize-none font-cairo text-right bg-white/5 border-white/20"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !currentMessage.trim()}
                className="btn-gradient min-w-[100px]"
              >
                إرسال
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* أسئلة سريعة */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white">⚡ أسئلة سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-right font-cairo border-white/20 hover:bg-white/10 h-auto py-3 text-wrap"
                  onClick={() => setCurrentMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;
