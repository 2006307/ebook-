export interface ColoringPage {
  pageNumber: number;
  sceneTitle: string;
  storyCaption: string;
  imagePrompt: string;
  imageUrl?: string;
  status: 'idle' | 'generating' | 'ready' | 'error';
  error?: string;
}

export type ImageSizeOption = '1K' | '2K' | '4K';

export type ArtStyleLevel = 'bold_simple' | 'classic_storybook' | 'detailed_explorer';

export interface ColoringBook {
  id: string;
  childName: string;
  theme: string;
  bookTitle: string;
  dedication: string;
  imageSize: ImageSizeOption;
  styleLevel: ArtStyleLevel;
  createdAt: number;
  pages: ColoringPage[];
}

export type TaskType = 'complex' | 'general' | 'fast';

export type ChatRole = 'creative_storyteller' | 'coloring_coach' | 'theme_explorer';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  modelUsed?: string;
  taskType?: TaskType;
}
