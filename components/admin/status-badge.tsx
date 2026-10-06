import { Badge } from "@/components/ui/badge";
import { leadStatusLabels } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { LeadStatus, PublishStatus } from "@/lib/types";

export function PublishBadge({ status }: { status: PublishStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5",
        status === "published"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
      )}
    >
      <span className={cn("size-1.5 rounded-full", status === "published" ? "bg-emerald-500" : "bg-amber-500")} />
      {status === "published" ? "Published" : "Draft"}
    </Badge>
  );
}

const leadTone: Record<LeadStatus, string> = {
  new: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  contacted: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-400",
  quoted: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  closed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="outline" className={leadTone[status]}>
      {leadStatusLabels[status]}
    </Badge>
  );
}
