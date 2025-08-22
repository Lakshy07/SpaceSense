import type { Session, Wall } from './types';
import { randomBytes } from 'crypto';

// In-memory store for demo purposes
let sessions: Session[] = [];

// Seed with some initial data for demonstration
if (process.env.NODE_ENV === 'development' && sessions.length === 0) {
  sessions.push({
    id: '1',
    name: 'Cozy Living Room',
    overallTheme: 'Scandinavian minimalist',
    roomDimensions: { width: 4, height: 2.5, depth: 5 },
    walls: [
      { name: 'North', theme: 'Light gray wall with a large abstract painting' },
      { name: 'East', theme: 'Exposed brick accent wall' },
      { name: 'South', theme: 'Wall with a large window and sheer curtains' },
      { name: 'West', theme: 'Bookshelf wall with integrated lighting' }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  });
  sessions.push({
    id: '2',
    name: 'Modern Kitchen',
    overallTheme: 'Industrial chic',
    roomDimensions: { width: 3, height: 2.7, depth: 4 },
    walls: [
      { name: 'North', theme: 'Dark green tiled wall' },
      { name: 'East', theme: 'Stainless steel backsplash' },
      { name: 'South', theme: 'Matte black cabinets' },
      { name: 'West', theme: 'Chalkboard paint wall for notes' }
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  });
}


export async function getSessions(): Promise<Session[]> {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  return sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getSession(id: string): Promise<Session | undefined> {
  await new Promise(res => setTimeout(res, 200));
  return sessions.find(s => s.id === id);
}

export async function createSession(data: Omit<Session, 'id' | 'createdAt' | 'walls'> & { walls: Array<Omit<Wall, 'imageUrl' | 'isGenerating'>> }): Promise<Session> {
  await new Promise(res => setTimeout(res, 300));
  const newSession: Session = {
    id: randomBytes(8).toString('hex'),
    ...data,
    createdAt: new Date().toISOString(),
    walls: data.walls.map(w => ({ ...w, imageUrl: undefined, isGenerating: false })),
  };
  sessions.unshift(newSession); // Add to the beginning of the array
  return newSession;
}

export async function updateSession(id: string, data: Partial<Session>): Promise<Session | undefined> {
  await new Promise(res => setTimeout(res, 100));
  const sessionIndex = sessions.findIndex(s => s.id === id);
  if (sessionIndex === -1) return undefined;
  
  const updatedWalls = data.walls ? data.walls.map(updatedWall => {
    const originalWall = sessions[sessionIndex].walls.find(w => w.name === updatedWall.name);
    return { ...originalWall, ...updatedWall };
  }) : sessions[sessionIndex].walls;

  sessions[sessionIndex] = { ...sessions[sessionIndex], ...data, walls: updatedWalls };
  return sessions[sessionIndex];
}
