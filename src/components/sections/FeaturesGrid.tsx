
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';

interface FeaturesGridProps {
  onNavigate: (section: string) => void;
}

const FeaturesGrid = ({ onNavigate }: FeaturesGridProps) => {
  const { t } = useTranslation();

  const features = [
    {
      id: 'chatbot',
      icon: '🤖',
      title: t.features.chatbot.title,
      description: t.features.chatbot.description,
      color: 'from-blue-500 to-purple-600',
      popular: true
    },
    {
      id: 'translator',
      icon: '🌐',
      title: t.features.translator.title,
      description: t.features.translator.description,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'summary',
      icon: '📰',
      title: t.features.summary.title,
      description: t.features.summary.description,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'website',
      icon: '🖥️',
      title: t.features.website.title,
      description: t.features.website.description,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'code',
      icon: '💻',
      title: t.features.code.title,
      description: t.features.code.description,
      color: 'from-cyan-500 to-blue-500',
      popular: true
    },
    {
      id: 'images',
      icon: '🎨',
      title: t.features.images.title,
      description: t.features.images.description,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'cv',
      icon: '📝',
      title: 'CV Generator',
      description: 'Create professional CVs with ready templates and smart content',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'games',
      icon: '🎮',
      title: 'Game Downloads',
      description: 'Download APK games and PC games with comprehensive information',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-cairo mb-6">
            <span className="text-gradient">{t.features.title}</span>
          </h2>
          <p className="text-xl text-gray-300 font-cairo max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.id}
              className="card-hover bg-black/40 backdrop-blur-sm border-white/10 overflow-hidden relative group cursor-pointer"
              onClick={() => onNavigate(feature.id)}
            >
              {feature.popular && (
                <div className="absolute top-2 right-2 bg-gradient-accent text-white text-xs px-2 py-1 rounded-full font-cairo">
                  Most Used
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
                  Try Tool
                </Button>
              </CardContent>

              {/* Lighting effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`}></div>
            </Card>
          ))}
        </div>

        {/* Additional features section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-4 glow-primary">
                ⚡
              </div>
              <h3 className="text-xl font-bold font-cairo mb-2 text-white">Fast & Instant</h3>
              <p className="text-gray-400 font-cairo">Instant results without waiting</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center text-2xl mx-auto mb-4 glow-secondary">
                🔒
              </div>
              <h3 className="text-xl font-bold font-cairo mb-2 text-white">Safe & Private</h3>
              <p className="text-gray-400 font-cairo">Your data is protected and not stored</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center text-2xl mx-auto mb-4 glow-accent">
                🌟
              </div>
              <h3 className="text-xl font-bold font-cairo mb-2 text-white">Completely Free</h3>
              <p className="text-gray-400 font-cairo">All tools are free with no limits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
