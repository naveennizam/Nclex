'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

interface User {
  id: string;

}

type ResultRow = {
  id: number,
  total_questions: number;
  correct_answers: string;
  score: string;
  formatted_date: string;
  ques_type: string;
  subject: string;
};


export const columns: ColumnDef<ResultRow>[] = [

  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ getValue }) => {
      const scoreStr = getValue<string>() || '0%';
      const scoreNum = parseFloat(scoreStr.replace('%', ''));

      let bgColor = 'bg-gray-400 text-white';
      if (scoreNum >= 90) bgColor = 'bg-green-500 text-white';
      else if (scoreNum >= 75) bgColor = 'bg-yellow-500 text-black';
      else if (scoreNum >= 50) bgColor = 'bg-orange-500 text-white';
      else bgColor = 'bg-red-500 text-white';

      return (
        <div
          className={`px-3 py-1 text-sm font-semibold rounded-full text-center w-fit ${bgColor}`}
        >
          {scoreStr}
        </div>
      );
    },
  }
  ,
  {
    accessorKey: "total_questions",
    header: () => <div className="text-center">T.Questions</div>,
    cell: ({ getValue }) => <div className="text-center"> {getValue<number>()}</div>,
  },
  {
    accessorKey: "correct_answers",
    header: () => <div className="text-center">T.Correct</div>,
    cell: ({ getValue }) => <div className="text-center"> {getValue<string>()}</div>,
  },
  {
    accessorKey: "formatted_date",
    header: () => <div className="text-center">Date</div>,
    cell: ({ getValue }) => <div className="text-center"> {getValue<string>()}</div>,
  },
  {
    accessorKey: "ques_type",
    header: () => <div className="text-center">Type</div>,
    cell: ({ getValue }) => <div className="text-center"> {getValue<string>()}</div>,
  },
  {
    accessorKey: "subject",
    header: () => <div className="text-center">Subject</div>,
    cell: ({ getValue }) => <div className="text-center"> {getValue<string>()}</div>,
  },
  {
    id: "chevron",
    header: () => <div className="text-center" />,
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <div className="text-center">
          <Link href={`/dashboard/result/${id}`} target='no_blan'>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>
      );
    },
  }

];


export default function ResultsPage() {
  const [practice, setPractice] = useState<ResultRow[]>([]);



  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const router = useRouter();
  const { user } = useAuth() as { user: User };

  useEffect(() => {
    localStorage.removeItem('lms-test');
    const fetchResults = async () => {
      let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
      const res = await fetch(`${domain}/test/results?user_id=${user.id}&limit=${pageSize}&offset=${page * pageSize}`
      );
      const json = await res.json();

      setPractice(json.data);
      setTotal(json.total);
    };

    fetchResults();
  }, [page]);

  return (
    <>
      <section className='container m-5'>
        <Tabs defaultValue="practice" className="w-[600px]  ">
          <TabsList className="tabsList grid grid-cols-2 w-full rounded-md p-1">                      <TabsTrigger
            value="practice"
            className="tab-btn"            >
            Practice
          </TabsTrigger>
            <TabsTrigger
              value="adaptive"
              className="tab-btn"
            >
              Adaptive (CAT)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice">
            <div >

              {(practice || []).length > 0 ? (
                <div className="p-4">
                  <h1 className="text-xl font-bold mb-4">User Result Data</h1>
                  <DataTable columns={columns} data={practice} />

                  {/* Pagination UI */}
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                      className="button-primary"
                    >
                      Previous
                    </button>
                    <span>
                      Page {page + 1} of {Math.ceil(total / pageSize)}
                    </span>
                    <button
                      disabled={(page + 1) * pageSize >= total}
                      onClick={() => setPage((p) => p + 1)}
                      className="button-success"
                    >
                      Next
                    </button>
                  </div>
                </div>

              )
                :
                <div className="mt-4 flex items-center justify-between">
                  <p>You haven't attempted any test</p>
                  <button
                    className="button-primary"
                    onClick={() => router.push('/dashboard/create-test')}
                  >
                    Create Test
                  </button>
                </div>
              }
            </div>
          </TabsContent>

          <TabsContent value="adaptive">
            <div>
              <div className="p-4">
                <h1 className="text-xl font-bold mb-4">User Result</h1>

                <div className="mt-4 flex items-center justify-between">
                  <p>You haven't attempted any test</p>
                  <button
                    className="button-primary"
                    onClick={() => router.push('/dashboard/create-test')}
                  >
                    Create Test
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>


        </Tabs >
      </section>

    </>
  );

}
