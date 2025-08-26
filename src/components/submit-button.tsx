'use client'

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export function SubmitButton() {
  const { pending } = useFormStatus();
  const form = useFormContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // This is a hack to pass the whole form state as JSON
    // because server actions can't easily parse complex nested objects from FormData
    const formValues = form.getValues();
    
    // We need to handle the file input separately
    const formData = new FormData((event.target as HTMLButtonElement).form!);
    const houseMapFile = formData.get('houseMap');

    const valuesToSubmit = { ...formValues };
    // remove the file object before serializing
    delete valuesToSubmit.houseMap; 

    // Add the json to the form
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'json';
    hiddenInput.value = JSON.stringify(valuesToSubmit);
    (event.target as HTMLButtonElement).form?.appendChild(hiddenInput);

    // Re-add file if it exists, so it's submitted with the form
    if (houseMapFile && (houseMapFile as File).size > 0) {
      // We already have it in FormData, so no need to append again
    } else {
       // if there's no file, we might need to remove it from form data
       // if it was previously set, to avoid sending an empty file.
       if (formData.has('houseMap')) {
         // The form will submit the file input, let's trust it.
       }
    }
  };

  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto" onClick={handleClick}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        'Create Project'
      )}
    </Button>
  );
}
