'use server'

import { z } from 'zod';
import { createSession as apiCreateSession, getSession as apiGetSession, updateSession as apiUpdateSession } from '@/lib/data';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Session, Wall } from './types';
import { generateWallDesign } from '@/ai/flows/generate-wall-design';

const sessionSchema = z.object({
  name: z.string().min(3, "Session name must be at least 3 characters long."),
  overallTheme: z.string().min(3, "Overall theme must be at least 3 characters long."),
  width: z.coerce.number().min(1, "Width must be at least 1."),
  height: z.coerce.number().min(1, "Height must be at least 1."),
  depth: z.coerce.number().min(1, "Depth must be at least 1."),
  wallNorth: z.string().min(1, "Theme for North wall is required."),
  wallEast: z.string().min(1, "Theme for East wall is required."),
  wallSouth: z.string().min(1, "Theme for South wall is required."),
  wallWest: z.string().min(1, "Theme for West wall is required."),
});


export async function createSessionAction(prevState: any, formData: FormData) {
  const validatedFields = sessionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your inputs.',
    };
  }

  const { name, overallTheme, width, height, depth, wallNorth, wallEast, wallSouth, wallWest } = validatedFields.data;

  try {
    const newSession = await apiCreateSession({
      name,
      overallTheme,
      roomDimensions: { width, height, depth },
      walls: [
        { name: 'North', theme: wallNorth },
        { name: 'East', theme: wallEast },
        { name: 'South', theme: wallSouth },
        { name: 'West', theme: wallWest },
      ]
    });
    
    if (!newSession) {
        throw new Error("Failed to create session.");
    }
    
    revalidatePath('/dashboard');
    redirect(`/dashboard/sessions/${newSession.id}`);
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }
}

export async function generateWallImageAction(sessionId: string, wallName: Wall['name']) {
    const session = await apiGetSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const wall = session.walls.find(w => w.name === wallName);
    if (!wall) {
        throw new Error('Wall not found');
    }

    // Set generating state
    wall.isGenerating = true;
    await apiUpdateSession(sessionId, { walls: session.walls });
    revalidatePath(`/dashboard/sessions/${sessionId}`);

    try {
        const result = await generateWallDesign({ prompt: wall.theme });
        
        const finalSession = await apiGetSession(sessionId);
        if(!finalSession) throw new Error('Session disappeared');
        const finalWall = finalSession.walls.find(w => w.name === wallName);

        if (finalWall) {
            finalWall.imageUrl = result.imageDataUri;
            finalWall.isGenerating = false;
        }

        await apiUpdateSession(sessionId, { walls: finalSession.walls });
    } catch(e) {
        // Reset generating state on error
        const errorSession = await apiGetSession(sessionId);
        if(!errorSession) return;
        const finalWall = errorSession.walls.find(w => w.name === wallName);
        if (finalWall) {
            finalWall.isGenerating = false;
        }
        await apiUpdateSession(sessionId, { walls: errorSession.walls });
        console.error("AI Generation failed:", e);
    }

    revalidatePath(`/dashboard/sessions/${sessionId}`);
}
