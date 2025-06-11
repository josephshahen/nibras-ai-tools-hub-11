
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface NotFoundProps {
  onNavigate?: (section: string) => void;
}

const NotFound = ({ onNavigate }: NotFoundProps) => {
  const { t } = useTranslation();

  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen gradient-dark text-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gradient animate-pulse">404</div>
          <div className="w-32 h-1 bg-gradient-accent mx-auto mb-4 rounded-full"></div>
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-6">
          <span className="text-gradient">Page Not Found</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 font-cairo leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleGoHome}
            className="btn-gradient text-lg px-8 py-4 font-cairo min-w-[200px] flex items-center gap-2"
          >
            <Home size={20} />
            Back to Home
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="text-lg px-8 py-4 font-cairo border-white/20 hover:bg-white/10 min-w-[200px] flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </Button>
        </div>

        {/* Features preview */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={handleGoHome}>
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-3 glow-primary">
              🤖
            </div>
            <div className="text-sm text-gray-400 font-cairo">Chatbot</div>
          </div>
          
          <div className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={handleGoHome}>
            <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center text-2xl mx-auto mb-3 glow-secondary">
              🌐
            </div>
            <div className="text-sm text-gray-400 font-cairo">Translator</div>
          </div>
          
          <div className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={handleGoHome}>
            <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center text-2xl mx-auto mb-3 glow-accent">
              🎨
            </div>
            <div className="text-sm text-gray-400 font-cairo">Images</div>
          </div>
          
          <div className="text-center cursor-pointer hover:scale-105 transition-transform" onClick={handleGoHome}>
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-3 glow-primary">
              💻
            </div>
            <div className="text-sm text-gray-400 font-cairo">Code</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
