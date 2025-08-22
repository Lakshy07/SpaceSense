'use client'

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSessionAction } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from './ui/textarea';
import { SubmitButton } from './submit-button';

const sessionSchema = z.object({
  name: z.string().min(3, "Session name must be at least 3 characters long."),
  overallTheme: z.string().min(3, "Overall theme must be at least 3 characters long."),
  width: z.coerce.number().min(1, "Width must be at least 1 meter."),
  height: z.coerce.number().min(1, "Height must be at least 1 meter."),
  depth: z.coerce.number().min(1, "Depth must be at least 1 meter."),
  wallNorth: z.string().min(1, "Theme for North wall is required."),
  wallEast: z.string().min(1, "Theme for East wall is required."),
  wallSouth: z.string().min(1, "Theme for South wall is required."),
  wallWest: z.string().min(1, "Theme for West wall is required."),
});

type SessionFormData = z.infer<typeof sessionSchema>;

const initialState = {
  message: null,
  errors: {},
};

export function SessionForm() {
  const [state, formAction] = useFormState(createSessionAction, initialState);

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: '',
      overallTheme: '',
      width: 4,
      height: 2.5,
      depth: 5,
      wallNorth: '',
      wallEast: '',
      wallSouth: '',
      wallWest: '',
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Modern Living Room" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="overallTheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Room Theme</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the overall vibe of the room..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Room Dimensions (in meters)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="width" render={({ field }) => (
              <FormItem><FormLabel>Width</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="height" render={({ field }) => (
              <FormItem><FormLabel>Height</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="depth" render={({ field }) => (
              <FormItem><FormLabel>Depth</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Wall Themes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="wallNorth" render={({ field }) => (
                <FormItem><FormLabel>North Wall</FormLabel><FormControl><Textarea placeholder="e.g., Exposed brick..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="wallEast" render={({ field }) => (
                <FormItem><FormLabel>East Wall</FormLabel><FormControl><Textarea placeholder="e.g., Large abstract painting..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="wallSouth" render={({ field }) => (
                <FormItem><FormLabel>South Wall</FormLabel><FormControl><Textarea placeholder="e.g., Floor-to-ceiling window..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="wallWest" render={({ field }) => (
                <FormItem><FormLabel>West Wall</FormLabel><FormControl><Textarea placeholder="e.g., Bookshelf wall..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        <SubmitButton />
        {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
      </form>
    </Form>
  );
}
