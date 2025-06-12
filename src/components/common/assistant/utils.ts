
export const generateUserId = () => {
  return 'user-' + crypto.randomUUID().substring(0, 8);
};

export const formatRelativeTime = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now.getTime() - time.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'منذ دقائق';
  if (hours === 1) return 'منذ ساعة';
  if (hours < 24) return `منذ ${hours} ساعات`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return 'منذ يوم';
  return `منذ ${days} أيام`;
};

export const getActivityStatusText = (isActive: boolean, lastActiveTime: string) => {
  if (!isActive) return '';
  const lastActive = new Date(lastActiveTime);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
  
  if (diffMinutes < 2) return '🟢 يعمل الآن';
  if (diffMinutes < 60) return `🟡 آخر نشاط منذ ${diffMinutes} دقيقة`;
  return '🔴 غير نشط حالياً';
};

export const getCurrentSearchText = (searchCategory: string, customSearch: string, searchCategories: any[]) => {
  if (searchCategory === 'custom') return customSearch || 'لم تحدد بحث مخصص';
  if (searchCategory === 'research') return 'بحوثاتي السابقة';
  const category = searchCategories.find(cat => cat.value === searchCategory);
  return category?.label || searchCategory;
};
