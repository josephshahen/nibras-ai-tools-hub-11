
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main title */}
          <h1 className="text-6xl md:text-8xl font-bold font-cairo mb-6 leading-tight">
            <span className="text-gradient">{t.hero.title}</span>
            <span className="text-white"> {t.hero.subtitle}</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-cairo leading-relaxed">
            {t.hero.description}
          </p>
          <p className="text-lg text-gray-400 mb-12 font-cairo">
            Chatbot • Translation • Summary • Image Generator • Code Assistant • Games Download
          </p>

          {/* Main buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={() => onNavigate('chatbot')}
              className="btn-gradient text-lg px-8 py-4 font-cairo min-w-[200px]"
            >
              🤖 {t.nav.chatbot}
            </Button>
            <Button
              onClick={() => onNavigate('images')}
              variant="outline"
              className="text-lg px-8 py-4 font-cairo border-white/20 hover:bg-white/10 min-w-[200px]"
            >
              🎨 {t.nav.images}
            </Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">8+</div>
              <div className="text-sm text-gray-400 font-cairo">Smart Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">100+</div>
              <div className="text-sm text-gray-400 font-cairo">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">0</div>
              <div className="text-sm text-gray-400 font-cairo">Registration Required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
              <div className="text-sm text-gray-400 font-cairo">Always Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Down arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-6 border-r-2 border-b-2 border-white/50 transform rotate-45"></div>
      </div>
    </section>
  );
};

export default HeroSection;
