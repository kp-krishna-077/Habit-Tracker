import { useState } from 'react';
import BottomNav from '../BottomNav';

export default function BottomNavExample() {
  const [activeTab, setActiveTab] = useState('habits');
  
  return (
    <div className="h-screen relative">
      <div className="p-4">
        <p>Active tab: {activeTab}</p>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
