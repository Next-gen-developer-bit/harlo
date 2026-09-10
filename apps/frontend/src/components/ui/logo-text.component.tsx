import React from 'react';

export const LogoTextComponent = () => {
  return (
    <svg
      width="220"
      height="44"
      viewBox="0 0 220 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Black circle icon mark (44×44 canvas, left-aligned) ── */}
      <circle cx="22" cy="22" r="20" fill="#111111" />
      {/* White H lettermark */}
      <text
        x="22"
        y="31"
        fontFamily="'Arial Rounded MT Bold', 'Nunito', 'Poppins', Arial, sans-serif"
        fontWeight="900"
        fontSize="24"
        fill="white"
        textAnchor="middle"
        dominantBaseline="auto"
        letterSpacing="-0.5"
      >
        H
      </text>

      {/* ── "Harlo" wordmark ── */}
      <text
        x="52"
        y="30"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontWeight="700"
        fontSize="22"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        Harlo
      </text>

      {/* ── "Social" subtext ── */}
      <text
        x="53"
        y="42"
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontWeight="400"
        fontSize="8"
        fill="currentColor"
        opacity="0.72"
        letterSpacing="3"
      >
        SOCIAL
      </text>
    </svg>
  );
};
