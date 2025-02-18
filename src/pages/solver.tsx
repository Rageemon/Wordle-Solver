import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import WordsInput from "./wordsinput.tsx";
import dict5 from "../../dict5.json"; // Import JSON

const Solver = () => {
  const [wordsInput, setWordsInput] = useState<number[]>([1]);
  const [posi, setPosi] = useState<boolean>(false);
  const [pre, setPre] = useState<boolean>(false);

  const handleOtpSubmit = (data: { word: string; position: number | null; present: boolean }[]) => {
    const wordList = dict5.dict5; // Correctly access words list

    console.log("Submitted Data:", data);
    console.log("Words Matching Position:", filterByPosition(wordList, data));
  };

  const filterByPosition = (words: string[], submittedData: { word: string; position: number | null; present: boolean }[]) => {
    let WORDS = words.filter(word =>
      submittedData.every(({ word: char, position }) =>
        position === null || word[position] === char
      )
    );
    

    WORDS = WORDS.filter(word =>
      submittedData.every(({ word: char, position, present }) =>
        present && position === null ? word.includes(char) && word.indexOf(char) !== position : true
      )
    );
   
    WORDS = WORDS.filter(word =>
      submittedData.every(({ word: char, present }) =>
        present === false ? !word.includes(char) : true
      )
    );
  
    return WORDS;
  };
  

 

  return (
    <div className="flex flex-col items-center h-screen">
      {wordsInput.map((_, index) => (
        <WordsInput key={index} length={5} posi={posi} pre={pre} onOtpSubmit={handleOtpSubmit} />
      ))}

      <Button
        onClick={() => {
          handleOtpSubmit([]);
          setWordsInput([...wordsInput, 1]);
        }}
      >
        Add more
      </Button>

      <Button
        onClick={() => {
          setPosi((prev) => !prev);
          setPre(false);
        }}
      >
        {posi ? "Green (ON)" : "Green (OFF)"}
      </Button>

      <Button
        onClick={() => {
          setPre((prev) => !prev);
          setPosi(false);
        }}
      >
        {pre ? "Yellow (ON)" : "Yellow (OFF)"}
      </Button>
    </div>
  );
};

export default Solver;
