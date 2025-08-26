'use server'

import { z } from 'zod';
import { createSession as apiCreateSession, getSession as apiGetSession, updateSession as apiUpdateSession } from '@/lib/data';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Session, Wall, Room } from './types';
import { generateWallDesign } from '@/ai/flows/generate-wall-design';
import { randomBytes } from 'crypto';

const wallSchema = z.object({
  name: z.string().min(1, "Wall name is required."),
  theme: z.string().min(1, "Wall theme is required."),
  features: z.object({
    hasWindow: z.boolean().default(false),
    windowDetails: z.string().optional(),
    hasDoor: z.boolean().default(false),
    doorDetails: z.string().optional(),
    otherFeatures: z.string().optional(),
  }),
});

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required."),
  theme: z.string().min(1, "Room theme is required."),
  ceilingDesign: z.string().min(1, "Ceiling design is required."),
  width: z.coerce.number().min(1, "Width must be at least 1 meter."),
  height: z.coerce.number().min(1, "Height must be at least 1 meter."),
  depth: z.coerce.number().min(1, "Depth must be at least 1 meter."),
  walls: z.array(wallSchema).min(1, "At least one wall is required per room."),
});

const sessionSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters long."),
  overallTheme: z.string().min(3, "Global theme must be at least 3 characters long."),
  rooms: z.array(roomSchema).min(1, "At least one room is required."),
  houseMap: z.any().optional(),
});


export async function createSessionAction(prevState: any, formData: FormData) {
  // This is complex to parse from FormData, so we'll read the raw form body
  const jsonString = formData.get('json') as string;
  const houseMapFile = formData.get('houseMap') as File | null;


  if (!jsonString) { // Fallback for non-JS
     return { message: 'This form requires JavaScript.' };
  }
  
  const validatedFields = sessionSchema.safeParse(JSON.parse(jsonString));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your inputs.',
    };
  }
  
  // In a real app, you'd get the designerId from the logged-in user's session
  const designerId = 'employee-1'; // or 'owner-1'
  const { name, overallTheme, rooms } = validatedFields.data;

  // TODO: Handle file upload to a storage service (e.g., Firebase Storage)
  // For now, we'll just use a placeholder URL.
  const houseMapUrl = houseMapFile && houseMapFile.size > 0 ? `https://picsum.photos/seed/${randomBytes(4).toString('hex')}/400/400` : undefined;


  try {
    const newSession = await apiCreateSession({
      name,
      overallTheme,
      houseMapUrl,
      designerId,
      rooms: rooms.map(room => ({
        id: randomBytes(4).toString('hex'),
        ...room,
        dimensions: {
            width: room.width,
            height: room.height,
            depth: room.depth
        },
        walls: room.walls.map(wall => ({
          name: wall.name,
          theme: wall.theme,
          features: wall.features,
        })),
      })),
    });
    
    if (!newSession) {
        throw new Error("Failed to create session.");
    }
    
    revalidatePath('/dashboard/owner');
    revalidatePath('/dashboard/employee');
    redirect(`/dashboard/sessions/${newSession.id}`);
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }
}

export async function generateWallImageAction(sessionId: string, roomId: string, wallName: Wall['name']) {
    const session = await apiGetSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const room = session.rooms.find(r => r.id === roomId);
    if (!room) {
        throw new Error('Room not found');
    }

    const wall = room.walls.find(w => w.name === wallName);
    if (!wall) {
        throw new Error('Wall not found');
    }

    // Set generating state
    wall.isGenerating = true;
    await apiUpdateSession(sessionId, { rooms: session.rooms });
    revalidatePath(`/dashboard/sessions/${sessionId}`);

    try {
        let prompt = wall.theme;
        prompt += ` The room has a ${room.theme} theme. The ceiling is ${room.ceilingDesign}.`;

        if (wall.features.hasWindow) {
            prompt += ` The wall has a window. Details: ${wall.features.windowDetails}.`;
        }
        if (wall.features.hasDoor) {
            prompt += ` The wall has a door. Details: ${wall.features.doorDetails}.`;
        }
        if (wall.features.otherFeatures) {
            prompt += ` Other features on the wall: ${wall.features.otherFeatures}.`;
        }


        const result = await generateWallDesign({ prompt });
        
        const finalSession = await apiGetSession(sessionId);
        if(!finalSession) throw new Error('Session disappeared');
        const finalRoom = finalSession.rooms.find(r => r.id === roomId);
        if(!finalRoom) throw new Error('Room disappeared');

        const finalWall = finalRoom.walls.find(w => w.name === wallName);

        if (finalWall) {
            finalWall.imageUrl = result.imageDataUri;
            finalWall.isGenerating = false;
        }

        await apiUpdateSession(sessionId, { rooms: finalSession.rooms });
    } catch(e) {
        // Reset generating state on error
        const errorSession = await apiGetgtiSession(sessionId);
        if(!errorSession) return;
        const finalRoom = errorSession.rooms.find(r => r.id === roomId);
        if(!finalRoom) return;
        const finalWall = finalRoom.walls.find(w => w.name === wallName);
        if (finalWall) {
            finalWall.isGenerating = false;
        }
        await apiUpdateSession(sessionId, { rooms: errorSession.rooms });
        console.error("AI Generation failed:", e);
    }

    revalidatePath(`/dashboard/sessions/${sessionId}`);
}

async function apiGetgtiSession(sessionId: string): Promise<Session | undefined> {
    return apiGetSession(sessionId);
}
