import React, { useRef, useEffect } from "react";

const StarSky = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");

    const MAX_SPEED = 0.15; // slower, smoother movement
    const CONNECTION_DIST = 100; // max distance for lines
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;

    let stars = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      c.width = width;
      c.height = height;

      const area = width * height;
      const numStars = Math.floor(area / 3000);

      if (stars.length !== numStars) {
        stars = Array.from({ length: numStars }, makeStar);
      } else {
        // just reposition existing stars
        stars.forEach((s) => {
          s.pos.x = Math.random() * width;
          s.pos.y = Math.random() * height;
        });
      }
    };

    const makeStar = () => ({
      radius: Math.random() * 2 + 0.5,
      pos: { x: Math.random() * width, y: Math.random() * height },
      vel: {
        x: (Math.random() - 0.5) * MAX_SPEED,
        y: (Math.random() - 0.5) * MAX_SPEED,
      },
      bigger: Math.random() > 0.5,
    });

    const drawStar = (star) => {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(star.pos.x, star.pos.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      // Pulsate
      star.radius += star.bigger ? 0.005 : -0.005;
      if (star.radius >= 3) star.bigger = false;
      if (star.radius <= 0.3) star.bigger = true;

      // Move with drift
      star.pos.x += star.vel.x;
      star.pos.y += star.vel.y;

      // Bounce off edges
      if (star.pos.x <= 0 || star.pos.x >= width) star.vel.x *= -1;
      if (star.pos.y <= 0 || star.pos.y >= height) star.vel.y *= -1;
    };

    const drawConnections = () => {
      for (let i = 0; i < stars.length; i++) {
        const s1 = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dx = s1.pos.x - s2.pos.x;
          const dy = s1.pos.y - s2.pos.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DIST_SQ) {
            const opacity = 1 - distSq / CONNECTION_DIST_SQ;
            ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.5})`;
            ctx.lineWidth = 0.25;
            ctx.beginPath();
            ctx.moveTo(s1.pos.x, s1.pos.y);
            ctx.lineTo(s2.pos.x, s2.pos.y);
            ctx.stroke();
          }
        }
      }
    };

    const drawBackground = () => {
      const grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, "#000");
      grd.addColorStop(0.5, "#135288");
      grd.addColorStop(1, "#0C5663");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);
    };

    const animate = () => {
      drawBackground();
      stars.forEach(drawStar);
      drawConnections();
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        zIndex: -1,
      }}
    />
  );
};

export default StarSky;
