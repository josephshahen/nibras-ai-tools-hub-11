
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Trash2, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen gradient-dark text-white">
      <div className="container mx-auto px-4 py-16" dir="rtl">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              🔒 سياسة الخصوصية
            </h1>
            <p className="text-xl text-gray-300 font-cairo">
              كيف نحمي بياناتك في المساعد الذكي الدائم
            </p>
          </div>

          {/* Privacy Cards */}
          <div className="grid gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-right font-cairo flex items-center gap-3">
                  <Shield className="text-green-400" size={24} />
                  البيانات التي نجمعها
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong>معرف مجهول:</strong> رقم عشوائي لا يكشف هويتك
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong>تفضيلات البحث:</strong> المواضيع التي تهتم بها
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong>وقت النشاط:</strong> متى كانت آخر زيارة لك
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <div>
                    <strong>لا نجمع:</strong> اسمك، ايميلك، أو أي معلومات شخصية
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-right font-cairo flex items-center gap-3">
                  <Eye className="text-blue-400" size={24} />
                  كيف نستخدم البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <div>البحث عن محتوى مناسب لاهتماماتك</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <div>تقديم اقتراحات مخصصة عند عودتك</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1">•</span>
                  <div>تحسين جودة النتائج بناءً على تفاعلك</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3 mt-4">
                  <p className="text-yellow-200 font-cairo">
                    <strong>ملاحظة مهمة:</strong> لا نبيع بياناتك أو نشاركها مع أطراف ثالثة
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-600/20 to-red-600/20 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-right font-cairo flex items-center gap-3">
                  <Trash2 className="text-purple-400" size={24} />
                  حذف البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-bold mb-2">الحذف التلقائي:</h4>
                  <p>تُحذف بياناتك تلقائياً بعد 30 يوماً من عدم النشاط</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">الحذف اليدوي:</h4>
                  <p>يمكنك حذف حسابك فوراً عبر إيقاف المساعد من النافذة الرئيسية</p>
                </div>
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                  <p className="text-red-200 font-cairo">
                    <strong>تنبيه:</strong> عند الحذف، ستفقد جميع التفضيلات والنتائج المحفوظة
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 border-gray-400/30">
              <CardHeader>
                <CardTitle className="text-right font-cairo flex items-center gap-3">
                  <Settings className="text-gray-400" size={24} />
                  حقوقك والتحكم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <div>تغيير تفضيلات البحث في أي وقت</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <div>إيقاف وتفعيل المساعد حسب رغبتك</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <div>الاطلاع على نشاطاتك وحذفها</div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <div>طلب معلومات مفصلة عن بياناتك المحفوظة</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact and Actions */}
          <div className="text-center space-y-6">
            <div className="bg-black/40 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-3 font-cairo">هل لديك أسئلة؟</h3>
              <p className="text-gray-300 mb-4">
                تواصل معنا لأي استفسار حول خصوصيتك وبياناتك
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" className="font-cairo">
                  تواصل معنا
                </Button>
                <Button variant="outline" className="font-cairo">
                  الأسئلة الشائعة
                </Button>
              </div>
            </div>

            <Link to="/">
              <Button className="btn-gradient font-cairo text-lg px-8 py-3">
                <ArrowRight className="mr-2" size={20} />
                العودة للموقع الرئيسي
              </Button>
            </Link>
          </div>

          {/* Last Updated */}
          <div className="text-center mt-8 text-sm text-gray-500">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
