
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { SupportedLanguage } from '@/locales';

interface Language {
  code: SupportedLanguage;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷', nativeName: 'فارسی' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', nativeName: 'Čeština' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', nativeName: 'Română' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', nativeName: 'Kiswahili' }
];

const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useTranslation();

  const currentLangData = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (languageCode: SupportedLanguage) => {
    setLanguage(languageCode);
    console.log(`Language changed to: ${languageCode}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-white/20 hover:bg-white/10 flex items-center gap-2 font-cairo"
        >
          <Globe size={16} />
          <span>{currentLangData.flag}</span>
          <span className="hidden md:inline">{currentLangData.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 border-white/20 max-h-80 overflow-y-auto">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="font-cairo hover:bg-white/10 cursor-pointer flex items-center gap-3"
          >
            <span>{language.flag}</span>
            <div className="flex flex-col">
              <span className="text-white">{language.nativeName}</span>
              <span className="text-gray-400 text-xs">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
