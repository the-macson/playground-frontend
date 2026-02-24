'use client';

import React from 'react';
import { Textarea, Button, Tooltip } from '@nextui-org/react';
import { Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function CompactTestCase({ id, index, io, onChange, onRemove, isOnly }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='group flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all relative'
    >
      <div className='flex flex-col items-center gap-2 pt-2'>
        <span className='text-[10px] font-mono text-white/20 select-none'>#{index + 1}</span>
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing text-white/10 group-hover:text-white/30 p-1 hover:bg-white/5 rounded transition-colors'
        >
          <GripVertical size={14} />
        </div>
      </div>

      <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Textarea
          placeholder='Input data...'
          minRows={1}
          maxRows={4}
          value={io.input}
          onChange={(e) => onChange(index, 'input', e.target.value)}
          classNames={{
            base: 'transition-all',
            inputWrapper: 'bg-black/20 border-white/5 group-data-[focus=true]:border-sky-500/30 min-h-[40px] py-1',
            input: 'font-mono text-xs text-sky-400 placeholder:text-white/10',
          }}
        />
        <Textarea
          placeholder='Expected output...'
          minRows={1}
          maxRows={4}
          value={io.output}
          onChange={(e) => onChange(index, 'output', e.target.value)}
          classNames={{
            base: 'transition-all',
            inputWrapper: 'bg-black/20 border-white/5 group-data-[focus=true]:border-emerald-500/30 min-h-[40px] py-1',
            input: 'font-mono text-xs text-emerald-400 placeholder:text-white/10',
          }}
        />
      </div>

      {!isOnly && (
        <Tooltip content='Remove Sample' color='danger' closeDelay={0} className='font-bold text-[10px] uppercase'>
          <Button
            isIconOnly
            size='sm'
            variant='light'
            onClick={() => onRemove(index)}
            className='text-white/10 hover:text-red-500 hover:bg-red-500/10 min-w-8 w-8 h-8 rounded-full transition-all'
          >
            <Trash2 size={14} />
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
