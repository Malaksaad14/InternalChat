import React, { useEffect, useState } from 'react';

export default function ChatScreen({ conversationId, activeUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = () => {
    if (!conversationId) return;
    setLoading(true);
    fetch(`/api/messages/${conversationId}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      conversationId: conversationId,
      senderId: activeUser.id,
      content: input
    };

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    });

    if (res.ok) {
      setInput('');
      fetchMessages(); // Refresh message list
    }
  };

  if (!conversationId) {
    return <div style={{ flex: 1, padding: '20px' }}>Select a conversation to start chatting.</div>;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '15px', borderBottom: '1px solid #ccc', fontWeight: 'bold' }}>
        Chat Room #{conversationId}
      </div>

      {/* Message History */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? <p>Loading messages...</p> : messages.map(msg => (
          <div 
            key={msg.id} 
            style={{
              alignSelf: msg.senderId === activeUser.id ? 'flex-end' : 'flex-start',
              backgroundColor: msg.senderId === activeUser.id ? '#0084ff' : '#e4e6eb',
              color: msg.senderId === activeUser.id ? '#fff' : '#000',
              padding: '10px 14px',
              borderRadius: '18px',
              maxWidth: '60%'
            }}
          >
            <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '2px' }}>
              User #{msg.senderId} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '15px', borderTop: '1px solid #ccc' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#0084ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
}