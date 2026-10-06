"use client";

import { ChevronDown, Maximize2, Minimize2, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrgNode } from "@/lib/types";

const collectIds = (node: OrgNode): string[] => [
  ...(node.children?.length ? [node.id] : []),
  ...(node.children ?? []).flatMap(collectIds),
];

/**
 * Sơ đồ tổ chức dạng cây: bấm vào từng khối để mở/thu gọn cấp dưới.
 * Cấp 0–1 dàn ngang trên desktop, các cấp sâu hơn xếp dọc có đường nối —
 * nhờ vậy vẫn đọc tốt trên màn hình điện thoại.
 */
export function OrgChart({ root }: { root: OrgNode }) {
  const allIds = useMemo(() => collectIds(root), [root]);
  const [open, setOpen] = useState<Set<string>>(() => new Set([root.id, ...(root.children ?? []).map((c) => c.id)]));

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allOpen = open.size >= allIds.length;

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_30px_80px_-40px_rgba(21,26,46,.35)] sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Bấm vào từng khối để xem các phòng ban trực thuộc.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(new Set(allOpen ? [root.id] : allIds))}
          className="shrink-0 rounded-full"
        >
          {allOpen ? <Minimize2 /> : <Maximize2 />}
          {allOpen ? "Thu gọn" : "Mở tất cả"}
        </Button>
      </div>

      {/* Cấp 0 */}
      <div className="flex justify-center">
        <NodeCard node={root} level={0} expanded={open.has(root.id)} onToggle={() => toggle(root.id)} />
      </div>

      <AnimatePresence initial={false}>
        {open.has(root.id) && root.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {/* Đường nối ngang giữa các nhánh cấp 1 */}
            <div className="mx-auto h-8 w-px bg-gold-400" />
            <div className="relative grid gap-6 md:grid-cols-2 md:gap-10">
              <div className="absolute top-0 right-1/4 left-1/4 hidden h-px bg-gold-400 md:block" />
              {root.children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="hidden h-6 w-px bg-gold-400 md:block" />
                  <NodeCard node={child} level={1} expanded={open.has(child.id)} onToggle={() => toggle(child.id)} />
                  <Branch nodes={child.children} visible={open.has(child.id)} open={open} toggle={toggle} level={2} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Branch({
  nodes,
  visible,
  open,
  toggle,
  level,
}: {
  nodes?: OrgNode[];
  visible: boolean;
  open: Set<string>;
  toggle: (id: string) => void;
  level: number;
}) {
  return (
    <AnimatePresence initial={false}>
      {visible && nodes?.length ? (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={cn("w-full overflow-hidden", level === 2 ? "mt-4 space-y-3" : "mt-3 ml-5 space-y-2 border-l border-dashed border-gold-400/70 pl-5")}
        >
          {nodes.map((node) => (
            <li key={node.id} className={cn("relative", level > 2 && "before:absolute before:top-5 before:-left-5 before:h-px before:w-5 before:bg-gold-400/70")}>
              <NodeCard node={node} level={level} expanded={open.has(node.id)} onToggle={() => toggle(node.id)} />
              <Branch nodes={node.children} visible={open.has(node.id)} open={open} toggle={toggle} level={level + 1} />
            </li>
          ))}
        </motion.ul>
      ) : null}
    </AnimatePresence>
  );
}

function NodeCard({
  node,
  level,
  expanded,
  onToggle,
}: {
  node: OrgNode;
  level: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const Comp = hasChildren ? "button" : "div";

  return (
    <Comp
      {...(hasChildren ? { type: "button" as const, onClick: onToggle, "aria-expanded": expanded } : {})}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border text-left transition-all duration-300",
        hasChildren && "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-gold-300 focus-visible:outline-none",
        level === 0 && "max-w-xs border-navy-800 bg-navy-900 px-5 py-4 text-white",
        level === 1 && "max-w-sm border-gold-300 bg-gold-50 px-5 py-4 text-navy-900",
        level === 2 && "border-navy-100 bg-white px-4 py-3 text-navy-900",
        level > 2 && "border-transparent bg-muted/70 px-3 py-2 text-sm text-navy-800",
      )}
    >
      {node.person && level < 3 && (
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full",
            level === 0 ? "bg-gold-300 text-navy-900" : "bg-navy-900 text-gold-200",
          )}
        >
          <UserRound className="size-5" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block font-semibold", level > 2 && "font-medium")}>{node.title}</span>
        {node.person && (
          <span className={cn("block text-xs", level === 0 ? "text-gold-200" : "text-muted-foreground")}>{node.person}</span>
        )}
      </span>
      {hasChildren && (
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform duration-300", expanded && "rotate-180", level === 0 ? "text-gold-300" : "text-gold-600")}
        />
      )}
    </Comp>
  );
}
