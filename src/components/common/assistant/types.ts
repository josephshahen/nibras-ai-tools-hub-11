
export interface AssistantActivity {
  id: string;
  type: 'search' | 'analysis' | 'suggestion';
  title: string;
  description: string;
  timestamp: string;
  isNew: boolean;
}

export interface SearchCategory {
  value: string;
  label: string;
}
