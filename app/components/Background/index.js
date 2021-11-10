import React from 'react';
import Particles from 'react-tsparticles';

function Background() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fpsLimit: 60,
        backgroundMask: {
          composite: 'destination-over',
          cover: {
            color: {
              value: '#000000',
            },
            opacity: 0.1,
          },
          enable: true,
        },
        modes: {
          bubble: {
            distance: 400,
            duration: 2,
            opacity: 0.8,
            size: 20,
          },
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
        particles: {
          color: {
            value: ['#c0aef5', '#b0e2ff'],
          },
          links: {
            color: ['#c0aef5', '#b0e2ff'],
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: 'none',
            enable: true,
            outMode: 'bounce',
            random: true,
            speed: 0.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              value_area: 800,
            },
            value: 50,
          },
          shape: {
            type: 'circle',
          },
          size: {
            random: true,
            value: 4,
          },
        },
      }}
    />
  );
}

export default Background;
