export interface Wall {
  name: 'North' | 'South' | 'East' | 'West';
  theme: string;
  imageUrl?: string;
  isGenerating?: boolean;
}

export interface Session {
  id: string;
  name: string;
  roomDimensions: {
    width: number;
    height: number;
    depth: number;
  };
  overallTheme: string;
  walls: Wall[];
  createdAt: string; // Using string for easier serialization
}
