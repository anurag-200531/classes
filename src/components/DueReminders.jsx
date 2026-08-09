import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BellRing,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  IndianRupee,
  Calendar,
  Send,
  Sparkles,
  Edit3,
} from 'lucide-react';

export default function DueReminders({ onOpenRecordPayment }) {
  const {
    students,
    getStudentDueStatus,
    generateWhatsAppLink,
    teacher,
    MONTH_NAMES,
    CURRENT_MONTH,
    CURRENT_YEAR,
  } = useApp();

  const [filterType, setFilterType] = useState('AllDues'); // AllDues, Overdue, Pending

  const activeStudents = students.filter((s) => s.status === 'Active');

  const studentsWithDues = activeStudents
    .map((student) => {
      const dueInfo = getStudentDueStatus(student, CURRENT_MONTH, CURRENT_YEAR);
      return { student, dueInfo };
    })
    .filter(({ dueInfo }) => {
      if (filterType === 'Overdue') return dueInfo.status === 'Overdue';
      if (filterType === 'Pending') return dueInfo.status === 'Pending';
      return dueInfo.status === 'Overdue' || dueInfo.status === 'Pending';
    });

  const totalDueAmount = studentsWithDues.reduce(
    (sum, item) => sum + item.student.monthlyFee,
    0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Fee Due Reminders & Alerts</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Automated alerts for upcoming and overdue fees. Click to send instant personalized WhatsApp reminders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${filterType === 'AllDues' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterType('AllDues')}
          >
            All Unpaid ({studentsWithDues.length})
          </button>

          <button
            className={`btn btn-sm ${filterType === 'Overdue' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterType('Overdue')}
            style={filterType === 'Overdue' ? { backgroundColor: 'var(--danger)' } : {}}
          >
            Overdue Only
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total Uncollected Dues for {MONTH_NAMES[CURRENT_MONTH]}
          </span>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--danger)', marginTop: '0.2rem' }}>
            ₹{totalDueAmount.toLocaleString('en-IN')}
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-secondary)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <Sparkles color="var(--accent-primary)" size={18} />
          <span>Auto WhatsApp Reminders Enabled</span>
        </div>
      </div>

      {/* Reminders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {studentsWithDues.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}
          >
            <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
            <h3>All Clear! No Pending Dues</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>
              All students have paid their fees for {MONTH_NAMES[CURRENT_MONTH]} {CURRENT_YEAR}.
            </p>
          </div>
        ) : (
          studentsWithDues.map(({ student, dueInfo }) => {
            const waLink = generateWhatsAppLink(student, CURRENT_MONTH, CURRENT_YEAR);
            const isOverdue = dueInfo.status === 'Overdue';

            return (
              <div
                key={student.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft: `4px solid ${isOverdue ? 'var(--danger)' : 'var(--warning)'}`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{student.name}</h3>
                    <span className="badge badge-secondary">{student.class}</span>
                    <span className={`badge ${dueInfo.class}`}>
                      {isOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
                      <span>
                        {isOverdue
                          ? `Overdue by ${dueInfo.days || 1} day(s)`
                          : `Due in ${dueInfo.daysLeft} day(s)`}
                      </span>
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    Parent: <strong style={{ color: 'var(--text-main)' }}>{student.parentName || student.name}</strong> • Phone:{' '}
                    <strong style={{ color: 'var(--text-main)' }}>{student.parentPhone || student.phone}</strong>
                  </div>

                  <div style={{ fontSize: '0.9rem', marginTop: '0.4rem', fontWeight: 600 }}>
                    Monthly Fee: <span style={{ color: 'var(--accent-primary)' }}>₹{student.monthlyFee}</span> • Due Date:{' '}
                    <span>{student.dueDay} {MONTH_NAMES[CURRENT_MONTH]} {CURRENT_YEAR}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-success"
                    onClick={() => onOpenRecordPayment(student, CURRENT_MONTH, CURRENT_YEAR)}
                  >
                    <IndianRupee size={16} />
                    <span>Collect Fee</span>
                  </button>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp Reminder</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
