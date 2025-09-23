// File: components/payments.ts (or wherever you define data & columns)
import { ColumnDef } from "@tanstack/react-table";

type Payment = {
    id: string;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    amount: number;
};

export const payments: Payment[] = [
    { id: "1", status: "pending", email: "user1@example.com", amount: 120 },
    { id: "2", status: "success", email: "user2@example.com", amount: 450 },
    { id: "3", status: "failed", email: "user3@example.com", amount: 210 },
    { id: "4", status: "processing", email: "user4@example.com", amount: 330 },
    { id: "5", status: "pending", email: "user1@example.com", amount: 120 },
    { id: "6", status: "success", email: "user2@example.com", amount: 450 },
    { id: "7", status: "failed", email: "user3@example.com", amount: 210 },
    { id: "8", status: "processing", email: "user4@example.com", amount: 330 },
    // ... more sample
];

export const paymentColumns: ColumnDef<Payment>[] = [
    {
        accessorKey: "id",
        header: "Id",
        cell: info => info.getValue(),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: info => info.getValue(),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: info => info.getValue(),
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: info => "$" + info.getValue<number>().toFixed(2),
        sortingFn: "basic", // you can customize sorting
    },
];
