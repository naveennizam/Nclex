'use client'

import { DataTable } from "@/app/admin/components/DataTable";
import { payments, paymentColumns } from "@/app/admin/Types/types";

import { ColumnDef } from '@tanstack/react-table';
type Payment = {
  id: string;
  email: string;
  amount: number;
  status: string;
  created_at: string;
};

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "email", header: "Email" },
  { accessorKey: "amount", header: "Amount", cell: info => `$${info.getValue<number>().toFixed(2)}` },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "created_at", header: "Created" },
];

export default function PaymentsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Payments</h1>
      <DataTable
        columns={columns}
        apiUrl="/api/payments"
        searchableColumns={["email", "status"]}
        defaultSortBy="created_at"
      />
    </div>
  );
}
