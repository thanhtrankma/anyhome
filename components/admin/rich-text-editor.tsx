"use client";

import ImageExt from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Video,
} from "lucide-react";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { uploadImage } from "@/lib/actions/upload";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  placeholder?: string;
}

type UrlMode = "link" | "youtube" | null;

const EMPTY_STATE = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  h2: false,
  h3: false,
  bullet: false,
  ordered: false,
  quote: false,
  link: false,
  canUndo: false,
  canRedo: false,
  words: 0,
};

/**
 * Trình soạn thảo Tiptap: định dạng văn bản, chèn ảnh công trình
 * (upload trực tiếp hoặc kéo-thả/dán vào khung soạn thảo) và video YouTube.
 */
export function RichTextEditor({ value, onChange, onBlur, invalid, placeholder = "Bắt đầu viết nội dung…" }: RichTextEditorProps) {
  const fileInputId = useId();
  // editorProps chỉ được đọc 1 lần khi khởi tạo → dùng ref để handler luôn thấy editor hiện tại
  const editorRef = useRef<Editor | null>(null);
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState<UrlMode>(null);
  const [url, setUrl] = useState("");

  const insertFiles = async (editor: Editor, files: File[], pos?: number) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) return false;
    setUploading(true);
    for (const file of images) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImage(fd);
      if (!res.ok) {
        toast.error(res.error);
        continue;
      }
      const chain = editor.chain().focus();
      (pos !== undefined ? chain.insertContentAt(pos, { type: "image", attrs: { src: res.data.url, alt: file.name } }) : chain.setImage({ src: res.data.url, alt: file.name })).run();
    }
    setUploading(false);
    return true;
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } },
      }),
      ImageExt.configure({ HTMLAttributes: { loading: "lazy" } }),
      Youtube.configure({ nocookie: true, modestBranding: true, HTMLAttributes: { class: "aspect-video w-full" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose-anyhome min-h-[360px] px-5 py-4 outline-none [&_.is-editor-empty:first-child]:before:pointer-events-none [&_.is-editor-empty:first-child]:before:float-left [&_.is-editor-empty:first-child]:before:h-0 [&_.is-editor-empty:first-child]:before:text-muted-foreground [&_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_img.ProseMirror-selectednode]:ring-3 [&_img.ProseMirror-selectednode]:ring-primary",
      },
      handleDrop: (view, event, _slice, moved) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const current = editorRef.current;
        if (moved || !files.length || !current) return false;
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
        event.preventDefault();
        void insertFiles(current, files, pos);
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        const current = editorRef.current;
        if (!files.length || !current) return false;
        void insertFiles(current, files);
        return true;
      },
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor;
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    onBlur: () => onBlur?.(),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            strike: e.isActive("strike"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
            words: e.getText().trim().split(/\s+/).filter(Boolean).length,
          }
        : EMPTY_STATE,
  }) ?? EMPTY_STATE;

  if (!editor) {
    return <div className="h-[420px] animate-pulse rounded-lg border bg-muted/40" />;
  }

  const openUrl = (mode: Exclude<UrlMode, null>) => {
    setUrl(mode === "link" ? (editor.getAttributes("link").href ?? "") : "");
    setUrlMode(mode);
  };

  const applyUrl = () => {
    const trimmed = url.trim();
    if (urlMode === "link") {
      if (!trimmed) editor.chain().focus().extendMarkRange("link").unsetLink().run();
      else if (!/^(https?:\/\/|mailto:|tel:|\/)/.test(trimmed)) return toast.error("Liên kết phải bắt đầu bằng https://, mailto:, tel: hoặc /");
      else editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
    } else if (urlMode === "youtube") {
      if (!/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(trimmed)) return toast.error("Vui lòng nhập link YouTube hợp lệ");
      editor.chain().focus().setYoutubeVideo({ src: trimmed }).run();
    }
    setUrlMode(null);
  };

  const tools: ({ icon: typeof Bold; label: string; active?: boolean; disabled?: boolean; run: () => void } | "sep")[] = [
    { icon: Undo2, label: "Hoàn tác", disabled: !state.canUndo, run: () => editor.chain().focus().undo().run() },
    { icon: Redo2, label: "Làm lại", disabled: !state.canRedo, run: () => editor.chain().focus().redo().run() },
    "sep",
    { icon: Heading2, label: "Tiêu đề H2", active: state.h2, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: Heading3, label: "Tiêu đề H3", active: state.h3, run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    "sep",
    { icon: Bold, label: "In đậm (⌘B)", active: state.bold, run: () => editor.chain().focus().toggleBold().run() },
    { icon: Italic, label: "In nghiêng (⌘I)", active: state.italic, run: () => editor.chain().focus().toggleItalic().run() },
    { icon: Underline, label: "Gạch chân (⌘U)", active: state.underline, run: () => editor.chain().focus().toggleUnderline().run() },
    { icon: Strikethrough, label: "Gạch ngang", active: state.strike, run: () => editor.chain().focus().toggleStrike().run() },
    "sep",
    { icon: List, label: "Danh sách", active: state.bullet, run: () => editor.chain().focus().toggleBulletList().run() },
    { icon: ListOrdered, label: "Danh sách số", active: state.ordered, run: () => editor.chain().focus().toggleOrderedList().run() },
    { icon: Quote, label: "Trích dẫn", active: state.quote, run: () => editor.chain().focus().toggleBlockquote().run() },
    { icon: Minus, label: "Đường kẻ ngang", run: () => editor.chain().focus().setHorizontalRule().run() },
    "sep",
    { icon: Link2, label: "Chèn liên kết", active: state.link, run: () => openUrl("link") },
    { icon: ImagePlus, label: "Chèn ảnh công trình", run: () => document.getElementById(fileInputId)?.click() },
    { icon: Video, label: "Chèn video YouTube", run: () => openUrl("youtube") },
  ];

  return (
    <div className={cn("rounded-lg border bg-background focus-within:ring-3 focus-within:ring-ring/40", invalid && "border-destructive")}>
      <div role="toolbar" aria-label="Định dạng" className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-lg border-b bg-muted/90 p-1.5 backdrop-blur">
        {tools.map((t, i) =>
          t === "sep" ? (
            <Separator key={`sep-${i}`} orientation="vertical" className="mx-1 h-5!" />
          ) : (
            <Tooltip key={t.label}>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t.label}
                    aria-pressed={t.active}
                    disabled={t.disabled}
                    onClick={t.run}
                    className={cn(t.active && "bg-primary/15 text-primary hover:bg-primary/20")}
                  />
                }
              >
                <t.icon />
              </TooltipTrigger>
              <TooltipContent>{t.label}</TooltipContent>
            </Tooltip>
          ),
        )}
        {uploading && (
          <span className="ml-auto flex items-center gap-1.5 pr-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" /> Đang tải ảnh…
          </span>
        )}
      </div>

      <EditorContent editor={editor} />

      <div className="flex justify-between rounded-b-lg border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        <span>Mẹo: kéo-thả hoặc dán ảnh trực tiếp vào khung soạn thảo</span>
        <span className="tabular-nums">{state.words} từ</span>
      </div>

      <input
        id={fileInputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(e) => {
          void insertFiles(editor, Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      <Dialog open={urlMode !== null} onOpenChange={(o) => !o && setUrlMode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{urlMode === "link" ? "Chèn liên kết" : "Chèn video YouTube"}</DialogTitle>
            <DialogDescription>
              {urlMode === "link" ? "Để trống để gỡ liên kết khỏi đoạn văn bản đã chọn." : "Dán đường dẫn video, ví dụ https://youtu.be/…"}
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyUrl();
              }
            }}
            placeholder={urlMode === "link" ? "https://" : "https://www.youtube.com/watch?v=…"}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUrlMode(null)}>
              Huỷ
            </Button>
            <Button type="button" onClick={applyUrl}>
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
