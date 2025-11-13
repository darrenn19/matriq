import React, { useState, useRef, useCallback, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import "./nightScene.css";

// Popup component
const Popup = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!message);
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
          background:
            type === "error"
              ? "#ff4444"
              : type === "success"
              ? "#4CAF50"
              : "#333",
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

  // Toggle password visibility and update moon target to marker
  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword((prev) => {
      const newState = { ...prev, [field]: !prev[field] };

      if (newState[field]) {
        const marker = document.querySelector(
          `.beam-marker[data-field="${field}"]`
        );
        if (marker) {
          const rect = marker.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          setEyeTarget({ x: centerX, y: centerY });
        }
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

  // 🌙 Responsive moon-beam target tracking
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!isAnyPasswordVisible) return;

      const activeField = Object.keys(showPassword).find((f) => showPassword[f]);
      if (!activeField) return;

      const marker = document.querySelector(`.beam-marker[data-field="${activeField}"]`);
      if (marker) {
        const rect = marker.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setEyeTarget({ x: centerX, y: centerY });
      }
    });

    document.querySelectorAll(".beam-marker").forEach((m) => observer.observe(m));

    const handleResize = () => {
      const activeField = Object.keys(showPassword).find((f) => showPassword[f]);
      if (!activeField) return;
      const marker = document.querySelector(`.beam-marker[data-field="${activeField}"]`);
      if (marker) {
        const rect = marker.getBoundingClientRect();
        setEyeTarget({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [showPassword, isAnyPasswordVisible]);

  // 🪄 Moon beam movement + transform animation
  useEffect(() => {
    const moon = document.querySelector(".moon");
    const beam = document.querySelector(".moon-beam");
    if (!moon || !beam) return;

    const updateBeam = () => {
      const moonRect = moon.getBoundingClientRect();
      const moonCenterX = moonRect.left + moonRect.width / 2;
      const moonCenterY = moonRect.top + moonRect.height / 2;

      if (!isAnyPasswordVisible) {
        beam.style.transform = `translateX(-50%) rotate(90deg) scaleY(0)`;
        return;
      }

      const dx = eyeTarget.x - moonCenterX;
      const dy = eyeTarget.y - moonCenterY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxBeamLength = 800;
      const scaleY = Math.min(distance / maxBeamLength, 1);

      beam.style.transform = `translateX(-50%) rotate(${angle - 90}deg) scaleY(${scaleY})`;
    };

    updateBeam();
    window.addEventListener("resize", updateBeam);
    return () => window.removeEventListener("resize", updateBeam);
  }, [eyeTarget, isAnyPasswordVisible]);

  // 🧩 Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) showPopup(error.message, "error");
    else window.location.href = "#/";
  };

  // 🧩 Signup
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

    if (error) showPopup(error.message, "error");
    else {
      const user = data.user;
      if (user) {
        await supabase.from("profiles").insert({
          id: user.id,
          full_name,
          email,
        });
      }
      showPopup("Account created! Check your email for confirmation.", "success");
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
          <div className={`moon-beam ${isAnyPasswordVisible ? "active" : ""}`}></div>
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

            <div className="input-group password-group" style={{ position: "relative" }}>
              <input
                name="password"
                ref={(el) => (passwordRefs.current.loginPassword = el)}
                type={showPassword.loginPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input"
                required
              />
              <div className="beam-marker" data-field="loginPassword"></div>
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

            <div className="input-group password-group" style={{ position: "relative" }}>
              <input
                name="password"
                ref={(el) => (passwordRefs.current.signupPassword = el)}
                type={showPassword.signupPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input"
                required
              />
              <div className="beam-marker" data-field="signupPassword"></div>
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("signupPassword")}
              >
                {showPassword.signupPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <div className="input-group password-group" style={{ position: "relative" }}>
              <input
                name="confirm"
                ref={(el) => (passwordRefs.current.confirmPassword = el)}
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="auth-input"
                required
              />
              <div className="beam-marker" data-field="confirmPassword"></div>
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

      <Popup message={popup.message} type={popup.type} onClose={closePopup} />
    </div>
  );
};

export default Auth;
