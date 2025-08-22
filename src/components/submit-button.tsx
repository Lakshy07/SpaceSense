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
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'json';
    hiddenInput.value = JSON.stringify(formValues);
    (event.target as HTMLButtonElement).form?.appendChild(hiddenInput);
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
