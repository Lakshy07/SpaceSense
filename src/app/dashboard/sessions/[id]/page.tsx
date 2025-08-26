import { getSession } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { WallDisplay } from "@/components/wall-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Sparkles, Home, Box, Grid3x3, Map } from "lucide-react";
import ExportButton from "@/components/export-button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default async function SessionDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession(params.id);

  if (!session) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-4">
          <Home className="h-10 w-10 text-muted-foreground" />
          <div>
            <h1 className="text-4xl font-bold font-headline">{session.name}</h1>
            <p className="text-lg text-muted-foreground">{session.overallTheme}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Project Details</CardTitle>
                    <ExportButton session={session} />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                            <span className="font-medium">Global Theme:</span>
                            <p className="text-sm text-muted-foreground">{session.overallTheme}</p>
                        </div>
                    </div>
                     {session.houseMapUrl && (
                        <div className="flex items-start gap-3">
                            <Map className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <span className="font-medium">Floor Plan</span>
                                <div className="mt-2 rounded-md border overflow-hidden">
                                     <Image 
                                        src={session.houseMapUrl} 
                                        alt="House floor plan" 
                                        width={200}
                                        height={200}
                                        className="w-full h-auto object-contain"
                                        data-ai-hint="floor plan"
                                     />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
           <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {session.rooms.map((room, index) => (
                <AccordionItem key={room.id} value={`item-${index}`}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-4">
                            <Box className="h-6 w-6" />
                            <div className="text-left">
                                <h3 className="text-lg font-semibold">{room.name}</h3>
                                <p className="text-sm text-muted-foreground">{room.theme}</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Card className="border-none shadow-none">
                            <CardHeader>
                               <div className="flex items-center gap-3 text-sm mb-2">
                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Dimensions:</span>
                                    <span>{room.dimensions.width}m x {room.dimensions.depth}m x {room.dimensions.height}m</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Ceiling:</span>
                                    <span>{room.ceilingDesign}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {room.walls.map((wall) => (
                                        <WallDisplay key={wall.name} wall={wall} sessionId={session.id} roomId={room.id} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            ))}
           </Accordion>
        </div>
      </div>
    </div>
  );
}
