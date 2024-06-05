import React, { useState, useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { Image, Text } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';

const TiltImage = ({ imageSrc, altText, ...tiltProps }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const containerRef = useRef(null); // Ref for the container
  const isTouchEventRef = useRef(false); // Ref to track if it's a touch event

  const handleClick = (event) => {
    setIsAnimating(true);
    const rect = containerRef.current.getBoundingClientRect(); // Use container's bounding rect
    setClickPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  useEffect(() => {
    if (isAnimating) {
      controls.start({
        y: [clickPosition.y - 50, clickPosition.y - 100],
        opacity: [1, 0],
        transition: {
          duration: 0.5,
          ease: "easeInOut",
        },
      }).then(() => setIsAnimating(false));
    }
  }, [isAnimating, controls, clickPosition]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }} onClick={handleClick}>
      <Tilt {...tiltProps}>
        <Image
          boxSize="300px"
          src={imageSrc}
          alt={altText}
          onClick={handleClick}
        />
      </Tilt>
      {isAnimating && (
        <motion.div
          animate={controls}
          initial={{ y: clickPosition.y, opacity: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: clickPosition.x,
            transform: 'translate(-50%, -50%)',
            color: 'white',
          }}
        >
          <Text fontSize='4xl'>
          +1
          </Text>
        </motion.div>
      )}
    </div>
  );
};

export default TiltImage;
