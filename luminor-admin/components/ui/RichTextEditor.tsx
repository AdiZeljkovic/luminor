"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming alias is configured, otherwise ../../lib/utils

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL slike:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-2 border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", editor.isActive('bold') ? 'bg-gray-200 text-black' : 'text-gray-600')}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", editor.isActive('italic') ? 'bg-gray-200 text-black' : 'text-gray-600')}
                title="Italic"
            >
                <Italic size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'text-gray-600')}
                title="Heading 2"
            >
                <Heading1 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-black' : 'text-gray-600')}
                title="Heading 3"
            >
                <Heading2 size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'text-gray-600')}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", editor.isActive('orderedList') ? 'bg-gray-200 text-black' : 'text-gray-600')}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition-colors", editor.isActive('blockquote') ? 'bg-gray-200 text-black' : 'text-gray-600')}
                title="Quote"
            >
                <Quote size={18} />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600"
                title="Add Image"
            >
                <ImageIcon size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center flex-grow" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50"
                title="Undo"
            >
                <Undo size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50"
                title="Redo"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

export default function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[150px]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });


    return (
        <div className={cn("border-2 border-dark rounded-lg overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col transition-all", className)}>
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto max-h-[500px] bg-white text-dark">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
