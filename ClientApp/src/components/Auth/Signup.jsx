import React, { useState } from "react";
import authService from "../../services/authService";
import { toast } from "react-toastify";
import "./Auth.css"; // Ensure CSS is imported if needed for styling icons

export default function Signup({ setIsLogin, isForgetPassword }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
    }
    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 8 || value.length > 20) error = "Password must be 8-20 characters";
    }
    if (name === "confirmPassword") {
      if (!value) error = "Confirm Password is required";
      else if (value !== password) error = "Passwords do not match";
    }
    if (name === "otp") {
      if (!value) error = "OTP is required";
      else if (value.length !== 6) error = "OTP must be 6 digits";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleStep1 = async () => {
    const emailError = validateField("email", email);
    if (emailError) return;

    setIsLoading(true);
    try {
      const data = await authService.signupStep1(email, isForgetPassword);
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setStep(2);
      toast.success("OTP sent to your email");
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2 = async () => {
    const otpError = validateField("otp", otp);
    const passwordError = validateField("password", password);
    const confirmPasswordError = validateField("confirmPassword", confirmPassword);

    if (otpError || passwordError || confirmPasswordError) return;

    setIsLoading(true);
    try {
      const data = await authService.signupStep2(email, password, otp, isForgetPassword);
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(isForgetPassword ? "Password Reset Successful. Please login." : "Signup Successful. Please login.");
      setIsLogin(true);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-section">
      <h2>{isForgetPassword ? "Forget Password" : (step === 1 ? "Verify Account" : "Verify Account")}</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField("email", e.target.value);
            }}
            required
          />
          {errors.email && <span className="error-text">{errors.email}</span>}

          <button className="primary-btn" onClick={handleStep1} disabled={isLoading}>
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Send OTP"
            )}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled // Email should typically be disabled in step 2
          />

          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i className="bi bi-eye-slash"></i>
              ) : (
                <i className="bi bi-eye"></i>
              )}
            </span>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}

          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateField("confirmPassword", e.target.value);
              }}
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <i className="bi bi-eye-slash"></i>
              ) : (
                <i className="bi bi-eye"></i>
              )}
            </span>
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

          <input
            type="number"
            placeholder="Enter OTP"
            value={otp}
            required
            onChange={(e) => {
              setOtp(e.target.value);
              validateField("otp", e.target.value);
            }}
          />
          {errors.otp && <span className="error-text">{errors.otp}</span>}

          <button className="primary-btn" onClick={handleStep2} disabled={isLoading}>
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              isForgetPassword ? "Reset Password" : "Verify & Signup"
            )}
          </button>
        </>
      )}

      <p className="toggle-text">
        {isForgetPassword ? (
          <span onClick={() => setIsLogin(true)}>Go to Login</span>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Login</span>
          </>
        )}
      </p>
    </div>
  );
}
