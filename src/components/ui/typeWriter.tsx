import React, { useState, useEffect } from 'react';

interface TypeWriterProps {
  words: string[];
  typingSpeed?: number;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  words,
  typingSpeed = 50
}) => {
  const [displayedTexts, setDisplayedTexts] = useState<string[]>(new Array(words.length).fill(''));
  const [charIndices, setCharIndices] = useState<number[]>(new Array(words.length).fill(0));

  useEffect(() => {
    setDisplayedTexts(new Array(words.length).fill(''));
    setCharIndices(new Array(words.length).fill(0));
  }, [words]);

  useEffect(() => {
    if (words.length === 0) return;

    const timers: NodeJS.Timeout[] = [];

    words.forEach((word, wordIndex) => {
      if (charIndices[wordIndex] < word.length) {
        const timer = setTimeout(() => {
          setDisplayedTexts(prev => {
            const newTexts = [...prev];
            newTexts[wordIndex] = word.slice(0, charIndices[wordIndex] + 1);
            return newTexts;
          });
          setCharIndices(prev => {
            const newIndices = [...prev];
            newIndices[wordIndex] = prev[wordIndex] + 1;
            return newIndices;
          });
        }, typingSpeed * (wordIndex + 1));
        timers.push(timer);
      }
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [words, charIndices, typingSpeed]);

  return (
    <div className="flex flex-wrap gap-4 justify-center text-white font-mono">
      {displayedTexts.map((text, index) => (
        <div key={index} className="min-w-[5ch] text-center">
          {text}
          {text === words[index] ? '' : <span className="animate-blink">|</span>}
        </div>
      ))}
    </div>
  );
};

export default TypeWriter;