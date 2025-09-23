// components/DataTable.tsx
"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender 
} from "@tanstack/react-table";

import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  apiUrl: string;
  searchableColumns?: (keyof TData)[];
  defaultSortBy?: keyof TData;
}

export function DataTable<TData>({
  columns,
  apiUrl,
  searchableColumns = [],
  defaultSortBy,
}: DataTableProps<TData>) {
  const [data, setData] = React.useState<TData[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const limit = 10;

  // fetch data
  React.useEffect(() => {
    const fetchData = async () => {
      const sortBy = sorting[0]?.id || defaultSortBy || "created_at";
      const sortOrder = sorting[0]?.desc ? "desc" : "asc";

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy: String(sortBy),
        sortOrder,
      });

      for (const filter of columnFilters) {
        if (filter.value) {
          params.append(filter.id, filter.value as string);
        }
      }

      const res = await fetch(`${apiUrl}?${params.toString()}`);
      const json = await res.json();
      setData(json.data);
      setTotalPages(json.totalPages);
    };

    fetchData();
  }, [apiUrl, sorting, columnFilters, page]);

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Search inputs */}
      {searchableColumns.length > 0 && (
        <div className="flex space-x-2">
          {searchableColumns.map((col) => (
            <Input
              key={String(col)}
              placeholder={`Filter ${String(col)}`}
              value={(table.getColumn(col as string)?.getFilterValue() as string) || ""}
              onChange={(e) =>
                table.getColumn(col as string)?.setFilterValue(e.target.value)
              }
              className="max-w-sm"
            />
          ))}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer"
                  >
                    {!header.isPlaceholder && (
                      typeof header.column.columnDef.header === 'function'
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header
                    )}
                    {header.isPlaceholder ? null : header.column.columnDef.header}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                        ? " 🔽"
                        : ""}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  // <TableCell key={cell.id}>{cell.renderCell()}</TableCell>
                  <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span>Page {page} of {totalPages}</span>
        <div className="space-x-2">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </Button>
          <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
