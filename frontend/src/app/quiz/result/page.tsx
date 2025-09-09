"use client"
import React, { useEffect, useState } from 'react';
import { encodeNumberXOR, decodeNumberXOR } from '../../utils/XORencrypt'
import { useRouter } from 'next/navigation';


import { Question } from '../types';

import { questions } from '../quizes';

// Assuming questions is defined above or imported
export default function QuizResults() {
    const router = useRouter();

    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string | string[] | null }>({});
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const completed = localStorage.getItem('quizCompleted');
        const stored = localStorage.getItem('quiz-answers');
        console.log("Stored",stored)
        const storedAnswers = stored ? JSON.parse(stored) : {};


        if (!completed) {

        } else {
            setUserAnswers(storedAnswers);
        }
    }, []);
    useEffect(() => {
        const completed = localStorage.getItem('quizCompleted');
        if (completed !== 'true') {
            router.push(`/quiz?q=${encodeNumberXOR(1)}`);
            return;
        }
        const stored = localStorage.getItem('quiz-answers');
        const storedAnswers = stored ? JSON.parse(stored) : {};

        // const storedAnswers = JSON.parse(localStorage.getItem('quiz-answers')) || {};
        setUserAnswers(storedAnswers);
        setShowResults(true);

        setTimeout(() => {
            localStorage.removeItem('quiz-answers');
            localStorage.removeItem('quizCompleted');
        }, 2000); // wait 2 seconds
    }, []);


    const getOptionStyle = (question: Question, option: string) => {
        const correct = Array.isArray(question.answer)
            ? question.answer.includes(option)
            : question.answer === option;

        const userAnswer = userAnswers[question.id];

        const userSelected = userAnswer != null && (
            Array.isArray(userAnswer)
                ? userAnswer.includes(option)
                : userAnswer === option
        );

        if (correct) {
            return { color: 'green', fontWeight: 'bold' };
        }
        if (userSelected && !correct) {
            return { color: 'red', textDecoration: 'line-through' };
        }
        return {}; // default style
    };

    function isChoiceQuestion(
        question: Question
    ): question is Extract<Question, { type: 'single' | 'multiple' }> {
        return question.type === 'single' || question.type === 'multiple';
    }

    return (
        <section className="container m-5">
            <h2>Quiz Results</h2>
            {questions.map((q) => (
                <div key={q.id} style={{ marginBottom: '2rem' }}>
                    <strong>Question {q.id}:</strong>
                    <p> {q.question}</p>

                    {/* Handle text for highlight or drag type */}
                    {q.type === 'highlight' && (
                        <p>
                            {q.text.split(' ').map((word, i) => {
                                const clean = (str: string) => str.replace(/[^\w\s]/g, '').toLowerCase();
                                const wordLower = clean(word);

                                // Handle q.answer as string[]
                                const correctAnswers = Array.isArray(q.answer) ? q.answer : [q.answer];
                                const isCorrect = correctAnswers.some(answer => wordLower.includes(clean(answer)));

                                const userAnswer = userAnswers[q.id];
                                const userSelected = Array.isArray(userAnswer)
                                    ? userAnswer.some(ans => wordLower.includes(clean(ans)))
                                    : typeof userAnswer === 'string'
                                        ? wordLower.includes(clean(userAnswer))
                                        : false;

                                return (
                                    <span
                                        key={i}
                                        style={{
                                            backgroundColor: isCorrect
                                                ? 'lightgreen'
                                                : userSelected
                                                    ? 'salmon'
                                                    : 'transparent',
                                            fontWeight: isCorrect ? 'bold' : 'normal',
                                            marginRight: '5px',
                                        }}
                                    >
                                        {word}
                                    </span>
                                );
                            })}
                        </p>
                    )}



                    {isChoiceQuestion(q) && (
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {q.options.map((option, idx) => (
                                <li key={idx} style={getOptionStyle(q, option)}>
                                    {option}
                                </li>
                            ))}
                        </ul>
                    )}


                    {q.type === 'drag' && (
                        <div>
                            <p><strong>Your Order:</strong></p>
                            <ol>
                            {(userAnswers[q.id] as string[] || []).map((step, idx) => (
                                    <li key={idx} style={{
                                        color: step === q.answer[idx] ? 'green' : 'red'
                                    }}>
                                        {step}
                                    </li>
                                ))}
                            </ol>

                            <p><strong>Correct Order:</strong></p>
                            <ol>
                                {q.answer.map((step, idx) => (
                                    <li key={idx} style={{ color: 'green' }}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}

                    <p style={{ fontStyle: 'italic', color: '#555' }}>
                        Rationale: {q.rationale}
                    </p>

                    <hr />
                </div>
            ))}
        </section>
    );
}

