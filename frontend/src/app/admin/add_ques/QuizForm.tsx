'use client'
import { useState } from 'react';
import { categories } from './categories';

const QuizForm = (props:any) => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['']);
    const [answer, setAnswer] = useState<string[]>([]);
    const [rationale, setRationale] = useState('');
    const [category, setCategory] = useState('cardiac');


    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index:number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleAnswerChange = (option: string) => {
        if (answer.includes(option)) {
            setAnswer(answer.filter((a) => a !== option));
        } else {
            setAnswer([...answer, option]);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const quizQuestion = {
            type: props.type,
            question,
            category,
            options,
            answer,
            rationale,
        };

        //   console.log('Quiz Question:', quizQuestion);
        try {
            let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
            const res = await fetch(`${domain}/quiz/add-quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quizQuestion),
            });

            const data = await res.json();

            console.log(data)
            if (!res.ok) {
                // let errorShow = document.querySelector("#errorShow")
                //  errorShow.style.display = 'block'
                alert("something wrong")
            }
            else {
                alert("question added")
            }

        } catch (error) {
            console.error(error)
        }
        // Reset form (optional)
        setQuestion('');
        setOptions(['']);
        setAnswer([]);
        setRationale('');
    };


    return (
        <form onSubmit={handleSubmit} className='m-5'>

            <div>
                <label>Select an option: </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className='text-field m-4'>

                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Question:</label><br />
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    className='text-field m-3'
                    rows={5}
                    cols={80}
                />
            </div>

            <div>
                <label>Options:</label><br />
                {options.map((opt, index) => (
                    <div key={index}>
                        <input
                            type="text"
                        
                            value={opt}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                             className="w-70 h-12 px-4 text-lg text-field m-3"
                        />
                        <input
                            type="checkbox"
                            checked={answer.includes(opt)}
                            onChange={() => handleAnswerChange(opt)}
                            className='mx-3'
                        />
                        <label> Correct Answer</label>
                        {options.length > 1 && (
                            <button type="button" className='button-error m-3' onClick={() => removeOption(index)}>
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addOption} className='button-primary m-3'>Add Option</button>
            </div>

            <div>
                <label>Rationale:</label><br />
                <textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    required
                    className='text-field m-3'
                    rows={5}
                    cols={80}
                />
            </div>

            <button type="submit" className='button-success m-3'>Save Question</button>
        </form>
    );
};

export default QuizForm;
