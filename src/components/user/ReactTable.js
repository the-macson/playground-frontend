import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  useGlobalFilter,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Box,
  Button,
  Flex,
  Select,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper();


export default function ReactTable({ dataArray }) {
  const Router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const data = React.useMemo(() => [...dataArray], []);
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("difficulty", {
      header: "Difficulty",
      cell: (info) =>
        info.getValue() == 1
          ? "Easy"
          : info.getValue() == 2
          ? "Medium"
          : "Hard",
    }),
    columnHelper.accessor((row) => row.id, {
      header: "Status",
      id: "update",
      cell: (info) => (
        <Button
          onClick={() => {
            Router.push(`/problem/${info.row.original.id}`);
          }}>
          Solve
        </Button>
      ),
    }),
  ];
  const {
    getHeaderGroups,
    getRowModel,
    getGlobalFilterProps,
    pagination,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    firstPage,
    lastPage,
    getState,
    getCanPreviousPage,
    getCanNextPage,
    getPageCount,
    setPageSize,
  } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 1, //custom initial page index
        pageSize: 10, //custom default page size
      },
    },
  });

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    !isLoading && (
      <Box>
        <Box my="3" borderWidth="1px" borderRadius="lg" overflow="auto">
          <Table>
            <Thead>
              {getHeaderGroups &&
                getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th
                        colSpan={header.colSpan}
                        key={header.id}
                        style={{
                          textAlign: "left",
                          paddingLeft: "25px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          borderBottom: "1px solid #e2e8f0",
                        }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Th>
                    ))}
                  </Tr>
                ))}
            </Thead>
            <Tbody>
              {getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Flex justify="flex-end">
          <Flex justify="space-between" gap={2} alignItems={"center"}>
            <Text>
              Page{" "}
              <strong>
                {getState().pagination.pageIndex + 1} of {getPageCount()}
              </strong>{" "}
            </Text>
            <Button
              onClick={() => firstPage()}
              isDisabled={!getCanPreviousPage()}>
              {"<<"}
            </Button>
            <Button
              onClick={() => previousPage()}
              isDisabled={!getCanPreviousPage()}>
              {"<"}
            </Button>
            <Button onClick={() => nextPage()} isDisabled={!getCanNextPage()}>
              {">"}
            </Button>
            <Button onClick={() => lastPage()} isDisabled={!getCanNextPage()}>
              {">>"}
            </Button>
            <Select
              w={24}
              value={getState().pagination.pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Box>
    )
  );
}
