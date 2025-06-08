
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Home, Trash2, Save } from 'lucide-react';
import { chatWithAI } from '@/services/aiService';
import FloatingAIAssistant from '@/components/common/FloatingAIAssistant';

interface ChatBotProps {
  onNavigate?: (section: string) => void;
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = ({ onNavigate }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟', isBot: true, timestamp: new Date() }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // حفظ المحادثات في localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    }
  }, []);

  // حفظ المحادثات عند تغييرها
  useEffect(() => {
    if (messages.length > 1) { // لا نحفظ إذا كانت فقط رسالة الترحيب الافتراضية
      localStorage.setItem('chatbot-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = { 
      id: Date.now(), 
      text: currentMessage, 
      isBot: false, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));

      const response = await chatWithAI(messageToSend, conversationHistory);
      
      const botResponse: Message = { 
        id: Date.now() + 1, 
        text: response, 
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = { 
        id: Date.now() + 1, 
        text: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    const confirmClear = window.confirm('هل أنت متأكد من حذف جميع المحادثات؟');
    if (confirmClear) {
      const initialMessage: Message = {
        id: 1,
        text: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
        isBot: true,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      localStorage.removeItem('chatbot-messages');
    }
  };

  const saveChat = () => {
    const chatData = {
      messages,
      timestamp: new Date(),
      title: `محادثة ${new Date().toLocaleDateString('ar-SA')}`
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const quickQuestions = [
    "ما هو الذكاء الاصطناعي؟",
    "كيف أتعلم البرمجة؟",
    "اشرح لي الفرق بين React و Vue",
    "ما هي أفضل لغات البرمجة للمبتدئين؟",
    "كيف أحسن أداء موقعي؟",
    "ما هي أحدث تقنيات الويب؟"
  ];

  const handleAIApply = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };

  const getCurrentContext = () => {
    const lastUserMessage = [...messages].reverse().find(m => !m.isBot);
    const lastBotMessage = [...messages].reverse().find(m => m.isBot);
    return `شات بوت ذكي - آخر سؤال: ${lastUserMessage?.text || 'لا يوجد'} - آخر إجابة: ${lastBotMessage?.text?.substring(0, 100) || 'لا يوجد'}...`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
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
            
            <div className="flex gap-2">
              <Button
                onClick={saveChat}
                variant="outline"
                className="border-white/20 hover:bg-white/10 flex items-center gap-2"
                title="حفظ المحادثة"
              >
                <Save size={16} />
                حفظ
              </Button>
              <Button
                onClick={clearChat}
                variant="outline"
                className="border-red-500/20 hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                title="مسح المحادثة"
              >
                <Trash2 size={16} />
                مسح
              </Button>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">شات بوت</span> ذكي
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            تحدث مع مساعدك الذكي واحصل على إجابات فورية مع إمكانية التعديل والتحسين
          </p>
        </div>

        {/* منطقة المحادثة */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-right font-cairo text-white flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {messages.length > 1 ? `${messages.length - 1} رسالة` : 'محادثة جديدة'}
              </span>
              <span className="flex items-center gap-2">
                💬 المحادثة الذكية
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-black/20 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <div
                      className={`p-3 rounded-lg font-cairo ${
                        message.isBot
                          ? 'bg-white/10 text-white'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                    <span className={`text-xs text-gray-400 px-2 ${message.isBot ? 'text-left' : 'text-right'}`}>
                      {formatTime(message.timestamp)}
                    </span>
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
            <CardTitle className="text-right font-cairo text-white">⚡ أسئلة سريعة ومتطورة</CardTitle>
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

      <FloatingAIAssistant 
        context={getCurrentContext()}
        onApply={handleAIApply}
      />
    </div>
  );
};

export default ChatBot;
