import React, { useEffect, useState } from 'react';

const ALL_SAMPLE_USERS = [
  { id: 1, name: "Dr. Malak", clinicId: 1, clinicName: "Branch A" },
  { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
  { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" }
];

export default function ConversationList({ 
  activeUser, 
  onSwitchActiveUser, 
  selectedContact, 
  onSelectContact,
  selectedConversationId, 
  onSelectConversation 
}) {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Single main group channel renamed to "Group Chat"
  const singleGroup = { id: 101, isGroup: true, groupName: "Group Chat", membersCount: 3 };

  // Direct contacts excluding the currently logged-in active user
  const otherUsers = ALL_SAMPLE_USERS.filter(u => u.id !== activeUser.id);

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
              Logged in: <strong style={{ color: 'var(--accent-pink)' }}>{activeUser?.name || 'User'}</strong>
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
            placeholder="Search channels & contacts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations / Group Channel List */}
      <div className="category-list">
        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
          CHANNELS & GROUPS
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
            <div className="category-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff' }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                {singleGroup.groupName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                3 Members • Group Chat
              </div>
            </div>
          </div>
          <div className="badge">Group</div>
        </div>
      </div>

      {/* Direct Messages Section Header */}
      <div className="sidebar-section-divider">
        <span className="section-label">DIRECT MESSAGES</span>
        <span style={{ fontSize: '11px', color: 'var(--accent-purple-light)' }}>
          {filteredContacts.length} Contacts
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
                onSelectConversation(contact.id); // Distinct conversation ID per contact
              }}
              title={`Click to open direct chat with ${contact.name}`}
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
          LOGGED IN AS (SWITCH USER):
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
                  border: isActive ? '1px solid #ec4899' : '1px solid var(--border-color)',
                  background: isActive ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
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