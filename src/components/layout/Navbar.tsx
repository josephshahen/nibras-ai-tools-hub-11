
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LanguageSelector from '../common/LanguageSelector';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Navbar = ({ activeSection, onNavigate }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'الرئيسية', icon: '🏠' },
    { id: 'chatbot', label: 'شات بوت', icon: '🤖' },
    { id: 'translator', label: 'مترجم فوري', icon: '🌐' },
    { id: 'summary', label: 'تلخيص المقالات', icon: '📰' },
    { id: 'website', label: 'مولد مواقع', icon: '🖥️' },
    { id: 'code', label: 'مساعد برمجة', icon: '💻' },
    { id: 'images', label: 'مولد صور', icon: '🎨' },
    { id: 'cv', label: 'سيرة ذاتية', icon: '📝' },
    { id: 'games', label: 'تحميل ألعاب', icon: '🎮' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* اللوجو ومنتقي اللغة */}
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onNavigate('home')}
            >
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">ن</span>
              </div>
              <div className="text-gradient font-bold text-xl font-cairo">
                نبراس AI
              </div>
            </div>
            <LanguageSelector />
          </div>

          {/* القائمة الرئيسية - الكمبيوتر */}
          <div className="hidden lg:flex items-center gap-2">
            {navigationItems.slice(0, 6).map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate(item.id)}
                className={`
                  font-cairo text-sm transition-all duration-300
                  ${activeSection === item.id 
                    ? 'bg-primary text-primary-foreground glow-primary' 
                    : 'hover:bg-white/10 hover:text-accent'
                  }
                `}
              >
                <span className="ml-2">{item.icon}</span>
                {item.label}
              </Button>
            ))}
            
            {/* قائمة منسدلة للمزيد */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="font-cairo hover:bg-white/10">
                <span className="ml-2">⚡</span>
                المزيد
              </Button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {navigationItems.slice(6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="w-full text-right px-4 py-3 text-sm font-cairo hover:bg-white/10 hover:text-accent transition-colors flex items-center justify-end gap-2"
                  >
                    {item.label}
                    <span>{item.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* زر القائمة - الجوال */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* القائمة المنسدلة - الجوال */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <div className="grid grid-cols-2 gap-2 pt-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`
                  p-3 rounded-lg text-sm font-cairo transition-all duration-300 flex items-center justify-center gap-2
                  ${activeSection === item.id 
                    ? 'bg-primary text-primary-foreground glow-primary' 
                    : 'bg-white/5 hover:bg-white/10 hover:text-accent'
                  }
                `}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
