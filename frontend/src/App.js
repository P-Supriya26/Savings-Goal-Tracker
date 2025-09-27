import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import GoalsList from './components/GoalsList';
import GoalForm from './components/GoalForm';
import ChatBot from './components/ChatBot';
import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals" 
                element={
                  <ProtectedRoute>
                    <GoalsList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals/new" 
                element={
                  <ProtectedRoute>
                    <GoalForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals/:id/edit" 
                element={
                  <ProtectedRoute>
                    <GoalForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <ChatBot />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
