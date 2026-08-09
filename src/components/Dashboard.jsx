import React from 'react';
import { useApp } from '../context/AppContext';
import {
  IndianRupee,
  Users,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Send,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function Dashboard({ onOpenAddStudent, onOpenRecordPayment, onOpenReceipt }) {
  const {
    students,
    payments,
    getMonthlyEarnings,
    getTotalPendingDues,
    getOverdueStudentsList,
    generateWhatsAppLink,
    setActiveTab,
    MONTH_NAMES,
    CURRENT_MONTH,
    CURRENT_YEAR,
    setSelectedStudentForHistory,
  } = useApp();

  const activeStudents = students.filter((s) => s.status === 'Active');
  const monthEarnings = getMonthlyEarnings(CURRENT_YEAR, CURRENT_MONTH);
  const pendingDues = getTotalPendingDues(CURRENT_YEAR, CURRENT_MONTH);
  const overdueList = getOverdueStudentsList(CURRENT_MONTH, CURRENT_YEAR);

  // Recent payment transactions sorted by latest
  const recentPayments = Object.values(payments)
    .sort((a, b) => new Date(b.timestamp || b.datePaid) - new Date(a.timestamp || a.datePaid))
    .slice(0, 5);

  // Monthly earnings for the last 6 months for quick chart / graph view
  const last6MonthsData = [];
  for (let i = 5; i >= 0; i--) {
    let m = CURRENT_MONTH - i;
    let y = CURRENT_YEAR;
    if (m < 0) {
      m += 12;
      y -= 1;
    }
    const earnings = getMonthlyEarnings(y, m);
    last6MonthsData.push({
      label: MONTH_NAMES[m].slice(0, 3),
      monthIndex: m,
      year: y,
      amount: earnings,
    });
  }

  const maxEarnings = Math.max(...last6MonthsData.map((d) => d.amount), 5000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner: Quick Actions & Welcome */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>
            {MONTH_NAMES[CURRENT_MONTH]} {CURRENT_YEAR} Overview
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage admissions, monitor monthly fees, and issue automatic WhatsApp due date reminders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onOpenAddStudent}>
            <PlusCircle size={18} />
            <span>Add Student</span>
          </button>
          <button className="btn btn-success" onClick={onOpenRecordPayment}>
            <IndianRupee size={18} />
            <span>Record Fee Payment</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        {/* Metric 1: Monthly Earnings */}
        <div className="card stat-card">
          <div className="stat-icon success">
            <IndianRupee size={26} />
          </div>
          <div>
            <div className="stat-lbl">This Month's Earnings</div>
            <div className="stat-val" style={{ color: 'var(--success)' }}>
              ₹{monthEarnings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Collected in {MONTH_NAMES[CURRENT_MONTH]}
            </div>
          </div>
        </div>

        {/* Metric 2: Pending Dues */}
        <div className="card stat-card">
          <div className="stat-icon warning">
            <Clock size={26} />
          </div>
          <div>
            <div className="stat-lbl">Pending Dues</div>
            <div className="stat-val" style={{ color: 'var(--warning)' }}>
              ₹{pendingDues.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Uncollected this month
            </div>
          </div>
        </div>

        {/* Metric 3: Active Students */}
        <div className="card stat-card">
          <div className="stat-icon primary">
            <Users size={26} />
          </div>
          <div>
            <div className="stat-lbl">Active Students</div>
            <div className="stat-val">{activeStudents.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Enrolled in batches
            </div>
          </div>
        </div>

        {/* Metric 4: Overdue Alert */}
        <div className="card stat-card">
          <div className="stat-icon danger">
            <AlertTriangle size={26} />
          </div>
          <div>
            <div className="stat-lbl">Overdue Payments</div>
            <div className="stat-val" style={{ color: 'var(--danger)' }}>
              {overdueList.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Past due date
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Overdue Alert Section */}
      {overdueList.length > 0 && (
        <div
          className="card"
          style={{
            borderLeft: '4px solid var(--danger)',
            backgroundColor: 'var(--danger-bg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle color="var(--danger)" size={24} />
              <div>
                <h3 style={{ color: 'var(--danger)', fontSize: '1.1rem' }}>
                  {overdueList.length} Student(s) Fee Payment Overdue
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', opacity: 0.9 }}>
                  Send immediate WhatsApp fee due reminders to parents/students in 1-click.
                </p>
              </div>
            </div>

            <button
              className="btn btn-outline"
              style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
              onClick={() => setActiveTab('dueReminders')}
            >
              <span>View All Alerts</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {overdueList.slice(0, 3).map((stu) => {
              const waLink = generateWhatsAppLink(stu, CURRENT_MONTH, CURRENT_YEAR);
              return (
                <div
                  key={stu.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{stu.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      ({stu.class})
                    </span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>
                      Due Amount: ₹{stu.monthlyFee} • Due Date: {stu.dueDay} {MONTH_NAMES[CURRENT_MONTH]}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm"
                    >
                      <MessageSquare size={15} />
                      <span>Send WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: Revenue Bar Chart + Recent Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Revenue Trend Chart */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--accent-primary)" />
              <span>Earnings Trend (Last 6 Months)</span>
            </h3>
            <button
              onClick={() => setActiveTab('analytics')}
              className="btn btn-outline btn-sm"
            >
              Full Analytics
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '1rem', paddingTop: '1rem' }}>
            {last6MonthsData.map((d, index) => {
              const heightPercent = Math.max((d.amount / maxEarnings) * 100, 8);
              const isCurrent = d.monthIndex === CURRENT_MONTH;

              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    ₹{d.amount > 0 ? (d.amount / 1000).toFixed(1) + 'k' : '0'}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${heightPercent}%`,
                      background: isCurrent ? 'var(--accent-gradient)' : 'var(--bg-card-hover)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.3s ease',
                      border: isCurrent ? 'none' : '1px solid var(--border-color)',
                      boxShadow: isCurrent ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
                    }}
                    title={`${d.label}: ₹${d.amount}`}
                  />
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Fee Payments Log */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} color="var(--success)" />
              <span>Recent Fee Payments</span>
            </h3>
            <button onClick={() => setActiveTab('ledger')} className="btn btn-outline btn-sm">
              Fee Ledger
            </button>
          </div>

          {recentPayments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No payments recorded yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentPayments.map((pmt, idx) => {
                const student = students.find((s) => s.id === pmt.studentId);
                if (!student) return null;

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Month: {MONTH_NAMES[pmt.month]} {pmt.year} • Mode: {pmt.mode}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--success)' }}>
                        +₹{pmt.amount}
                      </div>
                      <button
                        onClick={() => onOpenReceipt(pmt)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-primary)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
