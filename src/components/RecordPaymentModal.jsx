import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { X, IndianRupee, CreditCard, Calendar, CheckCircle2 } from 'lucide-react';

export default function RecordPaymentModal({
  preselectedStudent,
  preselectedMonth,
  preselectedYear,
  onClose,
  onOpenReceipt,
}) {
  const { students, recordPayment, MONTH_NAMES, CURRENT_MONTH, CURRENT_YEAR } = useApp();

  const [studentId, setStudentId] = useState(
    preselectedStudent ? preselectedStudent.id : students[0]?.id || ''
  );
  const [month, setMonth] = useState(
    preselectedMonth !== undefined ? preselectedMonth : CURRENT_MONTH
  );
  const [year, setYear] = useState(preselectedYear || CURRENT_YEAR);

  const currentStudent = students.find((s) => s.id === studentId) || students[0];

  const [amount, setAmount] = useState(currentStudent ? currentStudent.monthlyFee : 1500);
  const [mode, setMode] = useState('UPI');
  const [refNo, setRefNo] = useState('');
  const [datePaid, setDatePaid] = useState(new Date().toISOString().split('T')[0]);
  const [discount, setDiscount] = useState('0');
  const [lateFee, setLateFee] = useState('0');

  const handleStudentChange = (id) => {
    setStudentId(id);
    const stu = students.find((s) => s.id === id);
    if (stu) setAmount(stu.monthlyFee);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !amount) {
      alert('Please select a student and enter amount.');
      return;
    }

    const record = recordPayment({
      studentId,
      month: parseInt(month, 10),
      year: parseInt(year, 10),
      amount: parseFloat(amount),
      mode,
      refNo,
      datePaid,
      discount,
      lateFee,
    });

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    onClose();
    if (onOpenReceipt) {
      onOpenReceipt(record);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IndianRupee size={22} color="var(--success)" />
            <span>Record Fee Payment</span>
          </h2>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group">
            <label>Select Student *</label>
            <select
              className="form-control"
              value={studentId}
              onChange={(e) => handleStudentChange(e.target.value)}
              required
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.class}) - ₹{s.monthlyFee}/mo
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Fee Month *</label>
              <select
                className="form-control"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Fee Year *</label>
              <select
                className="form-control"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Amount Collected (₹) *</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Mode *</label>
              <select
                className="form-control"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Cash">Cash Handed Over</option>
                <option value="Bank Transfer">Bank Transfer (IMPS/NEFT)</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Payment Date *</label>
              <input
                type="date"
                className="form-control"
                value={datePaid}
                onChange={(e) => setDatePaid(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Txn / Reference No.</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. UPI984210..."
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              <CheckCircle2 size={18} />
              <span>Record & Generate Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
