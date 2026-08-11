import React, { useEffect, useState, useRef } from 'react';

const USER_MAP = {
  1: "Dr. Malak",
  2: "Dr. Ahmed",
  3: "Dr. Sara"
};

// Symmetric pair key helper (e.g., User 1 & User 2 -> "direct_1_2")
export function getChatKey(activeUserId, contact) {
  if (!contact) return "group_101";
  if (contact.isGroup) return `group_${contact.id || 101}`;
  const ids = [activeUserId, contact.id].sort((a, b) => a - b);
  return `direct_${ids[0]}_${ids[1]}`;
}

// Initial shared conversation feeds
const INITIAL_HISTORIES = {
  // Shared Group Chat Feed
  "group_101": [
    { id: 'g1', senderId: 1, content: "Welcome doctors to our Dental Clinic Team Group Chat! 👋", timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
    { id: 'g2', senderId: 2, content: "Great to have a shared channel for Branch A and Branch B!", timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
    { id: 'g3', senderId: 3, content: "Dr. Sara joining from Branch B! Ready to collaborate.", timestamp: new Date(Date.now() - 15 * 60000).toISOString() }
  ],
  // Shared Direct Chat between Dr. Malak (1) and Dr. Ahmed (2)
  "direct_1_2": [
    { id: 'p1', senderId: 1, content: "Hello Dr. Ahmed, welcome to Dentalore!", timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
    { id: 'p2', senderId: 2, content: "Hi Dr. Malak! Ready to discuss today's clinic schedule.", timestamp: new Date(Date.now() - 5 * 60000).toISOString() }
  ],
  // Shared Direct Chat between Dr. Malak (1) and Dr. Sara (3)
  "direct_1_3": [
    { id: 's1', senderId: 1, content: "Hi Dr. Sara! How is Branch B operations today?", timestamp: new Date(Date.now() - 12 * 60000).toISOString() },
    { id: 's2', senderId: 3, content: "Hello Dr. Malak! Everything is running smoothly at Branch B.", timestamp: new Date(Date.now() - 7 * 60000).toISOString() }
  ],
  // Shared Direct Chat between Dr. Ahmed (2) and Dr. Sara (3)
  "direct_2_3": [
    { id: 'as1', senderId: 2, content: "Hi Dr. Sara, checking in from Branch A.", timestamp: new Date(Date.now() - 8 * 60000).toISOString() },
    { id: 'as2', senderId: 3, content: "Hi Dr. Ahmed! Patient cases are updated.", timestamp: new Date(Date.now() - 4 * 60000).toISOString() }
  ]
};

export default function ChatScreen({ conversationId, activeUser, selectedContact }) {
  const [chatHistories, setChatHistories] = useState(INITIAL_HISTORIES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const chatId = getChatKey(activeUser?.id, selectedContact);
  const isGroup = selectedContact?.isGroup;
  const contactName = selectedContact?.name || "Chat";
  const contactInitials = isGroup ? "👥" : contactName.split(' ').map(n => n[0]).join('');

  // Active messages for symmetric chat key
  const currentMessages = chatHistories[chatId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatId, currentMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeUser?.id) return;

    const newMessageObj = {
      id: Date.now(),
      senderId: activeUser.id,
      content: input,
      timestamp: new Date().toISOString()
    };

    // Update shared chat feed symmetrically
    setChatHistories(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessageObj]
    }));

    setInput('');

    // Backend sync
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: isGroup ? 101 : (typeof conversationId === 'number' ? conversationId : 1),
        senderId: activeUser.id,
        content: input
      })
    }).catch(err => console.error("API send log:", err));
  };

  if (!selectedContact) {
    return (
      <div className="chat-main" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <p>Select a contact or channel to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="chat-main">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-user">
          <div className="avatar-wrapper">
            <div className="avatar" style={{ background: isGroup ? 'linear-gradient(135deg, #0284c7, #06b6d4)' : undefined }}>
              {contactInitials}
            </div>
            <div className="status-dot"></div>
          </div>
          <div>
            <div className="chat-header-name">{contactName}</div>
            <div className="chat-header-status">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--online-green)', display: 'inline-block' }}></span>
              {isGroup ? `${selectedContact.membersCount || 3} Doctors Online` : 'Online'}
            </div>
          </div>
        </div>

        <div className="chat-header-actions">
          <button className="icon-btn" title="Search in chat">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="icon-btn" title="Voice / Video Call">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="icon-btn" title="More options">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="chat-messages">
        <div className="date-divider">
          <span className="date-divider-text">Today</span>
        </div>

        {currentMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)', fontSize: '13px' }}>
            No messages yet. Send a message to start chatting with {contactName}!
          </div>
        ) : (
          currentMessages.map(msg => {
            const isSent = msg.senderId === activeUser.id;
            const senderName = USER_MAP[msg.senderId] || `User #${msg.senderId}`;
            const timeStr = msg.timestamp 
              ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '11:00 AM';

            return (
              <div key={msg.id} className={`message-row ${isSent ? 'sent' : 'received'}`}>
                <div className="message-bubble-wrapper">
                  {!isSent && (
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '2px', marginLeft: '4px' }}>
                      {senderName}
                    </div>
                  )}
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                  <div className="message-meta">
                    <span>{timeStr}</span>
                    {isSent && (
                      <span className="check-icon" title="Delivered">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="chat-input-container">
        <div className="chat-input-wrapper">
          <button type="button" className="plus-btn" title="Add attachment">
            +
          </button>
          <input
            type="text"
            placeholder={`Message ${contactName}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button type="submit" className="send-btn">
          Send
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}