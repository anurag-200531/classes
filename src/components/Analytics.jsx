import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  PieChart,
  Download,
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

export default function Analytics() {
  const {
    students,
    payments,
    getMonthlyEarnings,
    getTotalPendingDues,
    MONTH_NAMES,
    CURRENT_YEAR,
    CURRENT_MONTH,
  } = useApp();

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  // Calculate year totals
  const monthlyBreakdown = MONTH_NAMES.map((monthName, idx) => {
    const earnings = getMonthlyEarnings(selectedYear, idx);
    let pending = 0;
    students.forEach((stu) => {
      if (stu.status === 'Active') {
        const key = `${stu.id}-${selectedYear}-${idx}`;
        if (!payments[key]) {
          pending += stu.monthlyFee;
        }
      }
    });

    return {
      monthName,
      monthIndex: idx,
      earnings,
      pending,
      totalPossible: earnings + pending,
    };
  });

  const totalYearEarnings = monthlyBreakdown.reduce((sum, item) => sum + item.earnings, 0);
  const totalYearPending = monthlyBreakdown.reduce((sum, item) => sum + item.pending, 0);
  const collectionRate =
    totalYearEarnings + totalYearPending > 0
      ? Math.round((totalYearEarnings / (totalYearEarnings + totalYearPending)) * 100)
      : 100;

  // Payment Mode breakdown
  const paymentModes = { UPI: 0, Cash: 0, BankTransfer: 0, Other: 0 };
  Object.values(payments).forEach((p) => {
    if (p.year === selectedYear) {
      if (p.mode === 'UPI') paymentModes.UPI += p.amount;
      else if (p.mode === 'Cash') paymentModes.Cash += p.amount;
      else if (p.mode === 'Bank Transfer') paymentModes.BankTransfer += p.amount;
      else paymentModes.Other += p.amount;
    }
  });

  // Export CSV Function
  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Receipt No,Student ID,Student Name,Class,Month,Year,Amount Paid,Payment Mode,Date Paid,Ref No\n';

    Object.values(payments).forEach((p) => {
      const student = students.find((s) => s.id === p.studentId);
      const studentName = student ? student.name : 'Unknown';
      const studentClass = student ? student.class : 'N/A';
      const monthName = MONTH_NAMES[p.month];

      const row = [
        p.receiptNo,
        p.studentId,
        `"${studentName}"`,
        `"${studentClass}"`,
        monthName,
        p.year,
        p.amount,
        p.mode,
        p.datePaid,
        p.refNo || 'N/A',
      ].join(',');

      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Coaching_Earnings_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Earnings Analytics & Reports</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Financial performance reports, collection efficiency, payment methods, and CSV data export.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
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

          <button className="btn btn-outline" onClick={exportCSV}>
            <FileSpreadsheet size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon success">
            <IndianRupee size={26} />
          </div>
          <div>
            <div className="stat-lbl">Total Revenue ({selectedYear})</div>
            <div className="stat-val" style={{ color: 'var(--success)' }}>
              ₹{totalYearEarnings.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon warning">
            <AlertTriangle size={26} />
          </div>
          <div>
            <div className="stat-lbl">Uncollected Dues</div>
            <div className="stat-val" style={{ color: 'var(--warning)' }}>
              ₹{totalYearPending.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon primary">
            <TrendingUp size={26} />
          </div>
          <div>
            <div className="stat-lbl">Collection Rate</div>
            <div className="stat-val" style={{ color: 'var(--accent-primary)' }}>
              {collectionRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="var(--accent-primary)" />
          <span>Month-by-Month Earnings Breakdown ({selectedYear})</span>
        </h3>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Collected Revenue</th>
                <th>Pending Dues</th>
                <th>Total Potential</th>
                <th>Collection %</th>
              </tr>
            </thead>
            <tbody>
              {monthlyBreakdown.map((row) => {
                const rate =
                  row.totalPossible > 0
                    ? Math.round((row.earnings / row.totalPossible) * 100)
                    : 100;
                const isCurrentMonth = row.monthIndex === CURRENT_MONTH && selectedYear === CURRENT_YEAR;

                return (
                  <tr key={row.monthName} style={isCurrentMonth ? { backgroundColor: 'rgba(99, 102, 241, 0.08)' } : {}}>
                    <td style={{ fontWeight: isCurrentMonth ? 700 : 500 }}>
                      {row.monthName} {isCurrentMonth && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Current</span>}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                      ₹{row.earnings.toLocaleString('en-IN')}
                    </td>
                    <td style={{ color: row.pending > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
                      ₹{row.pending.toLocaleString('en-IN')}
                    </td>
                    <td>₹{row.totalPossible.toLocaleString('en-IN')}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            flex: 1,
                            maxWidth: '80px',
                            height: '6px',
                            backgroundColor: 'var(--border-color)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${rate}%`,
                              height: '100%',
                              backgroundColor: rate > 80 ? 'var(--success)' : rate > 50 ? 'var(--warning)' : 'var(--danger)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
