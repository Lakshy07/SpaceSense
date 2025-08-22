'use client'

import { useFormState } from 'react-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSessionAction } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from './ui/textarea';
import { SubmitButton } from './submit-button';
import { Button } from './ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';

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
      rooms: [
        { 
          name: 'Living Room', 
          theme: 'Modern',
          ceilingDesign: 'White ceiling with recessed lighting',
          width: 4, 
          height: 2.5, 
          depth: 5,
          walls: [
            { name: 'North Wall', theme: 'A light gray wall with a large abstract painting', features: { hasWindow: false, windowDetails: '', hasDoor: false, doorDetails: '', otherFeatures: '' } },
            { name: 'East Wall', theme: 'Exposed brick accent wall', features: { hasWindow: false, windowDetails: '', hasDoor: false, doorDetails: '', otherFeatures: '' } },
            { name: 'South Wall', theme: 'Wall with a large window and sheer curtains', features: { hasWindow: true, windowDetails: 'Centered, 6ft wide', hasDoor: false, doorDetails: '', otherFeatures: '' } },
            { name: 'West Wall', theme: 'Bookshelf wall with integrated lighting', features: { hasWindow: false, windowDetails: '', hasDoor: true, doorDetails: 'Oak door, on the right', otherFeatures: 'Integrated bookshelf' } },
          ]
        }
      ],
    },
  });

  const { fields: roomFields, append: appendRoom, remove: removeRoom } = useFieldArray({
    control: form.control,
    name: "rooms"
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
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Johnson Residence" {...field} />
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
                <FormLabel>Global Project Theme</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the overall vibe of the project..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="text-xl font-medium mb-4">Rooms</h3>
          <div className="space-y-6">
            {roomFields.map((room, roomIndex) => (
              <RoomCard key={room.id} form={form} roomIndex={roomIndex} removeRoom={removeRoom} />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => appendRoom({ name: `Room ${roomFields.length + 1}`, theme: '', ceilingDesign: '', width: 4, height: 2.5, depth: 5, walls: [{ name: 'Main Wall', theme: '', features: { hasWindow: false, windowDetails: '', hasDoor: false, doorDetails: '', otherFeatures: '' } }] })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
        
        <SubmitButton />
        {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
      </form>
    </Form>
  );
}


function RoomCard({ form, roomIndex, removeRoom }: { form: any, roomIndex: number, removeRoom: (index: number) => void }) {
  const { fields: wallFields, append: appendWall, remove: removeWall } = useFieldArray({
    control: form.control,
    name: `rooms.${roomIndex}.walls`
  });

  return (
     <Card className="bg-muted/30">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Room {roomIndex + 1}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => removeRoom(roomIndex)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </CardHeader>
        <CardContent className="space-y-6">
            <FormField control={form.control} name={`rooms.${roomIndex}.name`} render={({ field }) => (
                <FormItem><FormLabel>Room Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name={`rooms.${roomIndex}.theme`} render={({ field }) => (
                <FormItem><FormLabel>Room Theme</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name={`rooms.${roomIndex}.ceilingDesign`} render={({ field }) => (
                <FormItem><FormLabel>Ceiling Design</FormLabel><FormControl><Input placeholder="e.g., Cove lighting, matte finish" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div>
                <h4 className="font-medium mb-2">Dimensions (in meters)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name={`rooms.${roomIndex}.width`} render={({ field }) => (
                    <FormItem><FormLabel>Width</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`rooms.${roomIndex}.height`} render={({ field }) => (
                    <FormItem><FormLabel>Height</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`rooms.${roomIndex}.depth`} render={({ field }) => (
                    <FormItem><FormLabel>Depth</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-2">Walls</h4>
                <div className="space-y-4">
                {wallFields.map((wall, wallIndex) => (
                    <WallCard key={wall.id} form={form} roomIndex={roomIndex} wallIndex={wallIndex} removeWall={removeWall} />
                ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendWall({ name: `Wall ${wallFields.length + 1}`, theme: '', features: { hasWindow: false, windowDetails: '', hasDoor: false, doorDetails: '', otherFeatures: '' } })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Wall
                </Button>
            </div>
        </CardContent>
     </Card>
  )
}

function WallCard({ form, roomIndex, wallIndex, removeWall }: { form: any, roomIndex: number, wallIndex: number, removeWall: (index: number) => void }) {
    const watchHasWindow = form.watch(`rooms.${roomIndex}.walls.${wallIndex}.features.hasWindow`);
    const watchHasDoor = form.watch(`rooms.${roomIndex}.walls.${wallIndex}.features.hasDoor`);

    return (
        <Card key={wallIndex} className="p-4 space-y-4 relative bg-background">
            <div className="flex items-start gap-2">
                <div className='flex-grow space-y-2'>
                    <FormField control={form.control} name={`rooms.${roomIndex}.walls.${wallIndex}.name`} render={({ field }) => (
                        <FormItem><FormLabel>Wall Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`rooms.${roomIndex}.walls.${wallIndex}.theme`} render={({ field }) => (
                        <FormItem><FormLabel>Wall Theme/Prompt</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeWall(wallIndex)} className='absolute top-2 right-2'><Trash2 className="h-4 w-4" /></Button>
            </div>
            
            <div className='space-y-4'>
                <FormField
                    control={form.control}
                    name={`rooms.${roomIndex}.walls.${wallIndex}.features.hasWindow`}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Has Window?</FormLabel>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {watchHasWindow && (
                    <FormField control={form.control} name={`rooms.${roomIndex}.walls.${wallIndex}.features.windowDetails`} render={({ field }) => (
                        <FormItem><FormLabel>Window Details</FormLabel><FormControl><Input placeholder="e.g. centered, 6ft wide, 4ft high" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                )}

                <FormField
                    control={form.control}
                    name={`rooms.${roomIndex}.walls.${wallIndex}.features.hasDoor`}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Has Door?</FormLabel>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {watchHasDoor && (
                     <FormField control={form.control} name={`rooms.${roomIndex}.walls.${wallIndex}.features.doorDetails`} render={({ field }) => (
                        <FormItem><FormLabel>Door Details</FormLabel><FormControl><Input placeholder="e.g. left side, 3ft wide" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                )}

                <FormField control={form.control} name={`rooms.${roomIndex}.walls.${wallIndex}.features.otherFeatures`} render={({ field }) => (
                    <FormItem><FormLabel>Other Features</FormLabel><FormControl><Input placeholder="e.g. TV mount, two shelves" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
        </Card>
    );
}
