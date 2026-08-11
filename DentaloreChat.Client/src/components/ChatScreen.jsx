import React, { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

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

// Map conversation IDs based on the database
// Conversation 1: Malak (1) & Ahmed (2)
// Conversation 2: Malak (1) & Sara (3)
// Conversation 3: Ahmed (2) & Sara (3)
// Conversation 101: Group Chat
function getConversationIdForUsers(userId1, userId2) {
  const ids = [userId1, userId2].sort((a, b) => a - b);
  if (ids[0] === 1 && ids[1] === 2) return 1; // Malak & Ahmed
  if (ids[0] === 1 && ids[1] === 3) return 2; // Malak & Sara
  if (ids[0] === 2 && ids[1] === 3) return 3; // Ahmed & Sara
  return 1; // Default fallback
}

// Initial shared conversation feeds (empty - will be loaded from database)
const INITIAL_HISTORIES = {};

export default function ChatScreen({ conversationId, activeUser, selectedContact }) {
  const [chatHistories, setChatHistories] = useState(INITIAL_HISTORIES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [connection, setConnection] = useState(null);
  const connectionRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const chatId = getChatKey(activeUser?.id, selectedContact);
  const isGroup = selectedContact?.isGroup;
  const contactName = selectedContact?.name || "Chat";
  const contactInitials = isGroup ? "👥" : contactName.split(' ').map(n => n[0]).join('');

  // Active messages for symmetric chat key
  const currentMessages = chatHistories[chatId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatId, currentMessages]);

  // Fetch messages from database when conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5123/api/messages/${conversationId}`);
        if (response.ok) {
          const data = await response.json();
          setChatHistories(prev => ({
            ...prev,
            [chatId]: data
          }));
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, chatId]);

  // Setup SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5123/chathub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
    connectionRef.current = newConnection;

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log('SignalR Connected');
        
        // Join the conversation group
        if (conversationId) {
          await newConnection.invoke('JoinConversation', conversationId);
        }
      } catch (err) {
        console.error('SignalR Connection Error: ', err);
      }
    };

    startConnection();

    // Listen for incoming messages
    newConnection.on('ReceiveMessage', (convId, senderId, content, timestamp) => {
      if (convId === conversationId) {
        const newMessage = {
          id: Date.now(),
          senderId: senderId,
          content: content,
          timestamp: timestamp
        };
        setChatHistories(prev => {
          const currentHistory = prev[chatId] || [];
          // Avoid duplicates by checking if a message with same content and sender exists
          const isDuplicate = currentHistory.some(
            msg => msg.content === content && msg.senderId === senderId && 
            Math.abs(new Date(msg.timestamp) - new Date(timestamp)) < 1000
          );
          if (isDuplicate) return prev;
          
          return {
            ...prev,
            [chatId]: [...currentHistory, newMessage]
          };
        });
      }
    });

    return () => {
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        newConnection.invoke('LeaveConversation', conversationId).catch(err => console.error(err));
      }
      newConnection.stop();
      newConnection.off('ReceiveMessage');
    };
  }, [conversationId, chatId]);

  // Re-join conversation when conversationId changes
  useEffect(() => {
    if (connection && conversationId && connection.state === signalR.HubConnectionState.Connected) {
      connection.invoke('JoinConversation', conversationId).catch(err => console.error(err));
    }
  }, [conversationId, connection]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeUser?.id) return;

    const newMessageObj = {
      id: Date.now(),
      senderId: activeUser.id,
      content: input,
      timestamp: new Date().toISOString()
    };

    // Update shared chat feed symmetrically (local update)
    setChatHistories(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessageObj]
    }));

    setInput('');

    // Backend sync - SignalR will broadcast to other clients
    const targetConversationId = isGroup ? 101 : (typeof conversationId === 'number' ? conversationId : getConversationIdForUsers(activeUser.id, selectedContact?.id));
    
    fetch('http://localhost:5123/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: targetConversationId,
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