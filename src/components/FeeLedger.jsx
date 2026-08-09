import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  IndianRupee,
  Calendar,
  Search,
  Receipt,
  Download,
  Filter,
} from 'lucide-react';

export default function FeeLedger({ onOpenRecordPayment, onOpenReceipt }) {
  const {
    students,
    payments,
    isFeePaid,
    getPaymentDetails,
    getStudentDueStatus,
    MONTH_NAMES,
    CURRENT_YEAR,
    CURRENT_MONTH,
  } = useApp();

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [searchQuery, setSearchQuery] = useState('');

  const activeStudents = students.filter((s) => s.status === 'Active');

  const filteredStudents = activeStudents.filter(
    (stu) =>
      stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stu.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Total collected for the selected year
  let totalYearlyCollected = 0;
  Object.values(payments).forEach((p) => {
    if (p.year === selectedYear) {
      totalYearlyCollected += p.amount;
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Year Selector */}
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Monthly Fee Ledger ({selectedYear})</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Comprehensive monthly fee matrix (Jan – Dec). Click on any month cell to collect fee or view digital receipt.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--accent-primary)" />
            <select
              className="form-control"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              style={{ fontWeight: 700, width: 'auto' }}
            >
              <option value={2026}>Year 2026</option>
              <option value={2025}>Year 2025</option>
              <option value={2024}>Year 2024</option>
            </select>
          </div>
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
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total Revenue Collected in {selectedYear}
          </span>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--success)', marginTop: '0.2rem' }}>
            ₹{totalYearlyCollected.toLocaleString('en-IN')}
          </h3>
        </div>

        {/* Quick Search */}
        <div style={{ minWidth: '220px', position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Filter by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.2rem' }}
          />
        </div>
      </div>

      {/* Monthly Matrix Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th style={{ minWidth: '160px' }}>Student</th>
                <th style={{ minWidth: '80px' }}>Fee</th>
                {MONTH_NAMES.map((m) => (
                  <th key={m} style={{ textAlign: 'center', minWidth: '70px' }}>
                    {m.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="14" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No active students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {student.class}
                      </div>
                    </td>

                    <td style={{ fontWeight: 700 }}>₹{student.monthlyFee}</td>

                    {MONTH_NAMES.map((mName, mIdx) => {
                      const paid = isFeePaid(student.id, selectedYear, mIdx);
                      const pmt = getPaymentDetails(student.id, selectedYear, mIdx);
                      const dueStatus = getStudentDueStatus(student, mIdx, selectedYear);

                      let cellClass = 'pending';
                      let cellText = 'Due';

                      if (paid) {
                        cellClass = 'paid';
                        cellText = `₹${pmt.amount}`;
                      } else if (dueStatus.status === 'Overdue') {
                        cellClass = 'overdue';
                        cellText = 'Overdue';
                      } else if (dueStatus.status === 'Upcoming') {
                        cellClass = '';
                        cellText = '-';
                      }

                      return (
                        <td key={mIdx} style={{ padding: '0.4rem', textAlign: 'center' }}>
                          <div
                            className={`month-cell ${cellClass}`}
                            onClick={() => {
                              if (paid) {
                                onOpenReceipt(pmt);
                              } else {
                                onOpenRecordPayment(student, mIdx, selectedYear);
                              }
                            }}
                            title={
                              paid
                                ? `Paid on ${pmt.datePaid} (${pmt.mode}). Click to view receipt.`
                                : `Click to record fee payment for ${mName} ${selectedYear}`
                            }
                          >
                            {cellText}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
