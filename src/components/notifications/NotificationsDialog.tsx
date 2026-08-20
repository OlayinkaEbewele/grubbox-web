"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  formatAgo,
  useNotifications,
  type NotificationKind,
} from "@/lib/notifications";
import { cn } from "@/lib/cn";

const KIND_TINT: Record<NotificationKind, string> = {
  order: "bg-[rgba(201,163,255,0.15)] text-primary",
  promo: "bg-[rgba(247,200,115,0.15)] text-accent",
  account: "bg-[rgba(74,222,128,0.15)] text-success",
};

const KIND_ICON: Record<NotificationKind, string> = {
  order: "🛵",
  promo: "🎟️",
  account: "🏅",
};

interface NotificationsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsDialog({
  open,
  onClose,
}: NotificationsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { notifications, unreadCount, isRead, markRead, markAllRead } =
    useNotifications();

  // showModal() brings focus trapping, page inertness and Escape with it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="notifications-dialog-title"
      className={cn(
        "bg-surface border-hairline text-fg m-auto w-full max-w-[460px] rounded-[28px] border-2 p-7",
        "backdrop:bg-black/60",
        "opacity-0 transition-[opacity,transform,overlay,display] duration-250 ease-[var(--ease-out-strong)]",
        "transition-discrete scale-95 open:scale-100 open:opacity-100",
        "starting:open:scale-95 starting:open:opacity-0",
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2
            id="notifications-dialog-title"
            className="font-display mb-1 text-2xl"
          >
            Notifications
          </h2>
          <p className="text-fg-subtle text-sm">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>

        <div className="flex flex-none items-center gap-3">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="text-primary hover:text-primary-light text-[12.5px] font-bold transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-fg-subtle hover:text-fg -mt-1 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          variant="notifications"
          frame="bare"
          as="h3"
          title="Nothing yet"
          description="Order updates and offers will show up here."
        />
      ) : (
        <ul className="rail flex max-h-[60vh] flex-col gap-1.5 overflow-y-auto pr-1">
          {notifications.map((notification) => {
            const read = isRead(notification.id);

            // Reading counts as reading: hovering or focusing an entry clears
            // its unread dot, the way a notification tray normally behaves.
            const rowProps = {
              onMouseEnter: () => markRead(notification.id),
              onFocus: () => markRead(notification.id),
              className: cn(
                "flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors duration-150",
                read
                  ? "hover:bg-surface-3"
                  : "bg-surface-3/60 hover:bg-surface-3",
              ),
            };

            const body = (
              <>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-9 flex-none items-center justify-center rounded-[11px] text-base",
                    KIND_TINT[notification.kind],
                  )}
                >
                  {KIND_ICON[notification.kind]}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="mb-0.5 flex items-center gap-2">
                    <span
                      className={cn(
                        "text-fg text-sm",
                        read ? "font-bold" : "font-extrabold",
                      )}
                    >
                      {notification.title}
                    </span>
                    {!read && (
                      <span
                        className="bg-primary size-1.75 flex-none rounded-full"
                        aria-label="Unread"
                      />
                    )}
                  </span>
                  <span className="text-fg-subtle block text-[12.5px] leading-relaxed">
                    {notification.body}
                  </span>
                  <span className="text-fg-subtle mt-1 block text-[11.5px] font-semibold">
                    {formatAgo(notification.minutesAgo)}
                  </span>
                </span>
              </>
            );

            return (
              <li key={notification.id}>
                {notification.href ? (
                  <Link
                    href={notification.href}
                    onClick={onClose}
                    {...rowProps}
                  >
                    {body}
                  </Link>
                ) : (
                  <div {...rowProps}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </dialog>
  );
}
