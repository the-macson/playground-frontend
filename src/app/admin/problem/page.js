'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Tooltip,
} from '@nextui-org/react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { isLoggedIn } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { getAllProblems, deleteProblem } from '@/services/adminService';
import { showToast } from '@/util/toast';
import Swal from 'sweetalert2';

export default function AdminProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const Router = useRouter();

  const fetchProblems = async () => {
    try {
      const { data } = await getAllProblems();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn('admin')) {
      Router.push('/login');
      return;
    }
    fetchProblems();
  }, [Router]);

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f31260',
      cancelButtonColor: '#3f3f46',
      confirmButtonText: 'Yes, delete it!',
      background: '#020617',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        await deleteProblem(id);
        showToast('Problem has been removed.');
        fetchProblems();
      } catch (error) {
        showToast('Failed to delete the problem.', 'error');
      }
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '1':
        return 'success';
      case '2':
        return 'warning';
      case '3':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case '1':
        return 'Easy';
      case '2':
        return 'Medium';
      case '3':
        return 'Hard';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className='min-h-screen bg-[#020617] p-6 lg:p-10'>
      <div className='max-w-full mx-auto space-y-6'>
        <div className='flex justify-between items-end px-2'>
          <div className='space-y-1'>
            <h1 className='text-4xl font-black tracking-tighter text-white font-heading italic'>
              PROBLEM <span className='text-sky-400'>MANAGEMENT</span>
            </h1>
            <p className='text-default-500 font-mono text-xs uppercase tracking-widest'>
              Control the challenges of the playground
            </p>
          </div>
          <Button
            color='primary'
            variant='shadow'
            startContent={<Plus size={18} />}
            className='bg-gradient-to-r from-sky-500 to-blue-600 font-black tracking-widest uppercase'
            onClick={() => Router.push('/admin/problem/add-problem')}
          >
            Create New Problem
          </Button>
        </div>

        <div className='glass-dark border-white/5 rounded-3xl overflow-hidden shadow-2xl'>
          <Table
            aria-label='Problem management table'
            classNames={{
              base: 'p-4',
              table: 'min-h-[400px]',
              thead: 'bg-transparent',
              th: 'bg-white/5 text-default-500 font-black uppercase text-[10px] tracking-widest py-4 border-b border-white/5',
              td: 'py-4 border-b border-white/5 group-data-[last=true]:border-none',
            }}
          >
            <TableHeader>
              <TableColumn>RANKING ID</TableColumn>
              <TableColumn>TITLE</TableColumn>
              <TableColumn>DIFFICULTY</TableColumn>
              <TableColumn align='center'>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={'No problems found in the laboratory.'}
              loadingContent={<div className='text-sky-400 font-mono italic animate-pulse'>Scanning database...</div>}
              isLoading={loading}
              items={problems}
            >
              {(item) => (
                <TableRow key={item.id} className='hover:bg-white/[0.02] transition-colors group'>
                  <TableCell>
                    <span className='font-mono text-xs text-sky-400/60 group-hover:text-sky-400 transition-colors'>
                      #{item.id.toString().padStart(4, '0')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='text-white font-bold tracking-tight text-base group-hover:text-sky-300 transition-colors'>
                        {item.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getDifficultyColor(item.difficulty)}
                      variant='flat'
                      size='sm'
                      className='font-black uppercase text-[9px] tracking-widest px-2'
                    >
                      {getDifficultyLabel(item.difficulty)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center gap-2'>
                      <Tooltip
                        content='Edit Challenge'
                        placement='top'
                        closeDelay={0}
                        className='font-bold text-[10px] uppercase tracking-widest'
                      >
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          className='text-default-400 hover:text-sky-400 min-w-unit-8 w-8 h-8'
                          onClick={() => Router.push(`/admin/problem/${item.id}`)}
                        >
                          <Edit2 size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        content='Delete Challenge'
                        color='danger'
                        placement='top'
                        closeDelay={0}
                        className='font-bold text-[10px] uppercase tracking-widest'
                      >
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          className='text-default-400 hover:text-danger min-w-unit-8 w-8 h-8'
                          onClick={() => handleDelete(item.id, item.title)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
