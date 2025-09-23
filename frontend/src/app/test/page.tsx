'use client'

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthFetch } from '@/app/utils/authFetch';
import QuestionRenderer from "@/app/dashboard/test/QuizRender";

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
    //let { user } = useAuth();

    const { user } = useAuth() as { user: User };
    const [data, setData] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [savedAnswer, setSavedAnswer] = useState<string>('');
    const [selectedAnswer, setSelectedAnswer] = useState<Record<string, string>>({});
    const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
    const currentItem = data[currentIndex];

    useEffect(() => {
        let getData = localStorage.getItem('lms-test');
        if (getData) {
            let datum = JSON.parse(getData).state;


            let getDataFromApi = async () => {
                try {
                    let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
                    const res = await fetch(`${domain}/test/get-quiz`, {
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
                        setData(result.message)
                    }

                } catch (error) {
                    console.error(error)
                }
            }
            getDataFromApi()
        }
    }, [])


    const handleAnswer = (questionId: string, selected: string) => {
        console.log(selected)
        const value = Array.isArray(selected)
            ? [...selected].sort().join('')
            : selected;

        setSelectedAnswer((prev) => ({
            ...prev,
            [questionId]: value,
        }));

    };
    const nextButton = () => {
        if (currentIndex == data.length - 1) {
            setIsQuizComplete(true);
            console.log("nextButton", selectedAnswer)

        }


        setCurrentIndex((prev) => prev + 1);
    };


    return (
        <div className="test-container">
            {currentItem && (
                <div className="test-question-block">
                    <div className="test-left-panel">
                        <h3>Scenario{Number(currentIndex) + 1}</h3>
                        <p>{currentItem.scenario}</p>
                    </div>

                    {/* <div className="test-right-panel">
                        <h3>Q{Number(currentIndex) + 1}: {currentItem.ques}</h3>
                        <QuestionRenderer
                            question={currentItem}
                            savedAnswer={selectedAnswer[currentItem.question_id] || ''}                      
                            onAnswer={(selected) => handleAnswer(currentItem?.question_id, selected)}
/>

                        <button
                            onClick={nextButton}
                            // disabled={currentIndex == data.length - 1}
                            className='button-success'
                        >
                            Next
                        </button>
                    </div> */}
                </div>
            )}
        </div>
    );
};



