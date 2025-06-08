
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

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('home');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'chatbot':
        return <ChatBot onNavigate={setActiveSection} />;
      case 'translator':
        return <Translator onNavigate={setActiveSection} />;
      case 'summary':
        return <ArticleSummary onNavigate={setActiveSection} />;
      case 'website':
        return <WebsiteGenerator onNavigate={setActiveSection} />;
      case 'code':
        return <CodeAssistant onNavigate={setActiveSection} />;
      case 'images':
        return <ImageGenerator onNavigate={setActiveSection} />;
      case 'cv':
        return <CVGenerator onNavigate={setActiveSection} />;
      case 'games':
        return <GamesDownload onNavigate={setActiveSection} />;
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
    </div>
  );
};

export default Index;
