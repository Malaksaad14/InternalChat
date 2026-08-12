import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

const ALL_SAMPLE_USERS = [
  { id: 1, name: "Dr. Hana", clinicId: 1, clinicName: "Branch A" },
  { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
  { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" },
  { id: 4, name: "Dr. Omar", clinicId: 2, clinicName: "Branch B" }
];

function getConversationIdForUsers(userId1, userId2) {
  const ids = [userId1, userId2].sort((a, b) => a - b);
  if (ids[0] === 1 && ids[1] === 2) return 1;
  if (ids[0] === 3 && ids[1] === 4) return 4; 
  return 1;
}

export default function ConversationList({ 
  activeUser, 
  onSwitchActiveUser, 
  selectedContact, 
  onSelectContact,
  selectedConversationId, 
  onSelectConversation,
  onOnlineUsersChange
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineUserIds, setOnlineUserIds] = useState([]); 

  // NEW: State to track unread messages { conversationId: count }
  const [unreadCounts, setUnreadCounts] = useState({});
  const selectedConvRef = useRef(selectedConversationId);

  // 1. UPDATED: Clear badges and save the exact time we read this chat
  useEffect(() => {
    selectedConvRef.current = selectedConversationId;
    if (selectedConversationId && activeUser?.id) {
      setUnreadCounts(prev => ({ ...prev, [selectedConversationId]: 0 }));
      // Save the exact time we looked at this chat
      localStorage.setItem(`lastReadTime_${activeUser.id}_${selectedConversationId}`, Date.now().toString());
    }
  }, [selectedConversationId, activeUser]);

  // 2. NEW: Background Fetch to check for missed offline messages when logging in!
  useEffect(() => {
    const checkMissedMessages = async () => {
      if (!activeUser?.id) return;

      // Find all other doctors in this clinic
      const colleagues = ALL_SAMPLE_USERS.filter(u => u.id !== activeUser.id && u.clinicId === activeUser.clinicId);
      
      for (const contact of colleagues) {
        const convId = getConversationIdForUsers(activeUser.id, contact.id);
        
        // Skip the chat we are currently looking at (since we are actively reading it)
        if (convId === selectedConversationId) continue;

        try {
          const response = await fetch(`http://localhost:5123/api/messages/${convId}?page=1&pageSize=15`);
          if (response.ok) {
            const data = await response.json();
            
            // Get the exact time we last opened this chat
            const lastReadTimeStr = localStorage.getItem(`lastReadTime_${activeUser.id}_${convId}`);
            const lastReadTime = lastReadTimeStr ? parseInt(lastReadTimeStr) : 0;

            // FIX: Only count messages that:
            // 1. Were sent by the OTHER contact (not us)
            // 2. Have a timestamp newer than our last read time
            const missedCount = data.filter(msg => 
              msg.senderId === contact.id && new Date(msg.timestamp).getTime() > lastReadTime
            ).length;

            if (missedCount > 0) {
              setUnreadCounts(prev => ({ ...prev, [convId]: missedCount }));
            }
          }
        } catch (err) {
          console.error("Background fetch failed", err);
        }
      }
    };

    checkMissedMessages();
  }, [activeUser]); // This runs once exactly when the user logs in

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5123/chathub')
      .withAutomaticReconnect()
      .build();

    connection.start().then(async () => {
      if (activeUser?.id) {
        await connection.invoke('UserConnected', activeUser.id);

        // NEW: Silently join the Group Chat to listen for background notifications
        if (activeUser.clinicId === 1) {
          await connection.invoke('JoinConversation', 101);
        }

        // NEW: Silently join all Direct Message chats to listen for background notifications
        const colleagues = ALL_SAMPLE_USERS.filter(u => u.id !== activeUser.id && u.clinicId === activeUser.clinicId);
        for (const contact of colleagues) {
          const convId = getConversationIdForUsers(activeUser.id, contact.id);
          await connection.invoke('JoinConversation', convId);
        }
      }
    }).catch(err => console.error(err));

    connection.on('UpdateUserStatus', (userId, isOnline) => {
      setOnlineUserIds(prev => {
        const newOnlineIds = isOnline 
          ? Array.from(new Set([...prev, userId]))
          : prev.filter(id => id !== userId);
        
        // Notify parent component
        if (onOnlineUsersChange) {
          onOnlineUsersChange(newOnlineIds);
        }
        
        return newOnlineIds;
      });
    });

    // NEW: Listen for all messages globally to update the unread badges
    connection.on('ReceiveMessage', (convId, senderId) => {
      // If I didn't send it AND I am not currently looking at this specific chat
      if (senderId !== activeUser.id && convId !== selectedConvRef.current) {
        setUnreadCounts(prev => ({
          ...prev,
          [convId]: (prev[convId] || 0) + 1
        }));
      }
    });

    return () => {
      connection.stop();
      connection.off('ReceiveMessage');
    };
  }, [activeUser]);

  const singleGroup = { id: 101, isGroup: true, groupName: "Group Chat", membersCount: 3, conversationId: 101 };

  const otherUsers = ALL_SAMPLE_USERS.filter(u => 
    u.id !== activeUser.id && u.clinicId === activeUser.clinicId
  );

  const filteredContacts = otherUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.clinicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isGroupSelected = selectedContact?.isGroup;

  // NEW: Get unread count for group
  const groupUnread = unreadCounts[101] || 0;

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
        </div>

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
            
            {/* NEW: Group Unread Badge Layout */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="badge">Group</div>
              {groupUnread > 0 && (
                <div style={{ background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px' }}>
                  {groupUnread}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

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
          const isUserOnline = onlineUserIds.includes(contact.id);

          // NEW: Calculate unread count for this specific direct message
          const convId = getConversationIdForUsers(activeUser.id, contact.id);
          const dmUnread = unreadCounts[convId] || 0;

          return (
            <div 
              key={contact.id} 
              className={`user-card ${isSelected ? 'active-chat' : ''}`}
              onClick={() => {
                onSelectContact(contact);
                onSelectConversation(convId);
              }}
            >
              <div className="user-info-left" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <div className="avatar-wrapper">
                  <div className="avatar">
                    {initials}
                  </div>
         
                  <div className="status-dot" style={{ background: isUserOnline ? 'var(--online-green)' : '#94a3b8' }}></div>
                </div>
                <div className="user-details" style={{ flexGrow: 1 }}>
                  <div className="user-name-text">{contact.name}</div>
                  <div className="user-subtext">
                    {contact.clinicName}
                  </div>
                </div>

                {/* NEW: Direct Message Unread Badge */}
                {dmUnread > 0 && (
                  <div style={{ 
                    background: '#ef4444', 
                    color: 'white', 
                    fontSize: '10px', 
                    fontWeight: 'bold', 
                    borderRadius: '50%', 
                    width: '18px', 
                    height: '18px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginLeft: '8px'
                  }}>
                    {dmUnread}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Switcher */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 'bold' }}>
          LOGGED IN AS (SWITCH DOCTOR):
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {ALL_SAMPLE_USERS.map(u => {
            const isActive = activeUser.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => onSwitchActiveUser(u)}
                style={{
                  flex: '1 1 45%',
                  padding: '6px 2px',
                  fontSize: '10px',
                  fontWeight: '600',
                  borderRadius: '6px',
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







// import React, { useState, useEffect } from 'react';
// import * as signalR from '@microsoft/signalr';

// const ALL_SAMPLE_USERS = [
//   { id: 1, name: "Dr. Hana", clinicId: 1, clinicName: "Branch A" },
//   { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
//   { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" },
//   { id: 4, name: "Dr. Omar", clinicId: 2, clinicName: "Branch B" }
// ];

// function getConversationIdForUsers(userId1, userId2) {
//   const ids = [userId1, userId2].sort((a, b) => a - b);
//   if (ids[0] === 1 && ids[1] === 2) return 1;
//   if (ids[0] === 3 && ids[1] === 4) return 4; 
//   return 1;
// }

// export default function ConversationList({ 
//   activeUser, 
//   onSwitchActiveUser, 
//   selectedContact, 
//   onSelectContact,
//   selectedConversationId, 
//   onSelectConversation,
//   onOnlineUsersChange
// }) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [onlineUserIds, setOnlineUserIds] = useState([]); 

//   useEffect(() => {
//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl('http://localhost:5123/chathub')
//       .withAutomaticReconnect()
//       .build();

//     connection.start().then(() => {
//       if (activeUser?.id) {
//         connection.invoke('UserConnected', activeUser.id);
//       }
//     }).catch(err => console.error(err));

//     connection.on('UpdateUserStatus', (userId, isOnline) => {
//       setOnlineUserIds(prev => {
//         const newOnlineIds = isOnline 
//           ? Array.from(new Set([...prev, userId]))
//           : prev.filter(id => id !== userId);
        
//         // Notify parent component
//         if (onOnlineUsersChange) {
//           onOnlineUsersChange(newOnlineIds);
//         }
        
//         return newOnlineIds;
//       });
//     });

//     return () => {
//       connection.stop();
//     };
//   }, [activeUser]);

//   const singleGroup = { id: 101, isGroup: true, groupName: "Group Chat", membersCount: 3, conversationId: 101 };

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
//         </div>

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

//       {activeUser.clinicId === 1 && (
//         <div className="category-list">
//           <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
//             CLINIC CHANNELS
//           </div>
          
//           <div 
//             className={`category-item ${isGroupSelected ? 'active' : ''}`}
//             onClick={() => {
//               onSelectContact(singleGroup);
//               onSelectConversation(singleGroup.id);
//             }}
//             style={{ cursor: 'pointer' }}
//           >
//             <div className="category-left">
//               <div className="category-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)', color: '#fff' }}>
//                 👥
//               </div>
//               <div>
//                 <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
//                   {singleGroup.groupName}
//                 </div>
//                 <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
//                   2 Members • Medical Team
//                 </div>
//               </div>
//             </div>
//             <div className="badge">Group</div>
//           </div>
//         </div>
//       )}

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
//           const isUserOnline = onlineUserIds.includes(contact.id);

//           return (
//             <div 
//               key={contact.id} 
//               className={`user-card ${isSelected ? 'active-chat' : ''}`}
//               onClick={() => {
//                 onSelectContact(contact);
//                 const convId = getConversationIdForUsers(activeUser.id, contact.id);
//                 onSelectConversation(convId);
//               }}
//             >
//               <div className="user-info-left">
//                 <div className="avatar-wrapper">
//                   <div className="avatar">
//                     {initials}
//                   </div>
         
//                   <div className="status-dot" style={{ background: isUserOnline ? 'var(--online-green)' : '#94a3b8' }}></div>
//                 </div>
//                 <div className="user-details">
//                   <div className="user-name-text">{contact.name}</div>
//                 <div className="user-subtext">
//                      {contact.clinicName}
//                 </div>
//                 </div>
//               </div>

              
//             </div>
//           );
//         })}
//       </div>

//       {/* Bottom Switcher */}
//       <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-panel)' }}>
//         <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 'bold' }}>
//           LOGGED IN AS (SWITCH DOCTOR):
//         </div>
//         <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
//           {ALL_SAMPLE_USERS.map(u => {
//             const isActive = activeUser.id === u.id;
//             return (
//               <button
//                 key={u.id}
//                 onClick={() => onSwitchActiveUser(u)}
//                 style={{
//                   flex: '1 1 45%',
//                   padding: '6px 2px',
//                   fontSize: '10px',
//                   fontWeight: '600',
//                   borderRadius: '6px',
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