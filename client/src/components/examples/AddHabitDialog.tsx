import { useState } from 'react';
import AddHabitDialog from '../AddHabitDialog';
import { Button } from '@/components/ui/button';

export default function AddHabitDialogExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <AddHabitDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={(title, description, freq, days) => {
          console.log('Saved:', title, description, freq, days);
          setOpen(false);
        }}
      />
    </div>
  );
}
