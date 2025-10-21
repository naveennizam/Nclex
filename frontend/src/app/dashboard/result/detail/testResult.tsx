'use client'

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAuthFetch } from '@/app/utils/authFetch';
import QuestionRenderer from "./QuizRender";
import { useSearchParams } from 'next/navigation'
import { DetailAnswer } from '@/app/types'


interface User {
    id: string;
    email: string;
}

export default function Test() {
    const fetchWithAuth = useAuthFetch();

    const { user } = useAuth() as { user: User };
    const [data, setData] = useState<DetailAnswer | null>(null);


    const params = useSearchParams();
    const id = params.get('id');
    const ques_id = params.get('ques_id');

    useEffect(() => {
        if (!id || !ques_id) return;

        let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''

        let getQuesAns = async () => {

            const res = await fetchWithAuth(`${domain}/test/check_ques?id=${id}&ques_id=${ques_id}`
            );
            const json = await res.json();
            console.log(json)
            setData(json)
        }

        getQuesAns()

    }, [id, ques_id]);

    return (
        <section>
            <nav className="navbar custom-navbar">
                <div className="container-fluid">
                    <p className="navbar-brand mx-5 my-0">NCLEXIA</p>

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
                        {data?.format !== "Dropdown" && data?.format !== "Highlight" && <h3>Q: {data?.ques}</h3>}
                        <QuestionRenderer question={data} />

                        </div>
                    </div>
                )}
            </div>

        </section>
    );
};
