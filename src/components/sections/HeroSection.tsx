
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* العنوان الرئيسي */}
          <h1 className="text-6xl md:text-8xl font-bold font-cairo mb-6 leading-tight">
            <span className="text-gradient">نبراس</span>
            <span className="text-white"> AI</span>
          </h1>
          
          {/* الوصف */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-cairo leading-relaxed">
            مجموعة شاملة من أدوات الذكاء الاصطناعي
          </p>
          <p className="text-lg text-gray-400 mb-12 font-cairo">
            شات بوت • ترجمة • تلخيص • مولد صور • مساعد برمجة • تحميل ألعاب
          </p>

          {/* الأزرار الرئيسية */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={() => onNavigate('chatbot')}
              className="btn-gradient text-lg px-8 py-4 font-cairo min-w-[200px]"
            >
              🤖 جرب الشات بوت
            </Button>
            <Button
              onClick={() => onNavigate('images')}
              variant="outline"
              className="text-lg px-8 py-4 font-cairo border-white/20 hover:bg-white/10 min-w-[200px]"
            >
              🎨 مولد الصور
            </Button>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">8+</div>
              <div className="text-sm text-gray-400 font-cairo">أدوات ذكية</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">100+</div>
              <div className="text-sm text-gray-400 font-cairo">لغة متاحة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">0</div>
              <div className="text-sm text-gray-400 font-cairo">تسجيل مطلوب</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
              <div className="text-sm text-gray-400 font-cairo">متاح دائماً</div>
            </div>
          </div>
        </div>
      </div>

      {/* سهم للأسفل */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-6 border-r-2 border-b-2 border-white/50 transform rotate-45"></div>
      </div>
    </section>
  );
};

export default HeroSection;
