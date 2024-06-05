import React, { useState, useRef, useEffect } from 'react';
import Tilt from 'react-parallax-tilt';
import { Image } from '@chakra-ui/react'; // Import both Image and motion
import { motion, useAnimation } from 'framer-motion';

const TiltImage = ({ imageSrc, altText, ...tiltProps }) => {

  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation(); // Create an animation control

  const handleClick = () => {
    setIsAnimating(true);
    //onClick?.(); // Call the passed onClick handler if provided
  };

  useEffect(() => {
    if (isAnimating) {
      controls.start({ // Start the animation
        translateY: -50,
        opacity: 0,
      }).then(() => setIsAnimating(false)); // Reset state after animation
    }
  }, [isAnimating, controls]);
  
  return (
    <div onClick={handleClick}>
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
        <motion.div animate={controls} initial={{ translateY: 0, opacity: 1 }}>
          +1
        </motion.div>
      )}
    </div>
  );
};

export default TiltImage;