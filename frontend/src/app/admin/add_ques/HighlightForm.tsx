'use client'
import { useState } from 'react';
import { categories } from './categories'

const QuizForm = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [rationale, setRationale] = useState('');
    const [text, setText] = useState('');
    const [category, setCategory] = useState('cardiac');





    const handleSubmit = async(e: any) => {
        e.preventDefault();

        const quizQuestion = {
            type: 'highlight',
            text,
            question,
            category,
            answer,
            rationale,
        };

        console.log('Quiz Question:', quizQuestion);
        // You can send this to your backend or save it in local state

        // Reset form (optional)

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
            else{
                alert("question added")
            }
      
          } catch (error) {
            console.error(error)
          }

        setQuestion('');
        setAnswer('');
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
                <label>Paragrah:</label><br />
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    className='text-field m-3'

                />
            </div>

            <div>
                <label>Question:</label><br />
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    className='text-field m-3'

                />
            </div>

            <div>
                <label>Answer:</label><br />

                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className='mx-3 text-field'
                />
            </div>

            <div>
                <label>Rationale:</label><br />
                <textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    required
                    className='text-field m-3'

                />
            </div>

            <button type="submit" className='button-success m-3'>Save Question</button>
        </form>
    );
};

export default QuizForm;
