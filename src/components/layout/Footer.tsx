
const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 font-cairo">
            © 2024 نبراس AI. جميع الحقوق محفوظة. | صُنع بـ ❤️ للمجتمع العالمي
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
