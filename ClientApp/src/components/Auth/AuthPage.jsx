import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="left-panel">
       <div>
         <h2>Welcome Back!</h2>
        <p>To keep connected with us please login with your personal info</p>
       </div>
       
      </div>

      <div className="right-panel">
        {isLogin ? <Login setIsLogin={setIsLogin} onLoginSuccess={onLoginSuccess} /> : <Signup setIsLogin={setIsLogin} />}
      </div>
    </div>
  );
}
