'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Button, ButtonGroup, Tooltip } from '@nextui-org/react';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Code, Undo, Redo } from 'lucide-react';

const MenuButton = ({ onClick, isActive, icon: Icon, label }) => (
  <Tooltip content={label} placement='top' closeDelay={0} className='font-bold text-[10px] uppercase tracking-widest'>
    <Button
      isIconOnly
      size='sm'
      variant={isActive ? 'flat' : 'light'}
      color={isActive ? 'primary' : 'default'}
      onClick={onClick}
      className={`w-8 h-8 ${isActive ? 'text-sky-400 bg-sky-400/10' : 'text-white/40 hover:text-white'}`}
    >
      <Icon size={16} />
    </Button>
  </Tooltip>
);

export default function InternalEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: true,
        orderedList: true,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px] p-6 text-white/90 font-sans',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className='w-full border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] flex flex-col group focus-within:border-sky-500/30 transition-all shadow-inner'>
      <div className='flex flex-wrap items-center gap-1 p-2 bg-white/[0.03] border-b border-white/5'>
        <ButtonGroup variant='light' size='sm'>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={Bold}
            label='Bold'
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={Italic}
            label='Italic'
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={UnderlineIcon}
            label='Underline'
          />
        </ButtonGroup>

        <div className='w-px h-4 bg-white/10 mx-1' />

        <ButtonGroup variant='light' size='sm'>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={List}
            label='Bullet List'
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={ListOrdered}
            label='Ordered List'
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            icon={Code}
            label='Code Block'
          />
        </ButtonGroup>

        <div className='w-px h-4 bg-white/10 mx-1' />

        <ButtonGroup variant='light' size='sm'>
          <MenuButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} label='Undo' />
          <MenuButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} label='Redo' />
        </ButtonGroup>
      </div>

      <div className='flex-1 max-h-[400px] overflow-y-auto custom-scrollbar'>
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror p {
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror pre {
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 0.5rem;
          font-family: monospace;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
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
