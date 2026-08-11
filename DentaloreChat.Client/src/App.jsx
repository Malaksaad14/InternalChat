import React, { useState } from 'react';
import NavIconBar from './components/NavIconBar';
import ConversationList from './components/ConversationList';
import ChatScreen from './components/ChatScreen';
import './App.css';

const ALL_SAMPLE_USERS = [
  { id: 1, name: "Dr. Malak", clinicId: 1, clinicName: "Branch A" },
  { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
  { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" }
];

export default function App() {
  // Default logged-in user: Dr. Malak (id: 1)
  const [activeUser, setActiveUser] = useState(ALL_SAMPLE_USERS[0]);
  
  // Selected conversation ID (default: Conversation 1 between Malak and Ahmed)
  const [selectedConversationId, setSelectedConversationId] = useState(1);

  // Selected contact target (Default: Dr. Ahmed)
  const [selectedContact, setSelectedContact] = useState(ALL_SAMPLE_USERS[1]);

  // Switch logged-in user context safely
  const handleSwitchActiveUser = (newUser) => {
    setActiveUser(newUser);

    // If currently selected contact is the user themselves, switch to a valid colleague
    if (!selectedContact?.isGroup && selectedContact?.id === newUser.id) {
      const fallbackContact = ALL_SAMPLE_USERS.find(u => u.id !== newUser.id);
      if (fallbackContact) {
        setSelectedContact(fallbackContact);
        // Update conversation ID based on new user and fallback contact
        const newConvId = getConversationIdForUsers(newUser.id, fallbackContact.id);
        setSelectedConversationId(newConvId);
      }
    } else if (selectedContact && !selectedContact.isGroup) {
      // Update conversation ID based on new user and same contact
      const newConvId = getConversationIdForUsers(newUser.id, selectedContact.id);
      setSelectedConversationId(newConvId);
    }
  };

  // Helper function to get conversation ID based on two user IDs
  function getConversationIdForUsers(userId1, userId2) {
    const ids = [userId1, userId2].sort((a, b) => a - b);
    if (ids[0] === 1 && ids[1] === 2) return 1; // Malak & Ahmed
    if (ids[0] === 1 && ids[1] === 3) return 2; // Malak & Sara
    if (ids[0] === 2 && ids[1] === 3) return 3; // Ahmed & Sara
    return 1; // Default fallback
  }

  return (
    <div className="app-container">
      {/* Far Left Navigation Icon Bar */}
      <NavIconBar 
        activeUser={activeUser} 
        onSwitchUserClick={(nextUser) => {
          if (nextUser) {
            handleSwitchActiveUser(nextUser);
          } else {
            const currentIndex = ALL_SAMPLE_USERS.findIndex(u => u.id === activeUser.id);
            const next = ALL_SAMPLE_USERS[(currentIndex + 1) % ALL_SAMPLE_USERS.length];
            handleSwitchActiveUser(next);
          }
        }} 
      />

      {/* Main App Window Card (Sidebar + Full Chat Area) */}
      <div className="app-main-window">
        {/* Left Sidebar: Channels & Direct Messages contacts list */}
        <ConversationList 
          activeUser={activeUser}
          onSwitchActiveUser={handleSwitchActiveUser}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          selectedConversationId={selectedConversationId} 
          onSelectConversation={setSelectedConversationId} 
        />
        
        {/* Middle/Full Area: Active Chat Feed & Input */}
        <ChatScreen 
          conversationId={selectedConversationId} 
          activeUser={activeUser}
          selectedContact={selectedContact} 
        />
      </div>
    </div>
  );
}
