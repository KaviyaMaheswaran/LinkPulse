import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import Redirect from './pages/Redirect';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div class="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative">
          
          {/* Header Navigation */}
          <Navbar />
          
          {/* Primary View Router */}
          <main class="flex-grow flex flex-col relative z-10">
            <Routes>
              {/* Authenticated Routes */}
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/analytics/:id" 
                element={
                  <PrivateRoute>
                    <Analytics />
                  </PrivateRoute>
                } 
              />

              {/* Public Authentications */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Fallbacks */}
              <Route path="/404" element={<NotFound />} />
              <Route path="/:shortCode" element={<Redirect />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          
          {/* Footer Panel */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
