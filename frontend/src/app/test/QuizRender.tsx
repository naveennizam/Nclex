"use client";
// DragDropQuestion from "./dragDrop";
import { useTheme } from 'next-themes';
//import { Question } from './types'; 
// interface QuestionRendererProps {
//   question: Question;
//   savedAnswer: string | string[] | null;
//   onAnswer: (answer: string | string[]) => void;
// }
// export default function QuestionRenderer({ question, savedAnswer, onAnswer }) {

//   const { format, question_id } = question;

//   const { opt } = question;

//   if (format === "Single") {
//     const optionsArray = opt.split(',\n');

//     return optionsArray.map((option) => {

//         const value = option.split('.')[0];
//         return(
//       <div key={option}>
//         <input
//           type="radio"
//           name={`q-${question_id}`}
//           value={value}
//           checked={savedAnswer == value}
//           onChange={() => onAnswer(value)}
  

//         />
//         {option}
//       </div>
//         )
//     });
//   }

//   if (format === "Multiple") {
  
//  const selected = Array.isArray(savedAnswer) ? savedAnswer : [];
//  const optionsArray = opt?.split(',\n').map((o) => o.trim()) || [];

//  return optionsArray.map((option,index) => {

//   const letter = option.split('.')[0].trim();
//         const label = option.trim();
//         const isChecked = savedAnswer.includes(letter);

// return(
//       <div key={index}>
         
//         <input
//           type="checkbox"
      
//           value={letter}
//           checked={isChecked}
//           onChange={(e) => {
//             const checked = e.target.checked;

//             let updatedAnswer;

//             if (checked) {
//               // Add the letter
//               updatedAnswer = [...savedAnswer, letter]
//                 .filter((v, i, self) => self.indexOf(v) === i) // remove duplicates
//                 .sort()
//                 .join('');
//             } else {
//               // Remove the letter
//               updatedAnswer = savedAnswer
//                 .split('')
//                 .filter((v) => v !== letter)
//                 .sort()
//                 .join('');
//             }

//             onAnswer(updatedAnswer); 
//           }}
//         />

      
//         {label}
//       </div>
// )
//   });
//   }

//   return <div>Unsupported question type</div>;
// }
export default function QuestionRenderer(){
  return(
    <></>
  )
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
//     const words = question.text.split(" ");
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
//           type="text"
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