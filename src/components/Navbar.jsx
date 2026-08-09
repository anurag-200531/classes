import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Lock, Bell, IndianRupee, User, Sparkles } from 'lucide-react';

export default function Navbar() {
  const {
    teacher,
    getMonthlyEarnings,
    getOverdueStudentsList,
    logout,
    theme,
    setTheme,
    setActiveTab,
    MONTH_NAMES,
    CURRENT_MONTH,
  } = useApp();

  const currentMonthEarnings = getMonthlyEarnings();
  const overdueCount = getOverdueStudentsList().length;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="top-header no-print">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            Welcome, {teacher.name.split(' ')[0]} 👋
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {teacher.subjects}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Current Month Earnings Quick Widget */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            borderRadius: '20px',
            background: 'var(--success-bg)',
            color: 'var(--success)',
            fontWeight: 700,
            fontSize: '0.9rem',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
          title={`Earnings in ${MONTH_NAMES[CURRENT_MONTH]}`}
        >
          <IndianRupee size={16} />
          <span>{currentMonthEarnings.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.8 }}>
            ({MONTH_NAMES[CURRENT_MONTH].slice(0, 3)})
          </span>
        </div>

        {/* Due Alerts Bell */}
        <button
          onClick={() => setActiveTab('dueReminders')}
          className="btn btn-outline"
          style={{
            position: 'relative',
            padding: '0.5rem',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
          }}
          title="Due Fee Alerts"
        >
          <Bell size={18} />
          {overdueCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.5)',
              }}
            >
              {overdueCount}
            </span>
          )}
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="btn btn-outline"
          style={{
            padding: '0.5rem',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Lock Screen / Logout */}
        {teacher.isPinEnabled && (
          <button
            onClick={logout}
            className="btn btn-outline"
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
            }}
            title="Lock Portal (PIN Required)"
          >
            <Lock size={18} />
          </button>
        )}

        {/* Teacher Avatar */}
        <div
          className="header-user-info"
          onClick={() => setActiveTab('profile')}
          style={{ cursor: 'pointer' }}
        >
          <div className="avatar">
            {teacher.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
