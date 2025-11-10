import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./app.css";

export default function Dashboard() {
  const [active, setActive] = useState(false);
  const toggleMenu = () => setActive((prev) => !prev);

  useEffect(() => {
    // PARTICLE BACKGROUND SCRIPT
    const container = document.querySelector(".particle-field");
    const colorBtn = document.getElementById("color-btn");
    const flowBtn = document.getElementById("flow-btn");

    if (!container) return;

    let particles = [];
    let colorScheme = 0;
    let flowPattern = 0;
    const colorSchemes = [
      ["#ff00cc", "#3333ff", "#00ccff"],
      ["#00ff88", "#ffcc00", "#ff6600"],
      ["#9d00ff", "#00ffea", "#ff0066"],
      ["#ff0000", "#ffff00", "#00ff00"],
    ];

    function createParticles(count) {
      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        const x = Math.random() * 100;
        const y = Math.pow(Math.random(), 10) * 100;
        const size = Math.random() * 4 + 2;
        particle.style.left = `${x}vw`;
        particle.style.top = `${y}vh`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = getRandomColor();
        particle.style.opacity = Math.random() * 0.7 + 0.3;
        setParticleAnimation(particle);
        container.appendChild(particle);
        particles.push({ element: particle, x, y, size });
      }
    }

    function getRandomColor() {
      const scheme = colorSchemes[colorScheme];
      return scheme[Math.floor(Math.random() * scheme.length)];
    }

    function setParticleAnimation(particle) {
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * -20;

      switch (flowPattern) {
        case 0:
          particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
          break;
        case 1:
          particle.style.animation = `flow ${duration}s ease-in-out ${delay}s infinite alternate`;
          break;
        case 2:
          particle.style.animation = `spiral ${duration}s ease-in-out ${delay}s infinite alternate`;
          break;
        default:
          break;
      }
    }

    function clearParticles() {
      particles.forEach((p) => p.element.remove());
      particles = [];
    }

    createParticles(150);

    colorBtn?.addEventListener("click", () => {
      colorScheme = (colorScheme + 1) % colorSchemes.length;
      particles.forEach((p) => (p.element.style.background = getRandomColor()));
    });

    flowBtn?.addEventListener("click", () => {
      flowPattern = (flowPattern + 1) % 3;
      particles.forEach((p) => setParticleAnimation(p.element));
    });

    container.addEventListener("mousemove", (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 100;
      const mouseY = (e.clientY / window.innerHeight) * 100;

      particles.forEach((p) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          const force = (20 - distance) / 2;
          const angle = Math.atan2(dy, dx);
          p.element.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`;
        } else {
          p.element.style.transform = "";
        }
      });
    });

    window.addEventListener("resize", () => {
      particles.forEach((p) => {
        p.element.style.left = `${p.x}vw`;
        p.element.style.top = `${p.y}vh`;
      });
    });

    return () => {
      clearParticles();
    };
  }, []);

  return (
    <div className={`container ${active ? "active" : ""}`}>
      {/*  NAVBAR */}
      <div className="navbar">
        <div className="menu">
          <h3 className="logo">MatrIQ</h3>
          <div className="hamburger-menu" onClick={toggleMenu}>
            <div className="bar"></div>
          </div>
        </div>
      </div>

      {/*  MAIN COSMIC BACKGROUND */}
      <div className="main-container">
        <div className="main">
          <div className="cosmic-container">
            {/* BACKGROUND PARTICLES */}
            <div className="particle-field"></div>

            {/* MAIN CONTENT (Front layer) */}
            <div className="main-content">
              <h1>MatrIQ</h1>
              <p>
                Organize and visualize everything you know in Matrices
              </p>
            </div>

            {/* CONTROL BUTTONS */}
            <div className="controls">
              <button id="color-btn">Change Colours</button>
              <button id="flow-btn">Change Flow</button>
            </div>
          </div>
        </div>

        {/* Shadows stay for 3D effect */}
        <div className="shadow one"></div>
        <div className="shadow two"></div>
      </div>

      {/* SIDE LINKS MENU */}
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
              Portfolio
            </a>
          </li>
          <li>
            <a href="#" style={{ "--i": "0.45s" }}>
              Testimonials
            </a>
          </li>
          <li>
            <a href="#" style={{ "--i": "0.60s" }}>
              About
            </a>
          </li>
          <li>
            <a href="#" style={{ "--i": "0.75s" }}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
