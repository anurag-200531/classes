import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Eye,
  MessageSquare,
  IndianRupee,
  Calendar,
  Phone,
  BookOpen,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function Students({ onOpenAddStudent, onOpenRecordPayment, onOpenReceipt }) {
  const {
    students,
    deleteStudent,
    getStudentDueStatus,
    generateWhatsAppLink,
    payments,
    MONTH_NAMES,
    CURRENT_MONTH,
    CURRENT_YEAR,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  // Extract unique classes for filter
  const classesList = ['All', ...new Set(students.map((s) => s.class))];

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery) ||
      (student.parentPhone && student.parentPhone.includes(searchQuery));

    const matchesClass = selectedClass === 'All' || student.class === selectedClass;

    const dueInfo = getStudentDueStatus(student, CURRENT_MONTH, CURRENT_YEAR);
    const matchesStatus =
      selectedStatusFilter === 'All' || dueInfo.status === selectedStatusFilter;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove student ${name}?`)) {
      deleteStudent(id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar & Actions */}
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Students Directory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Manage student admissions, contact details, monthly fee schedules, and payment histories.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddStudent}>
          <Plus size={18} />
          <span>New Admission</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search student by name, ID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Class Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-control"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ width: 'auto' }}
            >
              {classesList.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Classes' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              className="form-control"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="All">All Fee Status</option>
              <option value="Paid">Paid This Month</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class / Batch</th>
                <th>Admission Date</th>
                <th>Monthly Fee</th>
                <th>Fee Due Date</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const dueInfo = getStudentDueStatus(student, CURRENT_MONTH, CURRENT_YEAR);
                  const waLink = generateWhatsAppLink(student, CURRENT_MONTH, CURRENT_YEAR);

                  return (
                    <tr key={student.id}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{student.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: {student.id} • Ph: {student.phone}
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-secondary">{student.class}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {student.batch}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                          <Calendar size={14} color="var(--text-muted)" />
                          <span>{student.admissionDate}</span>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          ₹{student.monthlyFee}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          {student.dueDay}th of every month
                        </div>
                      </td>

                      <td>
                        <span className={`badge ${dueInfo.class}`}>
                          {dueInfo.status === 'Paid' && <CheckCircle2 size={12} />}
                          {dueInfo.status === 'Pending' && <Clock size={12} />}
                          {dueInfo.status === 'Overdue' && <AlertTriangle size={12} />}
                          <span>{dueInfo.status}</span>
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {/* Record Payment Button if not paid */}
                          {dueInfo.status !== 'Paid' ? (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => onOpenRecordPayment(student)}
                              title="Record Fee Payment"
                            >
                              <IndianRupee size={14} />
                              <span>Pay Fee</span>
                            </button>
                          ) : (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-whatsapp btn-sm"
                              title="Send WhatsApp Message"
                            >
                              <MessageSquare size={14} />
                            </a>
                          )}

                          {dueInfo.status === 'Overdue' && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-whatsapp btn-sm"
                              title="Send WhatsApp Due Reminder"
                            >
                              <MessageSquare size={14} />
                            </a>
                          )}

                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setViewingStudent(student)}
                            title="View Full Profile"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleDelete(student.id, student.name)}
                            title="Delete Student"
                            style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student View Details Modal Drawer */}
      {viewingStudent && (
        <div className="modal-overlay" onClick={() => setViewingStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h2>{viewingStudent.name}</h2>
                <span className="badge badge-secondary">{viewingStudent.id}</span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setViewingStudent(null)}>
                Close
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Class / Grade</div>
                  <div style={{ fontWeight: 600 }}>{viewingStudent.class}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Batch Timing</div>
                  <div style={{ fontWeight: 600 }}>{viewingStudent.batch}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Admission Date</div>
                  <div style={{ fontWeight: 600 }}>{viewingStudent.admissionDate}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Monthly Fee</div>
                  <div style={{ fontWeight: 700, color: 'var(--success)' }}>₹{viewingStudent.monthlyFee}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Student Phone</div>
                  <div style={{ fontWeight: 600 }}>{viewingStudent.phone}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Parent Phone</div>
                  <div style={{ fontWeight: 600 }}>{viewingStudent.parentPhone || 'N/A'}</div>
                </div>
              </div>

              {viewingStudent.address && (
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Address</div>
                  <div>{viewingStudent.address}</div>
                </div>
              )}

              {viewingStudent.notes && (
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Teacher Notes</div>
                  <div style={{ fontStyle: 'italic', background: 'var(--bg-primary)', padding: '0.5rem 0.8rem', borderRadius: '8px' }}>
                    {viewingStudent.notes}
                  </div>
                </div>
              )}

              <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

              <h4 style={{ fontSize: '1rem' }}>Recent Payment Ledger ({CURRENT_YEAR})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {MONTH_NAMES.map((monthName, idx) => {
                  const key = `${viewingStudent.id}-${CURRENT_YEAR}-${idx}`;
                  const pmt = payments[key];
                  return (
                    <div
                      key={monthName}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        backgroundColor: pmt ? 'var(--success-bg)' : 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{monthName}</span>
                      {pmt ? (
                        <div style={{ textAlign: 'right' }}>
                          <span className="badge badge-success">Paid ₹{pmt.amount}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                            {pmt.datePaid} ({pmt.mode})
                          </span>
                        </div>
                      ) : (
                        <span className="badge badge-warning">Unpaid</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
