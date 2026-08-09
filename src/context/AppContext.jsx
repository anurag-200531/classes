import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_TEACHER = {
  name: 'Prof. Rajesh Sharma',
  coachingName: 'Apex Academy Coaching Classes',
  phone: '9876543210',
  email: 'rajesh.apex@gmail.com',
  subjects: 'Mathematics & Science (Class 8th - 12th)',
  address: '123 Vidya Marg, Near Central Bank, City Center',
  upiId: 'apexacademy@upi',
  pin: '1234',
  isPinEnabled: false,
};

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth(); // 0-indexed (0 = Jan)

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Initial mock dataset for immediate testing
const INITIAL_STUDENTS = [
  {
    id: 'STU-1001',
    name: 'Aarav Sharma',
    class: 'Class 10',
    batch: 'Morning (8:00 AM)',
    admissionDate: '2025-04-10',
    monthlyFee: 1500,
    dueDay: 5, // 5th of every month
    phone: '9812345678',
    parentPhone: '9812345679',
    parentName: 'Sanjay Sharma',
    address: 'Sector 4, Green Park',
    status: 'Active',
    notes: 'Preparing for board exams.',
  },
  {
    id: 'STU-1002',
    name: 'Ananya Gupta',
    class: 'Class 12',
    batch: 'Evening (4:30 PM)',
    admissionDate: '2025-04-12',
    monthlyFee: 2200,
    dueDay: 10,
    phone: '9823456789',
    parentPhone: '9823456780',
    parentName: 'Sunil Gupta',
    address: 'Model Town, House #45',
    status: 'Active',
    notes: 'JEE Foundation aspirant.',
  },
  {
    id: 'STU-1003',
    name: 'Rohan Verma',
    class: 'Class 9',
    batch: 'Morning (9:30 AM)',
    admissionDate: '2025-05-01',
    monthlyFee: 1200,
    dueDay: 7,
    phone: '9834567890',
    parentPhone: '9834567891',
    parentName: 'Vikas Verma',
    address: 'Civil Lines',
    status: 'Active',
    notes: 'Needs extra help in Algebra.',
  },
  {
    id: 'STU-1004',
    name: 'Priya Singh',
    class: 'Class 11',
    batch: 'Evening (5:30 PM)',
    admissionDate: '2025-06-15',
    monthlyFee: 2000,
    dueDay: 5,
    phone: '9845678901',
    parentPhone: '9845678902',
    parentName: 'Mahendra Singh',
    address: 'Rajendra Nagar',
    status: 'Active',
    notes: 'Regular student.',
  },
  {
    id: 'STU-1005',
    name: 'Kabir Mehta',
    class: 'Class 10',
    batch: 'Morning (8:00 AM)',
    admissionDate: '2025-07-01',
    monthlyFee: 1500,
    dueDay: 15,
    phone: '9856789012',
    parentPhone: '9856789013',
    parentName: 'Deepak Mehta',
    address: 'Vasant Vihar',
    status: 'Active',
    notes: 'Good performance in weekly tests.',
  }
];

