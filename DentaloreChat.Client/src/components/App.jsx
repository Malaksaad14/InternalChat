import React, { useState } from 'react';
import UserSelector from './components/UserSelector';
import NavIconBar from './components/NavIconBar';
import ConversationList from './components/ConversationList';
import ChatScreen from './components/ChatScreen';
import RightSidebar from './components/RightSidebar';

const ALL_SAMPLE_USERS = [
  { id: 1, name: "Dr. Hana", clinicId: 1, clinicName: "Branch A" },
  { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
  { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" },
  { id: 4, name: "Dr. Omar", clinicId: 2, clinicName: "Branch B" }
];

export default function App() {
 
  const [activeUser, setActiveUser] = useState(ALL_SAMPLE_USERS[0]);
  
 
  const [selectedContact, setSelectedContact] = useState({ 
    id: 2, 
    name: "Dr. Ahmed", 
    clinicId: 1, 
    clinicName: "Branch A" 
  });
  

  const [selectedConversationId, setSelectedConversationId] = useState(1);

  
  const handleSwitchActiveUser = (newUser) => {
    setActiveUser(newUser);
   
    const firstAvailableContact = ALL_SAMPLE_USERS.find(
      u => u.id !== newUser.id && u.clinicId === newUser.clinicId
    );
    if (firstAvailableContact) {
      setSelectedContact(firstAvailableContact);
      setSelectedConversationId(firstAvailableContact.id === 2 ? 1 : 4);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif', background: 'var(--bg-main, #0f172a)' }}>

      <UserSelector activeUser={activeUser} onSelectUser={handleSwitchActiveUser} />
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
      
        <NavIconBar activeUser={activeUser} onSwitchUserClick={handleSwitchActiveUser} />

      
        <ConversationList 
          activeUser={activeUser}
          onSwitchActiveUser={handleSwitchActiveUser}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          selectedConversationId={selectedConversationId} 
          onSelectConversation={setSelectedConversationId} 
        />

        <ChatScreen 
          conversationId={selectedConversationId} 
          activeUser={activeUser} 
          selectedContact={selectedContact}
        />

      
        <RightSidebar 
          activeUser={activeUser} 
          selectedContact={selectedContact} 
        />
      </div>
    </div>
  );
}