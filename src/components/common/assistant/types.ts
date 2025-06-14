
export interface AssistantActivity {
  id: string;
  type: 'search' | 'analysis' | 'suggestion' | 'discovery';
  title: string;
  description: string;
  timestamp: string;
  isNew: boolean;
}

export interface SearchCategory {
  value: string;
  label: string;
}

export interface UserPreferences {
  searchCategory?: string;
  customSearch?: string;
}
