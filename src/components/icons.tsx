import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** The Grub Box mark: a fork and spoon, cropped tight. */
export function GrubMark({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M4 3v9a4 4 0 0 0 4 4v5h1V3M4 3v6h2M4 3h2v6M18 3c-2 0-3 2-3 5s1 5 3 5v8h1V3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function SearchIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m21 21-4.3-4.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function PinIcon({ size = 16, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M12 22s7-7.58 7-13A7 7 0 0 0 5 9c0 5.42 7 13 7 13Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </Icon>
  );
}

export function ClockIcon({ size = 13, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7v5l3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function CartIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M6 6h15l-1.5 9h-12z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.3" fill="currentColor" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" />
      <path
        d="M6 6 5 3H2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function ChevronLeftIcon({ size = 16, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function ArrowRightIcon({ size = 16, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function CheckIcon({ size = 12, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function HeartIcon({ size = 19, filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M12 21s-7.5-4.6-10-9.3C.5 8 2.6 4.5 6.2 4.5c2 0 3.5 1 5.8 3.5 2.3-2.5 3.8-3.5 5.8-3.5 3.6 0 5.7 3.5 4.2 7.2C19.5 16.4 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={filled ? "currentColor" : "none"}
      />
    </Icon>
  );
}

export function RefreshIcon({ size = 16, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M4 4v5h5M20 20v-5h-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9A7 7 0 0 1 19 8M18.5 15A7 7 0 0 1 5 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function StorefrontIcon({ size = 28, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M4 21V9l8-6 8 6v12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function ScooterIcon({ size = 28, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <circle cx="18.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="5.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M15 17.5H9M15 17.5l-2-6h-4l-2 3M15 17.5l2.5-7H21l-1 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function GridIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function BoxIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M4 8l8-5 8 5v8l-8 5-8-5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function ListIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M4 4h16v4H4zM4 11h16M4 16h16M4 21h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function ChartIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M4 20V10M10 20V4M16 20v-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function GearIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.8a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.3-.8-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.8a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.3.8 2-3.4-2-1.5c.1-.4.2-.8.2-1.2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function ChevronDownIcon({ size = 12, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function AlertIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12 8v5m0 3.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    </Icon>
  );
}

export function DocumentIcon({ size = 26, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path
        d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </Icon>
  );
}

export function CardIcon({ size = 26, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
    </Icon>
  );
}

export function AppleIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.7 12.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.1-2.9.9-3.6.9-.7 0-1.9-.9-3.1-.9-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.9.8 3.1.7c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.6-.1 0-2.5-1-2.6-3.9zM14.3 5.4c.6-.8 1.1-1.9 1-3-.9.1-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
    </svg>
  );
}

export function PlayStoreIcon({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M3.6 2.6 14 12 3.6 21.4c-.3-.2-.5-.6-.5-1V3.6c0-.4.2-.8.5-1z" fill="#fff" />
      <path d="m14 12 3.2-3.2 4 2.3c.9.5.9 1.9 0 2.4l-4 2.3L14 12z" fill="#F7C873" />
      <path d="m3.6 2.6 13.6 6.2L14 12 3.6 2.6z" fill="#fff" opacity="0.7" />
      <path d="m3.6 21.4 13.6-6.2L14 12l-10.4 9.4z" fill="#fff" opacity="0.9" />
    </Icon>
  );
}
