
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X, Minimize2, Maximize2, Move } from 'lucide-react';
import { chatWithAI } from '@/services/aiService';

interface FloatingAIAssistantProps {
  context?: string;
  onApply?: (suggestion: string) => void;
}

const FloatingAIAssistant = ({ context, onApply }: FloatingAIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number, text: string, isBot: boolean}>>([
    { id: 1, text: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك في التعديل؟', isBot: true }
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
        enhancedPrompt = `السياق: ${context}\n\nالطلب: ${messageToSend}\n\nقدم اقتراحات للتعديل والتحسين بناءً على السياق المعطى.`;
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

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full btn-gradient shadow-lg hover:shadow-xl transition-all duration-300"
        style={{ transform: 'scale(1.05)' }}
      >
        <MessageCircle size={24} />
      </Button>
    );
  }

  return (
    <Card
      ref={cardRef}
      className="fixed z-50 bg-black/90 backdrop-blur-sm border-white/20 shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? '300px' : '400px',
        height: isMinimized ? '60px' : '500px',
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <CardHeader 
        className="pb-2 cursor-grab active:cursor-grabbing"
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
            🤖 المساعد الذكي
            <Move size={16} className="opacity-50" />
          </div>
        </CardTitle>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="space-y-4 h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-black/20 rounded-lg max-h-60">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg font-cairo text-xs ${
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
                <div className="bg-white/10 text-white p-2 rounded-lg font-cairo text-xs">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="اطلب تعديلات أو اقتراحات..."
              className="resize-none font-cairo text-right bg-white/5 border-white/20 text-xs h-16"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !currentMessage.trim()}
                className="btn-gradient flex-1 text-xs py-1"
              >
                إرسال
              </Button>
              {onApply && (
                <Button 
                  onClick={applyLastSuggestion}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-xs py-1"
                >
                  تطبيق
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FloatingAIAssistant;
