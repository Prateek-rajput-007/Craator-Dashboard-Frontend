import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Toast from './components/Toast';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 3000);
  }, []);

  const handleLogin = useCallback((newToken, userRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', userRole);
    setToken(newToken);
    setRole(userRole);
    addToast('Logged in successfully!');
  }, [addToast]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    addToast('Logged out successfully!');
  }, [addToast]);

  const dashboardProps = useMemo(() => ({
    token,
    role,
    onLogout: handleLogout,
    addToast
  }), [token, role, handleLogout, addToast]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toast toasts={toasts} />
        <Switch>
          <Route path="/login">
            {!token ? (
              <AuthForm onLogin={handleLogin} addToast={addToast} />
            ) : (
              <Redirect to="/dashboard" />
            )}
          </Route>
          <Route path="/dashboard">
            {token ? (
              <Dashboard {...dashboardProps} />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route path="/">
            <Redirect to={token ? "/dashboard" : "/login"} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;