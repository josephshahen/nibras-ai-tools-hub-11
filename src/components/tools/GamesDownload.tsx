import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchGames } from '@/services/aiService';

const GamesDownload = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState('all');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const platforms = [
    { value: 'all', label: '🎯 جميع المنصات', description: 'بحث شامل في كل المنصات' },
    { value: 'android', label: '📱 أندرويد', description: 'ألعاب الهواتف الذكية' },
    { value: 'windows', label: '💻 ويندوز', description: 'ألعاب الكمبيوتر الشخصي' },
    { value: 'mac', label: '🍎 ماك', description: 'ألعاب أجهزة Apple' },
    { value: 'ios', label: '📱 آيفون/آيباد', description: 'ألعاب iOS' },
    { value: 'playstation', label: '🎮 بلايستيشن', description: 'PS5, PS4, PS3' },
    { value: 'xbox', label: '🎮 إكس بوكس', description: 'Xbox Series, Xbox One' },
    { value: 'nintendo', label: '🎮 نينتندو', description: 'Switch, 3DS' },
    { value: 'steam', label: '💨 ستيم', description: 'منصة Steam' }
  ];

  const popularGames = [
    { name: 'Minecraft', platform: 'all' },
    { name: 'Among Us', platform: 'android' },
    { name: 'Call of Duty', platform: 'windows' },
    { name: 'FIFA 24', platform: 'playstation' },
    { name: 'The Witcher 3', platform: 'steam' },
    { name: 'Genshin Impact', platform: 'all' }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    try {
      console.log(`🎮 بدء البحث المتطور عن "${searchQuery}" في منصة ${platform}...`);
      const platformText = platform === 'all' ? 'جميع المنصات' : platforms.find(p => p.value === platform)?.label || platform;
      const result = await searchGames(searchQuery, platformText);
      setSearchResult(result);
      console.log('✅ تم العثور على معلومات شاملة للعبة');
    } catch (error) {
      console.error('❌ خطأ في البحث:', error);
      setSearchResult({
        name: searchQuery,
        description: 'عذراً، حدث خطأ في البحث. يرجى المحاولة مرة أخرى مع اسم أكثر تحديداً.',
        error: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = (gameName: string, gamePlatform: string) => {
    setSearchQuery(gameName);
    setPlatform(gamePlatform);
    setTimeout(() => handleSearch(), 100);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مساعد الألعاب</span> الذكي المتطور
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            محرك بحث متطور للألعاب مع معلومات شاملة وروابط تحميل متنوعة
          </p>
          <div className="mt-4 px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg inline-block">
            <p className="text-green-400 font-cairo text-sm">
              🔍 بحث ذكي متطور | 📊 معلومات شاملة | 🎯 دقة عالية | 🔗 روابط متنوعة
            </p>
          </div>
        </div>

        {/* شريط البحث */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="اكتب اسم اللعبة بدقة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border-white/20 font-cairo text-right"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {platforms.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="font-cairo">
                      <div className="text-right">
                        <div className="font-semibold">{p.label}</div>
                        <div className="text-xs text-gray-400">{p.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="btn-gradient"
              >
                {isLoading ? '🔍 جاري البحث...' : '🚀 ابحث'}
              </Button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-400 font-cairo mb-2">🎮 ألعاب شائعة:</p>
              <div className="flex flex-wrap gap-2">
                {popularGames.map((game, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="border-white/20 hover:bg-white/10 font-cairo text-xs"
                    onClick={() => handleQuickSearch(game.name, game.platform)}
                  >
                    {game.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* نتائج البحث */}
        {isLoading && (
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-green-400 border-r-blue-400 border-b-purple-400 border-l-pink-400 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-400 font-cairo mb-2">🔍 جاري البحث المتطور...</p>
                <p className="text-xs text-gray-500 font-cairo">يتم تجميع معلومات شاملة من مصادر متعددة</p>
              </div>
            </CardContent>
          </Card>
        )}

        {searchResult && !isLoading && !searchResult.error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* معلومات اللعبة */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                  🎮 {searchResult.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-white/5 to-white/10 p-4 rounded-lg border border-white/10">
                  <p className="text-gray-300 font-cairo text-right leading-relaxed">{searchResult.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/5 p-3 rounded-lg text-center border border-white/10">
                    <div className="text-gray-400 font-cairo text-xs">المنصة</div>
                    <div className="text-white font-cairo font-semibold">{searchResult.platform}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg text-center border border-white/10">
                    <div className="text-gray-400 font-cairo text-xs">الحجم</div>
                    <div className="text-white font-cairo font-semibold">{searchResult.size}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg text-center border border-white/10">
                    <div className="text-gray-400 font-cairo text-xs">التقييم</div>
                    <div className="text-yellow-400 font-cairo font-semibold">⭐ {searchResult.rating}/10</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg text-center border border-white/10">
                    <div className="text-gray-400 font-cairo text-xs">Metacritic</div>
                    <div className="text-green-400 font-cairo font-semibold">{searchResult.metacriticScore}</div>
                  </div>
                </div>

                {searchResult.developer && (
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-400 font-cairo text-xs">المطور</div>
                        <div className="text-white font-cairo">{searchResult.developer}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 font-cairo text-xs">الناشر</div>
                        <div className="text-white font-cairo">{searchResult.publisher || 'غير محدد'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {searchResult.gameplay && (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h3 className="text-blue-400 font-cairo font-semibold mb-2">🎯 معلومات اللعب</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">النوع:</span>
                        <span className="text-white mr-2">{searchResult.gameplay.genre}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">المدة:</span>
                        <span className="text-white mr-2">{searchResult.gameplay.duration}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* التحميل والمعلومات التقنية */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                  📥 التحميل والمعلومات التقنية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {searchResult.downloadLinks && (
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h3 className="text-green-400 font-cairo font-semibold mb-3">🔗 روابط التحميل</h3>
                    <div className="space-y-2">
                      {searchResult.downloadLinks.official && (
                        <div className="bg-white/5 p-2 rounded text-sm">
                          <strong className="text-gray-300">الروابط الرسمية:</strong>
                          <p className="text-gray-400">{searchResult.downloadLinks.official}</p>
                        </div>
                      )}
                      {searchResult.downloadLinks.free && (
                        <div className="bg-white/5 p-2 rounded text-sm">
                          <strong className="text-gray-300">روابط مجانية:</strong>
                          <p className="text-gray-400">{searchResult.downloadLinks.free}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {searchResult.systemRequirements && (
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="text-white font-cairo font-semibold mb-3">⚙️ متطلبات النظام</h3>
                    <div className="space-y-2 text-sm">
                      {searchResult.systemRequirements.minimum && (
                        <div>
                          <strong className="text-gray-300">الحد الأدنى:</strong>
                          <p className="text-gray-400">{searchResult.systemRequirements.minimum}</p>
                        </div>
                      )}
                      {searchResult.systemRequirements.recommended && (
                        <div>
                          <strong className="text-gray-300">المنصوح به:</strong>
                          <p className="text-gray-400">{searchResult.systemRequirements.recommended}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {searchResult.emulators && Object.keys(searchResult.emulators).length > 0 && (
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <h3 className="text-purple-400 font-cairo font-semibold mb-3">🎮 المحاكيات المتوفرة</h3>
                    <div className="space-y-2">
                      {Object.entries(searchResult.emulators).map(([platform, emulators]: [string, any]) => (
                        emulators && emulators.length > 0 && (
                          <div key={platform} className="text-sm">
                            <strong className="text-gray-300 capitalize">{platform}:</strong>
                            <ul className="mr-4 text-gray-400">
                              {emulators.map((emulator: string, index: number) => (
                                <li key={index}>• {emulator}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {searchResult.pros && searchResult.pros.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                      <h4 className="text-green-400 font-cairo font-semibold mb-2 text-sm">✅ نقاط القوة</h4>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {searchResult.pros.slice(0, 3).map((pro: string, index: number) => (
                          <li key={index}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {searchResult.cons && searchResult.cons.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                        <h4 className="text-red-400 font-cairo font-semibold mb-2 text-sm">⚠️ نقاط الضعف</h4>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {searchResult.cons.slice(0, 3).map((con: string, index: number) => (
                            <li key={index}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {searchResult.alternatives && searchResult.alternatives.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                    <h4 className="text-blue-400 font-cairo font-semibold mb-2 text-sm">🎯 ألعاب مشابهة</h4>
                    <div className="flex flex-wrap gap-1">
                      {searchResult.alternatives.slice(0, 4).map((game: string, index: number) => (
                        <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {searchResult && searchResult.error && (
          <Card className="bg-red-500/10 border border-red-500/20">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-red-400 font-cairo">{searchResult.description}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!searchResult && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-cairo text-white mb-2">ابحث عن لعبتك المفضلة</h3>
            <p className="text-gray-400 font-cairo">اكتب اسم اللعبة بدقة واختر المنصة للحصول على معلومات شاملة ومفصلة</p>
          </div>
        )}

        {/* معلومات إضافية */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-center font-cairo text-white">🤖 مساعد الألعاب الذكي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  🔍
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">بحث ذكي</h3>
                <p className="text-sm text-gray-400 font-cairo">يجد أي لعبة مع معلومات مفصلة</p>
              </div>
              
              <div>
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  📱
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">جميع المنصات</h3>
                <p className="text-sm text-gray-400 font-cairo">أندرويد، ويندوز، ماك وأكثر</p>
              </div>
              
              <div>
                <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  💾
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">روابط مجانية</h3>
                <p className="text-sm text-gray-400 font-cairo">روابط تحميل ومحاكيات مجانية</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamesDownload;
