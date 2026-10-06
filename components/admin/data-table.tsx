"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Inbox, Search, SearchX, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableFilter {
  columnId: string;
  label: string;
  options: Record<string, string>;
}

interface DataTableProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchPlaceholder?: string;
  filters?: DataTableFilter[];
  toolbar?: React.ReactNode;
  pageSize?: number;
  emptyText?: string;
}

const ALL = "__all__";

/**
 * Bảng dữ liệu dùng chung cho Admin: tìm kiếm toàn cục, lọc theo cột
 * (Select), sắp xếp, phân trang. Cột cần lọc phải khai báo `filterFn: "equals"`.
 */
export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Tìm kiếm…",
  filters = [],
  toolbar,
  pageSize = 10,
  emptyText = "Chưa có dữ liệu.",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
    // Tìm kiếm không phân biệt dấu tiếng Việt
    globalFilterFn: (row, _columnId, value: string) => {
      const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();
      const haystack = norm(row.getAllCells().map((c) => String(c.getValue() ?? "")).join(" "));
      return haystack.includes(norm(value));
    },
  });

  const filtered = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize: size } = table.getState().pagination;
  const isFiltered = globalFilter !== "" || columnFilters.length > 0;

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <div className="flex flex-col gap-3 border-b p-3 sm:p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              table.setPageIndex(0);
            }}
            placeholder={searchPlaceholder}
            aria-label="Tìm kiếm"
            className="h-10 bg-background pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const column = table.getColumn(f.columnId);
            const value = (column?.getFilterValue() as string | undefined) ?? ALL;
            return (
              <Select
                key={f.columnId}
                items={{ [ALL]: `${f.label}: Tất cả`, ...f.options }}
                value={value}
                onValueChange={(v) => column?.setFilterValue(!v || v === ALL ? undefined : v)}
              >
                <SelectTrigger className="h-10! min-w-40 bg-background" aria-label={f.label}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>{f.label}: Tất cả</SelectItem>
                  {Object.entries(f.options).map(([v, label]) => (
                    <SelectItem key={v} value={v}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}
          {isFiltered && (
            <Button
              variant="ghost"
              className="h-10"
              onClick={() => {
                setGlobalFilter("");
                setColumnFilters([]);
              }}
            >
              <X /> Xoá lọc
            </Button>
          )}
        </div>
        {toolbar && <div className="flex items-center gap-2 lg:ml-auto">{toolbar}</div>}
      </div>

      <div>
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => {
                  const sortable = header.column.getCanSort();
                  const dir = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id} className="h-11 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase first:pl-4 last:pr-4">
                      {header.isPlaceholder ? null : sortable ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded transition-colors hover:text-foreground"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {dir === "asc" ? <ArrowUp className="size-3.5" /> : dir === "desc" ? <ArrowDown className="size-3.5" /> : <ArrowUpDown className="size-3.5 opacity-40" />}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="transition-colors hover:bg-muted/40">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn("py-3 first:pl-4 last:pr-4", (cell.column.columnDef.meta as { className?: string } | undefined)?.className)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="grid size-11 place-items-center rounded-full bg-muted">
                      {isFiltered ? <SearchX className="size-5" /> : <Inbox className="size-5" />}
                    </span>
                    <p className="text-sm">{isFiltered ? "Không tìm thấy kết quả phù hợp." : emptyText}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row">
        <p>
          {filtered === 0
            ? "0 kết quả"
            : `Hiển thị ${pageIndex * size + 1}–${Math.min((pageIndex + 1) * size, filtered)} / ${filtered} kết quả`}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} aria-label="Trang đầu">
            <ChevronsLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Trang trước">
            <ChevronLeft />
          </Button>
          <span className="px-3 font-medium text-foreground tabular-nums">
            {pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
          </span>
          <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Trang sau">
            <ChevronRight />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} aria-label="Trang cuối">
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
