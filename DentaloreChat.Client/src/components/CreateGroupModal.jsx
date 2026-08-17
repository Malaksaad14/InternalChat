import React, { useState, useEffect } from 'react';

export default function CreateGroupModal({ activeUser, onClose, onGroupCreated }) {
  const [groupName, setGroupName] = useState('');
  const [colleagues, setColleagues] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch only doctors from the SAME clinic
  useEffect(() => {
    fetch(`http://localhost:5123/api/users/clinic/${activeUser.clinicId}`)
      .then(res => res.json())
      .then(data => {
        // Exclude the active user from the list (they will be added automatically)
        setColleagues(data.filter(u => u.id !== activeUser.id));
      });
  }, [activeUser]);

  const handleToggle = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedIds.length === 0) return;

    // Send the activeUser + the selected colleagues
    const memberIds = [activeUser.id, ...selectedIds];

    const response = await fetch('http://localhost:5123/api/conversations/group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupName: groupName,
        clinicId: activeUser.clinicId,
        memberIds: memberIds
      })
    });

    if (response.ok) {
      onGroupCreated(); // Tell the sidebar to refresh the groups!
      onClose();        // Close the modal
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--bg-panel)', padding: '20px', borderRadius: '8px', width: '350px' }}>
        <h3>Create New Group</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Group Name" 
            value={groupName} 
            onChange={(e) => setGroupName(e.target.value)} 
            style={{ width: '100%', marginBottom: '15px', padding: '8px' }}
          />
          
          <div style={{ marginBottom: '15px' }}>
            <strong>Select Members:</strong>
            {colleagues.map(doc => (
              <label key={doc.id} style={{ display: 'block', marginTop: '8px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(doc.id)} 
                  onChange={() => handleToggle(doc.id)} 
                /> 
                {doc.name}
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px' }}>Cancel</button>
            <button type="submit" disabled={!groupName || selectedIds.length === 0} style={{ padding: '8px 16px', background: '#38bdf8', color: '#fff', border: 'none', borderRadius: '4px' }}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
