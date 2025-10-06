import { useState } from 'react';
import ConfettiEffect from '../ConfettiEffect';
import { Button } from '@/components/ui/button';

export default function ConfettiEffectExample() {
  const [show, setShow] = useState(false);
  
  return (
    <div className="p-4">
      <Button onClick={() => setShow(true)}>Trigger Confetti</Button>
      <ConfettiEffect show={show} onComplete={() => setShow(false)} />
    </div>
  );
}
