'use client';

export const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      viewBox="0 0 32 32"
      fill="none"
      className="min-w-[44px] min-h-[44px]"
    >
      {/* Black circle background - Harlo Social brand icon */}
      <circle cx="16" cy="16" r="16" fill="#111111" />
      {/* White H lettermark */}
      <text
        x="16"
        y="23"
        fontFamily="'Arial Rounded MT Bold', 'Nunito', 'Poppins', Arial, sans-serif"
        fontWeight="900"
        fontSize="19"
        fill="white"
        textAnchor="middle"
        dominantBaseline="auto"
        letterSpacing="-0.5"
      >
        H
      </text>
    </svg>
  );
};
