
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GamesDownload = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platform, setPlatform] = useState('all');
  const [category, setCategory] = useState('all');

  const platforms = [
    { value: 'all', label: '🎯 جميع المنصات' },
    { value: 'android', label: '📱 أندرويد (APK)' },
    { value: 'windows', label: '💻 ويندوز' },
    { value: 'mac', label: '🍎 ماك' },
    { value: 'ios', label: '📱 آيفون' }
  ];

  const categories = [
    { value: 'all', label: '🎮 جميع الفئات' },
    { value: 'action', label: '⚔️ أكشن' },
    { value: 'adventure', label: '🗺️ مغامرات' },
    { value: 'racing', label: '🏎️ سباق' },
    { value: 'sports', label: '⚽ رياضة' },
    { value: 'puzzle', label: '🧩 ألغاز' },
    { value: 'strategy', label: '🎯 استراتيجية' }
  ];

  const popularGames = [
    {
      id: 1,
      name: 'PUBG Mobile',
      description: 'لعبة باتل رويال شهيرة',
      platform: 'android',
      category: 'action',
      size: '2.1 GB',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=200&fit=crop',
      downloads: '500M+'
    },
    {
      id: 2,
      name: 'Minecraft',
      description: 'لعبة بناء وإبداع مفتوحة العالم',
      platform: 'windows',
      category: 'adventure',
      size: '150 MB',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=200&h=200&fit=crop',
      downloads: '100M+'
    },
    {
      id: 3,
      name: 'Asphalt 9',
      description: 'لعبة سباق سيارات مثيرة',
      platform: 'android',
      category: 'racing',
      size: '1.8 GB',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop',
      downloads: '200M+'
    },
    {
      id: 4,
      name: 'Among Us',
      description: 'لعبة اجتماعية ممتعة مع الأصدقاء',
      platform: 'android',
      category: 'puzzle',
      size: '250 MB',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1614108221926-612ba7b5ba84?w=200&h=200&fit=crop',
      downloads: '500M+'
    },
    {
      id: 5,
      name: 'FIFA 23',
      description: 'لعبة كرة القدم الأشهر',
      platform: 'windows',
      category: 'sports',
      size: '45 GB',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      downloads: '50M+'
    },
    {
      id: 6,
      name: 'Candy Crush Saga',
      description: 'لعبة ألغاز حلويات ممتعة',
      platform: 'android',
      category: 'puzzle',
      size: '180 MB',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200&h=200&fit=crop',
      downloads: '1B+'
    }
  ];

  const filteredGames = popularGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platform === 'all' || game.platform === platform;
    const matchesCategory = category === 'all' || game.category === category;
    
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  const handleDownload = (game: any) => {
    alert(`سيتم تحميل ${game.name} قريباً! في النسخة الكاملة، سيتم ربط الموقع بقواعد بيانات الألعاب الحقيقية.`);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">تحميل</span> الألعاب
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            اكتشف وحمل أفضل الألعاب لجميع المنصات
          </p>
        </div>

        {/* شريط البحث والفلاتر */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="ابحث عن لعبة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border-white/20 font-cairo text-right"
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

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="font-cairo">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* شبكة الألعاب */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.id} className="bg-black/40 backdrop-blur-sm border-white/10 card-hover overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={game.image} 
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-cairo text-white mb-1">
                      {game.name}
                    </CardTitle>
                    <p className="text-sm text-gray-400 font-cairo">
                      {game.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <span>⭐</span>
                      <span>{game.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-gray-400 font-cairo mb-4">
                  <span>📱 {platforms.find(p => p.value === game.platform)?.label.split(' ')[1]}</span>
                  <span>📦 {game.size}</span>
                  <span>⬇️ {game.downloads}</span>
                </div>
                
                <Button 
                  onClick={() => handleDownload(game)}
                  className="w-full btn-gradient"
                >
                  تحميل اللعبة
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-cairo text-white mb-2">لم يتم العثور على ألعاب</h3>
            <p className="text-gray-400 font-cairo">جرب تغيير مصطلحات البحث أو الفلاتر</p>
          </div>
        )}

        {/* معلومات إضافية */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-center font-cairo text-white">💡 معلومات مهمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  🔒
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">آمن ومحقق</h3>
                <p className="text-sm text-gray-400 font-cairo">جميع الألعاب محققة وخالية من الفيروسات</p>
              </div>
              
              <div>
                <div className="w-12 h-12 gradient-secondary rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  ⚡
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">تحديثات دورية</h3>
                <p className="text-sm text-gray-400 font-cairo">نضيف ألعاب جديدة باستمرار</p>
              </div>
              
              <div>
                <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center text-2xl mx-auto mb-3">
                  📱
                </div>
                <h3 className="font-cairo font-semibold text-white mb-2">متعدد المنصات</h3>
                <p className="text-sm text-gray-400 font-cairo">ألعاب لجميع أنظمة التشغيل</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamesDownload;
