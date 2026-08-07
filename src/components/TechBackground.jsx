import React, { useEffect, useRef } from 'react';

export default function TechBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Matrix Code / Floating Binary Bits & Microservice Network Nodes
    const symbols = ['0', '1', '{ }', 'java', 'kafka', 'redis', 'k8s', 'docker', '%', '01', '</>', 'REST API', 'microservices', 'AWS', 'Spring Boot', 'Java', 'maven', 'JWT', 'MySQL', 'Postgres', 'JPA', 'Jenkins', 'DynamoDB', 'CI/CD'];
    
    // Floating tech text particles
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      fontSize: Math.floor(Math.random() * 5) + 12,
      speedY: -(Math.random() * 0.4 + 0.18),
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.40 + 0.60, // Gently balanced opacity (25% - 55%)
    }));

    // Distributed Nodes for Network Lines
    const nodes = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.8,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Mesh Network Connections (Distributed Systems Nodes)
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;

        if (nodeA.x < 0 || nodeA.x > width) nodeA.vx *= -1;
        if (nodeA.y < 0 || nodeA.y > height) nodeA.vy *= -1;

        // Draw node pulse point
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)'; // Sky Blue dot
        ctx.beginPath();
        ctx.arc(nodeA.x, nodeA.y, nodeA.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect nodes within 170px proximity
          if (dist < 170) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.45 * (1 - dist / 170)})`; // Soft vivid Indigo Line (max 45%)
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // 2. Draw Floating Tech Code Particles (Matrix/SSE feel)
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Reset particle when floating past top
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
          p.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        }

        ctx.font = `${p.fontSize}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.fillText(p.symbol, p.x, p.y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
