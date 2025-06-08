
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeaturesGridProps {
  onNavigate: (section: string) => void;
}

const FeaturesGrid = ({ onNavigate }: FeaturesGridProps) => {
  const features = [
    {
      id: 'chatbot',
      icon: '🤖',
      title: 'شات بوت ذكي',
      description: 'تحدث مع مساعد ذكي يجيب على جميع أسئلتك ويساعدك في المهام المختلفة',
      color: 'from-blue-500 to-purple-600',
      popular: true
    },
    {
      id: 'translator',
      icon: '🌐',
      title: 'مترجم فوري',
      description: 'ترجمة فورية بين أكثر من 100 لغة مع دعم المستندات والنطق',
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'summary',
      icon: '📰',
      title: 'تلخيص المقالات',
      description: 'لخص المقالات الطويلة والمستندات الأكاديمية في ثوانٍ معدودة',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'website',
      icon: '🖥️',
      title: 'مولد مواقع',
      description: 'إنشاء مواقع ويب احترافية بالذكاء الاصطناعي مع قوالب جاهزة',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'code',
      icon: '💻',
      title: 'مساعد برمجة',
      description: 'توليد أكواد بـ 30+ لغة برمجية وتصحيح الأخطاء وشرح الحلول',
      color: 'from-cyan-500 to-blue-500',
      popular: true
    },
    {
      id: 'images',
      icon: '🎨',
      title: 'مولد صور',
      description: 'إنشاء صور فريدة من الوصف النصي بأساليب فنية متنوعة',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'cv',
      icon: '📝',
      title: 'سيرة ذاتية',
      description: 'إنشاء سيرة ذاتية احترافية بتصاميم جاهزة ومحتوى ذكي',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'games',
      icon: '🎮',
      title: 'تحميل ألعاب',
      description: 'تحميل ألعاب APK وألعاب الكمبيوتر مع معلومات شاملة',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* عنوان القسم */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-cairo mb-6">
            <span className="text-gradient">أدوات</span> متقدمة
          </h2>
          <p className="text-xl text-gray-300 font-cairo max-w-2xl mx-auto">
            مجموعة شاملة من أدوات الذكاء الاصطناعي لتسهيل مهامك اليومية
          </p>
        </div>

        {/* شبكة الأدوات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.id}
              className="card-hover bg-black/40 backdrop-blur-sm border-white/10 overflow-hidden relative group cursor-pointer"
              onClick={() => onNavigate(feature.id)}
            >
              {feature.popular && (
                <div className="absolute top-2 right-2 bg-gradient-accent text-white text-xs px-2 py-1 rounded-full font-cairo">
                  الأكثر استخداماً
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-cairo text-white group-hover:text-gradient transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-gray-300 font-cairo leading-relaxed mb-4">
                  {feature.description}
                </CardDescription>
                
                <Button 
                  className="w-full btn-gradient opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(feature.id);
                  }}
                >
                  تجربة الأداة
                </Button>
              </CardContent>

              {/* تأثير الإضاءة عند التحويم */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`}></div>
            </Card>
          ))}
        </div>

        {/* قسم الميزات الإضافية */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4 glow-primary">
                ⚡
              </div>
              <h3 className="text-xl font-bold font-cairo mb-2 text-white">سريع وفوري</h3>
              <p className="text-gray-400 font-cairo">نتائج فورية بدون انتظار</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center text-2xl mx-auto mb-4 glow-secondary">
                🔒
              </div>
              <h3 className="text-xl font-bold font-cairo mb-2 text-white">آمن وخصوصي</h3>
              <p className="text-gray-400 font-cairo">بياناتك محمية ولا نحتفظ بها</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center text-2xl mx-auto mb-4 glow-accent">
                🌟
              </div>
              <h3 className="text-xl font-bold font-cairo mb-2 text-white">مجاني تماماً</h3>
              <p className="text-gray-400 font-cairo">جميع الأدوات مجانية بدون حدود</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
