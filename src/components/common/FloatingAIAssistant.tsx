
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X, Minimize2, Maximize2, Move, Sparkles, Edit3 } from 'lucide-react';
import { chatWithAI } from '@/services/aiService';

interface FloatingAIAssistantProps {
  context?: string;
  onApply?: (suggestion: string) => void;
}

const FloatingAIAssistant = ({ context, onApply }: FloatingAIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number, text: string, isBot: boolean}>>([
    { id: 1, text: 'مرحباً! أنا مساعدك الذكي للتعديل والتحسين. كيف يمكنني مساعدتك؟', isBot: true }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleSend = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = { id: Date.now(), text: currentMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    try {
      let enhancedPrompt = messageToSend;
      if (context) {
        enhancedPrompt = `السياق الحالي: ${context}

الطلب من المستخدم: ${messageToSend}

قدم اقتراحات محددة وعملية للتعديل والتحسين بناءً على السياق. اجعل اقتراحاتك:
- محددة وقابلة للتطبيق مباشرة
- مناسبة للسياق المعطى
- مفيدة للمستخدم
- واضحة ومختصرة

إذا كان السياق متعلق بالصور، اقترح تعديلات على الوصف أو النمط
إذا كان متعلق بالكود، اقترح تحسينات أو ميزات جديدة
إذا كان متعلق بالمواقع، اقترح تحسينات على التصميم أو المحتوى`;
      }

      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));

      const response = await chatWithAI(enhancedPrompt, conversationHistory);
      
      const botResponse = { 
        id: Date.now() + 1, 
        text: response, 
        isBot: true 
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = { 
        id: Date.now() + 1, 
        text: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 
        isBot: true 
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyLastSuggestion = () => {
    const lastBotMessage = [...messages].reverse().find(m => m.isBot);
    if (lastBotMessage && onApply) {
      onApply(lastBotMessage.text);
    }
  };

  const getSmartSuggestions = () => {
    if (!context) return [];
    
    if (context.includes('مولد الصور')) {
      return [
        'حسّن جودة الوصف',
        'اقترح نمط فني مختلف',
        'أضف تفاصيل أكثر للصورة'
      ];
    } else if (context.includes('مساعد البرمجة')) {
      return [
        'أضف معالجة للأخطاء',
        'حسّن أداء الكود',
        'اقترح ميزات جديدة'
      ];
    } else if (context.includes('مولد المواقع')) {
      return [
        'حسّن تصميم الموقع',
        'أضف أقسام جديدة',
        'اقترح محتوى أفضل'
      ];
    } else if (context.includes('شات بوت')) {
      return [
        'اطرح سؤال أعمق',
        'اطلب شرح مفصل',
        'اقترح موضوع جديد'
      ];
    }
    
    return [
      'كيف يمكنني التحسين؟',
      'اقترح تعديلات',
      'ما هي أفضل الممارسات؟'
    ];
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full btn-gradient shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        style={{ transform: 'scale(1.05)' }}
      >
        <div className="flex flex-col items-center">
          <Sparkles size={20} />
          <span className="text-xs font-cairo">AI</span>
        </div>
      </Button>
    );
  }

  return (
    <Card
      ref={cardRef}
      className="fixed z-50 bg-black/95 backdrop-blur-sm border-white/20 shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? '350px' : '450px',
        height: isMinimized ? '60px' : '550px',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <CardHeader 
        className="pb-2 cursor-grab active:cursor-grabbing bg-gradient-to-r from-blue-600/20 to-purple-600/20"
        onMouseDown={handleMouseDown}
      >
        <CardTitle className="text-right font-cairo text-white flex items-center justify-between text-sm">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              <X size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-blue-400 animate-pulse" />
            🤖 المساعد الذكي للتعديل
            <Move size={16} className="opacity-50" />
          </div>
        </CardTitle>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="space-y-4 h-[450px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-black/20 rounded-lg max-h-60">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg font-cairo text-xs ${
                    message.isBot
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white p-2 rounded-lg font-cairo text-xs border border-blue-400/30">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* اقتراحات سريعة */}
          <div className="space-y-2">
            <div className="text-xs text-gray-400 font-cairo">⚡ اقتراحات سريعة:</div>
            <div className="grid grid-cols-1 gap-1">
              {getSmartSuggestions().map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs font-cairo border-white/20 hover:bg-white/10 h-auto py-1 text-wrap"
                  onClick={() => setCurrentMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="اطلب تعديلات أو اقتراحات محددة..."
              className="resize-none font-cairo text-right bg-white/5 border-white/20 text-xs h-16"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !currentMessage.trim()}
                className="btn-gradient flex-1 text-xs py-1"
              >
                <MessageCircle size={12} className="mr-1" />
                إرسال
              </Button>
              {onApply && (
                <Button 
                  onClick={applyLastSuggestion}
                  variant="outline"
                  className="border-green-400/40 hover:bg-green-400/10 text-green-400 text-xs py-1"
                >
                  <Edit3 size={12} className="mr-1" />
                  تطبيق
                </Button>
              )}
            </div>
          </div>

          {context && (
            <div className="text-xs text-gray-500 font-cairo bg-white/5 p-2 rounded">
              <strong>السياق:</strong> {context.length > 100 ? context.substring(0, 100) + '...' : context}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default FloatingAIAssistant;
