'use client';

import type { Wall } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { generateWallImageAction } from "@/lib/actions";
import Image from "next/image";

function GenerateButton({ isGenerating }: { isGenerating?: boolean }) {
    return (
        <Button type="submit" disabled={isGenerating} className="w-full">
            {isGenerating ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Design
                </>
            )}
        </Button>
    )
}

export function WallDisplay({ wall, sessionId, roomId }: { wall: Wall; sessionId: string, roomId: string }) {
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{wall.name}</CardTitle>
        <CardDescription className="h-10 min-h-10">{wall.theme}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center bg-muted/50 aspect-video rounded-md m-6 mt-0">
        {wall.imageUrl ? (
          <Image
            src={wall.imageUrl}
            alt={`AI generated design for ${wall.name} wall`}
            width={400}
            height={300}
            className="object-cover w-full h-full rounded-md"
            data-ai-hint="interior wall"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <ImageIcon className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm">Image will appear here</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form action={generateWallImageAction.bind(null, sessionId, roomId, wall.name)} className="w-full">
            <GenerateButton isGenerating={wall.isGenerating} />
        </form>
      </CardFooter>
    </Card>
  );
}
