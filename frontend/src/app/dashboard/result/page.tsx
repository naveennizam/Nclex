'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { ChevronRight, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';


type ResultRow = {
  ques_id: number;
  subject: string;
  system: string;
  user_ans: string;
  actual_ans: string;
  is_checked: boolean;
};

const columns: ColumnDef<ResultRow>[] = [
  { accessorKey: 'ques_id', header: 'Ques ID' },
  { accessorKey: 'subject', header: 'Subject' },
  { accessorKey: 'system', header: 'System' },
  { accessorKey: 'user_ans', header: 'User Answer' },
  { accessorKey: 'actual_ans', header: 'Actual Answer' },
  {
    accessorKey: 'is_correct',
    header: 'Check',
    cell: ({ getValue }) => (getValue<boolean>() ? <Check style={{ color: "green" }} /> : <X style={{ color: "red" }} />),
  },
  {
    id: 'chevron', // no accessorKey since it's not tied to data
    header: '', // no header label
    enableSorting: false,
    enableColumnFilter: false,
    cell: () => <ChevronRight className="w-4 h-4 text-muted-foreground" />,
  },
];

export default function ResultsPage() {
  const [data, setData] = useState<ResultRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
      const res = await fetch(`${domain}/test/results?limit=${pageSize}&offset=${page * pageSize}`
      );
      const json = await res.json();
      setData(json.data);
      setTotal(json.total);
    };

    fetchResults();
  }, [page]);

  return (
    <>
      {(data || []).length > 0 ? (



        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">User Result Data</h1>
          <DataTable columns={columns} data={data} />
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
      ) : (
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">User Result</h1>

          <div className="mt-4 flex items-center justify-between">
            <p> You haven't attempt any test</p>
            <button
              className="button-primary"
              onClick={() => router.push('/dashboard/create-test')}
            >
              Create Test
            </button>

          </div>
        </div>
      )
      }
    </>
  );

}
