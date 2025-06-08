import './App.css';
import Main from './components/Main';
import Login from './components/Login';
import Updates from './components/Updates';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/updates" element={
            <ProtectedRoute>
              <Updates />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
