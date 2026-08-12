import React from 'react';

export default function RightSidebar({ activeUser, selectedContact }) {
  // لو مفيش contact مختار، ممكن نعرض رسالة أو بيانات افتراضية خفيفة
  const contactName = selectedContact?.name || "Select a contact";
  const contactHandle = selectedContact?.name 
    ? `@${selectedContact.name.toLowerCase().replace(/\s+/g, '_')}` 
    : "@dentalore_user";
  
  const initials = selectedContact?.isGroup 
    ? "👥" 
    : (contactName !== "Select a contact" ? contactName.split(' ').map(n => n[0]).join('') : "💬");

  return (
    <div className="right-sidebar">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar-large" style={{ background: selectedContact?.isGroup ? 'linear-gradient(135deg, #0284c7, #06b6d4)' : undefined }}>
          {initials}
        </div>
        <div className="profile-name">{contactName}</div>
        <div className="profile-handle">{contactHandle}</div>

        {/* Quick Action Icons */}
        <div className="profile-action-row">
          <button className="action-icon-pill" title="Bookmark">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button className="action-icon-pill" title="Security">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
          <button className="action-icon-pill" title="Info">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="action-icon-pill" title="Pin">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Shared Document Accordion */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Shared Document</span>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </div>

      {/* Shared Media Grid */}
      <div className="media-section">
        <div className="media-section-header">
          <span>Shared Media</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="media-grid">
          <div className="media-thumb" style={{ background: 'linear-gradient(135deg, #1e293b, #334155)' }}>📷 1</div>
          <div className="media-thumb" style={{ background: 'linear-gradient(135deg, #312e81, #4338ca)' }}>📸 2</div>
          <div className="media-thumb" style={{ background: 'linear-gradient(135deg, #064e3b, #047857)' }}>🖼️ 3</div>
          <div className="media-thumb" style={{ background: 'linear-gradient(135deg, #701a75, #86198f)' }}>☕ 4</div>
          <div className="media-thumb" style={{ background: 'linear-gradient(135deg, #831843, #be185d)' }}>📑 5</div>
          <div className="media-thumb" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>📄 6</div>
        </div>

        <button className="view-all-btn">
          View All
        </button>
      </div>

      {/* Shared Post Section */}
      <div className="media-section">
        <div className="media-section-header">
          <span>Shared Post</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="media-grid">
          <div className="media-thumb" style={{ background: '#1c1917' }}>📱 1</div>
          <div className="media-thumb" style={{ background: '#022c22' }}>📱 2</div>
          <div className="media-thumb" style={{ background: '#172554' }}>📱 3</div>
        </div>
      </div>
    </div>
  );
}