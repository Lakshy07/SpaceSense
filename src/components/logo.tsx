import { SquareStack } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 text-lg font-bold tracking-tighter">
      <SquareStack className="h-6 w-6 text-primary" />
      <span className="font-headline">SpaceSense AI</span>
    </div>
  );
}
