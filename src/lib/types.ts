export interface Wall {
  name: string; // e.g., 'North Wall', 'Accent Wall'
  theme: string; // The prompt for this specific wall
  imageUrl?: string;
  isGenerating?: boolean;
}

export interface Room {
  id: string;
  name: string;
  theme: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  walls: Wall[];
}

export interface Session {
  id: string;
  name: string; // Project Name
  overallTheme: string; // Global Project Theme
  rooms: Room[];
  createdAt: string; // Using string for easier serialization
}
