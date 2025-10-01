'use client'

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAuthFetch } from '@/app/utils/authFetch';
import QuestionRenderer from "./QuizRender";


interface User {
    id: string;
    email: string;
}
interface Question {
    question_id: string;
    ques: string;
    opt: string;
    rationale: string;
    ans: string;
    format: string;
    scenario: string;
    id: string;
    subject: string;
    system: string;
    type: string;

}
export default function Test() {
    const fetchWithAuth = useAuthFetch();

    const { user } = useAuth() as { user: User };
    const [data, setData] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [savedAnswer, setSavedAnswer] = useState<string>('');
    const [selectedAnswer, setSelectedAnswer] = useState<Record<string, string>>({});
    const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

    const currentItem = data[currentIndex];


    const [seconds, setSeconds] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    let [savedTime, setSavedTime] = useState<number[]>([]);
    // Start timer on mount
    useEffect(() => {
        setSeconds(0);
        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [currentItem]);

    let router = useRouter();

    useEffect(() => {
        let getData = localStorage.getItem('lms-test');
        if (getData) {
            let datum = JSON.parse(getData).state;


            let getDataFromApi = async () => {
                try {
                    let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
                    const res = await fetchWithAuth(`${domain}/test/get-quiz`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(datum),
                    });

                    if (!res.ok) {

                        alert("something wrong")
                    }
                    else {
                        const result = await res.json();
                        //console.log('data',result)
                        setData(result.message)
                    }

                } catch (error) {
                    console.error(error)
                }
            }
            getDataFromApi()
        }
    }, [])


    const handleAnswer = (questionId: string, selected: string | string[]) => {
        // console.log(selected)
        const value = Array.isArray(selected)
            ? [...selected].sort().join('')
            : selected;

        setSelectedAnswer((prev) => ({
            ...prev,
            [questionId]: value,
        }));

    };
    useEffect(() => {
        console.log(`Saved times:`, savedTime);
    }, [savedTime]);

    const nextButton = () => {
        const finalSavedTime = [...savedTime, seconds]; 
        setSavedTime(finalSavedTime); 
      
        setSeconds(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
      
        if (currentIndex === data.length - 1) {
          setIsQuizComplete(true);
            let correct_ans_total = 0;
            let sub, mode;
            let used_questions = data.map((item, index) => {
                const user_ans = selectedAnswer[item.question_id];
                const actual_ans = item.ans;
                const is_correct = user_ans === actual_ans;

                correct_ans_total = (is_correct) ? correct_ans_total + 1 : correct_ans_total;
                sub = item.subject;
                mode = item.type;

                return {
                    user_id: user.id,
                    question_id: item.question_id,
                    subject: item.subject,
                    system: item.system,
                    attempt_number: 1,
                    selected_option: user_ans || null,
                    correct_option: item.ans,
                    is_correct: is_correct,
                    time_taken_secs: finalSavedTime[index] || 0
                };
            });

            const score = (correct_ans_total / data.length) * 100;
            const percentage = score.toFixed(1);
            let practice_session = {
                total_quesions: data.length,
                user_id: user.id,
                correct_answers: correct_ans_total,
                score: percentage,
                subject: sub,
                ques_type: mode,
            }


            let submitAnswers = async () => {
                try {
                    let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
                    const res = await fetch(`${domain}/test/submit-answers`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            used_questions: used_questions,
                            practice_session: practice_session
                        }),
                    });

                    if (!res.ok) alert("something wrong");

                    else router.push('/dashboard/result');


                } catch (error) {
                    console.error(error)
                }
            }

            submitAnswers()

        }
        setCurrentIndex((prev) => prev + 1);

    };

   
    const BackButton = () => {
        // Stop the current timer
        if (intervalRef.current) clearInterval(intervalRef.current);
      
        const prevIndex = currentIndex - 1;
      
        if (prevIndex >= 0) {
          // Restore saved time for previous question
          const previousTime = savedTime[prevIndex] || 0;
          setSeconds(previousTime);
      
          // Set to previous question
          setCurrentIndex(prevIndex);
        }
      };
      
      
    return (
        <section>
            <nav className="navbar custom-navbar">
                <div className="container-fluid">
                    <p className="navbar-brand mx-5 my-0">NCLEX</p>
                    <div className="d-flex mx-5">
                        <p className=" mb-0">{seconds} sec</p>
                    </div>
                </div>
            </nav>



            <div className="test-container">

                {currentItem && (
                    <div className="test-question-block">

                        <div className="test-left-panel">
                            <h3>Scenario{Number(currentIndex) + 1}</h3>
                            <p>{currentItem.scenario}</p>
                        </div>

                        <div className="test-right-panel">
                            <h3>Q{Number(currentIndex) + 1}: {currentItem.ques}</h3>
                            <QuestionRenderer
                                question={currentItem}
                                savedAnswer={selectedAnswer[currentItem.question_id] || ''}
                                onAnswer={(selected) => handleAnswer(currentItem?.question_id, selected)}

                            />

                            <div className="m-5 d-flex justify-content-between">
                                <button className="button-primary" onClick={BackButton}
                                disabled={currentIndex == 0}
                                >
                                    Back
                                </button>

                                <button onClick={nextButton} className="button-success">
                                    Next
                                </button>
                            </div>


                        </div>
                    </div>
                )}
            </div>

        </section>
    );
};
