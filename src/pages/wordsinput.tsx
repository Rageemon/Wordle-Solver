import { useEffect, useRef, useState } from "react";

interface WordsInputProps {
  length?: number;
  onOtpSubmit: (data: { word: string; position: number | null; present: boolean }[]) => void;
  posi: boolean;
  pre: boolean;
}

const WordsInput: React.FC<WordsInputProps> = ({ length = 4, onOtpSubmit, posi, pre }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [greenIndexes, setGreenIndexes] = useState<Set<number>>(new Set());
  const [yellowIndexes, setYellowIndexes] = useState<Set<number>>(new Set());
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    if (posi) {
      setGreenIndexes((prev) => new Set(prev).add(index));
      setYellowIndexes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    } else if (pre) {
      setYellowIndexes((prev) => new Set(prev).add(index));
      setGreenIndexes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    } else {
      setGreenIndexes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) newSet.delete(index);
        return newSet;
      });

      setYellowIndexes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) newSet.delete(index);
        return newSet;
      });
    }
  };


  const getSubmissionData = () => {
    return otp.map((word, index) => ({
      word,
      position: greenIndexes.has(index) ? index : null,
      present: yellowIndexes.has(index) || greenIndexes.has(index),
    }));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }

  };


  return (
    <div>
      {otp.map((value, index) => {
        let bgColor = "bg-white";
        if (greenIndexes.has(index)) {
          bgColor = "bg-green-500 text-white";
        } else if (yellowIndexes.has(index)) {
          bgColor = "bg-yellow-500 text-black";
        }

        return (
          <input
            key={index}
            type="text"
            ref={(input) => (inputRefs.current[index] = input)}
            value={value}
            onClick={() => handleClick(index)}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-10 h-10 m-1 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${bgColor}`}
          />
        );
      })}

      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={() => onOtpSubmit(getSubmissionData())}
      >
        Submit
      </button>
    </div>
  );
};

export default WordsInput;