// Initial Payment Records (Key format: `${studentId}-${year}-${monthIndex}`)
const generateInitialPayments = () => {
  const payments = {};
  const currentY = CURRENT_YEAR;
  
  // Aarav: Paid up to Current Month
  payments[`STU-1001-${currentY}-${CURRENT_MONTH}`] = {
    receiptNo: `REC-${currentY}${String(CURRENT_MONTH+1).padStart(2, '0')}-01`,
    amount: 1500,
    datePaid: `${currentY}-${String(CURRENT_MONTH+1).padStart(2, '0')}-04`,
    mode: 'UPI',
    refNo: 'UPI9842103982',
    month: CURRENT_MONTH,
    year: currentY,
    studentId: 'STU-1001',
  };

  // Ananya: Paid previous month, Pending/Overdue current month
  if (CURRENT_MONTH > 0) {
    payments[`STU-1002-${currentY}-${CURRENT_MONTH - 1}`] = {
      receiptNo: `REC-${currentY}${String(CURRENT_MONTH).padStart(2, '0')}-02`,
      amount: 2200,
      datePaid: `${currentY}-${String(CURRENT_MONTH).padStart(2, '0')}-08`,
      mode: 'Cash',
      refNo: 'CASH-REC',
      month: CURRENT_MONTH - 1,
      year: currentY,
      studentId: 'STU-1002',
    };
  }

  // Rohan: Paid current month
  payments[`STU-1003-${currentY}-${CURRENT_MONTH}`] = {
    receiptNo: `REC-${currentY}${String(CURRENT_MONTH+1).padStart(2, '0')}-03`,
    amount: 1200,
    datePaid: `${currentY}-${String(CURRENT_MONTH+1).padStart(2, '0')}-06`,
    mode: 'UPI',
    refNo: 'UPI8832105432',
    month: CURRENT_MONTH,
    year: currentY,
    studentId: 'STU-1003',
  };

  return payments;
};

