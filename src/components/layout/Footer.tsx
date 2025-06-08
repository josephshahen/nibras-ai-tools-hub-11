
const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* معلومات الموقع */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center glow-primary">
                <span className="text-white font-bold text-xl">ن</span>
              </div>
              <div className="text-gradient font-bold text-xl font-cairo">
                نبراس AI
              </div>
            </div>
            <p className="text-gray-400 font-cairo leading-relaxed">
              موقع أدوات الذكاء الاصطناعي الشامل. نساعدك في إنجاز مهامك بسهولة وسرعة باستخدام أحدث التقنيات.
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="text-white font-bold font-cairo mb-4">أدوات شائعة</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors font-cairo">🤖 شات بوت ذكي</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors font-cairo">🌐 مترجم فوري</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors font-cairo">🎨 مولد صور</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition-colors font-cairo">💻 مساعد برمجة</a></li>
            </ul>
          </div>

          {/* معلومات التواصل */}
          <div>
            <h3 className="text-white font-bold font-cairo mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                <span>📧</span>
                <span className="font-cairo">info@nibras-ai.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span>🌐</span>
                <span className="font-cairo">www.nibras-ai.com</span>
              </div>
              <div className="flex gap-4 mt-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors">
                  📱
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors">
                  🐦
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors">
                  📘
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 font-cairo">
            © 2024 نبراس AI. جميع الحقوق محفوظة. | صُنع بـ ❤️ للمجتمع العربي
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
