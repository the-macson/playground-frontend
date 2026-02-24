'use client';

import React, { useState, useEffect } from 'react';
import { isLoggedIn } from '../../../../services/authService';
import { useRouter } from 'next/navigation';
import { Card, Input, Button, Select, SelectItem, Textarea, Divider, Chip } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import { object, string, number, array } from 'yup';
import { Plus, Trash2, Save, ArrowLeft, Beaker, Zap } from 'lucide-react';
import { getTags, addProblem } from '../../../../services/adminService';
import InternalEditor from '../../../../components/common/InternalEditor';
import CompactTestCase from '../../../../components/admin/CompactTestCase';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';

// Removed JoditEditor dynamic import

export default function AddProblem() {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set([]));
  const [inputOutput, setInputOutput] = useState([{ id: 'init-1', input: '', output: '' }]);
  const [form, setForm] = useState({ title: '', description: '', difficulty: '' });
  const Router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const difficulties = [
    { label: 'Easy', value: '1', color: 'success' },
    { label: 'Medium', value: '2', color: 'warning' },
    { label: 'Hard', value: '3', color: 'danger' },
  ];

  const problemSchema = object({
    title: string().required('Title is required'),
    description: string().required('Description is required').min(20, 'Description must be at least 20 characters'),
    difficulty: string().required('Difficulty is required'),
    problemIOs: array().of(
      object({
        input: string().required('Input is required'),
        output: string().required('Output is required'),
      }),
    ),
  });

  useEffect(() => {
    if (!isLoggedIn('admin')) {
      Router.push('/login');
      return;
    }
    fetchTags();
  }, [Router]);

  const fetchTags = async () => {
    try {
      const { data } = await getTags();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleAddTestCase = () => {
    setInputOutput([
      ...inputOutput,
      { id: `tc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, input: '', output: '' },
    ]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setInputOutput((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveTestCase = (index) => {
    if (inputOutput.length > 1) {
      const newItems = [...inputOutput];
      newItems.splice(index, 1);
      setInputOutput(newItems);
    }
  };

  const handleIOChange = (index, field, value) => {
    const newItems = [...inputOutput];
    newItems[index][field] = value;
    setInputOutput(newItems);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      tags: Array.from(selectedTags).map((id) => ({ tagId: parseInt(id) })),
      problemIOs: inputOutput.map(({ input, output }) => ({ input, output })),
    };

    try {
      setLoading(true);
      await problemSchema.validate(data);
      await addProblem(data);
      Swal.fire({
        title: 'Success',
        text: 'Problem synthesized successfully',
        icon: 'success',
        background: '#020617',
        color: '#fff',
      });
      Router.push('/admin/problem');
    } catch (err) {
      Swal.fire({
        title: 'Validation Error',
        text: err.errors ? err.errors[0] : 'Check your inputs',
        icon: 'error',
        background: '#020617',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#020617] p-6 lg:p-10 pb-32'>
      <div className='max-w-full mx-auto space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <Button
            variant='light'
            startContent={<ArrowLeft size={18} />}
            className='text-default-400 hover:text-white font-bold uppercase tracking-widest text-[10px]'
            onClick={() => Router.push('/admin/problem')}
          >
            Back to Challenges
          </Button>
          <div className='text-right'>
            <h1 className='text-3xl font-black tracking-tighter text-white font-heading uppercase italic'>
              ADD <span className='text-sky-400'>CHALLENGE</span>
            </h1>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Main Form - Left Panel */}
          <div className='lg:col-span-12 xl:col-span-7 space-y-6'>
            <Card className='glass-dark border-white/5 p-6 shadow-2xl space-y-6'>
              <div className='space-y-6'>
                <Input
                  label='CHALLENGE TITLE'
                  labelPlacement='outside'
                  placeholder='Maximum Subarray'
                  variant='bordered'
                  classNames={{
                    label: 'text-sky-400 font-black uppercase text-[10px] tracking-widest mb-1',
                    inputWrapper: 'bg-white/5 border-white/10 group-data-[focus=true]:border-sky-400/50',
                  }}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <div className='space-y-1'>
                  <label className='text-sky-400 font-black uppercase text-[10px] tracking-widest'>DESCRIPTION</label>
                  <InternalEditor value={form.description} onChange={(val) => setForm({ ...form, description: val })} />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Select
                    label='CHALLENGE TAGS'
                    labelPlacement='outside'
                    placeholder='Select categories'
                    variant='bordered'
                    selectionMode='multiple'
                    selectedKeys={selectedTags}
                    onSelectionChange={setSelectedTags}
                    classNames={{
                      label: 'text-sky-400 font-black uppercase text-[10px] tracking-widest mb-1',
                      trigger: 'bg-white/5 border-white/10 group-data-[focus=true]:border-sky-400/50',
                      value: 'text-sky-400 font-bold',
                    }}
                  >
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id} className='text-white'>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label='DIFFICULTY'
                    labelPlacement='outside'
                    placeholder='Choose difficulty'
                    variant='bordered'
                    onSelectionChange={(keys) => setForm({ ...form, difficulty: Array.from(keys)[0] })}
                    classNames={{
                      label: 'text-sky-400 font-black uppercase text-[10px] tracking-widest mb-1',
                      trigger: 'bg-white/5 border-white/10 group-data-[focus=true]:border-sky-400/50',
                    }}
                  >
                    {difficulties.map((d) => (
                      <SelectItem key={d.value} value={d.value} textValue={d.label}>
                        <div className='flex items-center gap-2'>
                          <Chip color={d.color} size='sm' variant='dot'>
                            {d.label}
                          </Chip>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <Button
                color='primary'
                size='lg'
                variant='shadow'
                isLoading={loading}
                onClick={handleSubmit}
                startContent={!loading && <Save size={20} />}
                className='w-full bg-gradient-to-r from-sky-500 to-blue-600 font-black tracking-widest uppercase py-8 shadow-sky-500/20'
              >
                Finalize Challenge
              </Button>
            </Card>
          </div>

          {/* Test Cases - Right Panel */}
          <div className='lg:col-span-12 xl:col-span-5'>
            <Card className='glass-dark border-white/5 p-6 shadow-2xl h-full flex flex-col'>
              <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-2'>
                  <Beaker className='text-emerald-400' size={18} />
                  <h3 className='text-white font-black tracking-widest uppercase text-[10px]'>
                    LABORATORY SAMPLES <span className='text-white/20 ml-2'>( {inputOutput.length} )</span>
                  </h3>
                </div>
                <Button
                  size='sm'
                  variant='flat'
                  startContent={<Plus size={16} />}
                  onClick={handleAddTestCase}
                  className='text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400'
                >
                  New Sample
                </Button>
              </div>

              <div className='space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar'>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToFirstScrollableAncestor]}
                >
                  <SortableContext items={inputOutput.map((io) => io.id)} strategy={verticalListSortingStrategy}>
                    {inputOutput.map((io, index) => (
                      <CompactTestCase
                        key={io.id}
                        id={io.id}
                        index={index}
                        io={io}
                        onChange={handleIOChange}
                        onRemove={handleRemoveTestCase}
                        isOnly={inputOutput.length === 1}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>

              {inputOutput.length > 5 && (
                <div className='mt-4 p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl flex items-center gap-3'>
                  <Zap className='text-emerald-400' size={16} />
                  <p className='text-[10px] text-emerald-300 font-bold uppercase tracking-wider'>
                    Pro Tip: Scroll down for all {inputOutput.length} samples.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
