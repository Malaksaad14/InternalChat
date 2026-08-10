import React, { useEffect, useState } from 'react';

export default function ConversationList({ activeClinicId, selectedConversationId, onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/conversations/clinic/${activeClinicId}`)
      .then(res => res.json())
      .then(data => {
        setConversations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load conversations", err);
        setLoading(false);
      });
  }, [activeClinicId]);

  if (loading) return <div style={{ padding: '20px' }}>Loading conversations...</div>;

  return (
    <div style={{ width: '300px', borderRight: '1px solid #ccc', height: '100%', overflowY: 'auto' }}>
      <h3 style={{ padding: '15px', margin: 0, borderBottom: '1px solid #eee' }}>Conversations</h3>
      {conversations.length === 0 ? (
        <p style={{ padding: '15px', color: '#777' }}>No conversations found for this clinic.</p>
      ) : (
        conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            style={{
              padding: '15px',
              cursor: 'pointer',
              backgroundColor: selectedConversationId === conv.id ? '#e3f2fd' : 'transparent',
              borderBottom: '1px solid #eee'
            }}
          >
            <strong>{conv.isGroup ? conv.groupName : `Conversation #${conv.id}`}</strong>
          </div>
        ))
      )}
    </div>
  );
}