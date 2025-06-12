
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Activity, Shield, Check } from 'lucide-react';

const FeatureCards = () => {
  return (
    <>
      {/* Features */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-green-600/20 border-blue-400/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-cairo text-right flex items-center gap-2">
            <Gift className="text-yellow-400" size={20} />
            ✨ مزايا التفعيل
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300 space-y-3">
          <div className="flex items-center gap-3">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span className="font-cairo">🔍 يحفظ اهتماماتك بشكل <strong>آمن ومجهول</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span className="font-cairo">🔄 يقدم لك تحديثات عند عودتك</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span className="font-cairo">🚫 يمكنك إيقافه في أي وقت</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span className="font-cairo">⚡ إشعارات فورية عند العثور على محتوى مهم</span>
          </div>
        </CardContent>
      </Card>

      {/* How to verify it works */}
      <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-400/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-cairo text-right flex items-center gap-2">
            <Activity className="text-orange-400" size={20} />
            🔍 كيف تتأكد من عمل المساعد؟
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300 space-y-3">
          <div className="flex items-center gap-3">
            <Check size={16} className="text-orange-400 flex-shrink-0" />
            <span className="font-cairo">🟢 مؤشر الحالة أسفل الأيقونة (يعمل الآن / غير نشط)</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-orange-400 flex-shrink-0" />
            <span className="font-cairo">🔴 النشاطات الجديدة تظهر مع نقطة زرقاء وعداد أحمر</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-orange-400 flex-shrink-0" />
            <span className="font-cairo">🎉 رسالة الترحيب تظهر فوراً بعد التفعيل</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-orange-400 flex-shrink-0" />
            <span className="font-cairo">💻 حتى بعد إغلاق المتصفح، ستجد نشاطات جديدة عند العودة</span>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-cairo text-right flex items-center gap-2">
            <Shield className="text-green-400" size={20} />
            🔒 كيف نحمي خصوصيتك؟
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-300 space-y-3">
          <div className="flex items-center gap-3">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span className="font-cairo">معرف مجهول بدون أي معلومات شخصية</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span className="font-cairo">يتم حذف البيانات تلقائياً بعد 30 يوم من عدم النشاط</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-green-400 flex-shrink-0" />
            <span className="font-cairo">لا نجمع أي معلومات تعريفية أو بيانات حساسة</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FeatureCards;
