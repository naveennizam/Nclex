'use client'

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAuthFetch } from '@/app/utils/authFetch';
import QuestionRenderer from "./QuizRender";
import { useSearchParams } from 'next/navigation'


interface User {
    id: string;
    email: string;
}
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
export default function Test() {
    const fetchWithAuth = useAuthFetch();

    const { user } = useAuth() as { user: User };
    const [data, setData] =useState<Question | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [savedAnswer, setSavedAnswer] = useState<string>('');
    const [selectedAnswer, setSelectedAnswer] = useState<Record<string, string>>({});
    const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);


    let router = useRouter();
    const params = useSearchParams();
    const id = params.get('id');
    const ques_id = params.get('ques_id');

  useEffect(() => {
    let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''

    let getQuesAns = async () => {

      const res = await fetchWithAuth(`${domain}/test/check_ques?id=${id}&ques_id=${ques_id}`
      );
      const json = await res.json();
     console.log(json)
     setData(json)
    }
   
    getQuesAns()
   
  }, [])


    return (
        <section>
            <nav className="navbar custom-navbar">
                <div className="container-fluid">
                    <p className="navbar-brand mx-5 my-0">NCLEX</p>

                </div>
            </nav>



            <div className="test-container">

                {data && (
                    <div className="test-question-block">

                        <div className="test-left-panel">
                            <h3>Scenario</h3>
                            <p>{data?.scenario}</p>
                        </div>

                        <div className="test-right-panel">
                            <h3>Q: {data?.ques}</h3>
                            <QuestionRenderer
                                question={data}
                                
                                

                            />

                        </div>
                    </div>
                )}
            </div>

        </section>
    );
};
