
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import AuthPage from './components/Auth/AuthPage'
import FacultyDashboard from './components/FacultyControllers/FacultyDashboard'
import StudentDashboard from './components/StudentControllers/StudentDashboard'
import ProtectedRoute from './components/ProtectedRoute';
import { checkAuth } from './store/authSlice';
import UserProfile from './components/UserProfile/UserProfile';


function App() {

  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      dispatch(checkAuth());
      setIsChecking(false);
    };
    verifyUser();
  }, [dispatch]);

  if (isChecking) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} />

      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          {user?.role === 2 && <StudentDashboard user={user} />}
          {user?.role === 1 && <FacultyDashboard user={user} />}
          {/* {user?.role === 0 && <AdminDashboard user={user} />} */}
        </ProtectedRoute>
      } />

      <Route path="/user/:id" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
