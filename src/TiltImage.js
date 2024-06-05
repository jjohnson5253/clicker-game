import React, { useState, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { Image } from '@chakra-ui/react'; // Import both Image and motion
import { motion, useAnimation } from 'framer-motion';

const TiltImage = ({ imageSrc, altText, ...tiltProps }) => {

  const [isAnimating, setIsAnimating] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 }); // Store the click position
  const controls = useAnimation(); // Create an animation control

  const handleClick = (event) => {
    setIsAnimating(true);
    const rect = event.target.getBoundingClientRect();
    setClickPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top }); // Update the click position relative to the element
  };

  useEffect(() => {
    if (isAnimating) {
      controls.start({
        y: [clickPosition.y, clickPosition.y - 50], // Move upwards 50px
        opacity: [1, 0], // Fade to 0
        transition: {
          duration: 0.5, // Change the animation duration to 0.5 seconds
          ease: "easeInOut", // Optional: change the animation easing
        }
      }).then(() => setIsAnimating(false)); // Start the animation
    }
  }, [isAnimating, controls, clickPosition]);

  return (
    <div style={{ position: 'relative' }} onClick={handleClick}>
      <Tilt {...tiltProps}>
        <Image
          borderRadius="full"
          boxSize="150px"
          src={imageSrc}
          alt={altText}
          onTouchStart={handleClick}
          onClick={handleClick}
        />
      </Tilt>
      {isAnimating && (
        <motion.div
          animate={controls}
          initial={{ y: clickPosition.y, opacity: 1 }}
          style={{
            position: 'absolute', // Make the animation text absolute
            top: 0, // Start from the top of the container
            left: clickPosition.x, // Align the text horizontally based on click
            transform: 'translate(-50%, -50%)', // Center the text
            color: 'white', // Optional: set text color
          }}
        >
          +1
        </motion.div>
      )}
    </div>
  );
};

export default TiltImage;
