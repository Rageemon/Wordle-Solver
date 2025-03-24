import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import TypeWriter from "@/components/ui/typeWriter.tsx";
import dict5 from "../../dict5.json";
import Confetti from "@/components/ui/confetti";

const Solver = () => {
  const initialRow = {
    otp: new Array(5).fill(""),
    greenIndexes: new Set<number>(),
    yellowIndexes: new Set<number>(),
    isEditable: true,
  };

  const [rows, setRows] = useState<Array<{
    otp: string[];
    greenIndexes: Set<number>;
    yellowIndexes: Set<number>;
    isEditable: boolean;
  }>>([initialRow]);

  const [posi, setPosi] = useState<boolean>(false);
  const [pre, setPre] = useState<boolean>(false);
  const [wordList, setWordList] = useState<string[]>(dict5.dict5);
  const [filteredWords, setFilteredWords] = useState<string[]>(dict5.dict5);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [currentWordSet, setCurrentWordSet] = useState<string[]>(["ADIEU"]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  useEffect(() => {
    if (showAnimation && filteredWords.length > 0) {
      const updateWords = () => {
        const shuffled = [...filteredWords]
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.min(5, filteredWords.length))
          .map(word => word.toUpperCase()); // Convert to uppercase
        setCurrentWordSet(shuffled);
      };

      updateWords(); // Initial set
      const interval = setInterval(updateWords, 8000); // Change every 8 seconds
      return () => clearInterval(interval);
    }
  }, [showAnimation, filteredWords]);

  const handleSubmit = () => {
    setRows(prevRows => {
      const newRows = prevRows.map((row, idx) =>
        idx === prevRows.length - 1 ? { ...row, isEditable: false } : row
      );
      newRows.push({
        otp: new Array(5).fill(""),
        greenIndexes: new Set(),
        yellowIndexes: new Set(),
        isEditable: true
      });
      return newRows;
    });

    const currentRow = rows[rows.length - 1];
    const currentSubmissionData = currentRow.otp.map((word, index) => ({
      word,
      position: currentRow.greenIndexes.has(index) ? index : null,
      present: currentRow.yellowIndexes.has(index) || currentRow.greenIndexes.has(index),
    }));

    console.log(currentSubmissionData);

    const filtered = filterByPosition(wordList, currentSubmissionData);
    setFilteredWords(filtered);
    setWordList(filtered);
    setShowAnimation(true);

    setTimeout(() => {
      const nextRowFirstInput = inputRefs.current[0];
      if (nextRowFirstInput) {
        nextRowFirstInput.focus();
      }
    }, 0);
  };

  const filterByPosition = (words: string[], submittedData: { word: string; position: number | null; present: boolean }[]) => {
    let filtered = words;
    const validSubmissions = submittedData.filter(data => data.word !== "");

    if (validSubmissions.length === 0) return filtered;

    const letterPresence = new Map<string, boolean>();
    validSubmissions.forEach(({ word: char, present }) => {
      if (present) {
        letterPresence.set(char, true);
      } else if (!letterPresence.has(char)) {
        letterPresence.set(char, false);
      }
    });

    filtered = filtered.filter(word =>
      validSubmissions.every(({ word: char, position }) =>
        position === null || word[position] === char
      )
    );

    filtered = filtered.filter(word =>
      validSubmissions.every(({ word: char, position, present }) =>
        present && position === null ? word.includes(char) : true
      )
    );

    filtered = filtered.filter(word =>
      Array.from(letterPresence.entries()).every(([char, mustBePresent]) =>
        mustBePresent ? word.includes(char) : !word.includes(char)
      )
    );

    return filtered;
  };

  const handleChange = (rowIndex: number, letterIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (!/^[a-z]$/.test(value) && value !== '') return;

    setRows(prevRows => {
      const newRows = [...prevRows];
      const newOtp = [...newRows[rowIndex].otp];
      newOtp[letterIndex] = value;
      newRows[rowIndex] = { ...newRows[rowIndex], otp: newOtp };
      return newRows;
    });

    if (value && letterIndex < 4) {
      inputRefs.current[letterIndex + 1]?.focus();
    }
  };

  const handleClick = (rowIndex: number, letterIndex: number) => {
    if (!rows[rowIndex].isEditable) return;

    setRows(prevRows => {
      const newRows = [...prevRows];
      const row = { ...newRows[rowIndex] };

      if (posi) {
        row.greenIndexes = new Set(row.greenIndexes).add(letterIndex);
        row.yellowIndexes = new Set(row.yellowIndexes);
        row.yellowIndexes.delete(letterIndex);
      } else if (pre) {
        row.yellowIndexes = new Set(row.yellowIndexes).add(letterIndex);
        row.greenIndexes = new Set(row.greenIndexes);
        row.greenIndexes.delete(letterIndex);
      } else {
        row.greenIndexes = new Set(row.greenIndexes);
        row.yellowIndexes = new Set(row.yellowIndexes);
        row.greenIndexes.delete(letterIndex);
        row.yellowIndexes.delete(letterIndex);
      }

      newRows[rowIndex] = row;
      return newRows;
    });
  };

  const handleKeyDown = (rowIndex: number, letterIndex: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && !rows[rowIndex].otp[letterIndex] && letterIndex > 0) {
      inputRefs.current[letterIndex - 1]?.focus();
    }
  };



  const resetGame = () => {
    setRows([initialRow]);
    setPosi(false);
    setPre(false);
    setWordList(dict5.dict5);
    setFilteredWords(dict5.dict5);
    setShowAnimation(false);
    setShowConfetti(false);
    setShowCongrats(false);
    setCurrentWordSet(["ADIEU"]); // Reset to "ADIEU"
  };

  const handleGotItClick = () => {
    setShowConfetti(true);
    setShowCongrats(true);
    setTimeout(() => {
      setShowConfetti(false);
      setShowCongrats(false);
      resetGame(); // Reset after animation
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#121213] p-4">
      {/* Header */}
      <div className="w-full max-w-lg border-b border-gray-700 pb-2 mb-8">
        <h1 className="text-3xl font-bold text-center text-white">Wordle Solver</h1>
      </div>

      {/* Game Grid */}
      <div className="grid gap-4 mb-8">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.otp.map((value, letterIndex) => {
              let tileStyle = "bg-transparent border-2 border-gray-600";
              if (row.greenIndexes.has(letterIndex)) {
                tileStyle = "bg-[#538d4e] border-[#538d4e] text-white";
              } else if (row.yellowIndexes.has(letterIndex)) {
                tileStyle = "bg-[#b59f3b] border-[#b59f3b] text-white";
              } else if (value && !row.isEditable) {
                tileStyle = "bg-[#3a3a3c] border-[#3a3a3c] text-white";
              }

              return (
                <input
                  key={letterIndex}
                  type="text"
                  ref={(input) => {
                    if (rowIndex === rows.length - 1) {
                      inputRefs.current[letterIndex] = input;
                    }
                  }}
                  value={value}
                  onClick={() => handleClick(rowIndex, letterIndex)}
                  onChange={(e) => handleChange(rowIndex, letterIndex, e)}
                  onKeyDown={(e) => handleKeyDown(rowIndex, letterIndex, e)}
                  disabled={!row.isEditable}
                  className={`w-14 h-14 text-center text-2xl font-bold uppercase transition-all duration-300 text-white
                    ${tileStyle} 
                    ${!row.isEditable ? 'opacity-100' : 'hover:border-gray-400'} 
                    focus:outline-none focus:border-gray-300`}
                  maxLength={1}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
        <Button
          onClick={() => {
            setPosi((prev) => !prev);
            setPre(false);
          }}
          className={`h-14 relative transition-all duration-300
            ${posi
              ? 'bg-[#538d4e] ring-4 ring-blue-500 hover:bg-[#6ba966]'
              : 'bg-[#538d4e] hover:bg-[#6ba966]'
            }`}
          aria-label="Green tile selector"
        />

        <Button
          onClick={() => {
            setPre((prev) => !prev);
            setPosi(false);
          }}
          className={`h-14 relative transition-all duration-300
            ${pre
              ? 'bg-[#b59f3b] ring-4 ring-blue-500 hover:bg-[#c9b557]'
              : 'bg-[#b59f3b] hover:bg-[#c9b557]'
            }`}
          aria-label="Yellow tile selector"
        />

        <Button
          onClick={handleSubmit}
          className="h-14 font-bold bg-gray-700 hover:bg-gray-600 col-span-2"
        >
          ENTER
        </Button>

        <Button
          onClick={handleGotItClick} // Updated to new handler
          className="h-14 font-bold bg-[#538d4e] hover:bg-[#437c3e] col-span-2"
        >
          Got it!
        </Button>
      </div>

      {/* Results */}
      <div className="text-white mt-4 text-center">
        {!showAnimation ? (
          <div className="text-xl font-bold mb-2">
            <TypeWriter words={["ADIEU"]} typingSpeed={50} />
          </div>
        ) : filteredWords.length > 0 ? (
          <div>
            <div className="text-xl font-bold mb-2">Suggested Words:</div>
            <TypeWriter 
              words={currentWordSet} // currentWordSet is now uppercase
              typingSpeed={50}
            />
          </div>
        ) : (
          <div className="text-xl font-bold">No words match the criteria</div>
        )}
        <div className="text-sm text-gray-400 mt-2">
          {filteredWords.length} possible words
        </div>
      </div>

      {/* Congratulatory Message */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="text-4xl font-bold text-white bg-black bg-opacity-70 px-6 py-4 rounded-lg
              animate-[fadeInOut_5s_ease-in-out]"
          >
            Congratulations!
          </div>
        </div>
      )}

      {/* Confetti */}
      {showConfetti && <Confetti />}
    </div>
  );
};



export default Solver;