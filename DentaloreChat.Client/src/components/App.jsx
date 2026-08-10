import React, { useState } from 'react';
import UserSelector from './components/UserSelector';
import ConversationList from './components/ConversationList';
import ChatScreen from './components/ChatScreen';

export default function App() {
  const [activeUser, setActiveUser] = useState({ id: 1, name: "Dr. Malak", clinicId: 1 });
  const [selectedConversationId, setSelectedConversationId] = useState(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      <UserSelector activeUser={activeUser} onSelectUser={setActiveUser} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ConversationList 
          activeClinicId={activeUser.clinicId} 
          selectedConversationId={selectedConversationId} 
          onSelectConversation={setSelectedConversationId} 
        />
        <ChatScreen 
          conversationId={selectedConversationId} 
          activeUser={activeUser} 
        />
      </div>
    </div>
  );
}