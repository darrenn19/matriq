import React, { useRef, useEffect } from "react";

const StarSky = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");

    const resizeCanvas = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const numStars =
      (Math.min(window.innerWidth, window.innerHeight) /
        Math.max(window.innerWidth, window.innerHeight)) *
      750;

    const makeStar = () => ({
      radius: Math.random() * (3 - 0.5) + 0.5,
      pos: {
        x: Math.random() * c.width,
        y: Math.random() * c.height,
      },
      moveTo: {
        x: Math.random() * c.width,
        y: Math.random() * c.height,
      },
      bigger: Math.random() > 0.5,
      speed: Math.random() * (c.width / c.height / 40),
    });

    const stars = Array.from({ length: numStars }, makeStar);

    const drawStar = (star) => {
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(star.pos.x, star.pos.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      // pulsate
      if (star.bigger) {
        star.radius += 0.01;
        if (star.radius >= 3) star.bigger = false;
      } else {
        star.radius -= 0.01;
        if (star.radius <= 0.3) star.bigger = true;
      }

      // move
      star.pos.x += star.moveTo.x > star.pos.x ? star.speed : star.moveTo.x < star.pos.x ? -star.speed : 0;
      star.pos.y += star.moveTo.y > star.pos.y ? star.speed : star.moveTo.y < star.pos.y ? -star.speed : 0;

      if (Math.abs(star.moveTo.x - star.pos.x) < 5) star.moveTo.x = Math.random() * c.width;
      if (Math.abs(star.moveTo.y - star.pos.y) < 5) star.moveTo.y = Math.random() * c.height;

      // draw connections
      stars.forEach((other) => {
        if (star !== other) {
          const dx = star.pos.x - other.pos.x;
          const dy = star.pos.y - other.pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 50) {
            ctx.beginPath();
            ctx.moveTo(star.pos.x, star.pos.y);
            ctx.lineTo(other.pos.x, other.pos.y);
            ctx.closePath();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 0.025;
            ctx.stroke();
          }
        }
      });
    };

    const drawBackground = () => {
      const grdnt = ctx.createLinearGradient(0, 0, 0, c.height);
      grdnt.addColorStop(0, "#000");
      grdnt.addColorStop(0.5, "#135288");
      grdnt.addColorStop(1, "#0C5663");
      ctx.fillStyle = grdnt;
      ctx.fillRect(0, 0, c.width, c.height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      drawBackground();
      stars.forEach(drawStar);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} id="sky" style={{ display: "block" }} />;
};

export default StarSky;
