import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Building,
  Phone,
  Mail,
  BookOpen,
  MapPin,
  QrCode,
  Lock,
  Download,
  Upload,
  RotateCcw,
  Save,
  CheckCircle,
} from 'lucide-react';

export default function TeacherProfile() {
  const { teacher, setTeacher, resetToSampleData, students, payments } = useApp();

  const [formData, setFormData] = useState({ ...teacher });
  const [savedMsg, setSavedMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTeacher(formData);
    setSavedMsg('Profile updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  // Export database JSON
  const handleExportJSON = () => {
    const data = {
      teacher,
      students,
      payments,
      exportDate: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Coaching_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import database JSON
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.teacher && data.students && data.payments) {
          localStorage.setItem('coaching_teacher', JSON.stringify(data.teacher));
          localStorage.setItem('coaching_students', JSON.stringify(data.students));
          localStorage.setItem('coaching_payments', JSON.stringify(data.payments));
          alert('Backup restored successfully! Reloading...');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Error parsing JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Teacher & Coaching Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Configure your institute details, contact info, payment receipt headers, and security lock.
        </p>
      </div>

      {savedMsg && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle size={18} />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="card">
        <h3 style={{ marginBottom: '1.25rem' }}>Institute Details</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Teacher Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Coaching Institute Name</label>
            <input
              type="text"
              name="coachingName"
              className="form-control"
              value={formData.coachingName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number (WhatsApp)</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Subjects Taught & Batches</label>
            <input
              type="text"
              name="subjects"
              className="form-control"
              value={formData.subjects}
              onChange={handleChange}
              placeholder="e.g. Maths & Science (Class 8 - 12)"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Coaching Address (Printed on Receipts)</label>
            <input
              type="text"
              name="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>UPI ID (Printed on Fee Receipts & Reminders)</label>
            <input
              type="text"
              name="upiId"
              className="form-control"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="e.g. apexcoaching@upi"
            />
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

        <h3 style={{ marginBottom: '1rem' }}>Portal Security (PIN Protection)</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="checkbox"
              id="isPinEnabled"
              name="isPinEnabled"
              checked={formData.isPinEnabled}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="isPinEnabled" style={{ cursor: 'pointer', fontWeight: 600 }}>
              Enable PIN Lock on website load
            </label>
          </div>

          {formData.isPinEnabled && (
            <div className="form-group" style={{ maxWidth: '200px' }}>
              <label>Set 4-Digit Security PIN</label>
              <input
                type="password"
                name="pin"
                className="form-control"
                maxLength="4"
                value={formData.pin}
                onChange={handleChange}
                placeholder="1234"
              />
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={18} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Backup & Data Management Card */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Backup & Data Control</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Safeguard student admission records and payment transaction receipts. Export or restore data anytime.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={handleExportJSON}>
            <Download size={18} />
            <span>Download Backup (JSON)</span>
          </button>

          <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
            <Upload size={18} />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              style={{ display: 'none' }}
            />
          </label>

          <button
            className="btn btn-outline"
            onClick={() => {
              if (window.confirm('Reset data back to initial sample demo records?')) {
                resetToSampleData();
                window.location.reload();
              }
            }}
            style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <RotateCcw size={18} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
