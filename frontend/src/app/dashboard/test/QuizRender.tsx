"use client";
import React, { useEffect, useRef, useState } from "react";
import { QuizRenderQuestions } from '@/app/types';

interface QuestionRendererProps {
  question: QuizRenderQuestions;

  savedAnswer: string | string[] | { text: string | string[] };

  onAnswer: (answer: string | string[]) => void;

}
export default function QuestionRenderer({ question, savedAnswer, onAnswer }: QuestionRendererProps) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const isSelectingRef = useRef(false);
  const startIndexRef = useRef<number | null>(null);

  const { format, question_id, opt } = question;
  const [tokens, setToken] = useState<string[]>([]);
  useEffect(() => {
    if (format === "Dropdown") {
      const parts = question.ques?.split(/({{blank:\d+:[^}]+}})/g) || [];
      const count = parts.filter((p) => p.trim().startsWith("{{blank")).length;
      setAnswers(Array(count).fill(""));
    }
    if (format == "Highlight") {
      const tokenized = question.ques.match(/\S+|\s+/g) || [];
      setToken(tokenized);        // <--- this sets tokens for rendering

    }

  }, [question.ques, format]);

  useEffect(() => {
    if (format == "Highlight") {
      const selectedText = selectedIndices.map((i) => tokens[i]).join("");
      console.log('selectedText', selectedText)
      onAnswer?.(selectedText);

    }
  }, [selectedIndices, tokens]);


  useEffect(() => {
    const onMouseUpGlobal = () => {
      isSelectingRef.current = false;
      startIndexRef.current = null;
    };
    window.addEventListener("mouseup", onMouseUpGlobal);
    return () => window.removeEventListener("mouseup", onMouseUpGlobal);
  }, []);


  if (format === "Single") {
    // const optionsArray = opt.split(',\n');
    const optionsArray = opt.split(/,\s*\n?|\n/);

    return optionsArray.map((option) => {

      const value = option.split('.')[0];
      return (
        <div key={option}>
          <input
            type="radio"
            name={`q-${question_id}`}
            value={value}
            checked={savedAnswer == value}
            onChange={() => onAnswer(value)}


          />
          {option}
        </div>
      )
    });
  }

  if (format === "Multiple") {

    const selected = Array.isArray(savedAnswer) ? savedAnswer : [];
    const optionsArray = opt?.split(/,\s*\n?|\n/).map((o) => o.trim()) || [];

    return optionsArray.map((option, index) => {
      const letter = option.split('.')[0].trim();
      const label = option.trim();

      let normalizedAnswer: string[] = [];

      if (typeof savedAnswer === "string") {
        normalizedAnswer = savedAnswer.split("");
      } else if (Array.isArray(savedAnswer)) {
        normalizedAnswer = savedAnswer;
      } else if (typeof savedAnswer === "object" && savedAnswer?.text) {
        normalizedAnswer = Array.isArray(savedAnswer.text)
          ? savedAnswer.text
          : [savedAnswer.text];
      }

      const isChecked = normalizedAnswer.includes(letter);

      return (
        <div key={index}>
          <input
            type="checkbox"
            value={letter}
            checked={isChecked}
            onChange={(e) => {
              const checked = e.target.checked;

              let updatedAnswer: string | string[] = "";

              if (checked) {
                updatedAnswer = [...normalizedAnswer, letter]
                  .filter((v, i, self) => self.indexOf(v) === i)
                  .sort()
                  .join("");
              } else {
                updatedAnswer = normalizedAnswer
                  .filter((v) => v !== letter)
                  .sort()
                  .join("");
              }

              onAnswer(updatedAnswer);
            }}
          />
          {label}
        </div>
      );
    });

  }

  if (format === "Dropdown") {
    // Split question.ques into plain question.ques and blanks
    const parts = question.ques?.split(/({{blank:.*?}})/g) || [];
    const handleChange = (key: any, value: string) => {
      const updated = [...answers];

      updated[key] = value;
      setAnswers(updated);
      onAnswer(updated);
    };

    return (
      <p>
        {parts.map((part, i) => {
          const match = part.match(/{{blank:(.+?):(.+?)}}/);
          if (match) {
            const key = Number(match[1]);
            const options = match[2].split(",").map(o => o.trim());
            const selected = answers[key] || "";

            return (
              <select
                key={i}
                value={selected}
                onChange={(e) => handleChange(key, e.target.value)}
                className="border px-1 rounded mx-1"
              >
                <option value="">Select</option>
                {options.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            );
          }

          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  }

  if (format == "Highlight") {

    let highlightColor = "#ffd54f"

    const startSelecting = (index: number, e: React.MouseEvent<HTMLSpanElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      isSelectingRef.current = true;
      startIndexRef.current = index;
      setSelectedIndices([index]);
    };

    const extendSelection = (index: number) => {
      if (!isSelectingRef.current || startIndexRef.current === null) return;
      const a = Math.min(startIndexRef.current, index);
      const b = Math.max(startIndexRef.current, index);
      const range = [];
      for (let i = a; i <= b; i++) range.push(i);
      setSelectedIndices(range);
    };
    return (
      <div >
        {tokens.map((t, i) => {
          const isSpace = /^\s+$/.test(t);
          const isSelected = selectedIndices.includes(i);
          return isSpace ? (
            <span key={i}>{t}</span>
          ) : (
            <span
              key={i}
              onMouseDown={(e) => startSelecting(i, e)}
              onMouseEnter={() => extendSelection(i)}
              className={`cursor-text px-1 rounded transition-colors duration-150 ${isSelected ? "text-black" : "text-gray-800"
                }`}
              style={{ backgroundColor: isSelected ? highlightColor : "transparent" }}
            >
              {t}
            </span>
          );
        })}

        {selectedIndices.length > 0 && (
          <div className="mt-3 p-2 bg-gray-50 border rounded text-sm text-gray-700">
            <strong>Selected Answer:</strong> {selectedIndices.map((i) => tokens[i]).join("")}
          </div>
        )}
      </div>

    )
  }
  return <div>Unsupported question type</div>;
}


//   if (type === "drag") {
//     const { options } = question;
//     return (
//       <DragDropQuestion
//         id={id.toString()}
//         options={options}
//         savedOrder={Array.isArray(savedAnswer) ? savedAnswer : options}

//         onAnswer={onAnswer}
//       />
//     );
//   }

//   if (type === "highlight") {
//     const words = question.question.ques.split(" ");
//     const selectedIndex = savedAnswer;
//     return (
//       <div>
//         <p style={{ lineHeight: "1.8em" }}>
//           {words.map((word, index) => (
//             <span
//               key={index}
//               onClick={() => onAnswer(word)}
//               style={{
//                 cursor: "pointer",
//                 backgroundColor: selectedIndex === word ? "#1e2d4f" : "transparent",
//                 padding: "2px 4px",
//                 color: selectedIndex === word
//                   ? (resolvedTheme === "dark" ? "white" : "white")
//                   : "inherit",
//                 borderRadius: "4px",
//                 marginRight: "4px",
//                 userSelect: "none",
//                 display: "inline-block"
//               }}
//             >
//               {word}
//             </span>
//           ))}
//         </p>
//         <p>{question.question}</p>
//         <input
//           type="question.ques"
//           readOnly
//           value={savedAnswer || ""}
//           placeholder="Click a word above"
//           style={{
//             marginTop: "10px",
//             padding: "8px",
//             width: "100%",
//             maxWidth: "400px",
//             fontSize: "16px",
//             border: "1px solid #ccc",
//             borderRadius: "4px",
//           }}
//         />
//       </div>
//     );
//   }