"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  size: number;
}

export function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate shooting stars
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 15; i++) {
        newStars.push({
          id: i,
          startX: Math.random() * 100, // Random position in right 50%
          startY: Math.random() * 50, // Start from top half
          duration: 1.5 + Math.random() * 2, // 1.5-3.5 seconds
          delay: Math.random() * 5, // Stagger the starts
          size: 1 + Math.random() * 2, // 1-3px
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.startX}%`,
            top: `${star.startY}%`,
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
          }}
          animate={{
            x: [-200, -400],
            y: [0, 200],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "linear",
            times: [0, 0.1, 0.9, 1],
          }}
        />
      ))}
      
      {/* Add some shooting star trails */}
      {stars.slice(0, 5).map((star) => (
        <motion.div
          key={`trail-${star.id}`}
          className="absolute bg-gradient-to-r from-white to-transparent"
          style={{
            width: `${star.size * 30}px`,
            height: `${star.size}px`,
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            transformOrigin: "left center",
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            rotate: -45,
          }}
          animate={{
            x: [-200, -400],
            y: [0, 200],
            opacity: [0, 0.6, 0.6, 0],
            rotate: -45,
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "linear",
            times: [0, 0.1, 0.9, 1],
          }}
        />
      ))}
    </div>
  );
}
