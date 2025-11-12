import React, { useState, useRef, useCallback, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import "./nightScene.css";

// ✅ Popup component — works even if you have no CSS for it
const Popup = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      className="popup-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
      onClick={onClose}
    >
      <div
        className="popup-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: type === "error" ? "#ff4444" : type === "success" ? "#4CAF50" : "#333",
          color: "#fff",
          padding: "1.5rem 2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          textAlign: "center",
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "transform 0.2s ease-out",
          minWidth: "260px",
        }}
      >
        <p style={{ marginBottom: "1rem", fontSize: "1rem" }}>{message}</p>
        <button
          onClick={onClose}
          style={{
            background: "#fff",
            color: type === "error" ? "#ff4444" : "#4CAF50",
            border: "none",
            borderRadius: "6px",
            padding: "0.4rem 1rem",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState({});
  const [eyeTarget, setEyeTarget] = useState({ x: 0, y: 0 });
  const [popup, setPopup] = useState({ message: "", type: "" });
  const passwordRefs = useRef({});

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword((prev) => {
      const newState = { ...prev, [field]: !prev[field] };
      if (newState[field] && passwordRefs.current[field]) {
        const input = passwordRefs.current[field];
        const rect = input.getBoundingClientRect();
        setEyeTarget({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
      return newState;
    });
  }, []);

  const handleTabChange = useCallback((loginState) => {
    setIsLogin(loginState);
    setShowPassword({});
    setEyeTarget({ x: 0, y: 0 });
  }, []);

  const closePopup = () => setPopup({ message: "", type: "" });
  const showPopup = (message, type = "info") => setPopup({ message, type });

  const isAnyPasswordVisible = Object.values(showPassword).some((val) => val);

  // ✅ Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showPopup(error.message, "error");
    } else {
      window.location.href = "#/";
    }
  };

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    const full_name = e.target.full_name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirm = e.target.confirm.value.trim();

    if (password !== confirm) {
      showPopup("Passwords do not match!", "error");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      showPopup(error.message, "error");
    } else {
      const user = data.user;
      if (user) {
        await supabase.from("profiles").insert({
          id: user.id,
          full_name,
          email,
        });
      }
      showPopup("Account created! Check your email for confirmation.", "success");
      Navigate("/");
    }
  };

  return (
    <div className="night-scene">
      {/* 🌙 Sky */}
      <div className="sky">
        <div className="stars">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`star star-${i + 1}`}></div>
          ))}
        </div>
        <div
          className={`moon ${isAnyPasswordVisible ? "eye-open" : ""}`}
          style={{ "--eye-x": `${eyeTarget.x}px`, "--eye-y": `${eyeTarget.y}px` }}
        >
          <div className="moon-eye">
            <div className="eye-white">
              <div className="iris">
                <div className="pupil"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🏔️ Scene */}
      <div className="mountains">
        <div className="mountain mountain-1"></div>
        <div className="mountain mountain-2"></div>
        <div className="mountain mountain-3"></div>
      </div>

      <div className="forest">
        <div className="tree-layer layer-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={`tree tree-${n}`}></div>
          ))}
        </div>
        <div className="tree-layer layer-2">
          {[6, 7, 8, 9].map((n) => (
            <div key={n} className={`tree tree-${n}`}></div>
          ))}
        </div>
        <div className="tree-layer layer-3">
          {[10, 11, 12].map((n) => (
            <div key={n} className={`tree tree-${n}`}></div>
          ))}
        </div>
      </div>

      <div className="ground"></div>

      {/* 🔐 Auth Box */}
      <div className="auth-box">
        <div className="auth-tabs">
          <button
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => handleTabChange(true)}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => handleTabChange(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-content">
          {/* LOGIN FORM */}
          <form
            className={`auth-form ${isLogin ? "active" : ""}`}
            onSubmit={handleLogin}
          >
            <h2>Welcome Back</h2>
            <div className="input-group">
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="auth-input"
                required
              />
            </div>

            <div className="input-group password-group">
              <input
                name="password"
                ref={(el) => (passwordRefs.current.loginPassword = el)}
                type={showPassword.loginPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("loginPassword")}
              >
                {showPassword.loginPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          {/* SIGNUP FORM */}
          <form
            className={`auth-form ${!isLogin ? "active" : ""}`}
            onSubmit={handleSignup}
          >
            <h2>Create Account</h2>

            <div className="input-group">
              <input
                name="full_name"
                type="text"
                placeholder="Full Name"
                className="auth-input"
                required
              />
            </div>

            <div className="input-group">
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="auth-input"
                required
              />
            </div>

            <div className="input-group password-group">
              <input
                name="password"
                ref={(el) => (passwordRefs.current.signupPassword = el)}
                type={showPassword.signupPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("signupPassword")}
              >
                {showPassword.signupPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <div className="input-group password-group">
              <input
                name="confirm"
                ref={(el) => (passwordRefs.current.confirmPassword = el)}
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="auth-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showPassword.confirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/*Custom Popup */}
      <Popup message={popup.message} type={popup.type} onClose={closePopup} />
    </div>
  );
};

export default Auth;
