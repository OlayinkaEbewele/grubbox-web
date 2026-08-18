import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { PartnerOrderStatus } from "@/lib/data/partner";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-surface-alt border-hairline rounded-[20px] border-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  /** Week-over-week movement, shown in green under the value. */
  delta?: string;
  caption?: string;
  children?: ReactNode;
}

export function StatCard({ label, value, delta, caption, children }: StatCardProps) {
  return (
    <Panel className="p-5.5">
      <h3 className="text-fg-subtle mb-2 text-[12.5px] font-bold">{label}</h3>
      <div className="flex items-end justify-between gap-2.5">
        <div>
          <p className="text-[26px] font-extrabold tabular-nums">{value}</p>
          {delta && (
            <p className="text-success mt-1 text-[12.5px] font-bold">▲ {delta}</p>
          )}
          {caption && (
            <p className="text-fg-subtle mt-1.5 text-[12.5px] font-bold">{caption}</p>
          )}
        </div>
        {children}
      </div>
    </Panel>
  );
}

const STATUS_TONES: Record<PartnerOrderStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-[rgba(201,163,255,0.15)] text-primary" },
  preparing: { label: "Preparing", className: "bg-[rgba(247,200,115,0.15)] text-accent" },
  delivered: { label: "Delivered", className: "bg-[rgba(74,222,128,0.15)] text-success" },
  cancelled: { label: "Cancelled", className: "bg-hairline text-fg-subtle" },
};

export function StatusBadge({ status }: { status: PartnerOrderStatus }) {
  const tone = STATUS_TONES[status];
  return (
    <span
      className={cn(
        "flex-none rounded-full px-3.5 py-1.5 text-xs font-extrabold",
        tone.className,
      )}
    >
      {tone.label}
    </span>
  );
}

export { STATUS_TONES };
