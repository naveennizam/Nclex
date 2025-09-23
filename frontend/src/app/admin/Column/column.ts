// columns.ts
import type { ColumnDef } from "@tanstack/react-table";
import type { payments } from "../Types/types";
type Payment = {
  id: string;
  email: string;
  amount: number;
  status: string;
  created_at: string;
};
export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "id",
        header: "IDid",
      },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    // optional: formatting
    cell: info => `$${info.getValue<number>().toFixed(2)}`,
  },
];


