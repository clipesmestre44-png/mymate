export function LogoMark({ size = 32, color = "#7C3AED" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield */}
      <path
        d="M12 1.5L2.5 5.5V12.5C2.5 19 7 24.5 12 26C17 24.5 21.5 19 21.5 12.5V5.5L12 1.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Checkmark sweeping up like a trend arrow */}
      <path
        d="M6.5 14L10.5 18L17.5 8"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead at the tip */}
      <path
        d="M15 7.5L17.5 8L16.8 10.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
