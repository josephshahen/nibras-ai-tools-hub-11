
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/sections/HeroSection';
import FeaturesGrid from '../components/sections/FeaturesGrid';
import Footer from '../components/layout/Footer';
import ChatBot from '../components/tools/ChatBot';
import Translator from '../components/tools/Translator';
import ArticleSummary from '../components/tools/ArticleSummary';
import WebsiteGenerator from '../components/tools/WebsiteGenerator';
import CodeAssistant from '../components/tools/CodeAssistant';
import ImageGenerator from '../components/tools/ImageGenerator';
import CVGenerator from '../components/tools/CVGenerator';
import GamesDownload from '../components/tools/GamesDownload';
import AlwaysOnAssistant from '../components/common/AlwaysOnAssistant';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('home');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'chatbot':
        return <ChatBot />;
      case 'translator':
        return <Translator />;
      case 'summary':
        return <ArticleSummary />;
      case 'website':
        return <WebsiteGenerator />;
      case 'code':
        return <CodeAssistant />;
      case 'images':
        return <ImageGenerator />;
      case 'cv':
        return <CVGenerator />;
      case 'games':
        return <GamesDownload />;
      default:
        return (
          <>
            <HeroSection onNavigate={setActiveSection} />
            <FeaturesGrid onNavigate={setActiveSection} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen gradient-dark text-white">
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="pt-16">
        {renderActiveSection()}
      </main>
      <Footer />
      <AlwaysOnAssistant />
    </div>
  );
};

export default Index;
