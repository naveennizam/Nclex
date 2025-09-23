// app/quiz/page.js
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { questions } from "./quizes";
import QuestionRenderer from "./qizRender";
import { encodeNumberXOR, decodeNumberXOR } from '../utils/XORencrypt'
import Link from 'next/link';

export default function QuizPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const qParam = searchParams.get("q");
    const queryQ = qParam ? parseInt(qParam) : 1;
    let decoded = decodeNumberXOR(queryQ);
    const [currentQ, setCurrentQ] = useState(decoded);

    const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
    const [isQuizComplete, setIsQuizComplete] = useState(false);
    const [getScore, setGetScore] = useState(0)

    useEffect(() => {
        const storedAnswers = localStorage.getItem("quiz-answers");
        const stored = storedAnswers ? JSON.parse(storedAnswers) : {};


        console.log((storedAnswers))
        if (stored) {
            setAnswers((stored));
        }
    }, []);

    useEffect(() => {
        let encoded = encodeNumberXOR(currentQ);  // Obfuscated number

        router.replace(`?q=${encoded}`);
    }, [currentQ]);

    const handleAnswer = (val: any) => {
        const newAnswers = {
            ...answers,
            [currentQ]: typeof val === 'string' ? [val] : val
        };
        setAnswers(newAnswers);
        localStorage.setItem("quiz-answers", JSON.stringify(newAnswers));
    };

    const question = questions.find((q) => q.id === currentQ);

    type Question = {
        type: 'single' | 'multiple' | 'drag' | 'highlight';
        answer: string | string[];
    };

    const isAnswerCorrect = (question: Question, userAnswer: string | string[] | null): boolean => {
        if (Array.isArray(question.answer)) {
            if (question.type === 'multiple') {
                const sortedUser = [...(userAnswer || [])].sort();
                const sortedCorrect = [...question.answer].sort();
                return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
            }
            else if (question.type === 'drag') {
                return JSON.stringify(userAnswer) === JSON.stringify(question.answer);
            }
            else if (question.type === 'single') {
                const sortedUser = [...(userAnswer || [])].sort();
                const sortedCorrect = [...question.answer].sort();
                return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
            }
            else {
                const sortedUser = [...(userAnswer || [])].sort();
                const sortedCorrect = [...question.answer].sort();
                return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
            }
        }

        return userAnswer === question.answer;
    };

    const nextButton = () => {
        if (currentQ >= questions.length) {
            setIsQuizComplete(true);
            const storedAnswers = JSON.parse(localStorage.getItem('quiz-answers') || '{}');

            console.log("YYY", storedAnswers)
            questions.forEach((q: any) => {
                if (!(q.id in storedAnswers)) {
                    storedAnswers[q.id] = '';
                }
            });


            localStorage.setItem('quiz-answers', JSON.stringify(storedAnswers));
            let totalScore = 0;

            questions.forEach((q) => {
                const userAnswer = answers[q.id];
                console.log('userAnswer', userAnswer)
                if (isAnswerCorrect(q, userAnswer)) {
                    totalScore += 1;
                }
            });
            localStorage.setItem('quizCompleted', 'true');
            setGetScore(totalScore);
            return;
        }


        setCurrentQ((prev) => prev + 1);
    };


    return (
        <section className="container m-5">
            {isQuizComplete ?
                <div>
                    <div className="text-center">
                        <h1 className="mt-2">Result!</h1>
                        <h3 className="mt-2"> {getScore} of {questions.length}</h3>
                        <h4 className="mt-2">{(getScore / questions.length) * 100}%</h4>
                        <div className="d-flex justify-content-around mt-5">
                            <button className="btn button-primary" onClick={() => {
                                window.location.href = (`/quiz?q=${encodeNumberXOR(1)}`)
                            }}>
                                Try aign
                            </button>

                            <Link href={`/quiz/result`} className="btn button-success">
                                <button >
                                    Check your answers
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                :
                <div>
                    {!question ? <p>Question not found.</p>
                        :
                        <div>
                            <h2>Question {currentQ}</h2>
                            <p>{question?.type == 'highlight' ? '' : question?.question}</p>
                            <QuestionRenderer
                                question={question}
                                savedAnswer={answers[currentQ]}
                                onAnswer={handleAnswer}
                            />
                            <div className="d-flex justify-content-between mt-5">
                                <button
                                    className="button-primary"
                                    disabled={currentQ === 1}
                                    onClick={() => setCurrentQ((q) => q - 1)}
                                >
                                    Previous
                                </button>
                                <button
                                    className="button-success"

                                    // disabled={currentQ === questions.length}
                                    onClick={nextButton}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    }
                </div>
            }

        </section>
    );
}
