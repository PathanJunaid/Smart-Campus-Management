import React, { useState } from "react";
import { signupStep1, signupStep2 } from "../../api/authApi";
import {toast} from "react-toastify";


export default function Signup({ setIsLogin }) {

  const [step,setStep] = useState(1);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [otp,setOtp] = useState("");

  const handleStep1= async()=> {
    try {
      const data = await signupStep1(email);
      if(!data.success) {
        toast.error(data.message);
        return;

      }
      setStep(2);
      toast.success("OTP sent to your email");
      
    } catch (error) {
      console.log(error.message);
    }
  }


  const handleStep2=async() => {
    try {
      const data = await signupStep2(email, password, otp);
      if(!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("Signup Successful. Please login.");
      setIsLogin(true);
    } catch(error) {
      console.log(error.message);
    }
  }


  return (
    <div className="form-section">
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="primary-btn" onClick={handleStep1}>
            Send OTP
          </button>
        </>
      )}

      {step===2 && (
        <>
        <input type="email" 
         value={email}
         required
         onChange={(e)=>setEmail(e.target.value)}

        />

        <input type="password" 
         value={password}
         required
         onChange={(e)=>setPassword(e.target.value)}
        />

        <input type="number" 
         placeholder="Enter OTP"
         value={otp}
         required
         onChange={(e)=>setOtp(e.target.value)}
        />

        <button className="primary-btn" onClick={handleStep2}>
            verify & Signup
          </button>
        </>
      )}

      <p className="toggle-text">
        Already have an account?{" "}
        <span onClick={() => setIsLogin(true)}>Login</span>
      </p>
    </div>
  );
}
