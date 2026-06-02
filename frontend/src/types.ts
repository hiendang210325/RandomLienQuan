export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  rarity?: 'Legendary' | 'Epic' | 'Rare' | 'Common';
  categories?: string[];
  showInSpin?: boolean;
}

export interface CharacterFormPayload {
  id?: string;
  name: string;
  imageUrl: string;
  categories?: string[];
  showInSpin?: boolean;
}

export interface GalleryItem {
  id: string;
  name: string;
  leftImageUrl: string;
  rightImageUrl: string;
}

export interface Setting {
  key: string;
  value: any;
}

