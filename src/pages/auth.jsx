import React, { useState, useRef, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./nightScene.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState({});
  const [eyeTarget, setEyeTarget] = useState({ x: 0, y: 0 });
  const passwordRefs = useRef({});

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword(prev => {
      const newState = { ...prev, [field]: !prev[field] };
      if (newState[field] && passwordRefs.current[field]) {
        const input = passwordRefs.current[field];
        const rect = input.getBoundingClientRect();
        setEyeTarget({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
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

  const isAnyPasswordVisible = Object.values(showPassword).some(val => val);

  return (
    <div className="night-scene">
      <div className="sky">
        <div className="stars">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`star star-${i + 1}`}></div>
          ))}
        </div>
        <div className={`moon ${isAnyPasswordVisible ? 'eye-open' : ''}`} style={{ '--eye-x': `${eyeTarget.x}px`, '--eye-y': `${eyeTarget.y}px` }}>
          <div className="moon-eye">
            <div className="eye-white">
              <div className="iris">
                <div className="pupil"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          <form className={`auth-form ${isLogin ? "active" : ""}`} onSubmit={(e) => e.preventDefault()}>
            <h2>Welcome Back</h2>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                className="auth-input"
              />
            </div>

            <div className="input-group password-group">
              <input
                ref={el => passwordRefs.current.loginPassword = el}
                type={showPassword.loginPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('loginPassword')}
              >
                {showPassword.loginPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <button type="submit" className="auth-btn">Login</button>
          </form>

          <form className={`auth-form ${!isLogin ? "active" : ""}`} onSubmit={(e) => e.preventDefault()}>
            <h2>Create Account</h2>

            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                className="auth-input"
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                className="auth-input"
              />
            </div>

            <div className="input-group password-group">
              <input
                ref={el => passwordRefs.current.signupPassword = el}
                type={showPassword.signupPassword ? "text" : "password"}
                placeholder="Password"
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('signupPassword')}
              >
                {showPassword.signupPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <div className="input-group password-group">
              <input
                ref={el => passwordRefs.current.confirmPassword = el}
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showPassword.confirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            <button type="submit" className="auth-btn">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
