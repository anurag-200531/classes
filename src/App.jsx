import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import FeeLedger from './components/FeeLedger';
import DueReminders from './components/DueReminders';
import Analytics from './components/Analytics';
import TeacherProfile from './components/TeacherProfile';
import ReceiptModal from './components/ReceiptModal';
import AddStudentModal from './components/AddStudentModal';
import RecordPaymentModal from './components/RecordPaymentModal';
import AuthModal from './components/AuthModal';

function MainAppContent() {
  const { activeTab, isAuthenticated, selectedReceipt, setSelectedReceipt } = useApp();

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [recordPaymentConfig, setRecordPaymentConfig] = useState(null); // { student, month, year }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  const handleOpenRecordPayment = (student = null, month = undefined, year = undefined) => {
    setRecordPaymentConfig({ student, month, year });
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Header Navbar */}
        <Navbar />

        {/* Tab Content Body */}
        <main className="content-body">
          {activeTab === 'dashboard' && (
            <Dashboard
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              onOpenRecordPayment={handleOpenRecordPayment}
              onOpenReceipt={(pmt) => setSelectedReceipt(pmt)}
            />
          )}

          {activeTab === 'students' && (
            <Students
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              onOpenRecordPayment={handleOpenRecordPayment}
              onOpenReceipt={(pmt) => setSelectedReceipt(pmt)}
            />
          )}

          {activeTab === 'ledger' && (
            <FeeLedger
              onOpenRecordPayment={handleOpenRecordPayment}
              onOpenReceipt={(pmt) => setSelectedReceipt(pmt)}
            />
          )}

          {activeTab === 'dueReminders' && (
            <DueReminders onOpenRecordPayment={handleOpenRecordPayment} />
          )}

          {activeTab === 'analytics' && <Analytics />}

          {activeTab === 'profile' && <TeacherProfile />}
        </main>
      </div>

      {/* Global Modals */}
      {isAddStudentOpen && (
        <AddStudentModal onClose={() => setIsAddStudentOpen(false)} />
      )}

      {recordPaymentConfig && (
        <RecordPaymentModal
          preselectedStudent={recordPaymentConfig.student}
          preselectedMonth={recordPaymentConfig.month}
          preselectedYear={recordPaymentConfig.year}
          onClose={() => setRecordPaymentConfig(null)}
          onOpenReceipt={(pmt) => setSelectedReceipt(pmt)}
        />
      )}

      {selectedReceipt && (
        <ReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
