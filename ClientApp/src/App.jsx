
import {  useState } from 'react'
import './App.css'
import AuthPage from './components/Auth/AuthPage'
import FacultyDashboard from './components/FacultyControllers/FacultyDashboard'
import StudentDashboard from './components/StudentControllers/StudentDashboard'


function App() {

const [user, setUser] = useState(null);
const onLoginSuccess = (loggedInUser) => {
  setUser(loggedInUser);
}
  
  if (user) {
    if (user.role === 2) return <StudentDashboard user={user} />;
    if (user.role === 1) return <FacultyDashboard user={user} />;
    // if (user.role === 0) return <AdminDashboard user={user} />;
  }

  return <AuthPage onLoginSuccess={onLoginSuccess} />;
}

export default App;
