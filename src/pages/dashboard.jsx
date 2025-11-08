import React, { useEffect, useState } from "react";
import "./app.css"; // We'll include the CSS next — keep this import

export default function App() {
  const [colorScheme, setColorScheme] = useState(0);
  const [flowPattern, setFlowPattern] = useState(0);
  const [motionPaused, setMotionPaused] = useState(false);

  useEffect(() => {
    const container = document.querySelector(".particle-field");
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let particles = [];
    const colorSchemes = [
      ["#ff00cc", "#3333ff", "#00ccff"],
      ["#00ff88", "#ffcc00", "#ff6600"],
      ["#9d00ff", "#00ffea", "#ff0066"],
      ["#ff0000", "#ffff00", "#00ff00"],
    ];

    const particleCount =
      window.innerWidth < 600
        ? 60
        : window.innerWidth < 1200
        ? 100
        : 150;

    function getRandomColor(schemeIndex = 0) {
      const scheme = colorSchemes[schemeIndex];
      return scheme[Math.floor(Math.random() * scheme.length)];
    }

    function setParticleAnimation(particle, pattern) {
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * -20;
      let animationType = "";
      switch (pattern) {
        case 0:
          animationType = `float ${duration}s linear ${delay}s infinite`;
          break;
        case 1:
          animationType = `flow ${duration}s ease-in-out ${delay}s infinite alternate`;
          break;
        case 2:
          animationType = `spiral ${duration}s ease-in-out ${delay}s infinite alternate`;
          break;
        default:
          break;
      }
      particle.style.animation = animationType;
    }

    function createParticles(count) {
      for (let i = 0; i < count; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 4 + 2;

        particle.style.left = `${x}vw`;
        particle.style.top = `${y}vh`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = getRandomColor(colorScheme);
        particle.style.opacity = Math.random() * 0.7 + 0.3;

        setParticleAnimation(particle, flowPattern);

        container.appendChild(particle);
        particles.push({ element: particle, x, y });
      }
    }

    createParticles(particleCount);

    container.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      container.style.transform = `translate(${x}px, ${y}px)`;
    });

    window.addEventListener("resize", () => {
      particles.forEach((p) => {
        p.element.style.left = `${p.x}vw`;
        p.element.style.top = `${p.y}vh`;
      });
    });

    return () => {
      particles.forEach((p) => p.element.remove());
      particles = [];
    };
  }, []);

  // When color or flow scheme changes
  useEffect(() => {
    const particles = document.querySelectorAll(".particle");
    const colorSchemes = [
      ["#ff00cc", "#3333ff", "#00ccff"],
      ["#00ff88", "#ffcc00", "#ff6600"],
      ["#9d00ff", "#00ffea", "#ff0066"],
      ["#ff0000", "#ffff00", "#00ff00"],
    ];

    function getRandomColor(schemeIndex) {
      const scheme = colorSchemes[schemeIndex];
      return scheme[Math.floor(Math.random() * scheme.length)];
    }

    particles.forEach((p) => {
      p.style.background = getRandomColor(colorScheme);
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * -20;
      let animationType = "";
      switch (flowPattern) {
        case 0:
          animationType = `float ${duration}s linear ${delay}s infinite`;
          break;
        case 1:
          animationType = `flow ${duration}s ease-in-out ${delay}s infinite alternate`;
          break;
        case 2:
          animationType = `spiral ${duration}s ease-in-out ${delay}s infinite alternate`;
          break;
        default:
          break;
      }
      p.style.animation = animationType;
    });
  }, [colorScheme, flowPattern]);

  useEffect(() => {
    const particles = document.querySelectorAll(".particle");
    particles.forEach((p) => {
      p.style.animationPlayState = motionPaused ? "paused" : "running";
    });
  }, [motionPaused]);

  const [panelOpen, setPanelOpen] = useState(false);



  return (
    <div className="cosmic-container">
      <div className="particle-field" aria-hidden="true"></div>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        <h1>MatrIQ</h1>
        <p>
          PLACE MAIN CONTENT HERE. AREA IS FULLY RESPONSIVE AND SITS ABOVE THE
          COSMIC BACKGROUND.
        </p>
      </div>

      {/* SETTINGS BUTTON */}
      <button
        className="settings-btn"
        onClick={() => setPanelOpen(!panelOpen)}
        aria-label="Settings"
      >
        ⚙️
      </button>

      {/* SETTINGS PANEL */}
      <div className={`settings-panel ${panelOpen ? "open" : ""}`}>
        <button onClick={() => setColorScheme((prev) => (prev + 1) % 4)}>
          Change Colors
        </button>
        <button onClick={() => setFlowPattern((prev) => (prev + 1) % 3)}>
          Change Flow
        </button>
        <button onClick={() => setMotionPaused((prev) => !prev)}>
          {motionPaused ? "Resume Motion" : "Pause Motion"}
        </button>
      </div>
    </div>
  );
}
