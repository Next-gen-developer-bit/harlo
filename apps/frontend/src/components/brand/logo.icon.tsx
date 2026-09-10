'use client';

import React from 'react';

export const HarloSocialLogoIcon = ({
  className = 'w-6 h-6',
}: {
  className?: string;
  color?: string;
}) => (
  <img
    src="/harlo-icon-dark.png"
    alt="Harlo"
    className={className}
  />
);
