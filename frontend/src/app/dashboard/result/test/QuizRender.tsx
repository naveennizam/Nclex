"use client";
// DragDropQuestion from "./dragDrop";
interface Question {
    correct_option: string;
    selected_option: string;
    question_id: string;
    ques: string;
    opt: string;
    rationale: string;
    format: string;
    scenario: string;
    scenario_id: number;
    used_question_id: number;

}
interface QuestionRendererProps {
    question: Question;

}
export default function QuestionRenderer({ question }: QuestionRendererProps) {

    const { format, question_id, selected_option, correct_option, rationale } = question;
    console.log(rationale)
    const { opt } = question;

    if (format === "Single") {
        const optionsArray = opt.split(',\n');

        return (
            <>
                <div>
                    {optionsArray.map((option) => {
                        const value = option.split('.')[0];
                        return (
                            <div key={option} className="my-2 ">
                                <input
                                    type="radio"
                                    name={`q-${question_id}`}
                                    value={value}
                                     className="custom-radio"
                                    checked={value === selected_option}
                                    disabled
                                   
                                />
                                {option}
                            </div>
                        );
                    })}


                    <div className="mt-4">
                        <span className="h6 mb-0" style={{ display: 'inline' }}>
                            Correct Answer:
                        </span>
                        <strong className="ms-2">{correct_option}</strong>
                    </div>

                    <div className="mt-3">
                        <h6>Rationale:</h6>
                        <p>{rationale}</p>
                    </div>
                </div>
            </>
        );
    }


    if (format === "Multiple") {

        const optionsArray = opt?.split(',\n').map((o) => o.trim()) || [];

        return (
            <div>
                {optionsArray.map((option, index) => {

                    const letter = option.split('.')[0].trim();
                    const label = option.trim();
                    const isChecked = selected_option.includes(letter);

                    return (
                        <div key={index}>

                            <input
                                type="checkbox"

                                value={letter}
                                checked={isChecked}
                                onChange={(e) => {
                                    const checked = e.target.checked;


                                    let updatedAnswer: string | string[] = '';

                                    if (checked) {
                                        // Add the letter
                                        updatedAnswer = [...selected_option, letter]
                                            .filter((v, i, self) => self.indexOf(v) === i) // remove duplicates
                                            .sort()
                                            .join('');
                                    }
                                    else {
                                        if (typeof selected_option === 'string') {
                                            updatedAnswer = selected_option
                                                .split('')
                                                .filter((v) => v !== letter)
                                                .sort()
                                                .join('');
                                        }

                                    }

                                    // onAnswer(updatedAnswer);
                                }}
                            />


                            {label}
                        </div>
                    )
                })}
                <h6 className="my-5" style={{ display: 'inline' }}>Correct Answer: </h6>
                <strong>{correct_option.split('').join(',')}</strong>

                <h6 className="mt-2">Rationale:</h6>
                <p>{rationale}</p>
            </div>)
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