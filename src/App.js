import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Notestate from './context/notes/Notestate';
import { ThemeProvider } from './context/ThemeContext';
import { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Alert from './components/Alert';
import LandingPage from './components/public/LandingPage';
import AboutPage from './components/public/AboutPage';

// Redirects logged-in users away from auth pages
const GuestRoute = ({ element }) => {
  return localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : element;
};

function App() {
  const [alert, setAlert] = useState(null);

  const showalert = (message, type, autoDismiss = true) => {
    setAlert({ msg: message, type: type });
    if (autoDismiss) {
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const dismissAlert = () => setAlert(null);

  return (
    <ThemeProvider>
      <Notestate>
        <Router>
          <Alert Alert={alert} dismissAlert={dismissAlert} />
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Auth pages — redirect to dashboard if already logged in */}
            <Route path="/login"  element={<GuestRoute element={<Login  showalert={showalert} />} />} />
            <Route path="/signup" element={<GuestRoute element={<Signup showalert={showalert} />} />} />

            {/* Protected dashboard */}
            <Route path="/dashboard/*" element={<Dashboard showalert={showalert} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </Notestate>
    </ThemeProvider>
  );
}

export default App;
