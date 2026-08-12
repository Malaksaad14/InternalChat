import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5123/chathub')
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      if (activeUser?.id) {
        connection.invoke('UserConnected', activeUser.id);
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

    return () => {
      connection.stop();
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
            <div className="badge">Group</div>
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
         
                  <div className="status-dot" style={{ background: isUserOnline ? 'var(--online-green)' : '#94a3b8' }}></div>
                </div>
                <div className="user-details">
                  <div className="user-name-text">{contact.name}</div>
                <div className="user-subtext">
                     {contact.clinicName}
                </div>
                </div>
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