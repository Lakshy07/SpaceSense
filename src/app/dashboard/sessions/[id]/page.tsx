import { getSession } from "@/lib/data";
import { notFound } from "next/navigation";
import { WallDisplay } from "@/components/wall-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Sparkles } from "lucide-react";
import ExportButton from "@/components/export-button";

export default async function SessionDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession(params.id);

  if (!session) {
    notFound();
  }

  const { roomDimensions: dim } = session;

  return (
    <div className="container py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold font-headline">{session.name}</h1>
        <p className="text-lg text-muted-foreground">{session.overallTheme}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Details</CardTitle>
                    <ExportButton session={session} />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Ruler className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Dimensions:</span>
                        <span>{dim.width}m x {dim.depth}m x {dim.height}m</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                            <span className="font-medium">Overall Theme:</span>
                            <p className="text-sm text-muted-foreground">{session.overallTheme}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {session.walls.map((wall) => (
                    <WallDisplay key={wall.name} wall={wall} sessionId={session.id} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
