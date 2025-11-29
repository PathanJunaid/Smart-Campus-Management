import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container row m-0">
      <div className="left-panel col-md-6 d-none d-md-flex text-center">
       <div>
         <h2>Welcome Back!</h2>
        <p>To keep connected with us please login with your personal info</p>
       </div>
       
      </div>

      <div className="right-panel col-md-6 text-center">
        {isLogin ? <Login setIsLogin={setIsLogin} onLoginSuccess={onLoginSuccess} /> : <Signup setIsLogin={setIsLogin} />}
      </div>
    </div>
  );
}
