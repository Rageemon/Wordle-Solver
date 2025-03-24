import React from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const Confetti: React.FC = () => {
  const { width, height } = useWindowSize();
  
  return (
    <ReactConfetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.3}
    />
  );
};

export default Confetti;