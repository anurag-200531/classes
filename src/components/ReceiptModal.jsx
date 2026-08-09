import React from 'react';
import { useApp } from '../context/AppContext';
import { Printer, X, GraduationCap, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ReceiptModal({ payment, onClose }) {
  const { teacher, students, MONTH_NAMES } = useApp();

  if (!payment) return null;

  const student = students.find((s) => s.id === payment.studentId) || {
    name: 'Student',
    class: 'N/A',
    phone: 'N/A',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content printable-receipt-area"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', padding: '2rem' }}
      >
        {/* Modal Header Controls (Hidden on Print) */}
        <div
          className="no-print"
          style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}
        >
          <h3 style={{ fontSize: '1.1rem' }}>Digital Fee Receipt</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print / Download PDF</span>
            </button>
            <button className="btn btn-outline btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas */}
        <div
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: '16px',
            padding: '1.5rem',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          {/* Receipt Top Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid var(--border-color)',
              paddingBottom: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={24} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{teacher.coachingName}</h2>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {teacher.name} • Ph: {teacher.phone}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{teacher.address}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '12px',
                  display: 'inline-block',
                }}
              >
                FEE RECEIPT
              </span>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.4rem' }}>
                {payment.receiptNo}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Date: {payment.datePaid}
              </div>
            </div>
          </div>

          {/* Student & Class Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              backgroundColor: 'var(--bg-primary)',
              padding: '0.85rem',
              borderRadius: '10px',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Student Name</span>
              <div style={{ fontWeight: 700 }}>{student.name}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Student ID / Class</span>
              <div style={{ fontWeight: 700 }}>
                {student.id} ({student.class})
              </div>
            </div>
          </div>

          {/* Payment Line Items Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1rem',
              fontSize: '0.85rem',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 0' }}>Description</th>
                <th style={{ textAlign: 'right', padding: '0.5rem 0' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.6rem 0' }}>
                  <strong>Monthly Fee</strong> ({MONTH_NAMES[payment.month]} {payment.year})
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{payment.amount}</td>
              </tr>
              {payment.discount > 0 && (
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--success)' }}>
                  <td style={{ padding: '0.4rem 0' }}>Discount Applied</td>
                  <td style={{ textAlign: 'right' }}>-₹{payment.discount}</td>
                </tr>
              )}
              {payment.lateFee > 0 && (
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--danger)' }}>
                  <td style={{ padding: '0.4rem 0' }}>Late Fee Charges</td>
                  <td style={{ textAlign: 'right' }}>+₹{payment.lateFee}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Total & Payment Mode */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              borderRadius: '10px',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              marginBottom: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Payment Mode</span>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {payment.mode} {payment.refNo !== 'N/A' && `(${payment.refNo})`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Total Paid</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{payment.amount}</div>
            </div>
          </div>

          {/* Footer Signature stamp */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} color="var(--success)" />
              <span>Verified Computer Generated Receipt</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'cursive', fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {teacher.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Authorized Signature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
