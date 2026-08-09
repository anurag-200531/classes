import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UserPlus, IndianRupee, Calendar } from 'lucide-react';

export default function AddStudentModal({ onClose }) {
  const { addStudent, MONTH_NAMES, CURRENT_MONTH } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    class: 'Class 10',
    batch: 'Morning (8:00 AM)',
    admissionDate: new Date().toISOString().split('T')[0],
    monthlyFee: '1500',
    dueDay: '5',
    phone: '',
    parentPhone: '',
    parentName: '',
    address: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill out student name and phone number.');
      return;
    }

    addStudent(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={22} color="var(--accent-primary)" />
            <span>New Student Admission</span>
          </h2>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group">
            <label>Student Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Aarav Sharma"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Class / Grade *</label>
              <select name="class" className="form-control" value={formData.class} onChange={handleChange}>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Target / Dropper">Target / Dropper</option>
              </select>
            </div>

            <div className="form-group">
              <label>Batch Timing</label>
              <input
                type="text"
                name="batch"
                className="form-control"
                placeholder="e.g. Morning (8:00 AM)"
                value={formData.batch}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Monthly Fee Amount (₹) *</label>
              <input
                type="number"
                name="monthlyFee"
                className="form-control"
                value={formData.monthlyFee}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Monthly Fee Due Day *</label>
              <select name="dueDay" className="form-control" value={formData.dueDay} onChange={handleChange}>
                <option value="1">1st of every month</option>
                <option value="5">5th of every month</option>
                <option value="7">7th of every month</option>
                <option value="10">10th of every month</option>
                <option value="15">15th of every month</option>
                <option value="20">20th of every month</option>
                <option value="25">25th of every month</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Admission Date *</label>
              <input
                type="date"
                name="admissionDate"
                className="form-control"
                value={formData.admissionDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Student Contact Phone *</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Parent/Guardian Name</label>
              <input
                type="text"
                name="parentName"
                className="form-control"
                placeholder="e.g. Sanjay Sharma"
                value={formData.parentName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Parent Phone (WhatsApp)</label>
              <input
                type="text"
                name="parentPhone"
                className="form-control"
                placeholder="9876543210"
                value={formData.parentPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Locality, House #, City"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Notes / Preparation Goal</label>
            <textarea
              name="notes"
              className="form-control"
              rows="2"
              placeholder="Target exam, special notes..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
