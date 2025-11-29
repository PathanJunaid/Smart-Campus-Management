import React, { useState } from "react";
import { LoginUser } from "../../api/authApi";
import {toast} from "react-toastify";


export default function Login({ setIsLogin, onLoginSuccess }) {

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handlelogin = async () => {

      try {

        const data = await LoginUser(email, password);
        if(!data.success) {
          toast.error(data.message);
          return;
        }

        onLoginSuccess(data.data);
        toast.success("Login Successful");
        // console.log(data.user);


        localStorage.setItem("token", data.accessToken);
      } catch (error) {
        console.log(error.message);
        
      }
    }
 
  return (
    <div className="form-section">
      <h2>Login</h2>

      <input type="email" placeholder="Email" required onChange={(e)=>setEmail(e.target.value)}/>
      <input type="password" placeholder="Password"  required onChange={(e)=>setPassword(e.target.value)}/>

      <button className="primary-btn" onClick={handlelogin}>LOGIN</button>
      <p className="toggle-text">
        Don’t have an account?{" "}
        <span onClick={() => setIsLogin(false)}>Create Account</span>
      </p>
    </div>
  );
}
