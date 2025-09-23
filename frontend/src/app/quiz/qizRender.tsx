"use client";
import DragDropQuestion from "./dragDrop";
import { useTheme } from 'next-themes';
import { Question } from './types'; 
interface QuestionRendererProps {
  question: Question;
  savedAnswer: string | string[] | null;
  onAnswer: (answer: string | string[]) => void;
}
export default function QuestionRenderer({ question, savedAnswer, onAnswer }: QuestionRendererProps) {
  const { resolvedTheme } = useTheme();

  const { type, id } = question;

  if (type === "single") {
    const { options } = question;
    return options.map((opt) => {
      return(
      <div key={opt}>
        <input
          type="radio"
          name={`q-${id}`}
          value={opt}
          checked={savedAnswer == opt}
          onChange={() => onAnswer(opt)}
        />
        {opt}
      </div>
  )});
  }

  if (type === "multiple") {
    const { options } = question;
    const selected = Array.isArray(savedAnswer) ? savedAnswer : [];
    return options.map((opt) => (
      <div key={opt}>
        <input
          type="checkbox"
          value={opt}
          checked={selected.includes(opt)}
          onChange={(e) => {
            if (e.target.checked) {
              onAnswer([...selected, opt]);
            } else {
              onAnswer(selected.filter((a) => a !== opt));
              
            }
          }}
        />
        {opt}
      </div>
    ));
  }

  if (type === "drag") {
    const { options } = question;
    return (
      <DragDropQuestion
        id={id.toString()}
        options={options}
        savedOrder={Array.isArray(savedAnswer) ? savedAnswer : options}

        onAnswer={onAnswer}
      />
    );
  }

  if (type === "highlight") {
    const words = question.text.split(" ");
    const selectedIndex = savedAnswer;
    return (
      <div>
        <p style={{ lineHeight: "1.8em" }}>
          {words.map((word, index) => (
            <span
              key={index}
              onClick={() => onAnswer(word)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedIndex === word ? "#1e2d4f" : "transparent",
                padding: "2px 4px",
                color: selectedIndex === word
                  ? (resolvedTheme === "dark" ? "white" : "white")
                  : "inherit",
                borderRadius: "4px",
                marginRight: "4px",
                userSelect: "none",
                display: "inline-block"
              }}
            >
              {word}
            </span>
          ))}
        </p>
        <p>{question.question}</p>
        <input
          type="text"
          readOnly
          value={savedAnswer || ""}
          placeholder="Click a word above"
          style={{
            marginTop: "10px",
            padding: "8px",
            width: "100%",
            maxWidth: "400px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>
    );
  }

  return <div>Unsupported question type</div>;
}
