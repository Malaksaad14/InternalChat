import React, { useState } from 'react';

const ALL_SAMPLE_USERS = [
  { id: 1, name: "Dr. Malak", clinicId: 1, clinicName: "Branch A" },
  { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
  { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" },
  { id: 4, name: "Dr. Omar", clinicId: 2, clinicName: "Branch B" }
];

function getConversationIdForUsers(userId1, userId2) {
  const ids = [userId1, userId2].sort((a, b) => a - b);
  if (ids[0] === 1 && ids[1] === 2) return 1;
  if (ids[0] === 3 && ids[1] === 4) return 4; // Maps Sara (3) and Omar (4) to their chat
  return 1;
}
export default function ConversationList({ 
  activeUser, 
  onSwitchActiveUser, 
  selectedContact, 
  onSelectContact,
  selectedConversationId, 
  onSelectConversation 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const singleGroup = { id: 101, isGroup: true, groupName: "Group Chat", membersCount: 3, conversationId: 101 };

  // STRICT FILTER: Only show users who belong to the Active User's Clinic!
  const otherUsers = ALL_SAMPLE_USERS.filter(u => 
    u.id !== activeUser.id && u.clinicId === activeUser.clinicId
  );

  const filteredContacts = otherUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.clinicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isGroupSelected = selectedContact?.isGroup;

  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <div>
            <div className="sidebar-title">Messages</div>
            <div className="sidebar-user-email">
              Logged in: <strong style={{ color: '#38bdf8' }}>{activeUser?.name || 'User'}</strong>
            </div>
          </div>
          <button className="icon-btn" title="Options" style={{ width: '32px', height: '32px' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-box">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search channels & doctors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* STRICT FILTER: Only render the Group Chat UI if the user is in Clinic 1 */}
      {activeUser.clinicId === 1 && (
        <div className="category-list">
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
            CLINIC CHANNELS
          </div>
          
          <div 
            className={`category-item ${isGroupSelected ? 'active' : ''}`}
            onClick={() => {
              onSelectContact(singleGroup);
              onSelectConversation(singleGroup.id);
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="category-left">
              <div className="category-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)', color: '#fff' }}>
                👥
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                  {singleGroup.groupName}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                  2 Members • Medical Team
                </div>
              </div>
            </div>
            <div className="badge">Group</div>
          </div>
        </div>
      )}

      {/* Direct Messages Section Header */}
      <div className="sidebar-section-divider">
        <span className="section-label">DIRECT MESSAGES</span>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>
          {filteredContacts.length} Doctors
        </span>
      </div>

      {/* Direct Contacts List */}
      <div className="users-list">
        {filteredContacts.map(contact => {
          const isSelected = !selectedContact?.isGroup && selectedContact?.id === contact.id;
          const initials = contact.name.split(' ').map(n => n[0]).join('');

          return (
            <div 
              key={contact.id} 
              className={`user-card ${isSelected ? 'active-chat' : ''}`}
              onClick={() => {
                onSelectContact(contact);
                const convId = getConversationIdForUsers(activeUser.id, contact.id);
                onSelectConversation(convId);
              }}
            >
              <div className="user-info-left">
                <div className="avatar-wrapper">
                  <div className="avatar">
                    {initials}
                  </div>
                  <div className="status-dot"></div>
                </div>
                <div className="user-details">
                  <div className="user-name-text">{contact.name}</div>
                  <div className="user-subtext">
                    {contact.clinicName} • Available
                  </div>
                </div>
              </div>

              <div className="user-card-right">
                <span className="user-time">Online</span>
                {isSelected && (
                  <span className="active-user-badge">Chatting</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Logged-in User Switch Context Bar */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 'bold' }}>
          LOGGED IN AS (SWITCH DOCTOR):
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {ALL_SAMPLE_USERS.map(u => {
            const isActive = activeUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => onSwitchActiveUser(u)}
                style={{
                  flex: 1,
                  padding: '7px 4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  border: isActive ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                  background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3), rgba(6, 182, 212, 0.3))' : 'var(--bg-card)',
                  color: isActive ? '#38bdf8' : 'var(--text-muted)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {u.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}



// import React, { useEffect, useState } from 'react';

// const ALL_SAMPLE_USERS = [
//   { id: 1, name: "Dr. Malak", clinicId: 1, clinicName: "Branch A" },
//   { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
//   { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" }
// ];

// // Map conversation IDs based on the database
// // Conversation 1: Malak (1) & Ahmed (2)
// // Conversation 2: Malak (1) & Sara (3)
// // Conversation 3: Ahmed (2) & Sara (3)
// // Conversation 101: Group Chat
// function getConversationIdForUsers(userId1, userId2) {
//   const ids = [userId1, userId2].sort((a, b) => a - b);
//   if (ids[0] === 1 && ids[1] === 2) return 1; // Malak & Ahmed
//   if (ids[0] === 1 && ids[1] === 3) return 2; // Malak & Sara
//   if (ids[0] === 2 && ids[1] === 3) return 3; // Ahmed & Sara
//   return 1; // Default fallback
// }

// export default function ConversationList({ 
//   activeUser, 
//   onSwitchActiveUser, 
//   selectedContact, 
//   onSelectContact,
//   selectedConversationId, 
//   onSelectConversation 
// }) {
//   const [conversations, setConversations] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Single main group channel renamed to "Group Chat"
//   const singleGroup = { id: 101, isGroup: true, groupName: "Group Chat", membersCount: 3, conversationId: 101 };

//   // Direct contacts excluding the currently logged-in active user, 
//   // AND enforcing clinic-level isolation so they only see their own staff!
//   const otherUsers = ALL_SAMPLE_USERS.filter(u => 
//     u.id !== activeUser.id && u.clinicId === activeUser.clinicId
//   );

//   const filteredContacts = otherUsers.filter(u => 
//     u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     u.clinicName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const isGroupSelected = selectedContact?.isGroup;

//   return (
//     <div className="sidebar">
//       {/* Sidebar Header */}
//       <div className="sidebar-header">
//         <div className="sidebar-title-row">
//           <div>
//             <div className="sidebar-title">Messages</div>
//             <div className="sidebar-user-email">
//               Logged in: <strong style={{ color: '#38bdf8' }}>{activeUser?.name || 'User'}</strong>
//             </div>
//           </div>
//           <button className="icon-btn" title="Options" style={{ width: '32px', height: '32px' }}>
//             <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//             </svg>
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="search-box">
//           <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//           <input 
//             type="text" 
//             placeholder="Search channels & doctors..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Conversations / Group Channel List */}
//       <div className="category-list">
//         <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
//           CLINIC CHANNELS
//         </div>
        
//         <div 
//           className={`category-item ${isGroupSelected ? 'active' : ''}`}
//           onClick={() => {
//             onSelectContact(singleGroup);
//             onSelectConversation(singleGroup.id);
//           }}
//           style={{ cursor: 'pointer' }}
//         >
//           <div className="category-left">
//             <div className="category-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)', color: '#fff' }}>
//               👥
//             </div>
//             <div>
//               <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
//                 {singleGroup.groupName}
//               </div>
//               <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
//                 3 Members • Medical Team
//               </div>
//             </div>
//           </div>
//           <div className="badge">Group</div>
//         </div>
//       </div>

//       {/* Direct Messages Section Header */}
//       <div className="sidebar-section-divider">
//         <span className="section-label">DIRECT MESSAGES</span>
//         <span style={{ fontSize: '11px', color: '#38bdf8' }}>
//           {filteredContacts.length} Doctors
//         </span>
//       </div>

//       {/* Direct Contacts List */}
//       <div className="users-list">
//         {filteredContacts.map(contact => {
//           const isSelected = !selectedContact?.isGroup && selectedContact?.id === contact.id;
//           const initials = contact.name.split(' ').map(n => n[0]).join('');

//           return (
//             <div 
//               key={contact.id} 
//               className={`user-card ${isSelected ? 'active-chat' : ''}`}
//               onClick={() => {
//                 onSelectContact(contact);
//                 const convId = getConversationIdForUsers(activeUser.id, contact.id);
//                 onSelectConversation(convId);
//               }}
//               title={`Click to open direct chat with ${contact.name}`}
//             >
//               <div className="user-info-left">
//                 <div className="avatar-wrapper">
//                   <div className="avatar">
//                     {initials}
//                   </div>
//                   <div className="status-dot"></div>
//                 </div>
//                 <div className="user-details">
//                   <div className="user-name-text">{contact.name}</div>
//                   <div className="user-subtext">
//                     {contact.clinicName} • Available
//                   </div>
//                 </div>
//               </div>

//               <div className="user-card-right">
//                 <span className="user-time">Online</span>
//                 {isSelected && (
//                   <span className="active-user-badge">Chatting</span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Bottom Logged-in User Switch Context Bar */}
//       <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
//         <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 'bold' }}>
//           LOGGED IN AS (SWITCH DOCTOR):
//         </div>
//         <div style={{ display: 'flex', gap: '6px' }}>
//           {ALL_SAMPLE_USERS.map(u => {
//             const isActive = activeUser.id === u.id;
//             return (
//               <button
//                 key={u.id}
//                 onClick={() => onSwitchActiveUser(u)}
//                 style={{
//                   flex: 1,
//                   padding: '7px 4px',
//                   fontSize: '11px',
//                   fontWeight: '600',
//                   borderRadius: '8px',
//                   border: isActive ? '1px solid #38bdf8' : '1px solid var(--border-color)',
//                   background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3), rgba(6, 182, 212, 0.3))' : 'var(--bg-card)',
//                   color: isActive ? '#38bdf8' : 'var(--text-muted)',
//                   cursor: 'pointer',
//                   textAlign: 'center'
//                 }}
//               >
//                 {u.name}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }