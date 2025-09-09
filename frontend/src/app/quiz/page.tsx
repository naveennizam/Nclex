// app/quiz/page.js
import { Suspense } from 'react';
import QuizClient from './quizClient'; // 👇 Create this file from your current logic

export default function QuizPage() {
    return (
        <Suspense fallback={<p>Loading quiz...</p>}>
            <QuizClient />
        </Suspense>
    );
}
