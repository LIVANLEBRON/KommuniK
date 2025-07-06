import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import TeacherPanel from './pages/TeacherPanel';
import StudentDashboard from './pages/StudentDashboard';
import Assignments from './pages/Assignments';
import Messages from './pages/Messages';
import Materials from './pages/Materials';

// Styles
import './styles/App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando KommuniK Academy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        {user && <Navbar />}
        <main className={user ? 'main-content' : 'main-content-full'}>
          <Routes>
            {/* Rutas públicas */}
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/dashboard" />} 
            />
            
            {/* Rutas protegidas */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/teacher-panel" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherPanel />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin-panel" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/courses/:id" 
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/assignments" 
              element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/materials" 
              element={
                <ProtectedRoute>
                  <Materials />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta por defecto */}
            <Route 
              path="/" 
              element={
                user ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            
            {/* Ruta 404 */}
            <Route 
              path="*" 
              element={
                <div className="not-found">
                  <h1>404 - Página no encontrada</h1>
                  <p>La página que buscas no existe.</p>
                  <button 
                    onClick={() => window.history.back()}
                    className="btn btn-primary"
                  >
                    Volver
                  </button>
                </div>
              } 
            />
          </Routes>
        </main>
      </Router>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#4ade80',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;