export const AppProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(() => {
    const saved = localStorage.getItem('coaching_teacher');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('coaching_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('coaching_payments');
    return saved ? JSON.parse(saved) : generateInitialPayments();
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const lockSaved = localStorage.getItem('coaching_auth');
    return lockSaved === 'true' || !teacher.isPinEnabled;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('coaching_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('coaching_teacher', JSON.stringify(teacher));
  }, [teacher]);

  useEffect(() => {
    localStorage.setItem('coaching_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('coaching_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('coaching_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth functions
  const login = (pin) => {
    if (pin === teacher.pin) {
      setIsAuthenticated(true);
      localStorage.setItem('coaching_auth', 'true');
      return { success: true };
    }
    return { success: false, error: 'Incorrect PIN' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('coaching_auth', 'false');
  };

  // Student CRUD
  const addStudent = (studentData) => {
    const newId = `STU-${1000 + students.length + 1}`;
    const newStudent = {
      ...studentData,
      id: newId,
      status: 'Active',
      admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0],
      dueDay: parseInt(studentData.dueDay, 10) || 5,
      monthlyFee: parseFloat(studentData.monthlyFee) || 0,
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    setStudents((prev) =>
      prev.map((stu) => (stu.id === id ? { ...stu, ...updatedData } : stu))
    );
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((stu) => stu.id !== id));
  };

  // Payment Recording
  const recordPayment = ({ studentId, month, year, amount, mode, refNo, datePaid, discount = 0, lateFee = 0 }) => {
    const key = `${studentId}-${year}-${month}`;
    const receiptNo = `REC-${year}${String(month + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    
    const record = {
      receiptNo,
      studentId,
      month,
      year,
      amount: parseFloat(amount),
      mode,
      refNo: refNo || 'N/A',
      datePaid: datePaid || new Date().toISOString().split('T')[0],
      discount: parseFloat(discount) || 0,
      lateFee: parseFloat(lateFee) || 0,
      timestamp: new Date().toISOString(),
    };

    setPayments((prev) => ({
      ...prev,
      [key]: record,
    }));

    return record;
  };

  const deletePayment = (studentId, year, month) => {
    const key = `${studentId}-${year}-${month}`;
    setPayments((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Helper getters
  const isFeePaid = (studentId, year, month) => {
    const key = `${studentId}-${year}-${month}`;
    return !!payments[key];
  };

  const getPaymentDetails = (studentId, year, month) => {
    const key = `${studentId}-${year}-${month}`;
    return payments[key] || null;
  };

  // Calculate Due Status for a given student & month/year
  const getStudentDueStatus = (student, monthIndex = CURRENT_MONTH, year = CURRENT_YEAR) => {
    const paid = isFeePaid(student.id, year, monthIndex);
    if (paid) return { status: 'Paid', class: 'badge-success' };

    const today = new Date();
    const currentDay = today.getDate();
    const isCurrentMonth = today.getMonth() === monthIndex && today.getFullYear() === year;

    if (isCurrentMonth) {
      if (currentDay > student.dueDay) {
        const overdueDays = currentDay - student.dueDay;
        return { status: 'Overdue', days: overdueDays, class: 'badge-danger' };
      } else {
        const daysLeft = student.dueDay - currentDay;
        return { status: 'Pending', daysLeft, class: 'badge-warning' };
      }
    } else if (year < today.getFullYear() || (year === today.getFullYear() && monthIndex < today.getMonth())) {
      return { status: 'Overdue', days: 30, class: 'badge-danger' };
    } else {
      return { status: 'Upcoming', class: 'badge-secondary' };
    }
  };

  // Global Financial Analytics
  const getMonthlyEarnings = (year = CURRENT_YEAR, monthIndex = CURRENT_MONTH) => {
    let total = 0;
    Object.values(payments).forEach((p) => {
      if (p.year === year && p.month === monthIndex) {
        total += p.amount;
      }
    });
    return total;
  };

  const getTotalPendingDues = (year = CURRENT_YEAR, monthIndex = CURRENT_MONTH) => {
    let pendingAmount = 0;
    students.forEach((stu) => {
      if (stu.status === 'Active' && !isFeePaid(stu.id, year, monthIndex)) {
        pendingAmount += stu.monthlyFee;
      }
    });
    return pendingAmount;
  };

  const getOverdueStudentsList = (monthIndex = CURRENT_MONTH, year = CURRENT_YEAR) => {
    return students.filter((stu) => {
      if (stu.status !== 'Active') return false;
      const dueInfo = getStudentDueStatus(stu, monthIndex, year);
      return dueInfo.status === 'Overdue';
    });
  };

  // WhatsApp Message Link Generator
  const generateWhatsAppLink = (student, monthIndex = CURRENT_MONTH, year = CURRENT_YEAR) => {
    const monthName = MONTH_NAMES[monthIndex];
    const targetPhone = student.parentPhone || student.phone;
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    
    // Format message
    const message = `Hello *${student.parentName || student.name}*,\n\n` +
      `This is a polite reminder from *${teacher.coachingName}* (${teacher.name}).\n` +
      `The monthly coaching fee for *${student.name}* (${student.class}) for the month of *${monthName} ${year}* is due.\n\n` +
      `📌 *Fee Amount:* ₹${student.monthlyFee}\n` +
      `📌 *Due Date:* ${student.dueDay} ${monthName} ${year}\n` +
      (teacher.upiId ? `📌 *Pay via UPI ID:* ${teacher.upiId}\n\n` : '\n') +
      `Kindly clear the fee at your earliest convenience. If already paid, please ignore this message.\n\n` +
      `Thank you!`;

    const encodedMsg = encodeURIComponent(message);
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return `https://wa.me/${phoneWithCode}?text=${encodedMsg}`;
  };

  // Reset demo data
  const resetToSampleData = () => {
    setTeacher(INITIAL_TEACHER);
    setStudents(INITIAL_STUDENTS);
    setPayments(generateInitialPayments());
    localStorage.removeItem('coaching_teacher');
    localStorage.removeItem('coaching_students');
    localStorage.removeItem('coaching_payments');
  };

  return (
    <AppContext.Provider
      value={{
        teacher,
        setTeacher,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        payments,
        recordPayment,
        deletePayment,
        isFeePaid,
        getPaymentDetails,
        getStudentDueStatus,
        getMonthlyEarnings,
        getTotalPendingDues,
        getOverdueStudentsList,
        generateWhatsAppLink,
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        selectedReceipt,
        setSelectedReceipt,
        selectedStudentForHistory,
        setSelectedStudentForHistory,
        theme,
        setTheme,
        resetToSampleData,
        MONTH_NAMES,
        CURRENT_YEAR,
        CURRENT_MONTH,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
