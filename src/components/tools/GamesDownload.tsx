
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
    { value: 'all', label: '🎯 جميع المنصات' },
    { value: 'android', label: '📱 أندرويد' },
    { value: 'windows', label: '💻 ويندوز' },
    { value: 'mac', label: '🍎 ماك' },
    { value: 'ios', label: '📱 آيفون' },
    { value: 'playstation', label: '🎮 بلايستيشن' },
    { value: 'xbox', label: '🎮 إكس بوكس' },
    { value: 'nintendo', label: '🎮 نينتندو' }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    
    try {
      const platformText = platform === 'all' ? 'جميع المنصات' : platforms.find(p => p.value === platform)?.label || platform;
      const result = await searchGames(searchQuery, platformText);
      setSearchResult(result);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResult({
        name: searchQuery,
        description: 'عذراً، حدث خطأ في البحث عن اللعبة.',
        error: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مساعد</span> الألعاب الذكي
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            ابحث عن أي لعبة واحصل على معلومات مفصلة وروابط التحميل
          </p>
        </div>

        {/* شريط البحث */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="اكتب اسم اللعبة..."
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
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="btn-gradient"
              >
                {isLoading ? 'جاري البحث...' : 'ابحث'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* نتائج البحث */}
        {isLoading && (
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex gap-1 mb-4">
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className="text-sm text-gray-400 font-cairo">جاري البحث عن اللعبة...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {searchResult && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* معلومات اللعبة */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                  🎮 {searchResult.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-300 font-cairo text-right">{searchResult.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-gray-400 font-cairo">المنصة</div>
                    <div className="text-white font-cairo">{searchResult.platform}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-gray-400 font-cairo">الحجم</div>
                    <div className="text-white font-cairo">{searchResult.size}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-gray-400 font-cairo">التقييم</div>
                    <div className="text-yellow-400 font-cairo">⭐ {searchResult.rating}/5</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-gray-400 font-cairo">الفئة</div>
                    <div className="text-white font-cairo">{searchResult.category}</div>
                  </div>
                </div>

                {searchResult.developer && (
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400 font-cairo text-sm">المطور</div>
                    <div className="text-white font-cairo">{searchResult.developer}</div>
                  </div>
                )}

                {searchResult.releaseYear && (
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400 font-cairo text-sm">سنة الإصدار</div>
                    <div className="text-white font-cairo">{searchResult.releaseYear}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* التحميل والمعلومات الإضافية */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                  📥 التحميل والمعلومات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {searchResult.downloadLink && searchResult.downloadLink !== 'غير متاح' && (
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <h3 className="text-green-400 font-cairo font-semibold mb-2">رابط التحميل</h3>
                    <Button className="w-full btn-gradient">
                      تحميل اللعبة
                    </Button>
                  </div>
                )}

                {searchResult.systemRequirements && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-white font-cairo font-semibold mb-2">متطلبات النظام</h3>
                    <p className="text-gray-300 font-cairo text-sm">{searchResult.systemRequirements}</p>
                  </div>
                )}

                {searchResult.features && searchResult.features.length > 0 && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-white font-cairo font-semibold mb-2">المميزات</h3>
                    <ul className="space-y-1">
                      {searchResult.features.map((feature: string, index: number) => (
                        <li key={index} className="text-gray-300 font-cairo text-sm">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {searchResult.emulators && searchResult.emulators.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <h3 className="text-blue-400 font-cairo font-semibold mb-2">المحاكيات المجانية</h3>
                    <ul className="space-y-1">
                      {searchResult.emulators.map((emulator: string, index: number) => (
                        <li key={index} className="text-gray-300 font-cairo text-sm">• {emulator}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!searchResult && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-cairo text-white mb-2">ابحث عن لعبتك المفضلة</h3>
            <p className="text-gray-400 font-cairo">اكتب اسم اللعبة واختر المنصة للحصول على معلومات مفصلة</p>
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
