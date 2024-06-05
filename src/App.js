import React, { useState } from 'react';
import {useHapticFeedback} from "@vkruglikov/react-telegram-web-app";

function App() {

  const [impactOccurred, notificationOccurred, selectionChanged] = useHapticFeedback();
  
  const [boxColor, setBoxColor] = useState('#007bff'); // initial color

  const handleTap = () => {
    console.log('Tapped!')
    
    impactOccurred("medium");
    const newColor = getRandomColor(); // generate a random color
    setBoxColor(newColor); // update the box color    //navigator.vibrate(100); // vibrate for 100ms
  };

  // helper function to generate a random color
  function getRandomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <div
      onTouchStart={handleTap}
      onClick={handleTap}
      style={{
        width: 200,
        height: 200,
        backgroundColor: boxColor,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer' // add a pointer cursor on hover
      }}
    >
      <span style={{ fontSize: 24, color: '#fff' }}>Tap mee!</span>
    </div>
  );
}

export default App;