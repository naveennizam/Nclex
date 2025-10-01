'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';



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