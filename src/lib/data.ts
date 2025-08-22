import type { Session, Wall, Room } from './types';
import { randomBytes } from 'crypto';

// In-memory store for demo purposes
let sessions: Session[] = [];

// Seed with some initial data for demonstration
if (process.env.NODE_ENV === 'development' && sessions.length === 0) {
  sessions.push({
    id: '1',
    name: 'Cozy Living Room Project',
    overallTheme: 'Scandinavian minimalist',
    rooms: [
        {
            id: 'room1',
            name: 'Living Room',
            theme: 'A mix of scandinavian and industrial, with warm textiles and metal accents.',
            dimensions: { width: 4, height: 2.5, depth: 5 },
            walls: [
              { name: 'North', theme: 'Light gray wall with a large abstract painting', isGenerating: false },
              { name: 'East', theme: 'Exposed brick accent wall', isGenerating: false },
              { name: 'South', theme: 'Wall with a large window and sheer curtains', isGenerating: false },
              { name: 'West', theme: 'Bookshelf wall with integrated lighting', isGenerating: false }
            ],
        }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  });
  sessions.push({
    id: '2',
    name: 'Modern Kitchen & Dining',
    overallTheme: 'Industrial chic',
    rooms: [
        {
            id: 'room1',
            name: 'Kitchen',
            theme: 'Sleek and functional with dark tones',
            dimensions: { width: 3, height: 2.7, depth: 4 },
            walls: [
                { name: 'North', theme: 'Dark green tiled wall' },
                { name: 'East', theme: 'Stainless steel backsplash' },
                { name: 'South', theme: 'Matte black cabinets' },
                { name: 'West', theme: 'Chalkboard paint wall for notes' }
            ]
        },
        {
            id: 'room2',
            name: 'Dining Area',
            theme: 'Bright and airy extension of the kitchen',
            dimensions: { width: 3, height: 2.7, depth: 3 },
            walls: [
                { name: 'North', theme: 'Feature wall with geometric wallpaper' },
                { name: 'East', theme: 'Large glass sliding doors to the garden' },
            ]
        }
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

export async function createSession(data: Omit<Session, 'id' | 'createdAt' | 'rooms'> & { rooms: Array<Omit<Room, 'walls'> & {walls: Array<Omit<Wall, 'imageUrl' | 'isGenerating'>>}> }): Promise<Session> {
  await new Promise(res => setTimeout(res, 300));
  const newSession: Session = {
    id: randomBytes(8).toString('hex'),
    ...data,
    createdAt: new Date().toISOString(),
    rooms: data.rooms.map(r => ({ ...r, id: randomBytes(4).toString('hex'), walls: r.walls.map(w => ({...w, imageUrl: undefined, isGenerating: false})) })),
  };
  sessions.unshift(newSession); // Add to the beginning of the array
  return newSession;
}

export async function updateSession(id: string, data: Partial<Session>): Promise<Session | undefined> {
  await new Promise(res => setTimeout(res, 100));
  const sessionIndex = sessions.findIndex(s => s.id === id);
  if (sessionIndex === -1) return undefined;
  
  const updatedSession = { ...sessions[sessionIndex], ...data };

  if (data.rooms) {
    updatedSession.rooms = data.rooms.map(updatedRoom => {
        const originalRoom = sessions[sessionIndex].rooms.find(r => r.id === updatedRoom.id);
        if (!originalRoom) return { ...updatedRoom, walls: updatedRoom.walls.map(w => ({ ...w })) }; // New room

        const updatedWalls = updatedRoom.walls.map(updatedWall => {
            const originalWall = originalRoom.walls.find(w => w.name === updatedWall.name);
            return { ...originalWall, ...updatedWall };
        });

        return { ...originalRoom, ...updatedRoom, walls: updatedWalls };
    });
  }

  sessions[sessionIndex] = updatedSession;
  return sessions[sessionIndex];
}
