import React from 'react';

const SAMPLE_USERS = [
  { id: 1, name: "Dr. Hana", clinicId: 1, clinicName: "Branch A" },
  { id: 2, name: "Dr. Ahmed", clinicId: 1, clinicName: "Branch A" },
  { id: 3, name: "Dr. Sara", clinicId: 2, clinicName: "Branch B" },
  { id: 4, name: "Dr. Omar", clinicId: 2, clinicName: "Branch B" }
];

export default function UserSelector({ activeUser, onSelectUser }) {
  return (
    <div style={{ padding: '10px 20px', background: '#2c3e50', color: '#fff', display: 'flex', alignItems: 'center', gap: '15px' }}>
      <strong>Active User Context:</strong>
      <select 
        value={activeUser?.id || 1} 
        onChange={(e) => {
          const user = SAMPLE_USERS.find(u => u.id === parseInt(e.target.value));
          onSelectUser(user);
        }}
        style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '14px' }}
      >
        {SAMPLE_USERS.map(u => (
          <option key={u.id} value={u.id}>
            {u.name} — {u.clinicName}
          </option>
        ))}
      </select>
    </div>
  );
}