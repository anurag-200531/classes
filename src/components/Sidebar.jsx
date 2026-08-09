import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BellRing,
  TrendingUp,
  UserCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, teacher, getOverdueStudentsList } = useApp();
  const overdueCount = getOverdueStudentsList().length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students Directory', icon: Users },
    { id: 'ledger', label: 'Monthly Fee Ledger', icon: CreditCard },
    {
      id: 'dueReminders',
      label: 'Due Reminders',
      icon: BellRing,
      badge: overdueCount > 0 ? overdueCount : null,
    },
    { id: 'analytics', label: 'Earnings Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Teacher Profile', icon: UserCheck },
  ];

  return (
    <aside className="sidebar no-print">
      <div className="brand-header">
        <div className="brand-logo">
          <GraduationCap size={24} />
        </div>
        <div>
          <div className="brand-title">Coaching Pro</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            TEACHER PORTAL
          </span>
        </div>
      </div>

      <div style={{
        padding: '0.8rem 1rem',
        borderRadius: '12px',
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Institute</div>
        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {teacher.coachingName}
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{
        padding: '1rem',
        borderRadius: '12px',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <Sparkles size={16} color="var(--accent-primary)" />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>WhatsApp Direct</div>
          1-Click Reminders Ready
        </div>
      </div>
    </aside>
  );
}
