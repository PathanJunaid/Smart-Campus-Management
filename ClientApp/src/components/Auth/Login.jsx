import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, reset } from "../../store/authSlice";
import { toast } from "react-toastify";

export default function Login({ setIsLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const {
    user,
    isLoading,
    isError,
    isSuccess,
    message,
    needsRegistration,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (needsRegistration) {
      toast.warning("You need to change your password.");
    }
    if (isSuccess || user) {
      // toast.success("Login Successful");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, needsRegistration, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear error for this field on change
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (
      formData.password.length < 8 ||
      formData.password.length > 20
    ) {
      newErrors.password = "Password must be between 8 to 20 letters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault(); // prevent default form submit

    if (!validate()) {
      return; // don't call API if validation fails
    }

    dispatch(loginUser({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="form-section">
      <h2>Login</h2>

      <form onSubmit={handleLogin} noValidate>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button
          className="primary-btn"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span className="ms-2">Loading...</span>
            </>
          ) : (
            "LOGIN"
          )}
        </button>
      </form>

      <p className="toggle-text">
        Don’t have an account?{" "}
        <span onClick={() => setIsLogin(false)}>Create Account</span>
      </p>
    </div>
  );
}
