import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    RowData,
    Table,
    useReactTable,
} from '@tanstack/react-table';
import {ReactElement, useEffect, useState} from 'react';
import LoadSpinner from "./LoadSpinner.tsx";
import TicketPriorityComp from "./TicketPriorityComp.tsx";
import {TicketPriority, TicketStatus} from "../models/Ticket.ts";
import TicketStatusComp from "./TicketStatusComp.tsx";
import UserRoleComp from "./UserRoleComp.tsx";

declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'priority' | 'status' | 'role'
    }
}

export type DataTableProps<T> =  {
  /** Data for table */
  data: T[];

  /** Columns for table */
  columns: ColumnDef<T>[];

  /** Whether the data table is loading */
  isLoading?: boolean;

  /**
   * Whether the backend has more results
   * than what's currently loaded in the table
   * @default false
   */
  hasMore?: boolean;

  /**
   * Whether the backend is loading more results
   */
  isLoadingMore?: boolean;

  /**
   * Handler to call when the user takes an action that calls for
   * loading more data, like reaching the bottom of the table
   * or pressing a pagination button.
   */
  onLoadMore?: () => void;

  /**
   * Whether to show pagination controls
   * @default false
   */
  showPagination?: boolean;
};

// util components

type PaginationButtonProps<T> = {
  table: Table<T>;
};

const POSSIBLE_PAGE_SIZES = [5, 10, 20, 30, 40, 50];

const PaginationButtons = <T,>(
  props: PaginationButtonProps<T>
): ReactElement => {
  const { table } = props;

  return (
    <div className="flex ml-auto">
      <div className="flex space-x-4 mr-2 items-center">
          <p>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </p>
          <select
            name="page-size-selector"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(+e.target.value)}
            className="bg-white border rounded border-true-gray-300 p-1"
          >
            {POSSIBLE_PAGE_SIZES.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
      </div>
    </div>
  );
};

const DEFAULT_PROPS = {
  hasMore: false,
  showPagination: false,
};

const LoadingRows = (): ReactElement => (
  <>
    {[...Array(5)].map((_, index) => (
      <tr key={`loader-row-${index}`}>
        <td colSpan={100}>
          <LoadSpinner />
        </td>
      </tr>
    ))}
  </>
);

function DataTable<T>(props: DataTableProps<T>) {
  const p = { ...DEFAULT_PROPS, ...props };
    
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
  )

  const table = useReactTable<T>({
    data: p.data,
    columns: p.columns,
    filterFns: {},
    state: {
        columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(), 
    getSortedRowModel: getSortedRowModel(),
    debugTable: process.env.NODE_ENV !== 'production',
  });

  return (
      <div className="flex flex-col space-y-4">
          {p.showPagination && <PaginationButtons table={table}/>}
          <div className="p-3 rounded-lg shadow-lg border border-true-gray-400/[0.4]">
              <table className="w-full">
                  <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                              return (
                                  <th
                                      key={header.id}
                                      colSpan={header.colSpan}
                                  >
                                      {header.isPlaceholder ? null : (
                                          <>
                                          <div className="px-2 py-1">
                                              {flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                              {{
                                                  asc: ' 🔼',
                                                  desc: ' 🔽',
                                              }[header.column.getIsSorted() as string] ?? null}
                                          </div>
                                          {header.column.getCanFilter() ? (
                                              <div className="flex">
                                                  <Filter column={header.column} />
                                              </div>
                                          ) : null}
                                          </>
                                      )}
                                      <div className="h-[2px] w-[98%] mb-2 bg-brand-50/[0.2]" />
                                  </th>
                              );
                          })}
                      </tr>
                  ))}
                  </thead>
                  <tbody>
                  {p.isLoading && <LoadingRows/>}
                  {(p.showPagination
                          ? table.getPaginationRowModel()
                          : table.getCoreRowModel()
                  ).rows.map((row) => {
                      return (
                          <tr key={row.id}>
                              {row.getVisibleCells().map((cell) => {
                                  return (
                                      <td key={cell.id} className="h-[80px] px-4 py-1 border-b border-true-gray-300">
                                          {flexRender(
                                              cell.column.columnDef.cell,
                                              cell.getContext()
                                          )}
                                      </td>
                                  );
                              })}
                          </tr>
                      );
                  })}
                  {p.isLoadingMore && <LoadingRows/>}
                  </tbody>
              </table>
          </div>

          <div className="flex space-x-5 ml-auto">
              <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
              >
                  {'<<'}
              </button>
              <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
              >
                  {'<'}
              </button>
              <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
              >
                  {'>'}
              </button>
              <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
              >
                  {'>>'}
              </button>
          </div>
      </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = column.columnDef.meta ?? {}

    return filterVariant === 'priority' ? (
        <TicketPriorityComp includeNone={true} priority={stringToEnum((columnFilterValue ?? 'None') as string, TicketPriority) as unknown as TicketPriority} updateTicketPriority={(priority: TicketPriority) => { column.setFilterValue(priority) }} />
    ) : filterVariant === 'status' ? (
        <TicketStatusComp selectable={true} includeNone={true} status={stringToEnum((columnFilterValue ?? 'None') as string, TicketStatus) as unknown as TicketStatus} updateTicketStatus={(status: TicketStatus) => { column.setFilterValue(status) }} />
    ) : filterVariant === 'role' ? (
        <UserRoleComp role={(columnFilterValue as string ?? 'None')} updateUserRole={(role: string) => { column.setFilterValue(role) }} />
    ) : (
        <DebouncedInput
            className="w-36 shadow-xl mr-auto py-1 px-2 bg-true-gray-200 font-normal"
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
    )
}

function stringToEnum(errorCode: string, enumeration: any): number | undefined {
    for (let key in enumeration) {
        if (enumeration[key] === errorCode) {
            return parseInt(key);
        }
    }
    return undefined;
}


// A typical debounced input react component
function DebouncedInput({
                            value: initialValue,
                            onChange,
                            debounce = 500,
                            ...props
                        }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}


export default DataTable;
 