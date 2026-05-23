import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Heading1, Heading2, List, ListOrdered,
  Code, Quote, Undo, Redo, Type
} from 'lucide-react';
import './RichTextEditor.css';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      icon: <Bold size={18} />,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      icon: <Type size={18} />,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      icon: <Heading1 size={18} />,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 size={18} />,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <List size={18} />,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered size={18} />,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
    },
    {
      icon: <Code size={18} />,
      title: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
    },
    {
      icon: <Quote size={18} />,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
    },
  ];

  return (
    <div className="rte-toolbar">
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.preventDefault();
            btn.action();
          }}
          className={`rte-toolbar-btn ${btn.isActive ? 'is-active' : ''}`}
          title={btn.title}
        >
          {btn.icon}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
        className="rte-toolbar-btn"
        disabled={!editor.can().undo()}
      >
        <Undo size={18} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
        className="rte-toolbar-btn"
        disabled={!editor.can().redo()}
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

const RichTextEditor = ({ value, onChange, placeholder = 'Write something...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Return HTML or JSON? Let's go with HTML for now as it's easier to render
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync with external value change (e.g. when modal opens or note is cleared)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="rte-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="rte-content" />
    </div>
  );
};

export default RichTextEditor;

