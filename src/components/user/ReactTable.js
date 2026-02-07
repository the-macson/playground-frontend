'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  Pagination,
  Tooltip,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from 'lucide-react';

export default function ReactTable({ dataArray }) {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    let filteredData = [...dataArray];

    if (filterValue) {
      filteredData = filteredData.filter(
        (item) =>
          item.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.tags?.some((tag) => tag.name.toLowerCase().includes(filterValue.toLowerCase())),
      );
    }

    return filteredData;
  }, [dataArray, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const onSearchChange = (value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  };

  const getDifficultyChip = (difficulty) => {
    switch (difficulty) {
      case 1:
        return (
          <Chip
            className='capitalize bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            size='sm'
            variant='bordered'
          >
            Easy
          </Chip>
        );
      case 2:
        return (
          <Chip className='capitalize bg-amber-500/10 text-amber-500 border-amber-500/20' size='sm' variant='bordered'>
            Medium
          </Chip>
        );
      case 3:
        return (
          <Chip className='capitalize bg-rose-500/10 text-rose-500 border-rose-500/20' size='sm' variant='bordered'>
            Hard
          </Chip>
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-end gap-3 px-1'>
        <Input
          isClearable
          className='w-full sm:max-w-[44%] glass-dark rounded-xl'
          placeholder='Search by title or tags...'
          startContent={<SearchIcon size={18} className='text-default-400' />}
          value={filterValue}
          onClear={() => onSearchChange('')}
          onValueChange={onSearchChange}
        />
        <div className='flex gap-3 items-center'>
          <span className='text-default-400 text-small'>Total {dataArray.length} problems</span>
        </div>
      </div>

      <Table
        aria-label='Example table with custom cells'
        isHeaderSticky
        bottomContent={
          <div className='flex w-full justify-center'>
            <Pagination
              isCompact
              showControls
              showBlur
              color='primary'
              page={page}
              total={pages}
              onChange={setPage}
              className='glass rounded-full p-1'
            />
          </div>
        }
        classNames={{
          wrapper: 'glass-dark rounded-2xl border border-white/5 p-4',
          th: 'bg-transparent text-default-500 border-b border-white/5 font-semibold py-4 px-6',
          td: 'py-4 px-6 text-foreground/80',
          tr: 'hover:bg-white/5 transition-colors cursor-pointer group rounded-xl',
        }}
      >
        <TableHeader>
          <TableColumn key='title'>TITLE</TableColumn>
          <TableColumn key='difficulty'>DIFFICULTY</TableColumn>
          <TableColumn key='tags'>TAGS</TableColumn>
          <TableColumn key='action' align='center'>
            ACTION
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No problems found'} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className='flex flex-col'>
                  <p className='text-bold text-sm group-hover:text-sky-400 transition-colors'>{item.title}</p>
                </div>
              </TableCell>
              <TableCell>{getDifficultyChip(item.difficulty)}</TableCell>
              <TableCell>
                <div className='flex gap-2 flex-wrap'>
                  {item.tags?.map((tag) => (
                    <Chip key={tag.name} size='sm' variant='dot' className='border-white/10 text-default-400'>
                      {tag.name}
                    </Chip>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  size='sm'
                  variant='shadow'
                  className='bg-sky-500 text-white font-semibold rounded-full group-hover:scale-105 transition-transform'
                  onClick={() => router.push(`/problem/${item.id}`)}
                >
                  Solve
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
