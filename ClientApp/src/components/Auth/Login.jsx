import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, reset } from "../../store/authSlice";
import { toast } from "react-toastify";


export default function Login({ setIsLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message, needsRegistration } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (needsRegistration) {
      toast.warning("You need to change your password.");
      // Here you would typically redirect to a change password page
      // or show a modal. For now, we just show a warning.
    }
    if (isSuccess || user) {
      // toast.success("Login Successful"); 
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, needsRegistration, dispatch]);

  const handlelogin = async () => {
    dispatch(loginUser({ email, password }));
  }

  return (
    <div className="form-section">
      <h2>Login</h2>

      <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />

      <button
        className="primary-btn"
        onClick={handlelogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span className="ms-2">Loading...</span>
          </>
        ) : (
          "LOGIN"
        )}
      </button>

      <p className="toggle-text">
        Don’t have an account?{" "}
        <span onClick={() => setIsLogin(false)}>Create Account</span>
      </p>
    </div>
  );
}
