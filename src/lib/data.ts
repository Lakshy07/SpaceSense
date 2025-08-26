import type { Session, Wall, Room, User } from './types';
import { randomBytes } from 'crypto';

// In-memory store for demo purposes
let sessions: Session[] = [];
let users: User[] = [];


// Seed with some initial data for demonstration
if (process.env.NODE_ENV === 'development' && sessions.length === 0) {
  const owner: User = { id: 'owner-1', name: 'Lakshya', role: 'owner', email: 'owner@example.com' };
  const employees: User[] = [
    { id: 'employee-1', name: 'Alex Smith', role: 'employee', ownerId: 'owner-1', email: 'alex@example.com' },
    { id: 'employee-2', name: 'Maria Garcia', role: 'employee', ownerId: 'owner-1', email: 'maria@example.com' },
  ];
  users = [owner, ...employees];

  sessions.push({
    id: '1',
    name: 'Cozy Living Room Project',
    designerId: 'employee-1',
    overallTheme: 'Scandinavian minimalist',
    houseMapUrl: 'https://picsum.photos/seed/floorplan1/200/200',
    status: 'approved',
    rooms: [
        {
            id: 'room1',
            name: 'Living Room',
            theme: 'A mix of scandinavian and industrial, with warm textiles and metal accents.',
            ceilingDesign: 'White ceiling with exposed wooden beams',
            dimensions: { width: 4, height: 2.5, depth: 5 },
            walls: [
              { name: 'North', theme: 'Light gray wall with a large abstract painting', features: { hasWindow: false, windowDetails: '', hasDoor: false, doorDetails: '', otherFeatures: '' }, isGenerating: false },
              { name: 'East', theme: 'Exposed brick accent wall', features: { hasWindow: false, windowDetails: '', hasDoor: false, doorDetails: '', otherFeatures: '' }, isGenerating: false },
              { name: 'South', theme: 'Wall with a large window and sheer curtains', features: { hasWindow: true, windowDetails: 'Centered, 6ft wide', hasDoor: false, doorDetails: '', otherFeatures: '' }, isGenerating: false },
              { name: 'West', theme: 'Bookshelf wall with integrated lighting', features: { hasWindow: false, windowDetails: '', hasDoor: true, doorDetails: 'Sliding barn door', otherFeatures: 'Integrated bookshelf' }, isGenerating: false }
            ],
        }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  });
  sessions.push({
    id: '2',
    name: 'Modern Kitchen & Dining',
    designerId: 'employee-2',
    overallTheme: 'Industrial chic',
    status: 'pending',
    rooms: [
        {
            id: 'room1',
            name: 'Kitchen',
            theme: 'Sleek and functional with dark tones',
            ceilingDesign: 'Track lighting on a dark gray ceiling',
            dimensions: { width: 3, height: 2.7, depth: 4 },
            walls: [
                { name: 'North', theme: 'Dark green tiled wall', features: { hasWindow: false, windowDetails: '', hasDoor: false, doorDetails: '', otherFeatures: 'Open shelving' } },
                { name: 'East', theme: 'Stainless steel backsplash', features: { hasWindow: false, windowDetails: '', hasDoor: false, doorDetails: '', otherFeatures: 'Countertops and cabinets' } },
                { name: 'South', theme: 'Matte black cabinets', features: { hasWindow: false, windowDetails: '', hasDoor: true, doorDetails: 'Pantry door', otherFeatures: '' } },
                { name: 'West', theme: 'Chalkboard paint wall for notes', features: { hasWindow: false, windowDetails: '', hasDoor: false, doorDetails: '', otherFeatures: '' } }
            ]
        },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  });
    sessions.push({
    id: '3',
    name: 'Client Rejection Example',
    designerId: 'employee-1',
    overallTheme: 'Art Deco',
    status: 'rejected',
    rooms: [],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  });
}


export async function getSessions(params?: { designerId?: string, status?: string }): Promise<Session[]> {
  await new Promise(res => setTimeout(res, 500));
  let filteredSessions = sessions;
  if (params?.designerId) {
    filteredSessions = filteredSessions.filter(s => s.designerId === params.designerId);
  }
  if (params?.status) {
    filteredSessions = filteredSessions.filter(s => s.status === params.status);
  }
  return filteredSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllSessionsForOwner(ownerId: string): Promise<Session[]> {
    await new Promise(res => setTimeout(res, 500));
    const employeeIds = users.filter(u => u.role === 'employee' && u.ownerId === ownerId).map(u => u.id);
    const ownerSessions = sessions.filter(s => s.designerId === ownerId);
    const employeeSessions = sessions.filter(s => s.designerId && employeeIds.includes(s.designerId));
    return [...ownerSessions, ...employeeSessions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getSession(id: string): Promise<Session | undefined> {
  await new Promise(res => setTimeout(res, 200));
  return sessions.find(s => s.id === id);
}

export async function createSession(data: Omit<Session, 'id' | 'createdAt' | 'rooms' | 'status'> & { rooms: Array<Omit<Room, 'walls'> & {walls: Array<Omit<Wall, 'imageUrl' | 'isGenerating'>>}> }): Promise<Session> {
  await new Promise(res => setTimeout(res, 300));
  const newSession: Session = {
    id: randomBytes(8).toString('hex'),
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
    rooms: data.rooms.map(r => ({ ...r, id: randomBytes(4).toString('hex'), walls: r.walls.map(w => ({...w, features: w.features || {}, imageUrl: undefined, isGenerating: false})) })),
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

export async function getUsers(params?: { role?: 'owner' | 'employee', ownerId?: string }): Promise<User[]> {
  await new Promise(res => setTimeout(res, 200));
  let filteredUsers = users;
  if(params?.role){
    filteredUsers = filteredUsers.filter(u => u.role === params.role)
  }
  if(params?.ownerId){
    filteredUsers = filteredUsers.filter(u => u.ownerId === params.ownerId)
  }
  return filteredUsers;
}
