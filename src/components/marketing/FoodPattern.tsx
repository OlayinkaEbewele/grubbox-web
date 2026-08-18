/**
 * Tiled line-art food icons, used as the backdrop on the auth screens.
 * Purely decorative, so it's hidden from assistive tech.
 */
export function FoodPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <g id="fp-forkknife">
          <path d="M4 3v9a4 4 0 0 0 4 4v5h1V3M4 3v6h2M4 3h2v6M18 3c-2 0-3 2-3 5s1 5 3 5v8h1V3z" />
        </g>
        <g id="fp-drumstick">
          <path d="M13 3c3 0 5.5 2.5 5.5 5.5 0 2-1 3.8-2.6 4.9.6.3 1.1.8 1.4 1.4.8 1.5.3 3.4-1.2 4.2-1.5.8-3.4.3-4.2-1.2-.3-.6-.4-1.3-.3-1.9C10.5 16.6 9 18 7 18c-2 0-3.5-1.6-3.5-3.5S5 11 7 11c.3-2.4 1.5-4.6 3.4-6C11.5 4.1 12.2 3 13 3z" />
        </g>
        <g id="fp-pizza">
          <path d="M4 21 12 4l8 17z" />
          <path d="M7.5 15h9" />
          <circle cx="10" cy="12" r="0.8" />
          <circle cx="14" cy="12" r="0.8" />
          <circle cx="12" cy="17.5" r="0.8" />
        </g>
        <g id="fp-shrimp">
          <path d="M5 14c-1-4 1-9 6-10 4-1 8 2 8 6 0 3-2 5-5 6-1 3-4 5-7 4-2-1-2-4-2-6z" />
          <path d="M8 8l2 2M8 12l2-1" />
        </g>
        <g id="fp-egg">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8c2 0 4 1.5 4 4s-2 4-4 4-4-1.5-4-4 1.5-4 4-4z" />
        </g>
        <g id="fp-cherries">
          <circle cx="9" cy="16.5" r="3" />
          <circle cx="15" cy="16.5" r="3" />
          <path d="M9 13.5c0-4 2-7 6-9M15 13.5c-1-3.5.5-6.5 3-8" />
        </g>

        <pattern
          id="fp-tile"
          width="340"
          height="380"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(6)"
        >
          <g
            stroke="var(--color-primary)"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <use href="#fp-forkknife" transform="translate(30,20) scale(1.3)" opacity="0.55" />
            <use href="#fp-drumstick" transform="translate(230,55) rotate(18) scale(1.1)" opacity="0.5" />
            <use href="#fp-pizza" transform="translate(300,220) rotate(-10) scale(1.2)" opacity="0.55" />
            <use href="#fp-shrimp" transform="translate(40,180) rotate(-25) scale(1.15)" opacity="0.45" />
            <use href="#fp-egg" transform="translate(230,300) scale(0.9)" opacity="0.4" />
            <use href="#fp-cherries" transform="translate(90,300) rotate(10) scale(1.05)" opacity="0.5" />
            <use href="#fp-drumstick" transform="translate(150,150) rotate(-60) scale(0.75)" opacity="0.35" />
            <use href="#fp-forkknife" transform="translate(20,340) rotate(15) scale(0.9)" opacity="0.4" />
          </g>
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="var(--color-canvas)" />
      <rect width="100%" height="100%" fill="url(#fp-tile)" />
    </svg>
  );
}
