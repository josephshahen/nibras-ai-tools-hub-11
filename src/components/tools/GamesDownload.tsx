
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { searchGames, chatWithAI } from '@/services/aiService';

interface GameInfo {
  name: string;
  description: string;
  platform: string;
  size: string;
  rating: number;
  metacriticScore: string;
  category: string;
  releaseYear: string;
  developer: string;
  publisher: string;
  downloadLinks: {
    official: string;
    free: string;
    demos: string;
  };
  systemRequirements: {
    minimum: string;
    recommended: string;
  };
  features: string[];
  pros: string[];
  cons: string[];
  alternatives: string[];
  price: string;
  ageRating: string;
  languages: string[];
  awards: string[];
  error?: boolean;
}

const GamesDownload = () => {
  const [gameName, setGameName] = useState('');
  const [platform, setPlatform] = useState('PC');
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: number, text: string, isBot: boolean}>>([
    { id: 1, text: 'مرحباً! أنا مساعدك في عالم الألعاب. اسألني عن أي لعبة تريد معرفة تفاصيل عنها!', isBot: true }
  ]);
  const [currentChatMessage, setCurrentChatMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const platforms = [
    { value: 'PC', label: '🖥️ كمبيوتر شخصي (PC)', description: 'Windows, Mac, Linux' },
    { value: 'PlayStation', label: '🎮 بلايستيشن', description: 'PS4, PS5' },
    { value: 'Xbox', label: '🎯 إكس بوكس', description: 'Xbox One, Series X/S' },
    { value: 'Nintendo', label: '🎨 نينتندو', description: 'Switch, 3DS' },
    { value: 'Mobile', label: '📱 الهاتف المحمول', description: 'Android, iOS' },
    { value: 'VR', label: '🥽 الواقع الافتراضي', description: 'Meta Quest, PSVR' }
  ];

  const popularGames = [
    'Call of Duty',
    'FIFA 2024',
    'Minecraft',
    'Grand Theft Auto V',
    'Fortnite',
    'League of Legends',
    'Cyberpunk 2077',
    'Assassin\'s Creed'
  ];

  const searchGame = async () => {
    if (!gameName.trim()) return;

    setIsLoading(true);
    try {
      console.log(`🔍 البحث عن لعبة: ${gameName} لمنصة ${platform}`);
      const result = await searchGames(gameName, platform);
      setGameInfo(result);
      console.log('✅ تم الحصول على معلومات اللعبة');
    } catch (error) {
      console.error('❌ خطأ في البحث:', error);
      setGameInfo({
        name: gameName,
        description: 'عذراً، حدث خطأ في البحث. يرجى المحاولة مرة أخرى.',
        platform: platform,
        error: true
      } as GameInfo);
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!currentChatMessage.trim()) return;

    const userMessage = { id: Date.now(), text: currentChatMessage, isBot: false };
    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentChatMessage;
    setCurrentChatMessage('');
    setIsChatLoading(true);

    try {
      const conversationHistory = chatMessages.slice(-5).map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));

      const gameContext = gameInfo ? `معلومات اللعبة الحالية: ${gameInfo.name} - ${gameInfo.description}` : '';
      const fullMessage = `${gameContext}\n\nسؤال المستخدم: ${messageToSend}`;

      const response = await chatWithAI(fullMessage, conversationHistory);
      
      const botResponse = { 
        id: Date.now() + 1, 
        text: response, 
        isBot: true 
      };
      setChatMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = { 
        id: Date.now() + 1, 
        text: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 
        isBot: true 
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getDownloadButton = (link: string, label: string, icon: string) => {
    if (!link || link === 'جاري البحث...' || link === 'غير متوفر') {
      return (
        <Button variant="outline" disabled className="border-white/20 text-gray-500">
          {icon} {label} - غير متوفر
        </Button>
      );
    }
    
    return (
      <Button 
        variant="outline" 
        className="border-white/20 hover:bg-white/10"
        onClick={() => window.open(link.includes('http') ? link : `https://${link}`, '_blank')}
      >
        {icon} {label}
      </Button>
    );
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">قاعدة بيانات</span> الألعاب
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            اكتشف أفضل الألعاب مع معلومات شاملة وروابط التحميل المجانية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* البحث عن الألعاب */}
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                🔍 البحث عن الألعاب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-cairo text-white mb-2">اسم اللعبة</label>
                <Input
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="أدخل اسم اللعبة..."
                  className="bg-white/5 border-white/20 font-cairo text-right"
                  onKeyPress={(e) => e.key === 'Enter' && searchGame()}
                />
              </div>

              <div>
                <label className="block text-sm font-cairo text-white mb-2">المنصة</label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {platforms.map((platformOption) => (
                      <SelectItem key={platformOption.value} value={platformOption.value} className="font-cairo">
                        <div className="text-right">
                          <div className="font-semibold">{platformOption.label}</div>
                          <div className="text-xs text-gray-400">{platformOption.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={searchGame}
                disabled={isLoading || !gameName.trim()}
                className="btn-gradient w-full"
              >
                {isLoading ? '🔍 جاري البحث...' : '🎮 ابحث عن اللعبة'}
              </Button>

              <div className="mt-6">
                <h3 className="text-sm font-cairo text-white mb-2">ألعاب شائعة:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularGames.map((game, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs font-cairo border-white/20 hover:bg-white/10"
                      onClick={() => setGameName(game)}
                    >
                      {game}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* معلومات اللعبة */}
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                🎮 معلومات اللعبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-white border-r-blue-400 border-b-purple-400 border-l-pink-400 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-400 font-cairo">جاري البحث عن معلومات اللعبة...</p>
                </div>
              ) : gameInfo ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold font-cairo text-white mb-2">{gameInfo.name}</h2>
                    <div className="flex justify-center gap-4 text-sm">
                      <span className="bg-primary/20 px-2 py-1 rounded text-primary">{gameInfo.platform}</span>
                      <span className="bg-green-500/20 px-2 py-1 rounded text-green-400">⭐ {gameInfo.rating}/10</span>
                      {gameInfo.metacriticScore && (
                        <span className="bg-yellow-500/20 px-2 py-1 rounded text-yellow-400">🎯 {gameInfo.metacriticScore}</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="font-cairo font-semibold text-white mb-2">📝 الوصف</h3>
                    <p className="text-gray-300 font-cairo text-sm leading-relaxed">{gameInfo.description}</p>
                  </div>

                  {gameInfo.developer && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-cairo font-semibold text-white">👨‍💻 المطور</h4>
                        <p className="text-gray-300 font-cairo">{gameInfo.developer}</p>
                      </div>
                      <div>
                        <h4 className="font-cairo font-semibold text-white">🏢 الناشر</h4>
                        <p className="text-gray-300 font-cairo">{gameInfo.publisher}</p>
                      </div>
                    </div>
                  )}

                  {gameInfo.size && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-cairo font-semibold text-white">💾 الحجم</h4>
                        <p className="text-gray-300 font-cairo">{gameInfo.size}</p>
                      </div>
                      <div>
                        <h4 className="font-cairo font-semibold text-white">📅 سنة الإصدار</h4>
                        <p className="text-gray-300 font-cairo">{gameInfo.releaseYear}</p>
                      </div>
                    </div>
                  )}

                  {gameInfo.downloadLinks && (
                    <div>
                      <h4 className="font-cairo font-semibold text-white mb-2">📥 روابط التحميل</h4>
                      <div className="space-y-2">
                        {getDownloadButton(gameInfo.downloadLinks.official, 'متجر رسمي', '🏪')}
                        {getDownloadButton(gameInfo.downloadLinks.free, 'تحميل مجاني', '🆓')}
                        {getDownloadButton(gameInfo.downloadLinks.demos, 'نسخة تجريبية', '🎮')}
                      </div>
                    </div>
                  )}

                  {gameInfo.features && gameInfo.features.length > 0 && (
                    <div>
                      <h4 className="font-cairo font-semibold text-white mb-2">✨ المميزات</h4>
                      <div className="space-y-1">
                        {gameInfo.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="text-sm text-gray-300 font-cairo">
                            • {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {gameInfo.alternatives && gameInfo.alternatives.length > 0 && (
                    <div>
                      <h4 className="font-cairo font-semibold text-white mb-2">🎯 ألعاب مشابهة</h4>
                      <div className="flex flex-wrap gap-2">
                        {gameInfo.alternatives.slice(0, 3).map((alt, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs font-cairo border-white/20 hover:bg-white/10"
                            onClick={() => setGameName(alt)}
                          >
                            {alt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎮</div>
                  <p className="text-gray-400 font-cairo">معلومات اللعبة ستظهر هنا</p>
                  <p className="text-xs text-gray-500 font-cairo mt-2">ابحث عن لعبة لرؤية تفاصيلها الكاملة</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* شات بوت الألعاب */}
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                🤖 مساعد الألعاب الذكي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto mb-4 space-y-3 p-3 bg-black/20 rounded-lg">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-2 rounded-lg font-cairo text-sm ${
                        message.isBot
                          ? 'bg-white/10 text-white'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white p-2 rounded-lg font-cairo text-sm">
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
                  value={currentChatMessage}
                  onChange={(e) => setCurrentChatMessage(e.target.value)}
                  placeholder="اسأل عن أي لعبة... متطلبات النظام، المراجعات، طريقة اللعب..."
                  className="resize-none font-cairo text-right bg-white/5 border-white/20 h-20"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChatMessage())}
                />
                <Button 
                  onClick={sendChatMessage} 
                  disabled={isChatLoading || !currentChatMessage.trim()}
                  className="btn-gradient w-full"
                >
                  {isChatLoading ? '🤖 يكتب...' : '💬 أرسل'}
                </Button>
              </div>

              <div className="mt-4">
                <h4 className="text-xs font-cairo text-white mb-2">أسئلة سريعة:</h4>
                <div className="space-y-1">
                  {[
                    'ما هي متطلبات تشغيل هذه اللعبة؟',
                    'هل اللعبة تدعم اللعب الجماعي؟',
                    'ما هي أفضل إعدادات الجرافيك؟'
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-cairo border-white/20 hover:bg-white/10 h-auto py-2 text-wrap"
                      onClick={() => setCurrentChatMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GamesDownload;
