import React, { useState } from 'react';
import NavIconBar from './components/NavIconBar';
import ConversationList from './components/ConversationList';
import ChatScreen from './components/ChatScreen';
import './App.css';

const ALL_SAMPLE_USERS = [
  { id: 1, name: "Dr. Malak", clinicId: 1, clinicName: "Branch A" },
  { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
  { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" },
  { id: 4, name: "Dr. Omar", clinicId: 2, clinicName: "Branch B" }
];

export default function App() {
  const [activeUser, setActiveUser] = useState(ALL_SAMPLE_USERS[0]);
  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const [selectedContact, setSelectedContact] = useState(ALL_SAMPLE_USERS[1]);

  const handleSwitchActiveUser = (newUser) => {
    setActiveUser(newUser);

    // STRICT FILTER: Find colleagues ONLY in the new user's clinic
    const validColleagues = ALL_SAMPLE_USERS.filter(
      u => u.id !== newUser.id && u.clinicId === newUser.clinicId
    );
    
    // Assign a default contact. If Clinic 2 has no valid colleagues, this becomes null.
    const defaultContact = newUser.clinicId === 1 
      ? { id: 101, isGroup: true, groupName: "Group Chat" } 
      : (validColleagues.length > 0 ? validColleagues[0] : null);

    setSelectedContact(defaultContact);

    if (defaultContact) {
      const newConvId = defaultContact.isGroup ? 101 : getConversationIdForUsers(newUser.id, defaultContact.id);
      setSelectedConversationId(newConvId);
    } else {
      setSelectedConversationId(null);
    }
  };

  function getConversationIdForUsers(userId1, userId2) {
  const ids = [userId1, userId2].sort((a, b) => a - b);
  if (ids[0] === 1 && ids[1] === 2) return 1;
  if (ids[0] === 3 && ids[1] === 4) return 4; // Maps Sara (3) and Omar (4) to their chat
  return 1;
 }

  return (
    <div className="app-container">
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

      <div className="app-main-window">
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
      </div>
    </div>
  );
}




// import React, { useState } from 'react';
// import NavIconBar from './components/NavIconBar';
// import ConversationList from './components/ConversationList';
// import ChatScreen from './components/ChatScreen';
// import './App.css';

// const ALL_SAMPLE_USERS = [
//   { id: 1, name: "Dr. Malak", clinicId: 1, clinicName: "Branch A" },
//   { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
//   { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" }
// ];

// export default function App() {
//   // Default logged-in user: Dr. Malak (id: 1)
//   const [activeUser, setActiveUser] = useState(ALL_SAMPLE_USERS[0]);
  
//   // Selected conversation ID (default: Conversation 1 between Malak and Ahmed)
//   const [selectedConversationId, setSelectedConversationId] = useState(1);

//   // Selected contact target (Default: Dr. Ahmed)
//   const [selectedContact, setSelectedContact] = useState(ALL_SAMPLE_USERS[1]);

//   // Switch logged-in user context safely
//   const handleSwitchActiveUser = (newUser) => {
//     setActiveUser(newUser);

//     // Find valid colleagues in the NEW user's clinic
//     const validColleagues = ALL_SAMPLE_USERS.filter(
//       u => u.id !== newUser.id && u.clinicId === newUser.clinicId
//     );
    
//     // Default to the group chat if it belongs to their clinic, otherwise pick a colleague, otherwise null
//     const defaultContact = newUser.clinicId === 1 
//       ? { id: 101, isGroup: true, groupName: "Group Chat" } 
//       : (validColleagues.length > 0 ? validColleagues[0] : null);

//     setSelectedContact(defaultContact);

//     if (defaultContact) {
//       const newConvId = defaultContact.isGroup ? 101 : getConversationIdForUsers(newUser.id, defaultContact.id);
//       setSelectedConversationId(newConvId);
//     } else {
//       setSelectedConversationId(null);
//     }
//   };

//   // Helper function to get conversation ID based on two user IDs
//   function getConversationIdForUsers(userId1, userId2) {
//     const ids = [userId1, userId2].sort((a, b) => a - b);
//     if (ids[0] === 1 && ids[1] === 2) return 1; // Malak & Ahmed
//     if (ids[0] === 1 && ids[1] === 3) return 2; // Malak & Sara
//     if (ids[0] === 2 && ids[1] === 3) return 3; // Ahmed & Sara
//     return 1; // Default fallback
//   }

//   return (
//     <div className="app-container">
//       {/* Far Left Navigation Icon Bar */}
//       <NavIconBar 
//         activeUser={activeUser} 
//         onSwitchUserClick={(nextUser) => {
//           if (nextUser) {
//             handleSwitchActiveUser(nextUser);
//           } else {
//             const currentIndex = ALL_SAMPLE_USERS.findIndex(u => u.id === activeUser.id);
//             const next = ALL_SAMPLE_USERS[(currentIndex + 1) % ALL_SAMPLE_USERS.length];
//             handleSwitchActiveUser(next);
//           }
//         }} 
//       />

//       {/* Main App Window Card (Sidebar + Full Chat Area) */}
//       <div className="app-main-window">
//         {/* Left Sidebar: Channels & Direct Messages contacts list */}
//         <ConversationList 
//           activeUser={activeUser}
//           onSwitchActiveUser={handleSwitchActiveUser}
//           selectedContact={selectedContact}
//           onSelectContact={setSelectedContact}
//           selectedConversationId={selectedConversationId} 
//           onSelectConversation={setSelectedConversationId} 
//         />
        
//         {/* Middle/Full Area: Active Chat Feed & Input */}
//         <ChatScreen 
//           conversationId={selectedConversationId} 
//           activeUser={activeUser}
//           selectedContact={selectedContact} 
//         />
//       </div>
//     </div>
//   );
// }
