
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CVGenerator = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    summary: ''
  });
  
  const [experience, setExperience] = useState([
    { company: '', position: '', duration: '', description: '' }
  ]);
  
  const [education, setEducation] = useState([
    { institution: '', degree: '', year: '', details: '' }
  ]);
  
  const [skills, setSkills] = useState(['']);
  const [template, setTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    { value: 'modern', label: '🌟 عصري', description: 'تصميم حديث وأنيق' },
    { value: 'classic', label: '📋 كلاسيكي', description: 'تصميم تقليدي ومهني' },
    { value: 'creative', label: '🎨 إبداعي', description: 'تصميم ملون وجذاب' },
    { value: 'minimal', label: '⚡ بسيط', description: 'تصميم نظيف ومرتب' }
  ];

  const addExperience = () => {
    setExperience([...experience, { company: '', position: '', duration: '', description: '' }]);
  };

  const addEducation = () => {
    setEducation([...education, { institution: '', degree: '', year: '', details: '' }]);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const updateSkill = (index: number, value: string) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };

  const generateCV = async () => {
    setIsGenerating(true);
    
    // محاكاة إنشاء السيرة الذاتية
    setTimeout(() => {
      // في النسخة الحقيقية، سيتم إنشاء PDF
      alert('تم إنشاء السيرة الذاتية بنجاح! في النسخة الكاملة، سيتم تحميل ملف PDF.');
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-cairo mb-4">
            <span className="text-gradient">مولد</span> السيرة الذاتية
          </h1>
          <p className="text-xl text-gray-300 font-cairo">
            أنشئ سيرة ذاتية احترافية في دقائق
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* نموذج البيانات */}
          <div className="lg:col-span-2 space-y-6">
            {/* المعلومات الشخصية */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white flex items-center justify-end gap-2">
                  👤 المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="الاسم الكامل"
                    value={personalInfo.name}
                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                    className="bg-white/5 border-white/20 font-cairo text-right"
                  />
                  <Input
                    placeholder="المسمى الوظيفي"
                    value={personalInfo.title}
                    onChange={(e) => updatePersonalInfo('title', e.target.value)}
                    className="bg-white/5 border-white/20 font-cairo text-right"
                  />
                  <Input
                    placeholder="البريد الإلكتروني"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="bg-white/5 border-white/20 font-cairo text-right"
                  />
                  <Input
                    placeholder="رقم الهاتف"
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    className="bg-white/5 border-white/20 font-cairo text-right"
                  />
                </div>
                <Input
                  placeholder="العنوان"
                  value={personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  className="bg-white/5 border-white/20 font-cairo text-right"
                />
                <Textarea
                  placeholder="نبذة مختصرة عنك ومهاراتك..."
                  value={personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  className="h-20 resize-none font-cairo bg-white/5 border-white/20 text-right"
                />
              </CardContent>
            </Card>

            {/* الخبرات العملية */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white flex items-center justify-between">
                  <Button onClick={addExperience} variant="outline" size="sm" className="border-white/20">
                    ➕ إضافة خبرة
                  </Button>
                  <span className="flex items-center gap-2">
                    💼 الخبرات العملية
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="اسم الشركة"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="bg-white/5 border-white/20 font-cairo text-right"
                      />
                      <Input
                        placeholder="المنصب"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="bg-white/5 border-white/20 font-cairo text-right"
                      />
                    </div>
                    <Input
                      placeholder="فترة العمل (مثال: 2020 - 2023)"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      className="bg-white/5 border-white/20 font-cairo text-right"
                    />
                    <Textarea
                      placeholder="وصف المهام والإنجازات..."
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="h-16 resize-none font-cairo bg-white/5 border-white/20 text-right"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* التعليم */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white flex items-center justify-between">
                  <Button onClick={addEducation} variant="outline" size="sm" className="border-white/20">
                    ➕ إضافة مؤهل
                  </Button>
                  <span className="flex items-center gap-2">
                    🎓 التعليم
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="اسم المؤسسة التعليمية"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="bg-white/5 border-white/20 font-cairo text-right"
                      />
                      <Input
                        placeholder="الدرجة العلمية"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="bg-white/5 border-white/20 font-cairo text-right"
                      />
                    </div>
                    <Input
                      placeholder="سنة التخرج"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      className="bg-white/5 border-white/20 font-cairo text-right"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* المهارات */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white flex items-center justify-between">
                  <Button onClick={addSkill} variant="outline" size="sm" className="border-white/20">
                    ➕ إضافة مهارة
                  </Button>
                  <span className="flex items-center gap-2">
                    ⚡ المهارات
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.map((skill, index) => (
                    <Input
                      key={index}
                      placeholder="مهارة (مثال: البرمجة، التصميم، إلخ)"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="bg-white/5 border-white/20 font-cairo text-right"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* إعدادات التصميم والمعاينة */}
          <div className="space-y-6">
            {/* اختيار القالب */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white">🎨 قالب التصميم</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger className="bg-white/5 border-white/20 font-cairo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {templates.map((tmpl) => (
                      <SelectItem key={tmpl.value} value={tmpl.value} className="font-cairo">
                        <div className="text-right">
                          <div>{tmpl.label}</div>
                          <div className="text-xs text-gray-400">{tmpl.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={generateCV}
                  disabled={isGenerating || !personalInfo.name}
                  className="btn-gradient w-full"
                >
                  {isGenerating ? 'جاري إنشاء السيرة...' : '📥 إنشاء وتحميل السيرة'}
                </Button>
              </CardContent>
            </Card>

            {/* معاينة */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-right font-cairo text-white">👁️ معاينة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] bg-white rounded-lg p-4 text-black text-xs overflow-hidden">
                  <div className="text-center mb-4">
                    <h1 className="text-lg font-bold">{personalInfo.name || 'اسمك هنا'}</h1>
                    <p className="text-gray-600">{personalInfo.title || 'مسماك الوظيفي'}</p>
                    <p className="text-gray-500 text-xs">
                      {personalInfo.email} | {personalInfo.phone}
                    </p>
                  </div>
                  
                  {personalInfo.summary && (
                    <div className="mb-3">
                      <h2 className="font-bold text-sm mb-1">نبذة مختصرة</h2>
                      <p className="text-xs">{personalInfo.summary}</p>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <h2 className="font-bold text-sm mb-1">الخبرات</h2>
                    {experience.filter(exp => exp.company).map((exp, i) => (
                      <div key={i} className="mb-2">
                        <p className="font-semibold text-xs">{exp.position} - {exp.company}</p>
                        <p className="text-xs text-gray-600">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-3">
                    <h2 className="font-bold text-sm mb-1">التعليم</h2>
                    {education.filter(edu => edu.institution).map((edu, i) => (
                      <div key={i} className="mb-1">
                        <p className="text-xs">{edu.degree} - {edu.institution}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h2 className="font-bold text-sm mb-1">المهارات</h2>
                    <div className="flex flex-wrap gap-1">
                      {skills.filter(skill => skill).map((skill, i) => (
                        <span key={i} className="bg-gray-200 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVGenerator;
