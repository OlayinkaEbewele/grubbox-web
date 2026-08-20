"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { StarRating } from "@/components/orders/StarRating";
import { useReviews, REVIEW_TAGS } from "@/lib/reviews";
import type { Order } from "@/lib/orders";
import { cn } from "@/lib/cn";

const RATING_COPY = [
  "",
  "Not good",
  "Could be better",
  "Fine",
  "Good",
  "Great",
] as const;

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order;
}

/** Rate a delivered order: stars, a few quick tags, and an optional note. */
export function ReviewDialog({ open, onClose, order }: ReviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { reviewFor, submit } = useReviews();
  const existing = reviewFor(order.id);

  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  // showModal() brings focus trapping, page inertness and Escape with it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      // Seed from the existing review so "Edit rating" isn't a blank slate.
      setRating(existing?.rating ?? 0);
      setTags(existing?.tags ?? []);
      setComment(existing?.comment ?? "");
      setDone(false);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, existing]);

  function toggleTag(tag: string) {
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    submit({
      orderId: order.id,
      restaurantSlug: order.restaurantSlug,
      rating,
      tags,
      comment: comment.trim(),
    });
    setDone(true);
    // Let the thank-you register before the dialog goes away.
    setTimeout(onClose, 900);
  }

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
      aria-labelledby="review-dialog-title"
      className={cn(
        "bg-surface border-hairline text-fg m-auto w-full max-w-[460px] rounded-[28px] border-2 p-8",
        "backdrop:bg-black/60",
        "opacity-0 transition-[opacity,transform,overlay,display] duration-250 ease-[var(--ease-out-strong)]",
        "transition-discrete scale-95 open:scale-100 open:opacity-100",
        "starting:open:scale-95 starting:open:opacity-0",
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="text-fg-subtle hover:text-fg absolute top-5 right-6 text-2xl leading-none transition-colors"
      >
        ×
      </button>

      {done ? (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="pop-in text-success mb-5 flex size-18 items-center justify-center rounded-full bg-[rgba(74,222,128,0.15)]">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 6 9 17l-5-5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h2 id="review-dialog-title" className="font-display mb-1.5 text-2xl">
            Thanks for rating
          </h2>
          <p className="text-fg-subtle text-sm">
            Your feedback goes to {order.restaurantName}.
          </p>
        </div>
      ) : (
        <form onSubmit={save}>
          <h2 id="review-dialog-title" className="font-display mb-1.5 text-2xl">
            How was your order?
          </h2>
          <p className="text-fg-subtle mb-6 text-sm">
            {order.restaurantName} · #{order.id}
          </p>

          <div className="mb-6 flex flex-col items-center gap-2.5">
            <StarRating
              value={rating}
              onChange={setRating}
              label={`Rate your order from ${order.restaurantName}`}
            />
            <p
              aria-live="polite"
              className={cn(
                "text-[13px] font-bold",
                rating > 0 ? "text-accent" : "text-fg-subtle",
              )}
            >
              {rating > 0 ? RATING_COPY[rating] : "Tap a star to rate"}
            </p>
          </div>

          {/* Tags only make sense once there's a rating to qualify. */}
          {rating > 0 && (
            <fieldset className="mb-5">
              <legend className="text-fg-muted mb-2.5 text-[13px] font-bold">
                What stood out?
              </legend>
              <div className="flex flex-wrap gap-2">
                {REVIEW_TAGS.map((tag) => (
                  <Chip
                    key={tag}
                    active={tags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                    className="px-3.5 py-2 text-[13px]"
                  >
                    {tag}
                  </Chip>
                ))}
              </div>
            </fieldset>
          )}

          <label className="mb-6 block">
            <span className="text-fg-muted mb-1.5 block text-[13px] font-bold">
              Anything else? <span className="font-semibold">(optional)</span>
            </span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tell them what worked, or what didn't."
              className="border-hairline bg-surface-3 text-fg placeholder:text-fg-subtle focus:border-primary w-full resize-none rounded-[14px] border-2 px-4 py-3 text-sm outline-none transition-colors duration-150"
            />
          </label>

          <Button type="submit" size="lg" className="w-full" disabled={rating === 0}>
            {existing ? "Update rating" : "Submit rating"}
          </Button>
        </form>
      )}
    </dialog>
  );
}
