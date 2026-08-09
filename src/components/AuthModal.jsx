import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, GraduationCap, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function AuthModal() {
  const { login, teacher } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = (e) => {
    e.preventDefault();
    const res = login(pin);
    if (!res.success) {
      setError(res.error || 'Invalid PIN');
    }
  };

  const handleDemoUnlock = () => {
    login(teacher.pin || '1234');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--bg-primary)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
          }}
        >
          <GraduationCap size={32} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>
          {teacher.coachingName}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Teacher Portal Locked • Enter Security PIN
        </p>

        {error && (
          <div
            style={{
              padding: '0.6rem',
              borderRadius: '8px',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="password"
              className="form-control"
              maxLength="4"
              placeholder="Enter 4-Digit PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
                padding: '0.75rem',
                fontWeight: 700,
              }}
              autoFocus
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            <Lock size={18} />
            <span>Unlock Teacher Portal</span>
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={handleDemoUnlock}
            className="btn btn-outline btn-sm"
            style={{ width: '100%', fontSize: '0.8rem' }}
          >
            <KeyRound size={14} />
            <span>Quick Demo Unlock (PIN: {teacher.pin})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
