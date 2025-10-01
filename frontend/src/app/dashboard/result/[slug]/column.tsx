

"use client"
import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { ChevronRight, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import React from 'react';
import Dough from './Dough';
import { ProgressBars } from './ProgressBar'

type ResultRow = {
    // user_id,
    id: number;
    question_id: number;
    // time_taken_secs:  number;
    selected_option: string;
    correct_option: string;
    practice_session_id: number;
    is_correct: boolean;
    attempted_at: number;
    subject: string;
    system: string;
  
  
  
  };
export const columns: ColumnDef<ResultRow>[] = [

    {
      accessorKey: "is_correct",
      header: () => <div className="text-center"></div>,
      cell: ({ getValue }) => {
        const value = getValue<boolean>();
        return (
          <div className="text-center">
            {value ? <Check className="text-green-500" size={18} /> : <X className="text-red-500" size={18} />}
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ getValue }) => <div className="text-center"> {getValue<number>()}</div>,
    },
    {
      accessorKey: "correct_option",
      header: () => <div className="text-center">Correct Opt</div>,
      cell: ({ getValue }) => <div className="text-center"> {getValue<string>()}</div>,
    },
    {
      accessorKey: "selected_option",
      header: () => <div className="text-center">Selected Opt</div>,
      cell: ({ getValue }) => <div className="text-center"> {getValue<string>()}</div>,
    },
  
    {
      accessorKey: "subject",
      header: () => <div className="text-center">Subject</div>,
      cell: ({ getValue }) => <div className="text-center"> {getValue<string>()}</div>,
    },
    {
      accessorKey: "system",
      header: () => <div className="text-center">System</div>,
      cell: ({ getValue }) => <div className="text-center"> {getValue<string>()}</div>,
    },
    {
      id: "chevron",
      header: () => <div className="text-center" />,
      cell: ({ row }) => {
        const id = row.original.id;
        const ques_id = row.original.question_id;
  
        return (
          <div className="text-center">
            <Link href={`/dashboard/result/test?id=${id}&ques_id=${ques_id}`} target='no_blank'>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        );
      },
    }
  
  ];