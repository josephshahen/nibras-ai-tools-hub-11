
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit3, History } from 'lucide-react';
import { SearchCategory } from './types';

interface SearchCategorySelectorProps {
  searchCategory: string;
  customSearch: string;
  searchCategories: SearchCategory[];
  onCategoryChange: (value: string) => void;
  onCustomSearchChange: (value: string) => void;
}

const SearchCategorySelector = ({ 
  searchCategory, 
  customSearch, 
  searchCategories, 
  onCategoryChange, 
  onCustomSearchChange 
}: SearchCategorySelectorProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300 font-cairo text-right">
        اختر المجال الذي تريد أن يبحث لك فيه المساعد الذكي كل 6 ساعات:
      </p>
      <Select value={searchCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full bg-black/40 border-white/20 text-right font-cairo">
          <SelectValue placeholder="اختر مجال البحث" />
        </SelectTrigger>
        <SelectContent className="bg-black border-white/20">
          {searchCategories.map((category) => (
            <SelectItem key={category.value} value={category.value} className="text-right font-cairo">
              {category.value === 'custom' && <Edit3 size={14} className="inline ml-2" />}
              {category.value === 'research' && <History size={14} className="inline ml-2" />}
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Custom Search Input */}
      {searchCategory === 'custom' && (
        <div className="space-y-2">
          <Label className="text-sm font-cairo text-white">اكتب ما تريد البحث عنه:</Label>
          <Textarea
            value={customSearch}
            onChange={(e) => onCustomSearchChange(e.target.value)}
            placeholder="مثال: أحدث التطورات في الذكاء الاصطناعي، أفضل الكتب في مجال..."
            className="bg-black/40 border-white/20 text-white font-cairo resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-400 font-cairo">
            💡 كن محدداً قدر الإمكان للحصول على نتائج أفضل
          </p>
        </div>
      )}

      {/* Research History Option */}
      {searchCategory === 'research' && (
        <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-400/30">
          <div className="flex items-center gap-2 mb-2">
            <History className="text-blue-400" size={16} />
            <span className="text-sm font-cairo text-blue-400 font-semibold">بحوثاتي السابقة</span>
          </div>
          <p className="text-xs text-gray-300 font-cairo">
            سيقوم المساعد بتتبع وتطوير البحوث والمواضيع التي تفاعلت معها سابقاً في الموقع
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchCategorySelector;
