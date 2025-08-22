import { SessionForm } from '@/components/session-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewSessionPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create a New Design Session</CardTitle>
          <CardDescription>
            Define the room dimensions and themes to start generating your design.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionForm />
        </CardContent>
      </Card>
    </div>
  );
}
