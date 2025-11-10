import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./app.css";
import "./matrix.css";
import StarSky from "../components/starsky";

export default function MatrixPage() {
  const [active, setActive] = useState(false);
  const toggleMenu = () => setActive((prev) => !prev);

  return (
    <div className={`container ${active ? "active" : ""}`}>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="menu">
          <h3 className="logo">MatrIQ</h3>
          <div className="hamburger-menu" onClick={toggleMenu}>
            <div className="bar"></div>
          </div>
        </div>
      </div>

      {/* STAR BACKGROUND */}
      <div className="main-container">
        <div className="main">
          <div className="cosmic-container">
            <StarSky />

            <div className="main-content">
              <h1>Matrix View</h1>
              <p>Explore and interact with your knowledge matrices here.</p>
            </div>
          </div>
        </div>

        {/* SHADOWS */}
        <div className="shadow one"></div>
        <div className="shadow two"></div>
      </div>

      {/* SIDE MENU */}
      <div className="links">
        <ul>
          <li>
            <Link to="/" style={{ "--i": "0.05s" }}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/matrix" style={{ "--i": "0.15s" }}>
              Matrices
            </Link>
          </li>
          <li>
            <a href="#" style={{ "--i": "0.30s" }}>
              To Do
            </a>
          </li>
          <li>
            <a href="#" style={{ "--i": "0.45s" }}>
              Calendar
            </a>
          </li>
          <li>
            <a href="#" style={{ "--i": "0.60s" }}>
              Settings
            </a>
          </li>
          <li>
            <a href="#" style={{ "--i": "0.75s" }}>
              Log Out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
