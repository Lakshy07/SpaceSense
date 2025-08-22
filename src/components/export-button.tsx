'use client'

import { Button } from "./ui/button";
import { Download } from "lucide-react";
import type { Session } from "@/lib/types";

export default function ExportButton({ session }: { session: Session }) {
  const handleExport = () => {
    // Exclude generative state from export
    const exportableSession = {
      ...session,
      walls: session.walls.map(({isGenerating, ...rest}) => rest)
    }
    const dataStr = JSON.stringify(exportableSession, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `spacesense_session_${session.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
  );
}
