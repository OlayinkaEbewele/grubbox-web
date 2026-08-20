import type { ComponentProps } from "react";

/** Shared between the input and the select so the two never drift apart. */
const CONTROL =
  "border-hairline bg-surface-3 text-fg placeholder:text-fg-subtle focus:border-primary w-full rounded-[14px] border-2 px-4 py-3.25 text-sm outline-none transition-colors duration-150";

const LABEL = "text-fg-muted mb-1.5 block text-[13px] font-bold";

/**
 * `className` lands on the wrapping label rather than the control, because
 * every caller uses it for layout (`flex-1`, `min-w-50`) and the label is what
 * the flex row actually lays out.
 */
interface FieldProps extends ComponentProps<"input"> {
  label: string;
  className?: string;
}

export function Field({ label, className, ...props }: FieldProps) {
  return (
    <label className={className}>
      <span className={LABEL}>{label}</span>
      <input type="text" className={CONTROL} {...props} />
    </label>
  );
}

interface SelectFieldProps extends ComponentProps<"select"> {
  label: string;
  options: readonly string[];
  className?: string;
}

export function SelectField({
  label,
  options,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <label className={className}>
      <span className={LABEL}>{label}</span>
      <select className={CONTROL} {...props}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
