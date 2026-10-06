/**
 * Lọc HTML từ trình soạn thảo trước khi lưu. Tiptap chỉ sinh ra tập thẻ
 * giới hạn, nhưng Server Action có thể bị gọi trực tiếp nên vẫn cần chặn
 * script, handler sự kiện và iframe ngoài YouTube.
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<\s*(script|style|object|embed|form|input|textarea|button)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|object|embed|link|meta|base)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["']?)\s*(javascript|vbscript|data):[^"'\s>]*/gi, '$1=$2#')
    .replace(/<iframe\b(?![^>]*\bsrc=["']https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/)[^>]*>[\s\S]*?<\/iframe>/gi, "");
}
