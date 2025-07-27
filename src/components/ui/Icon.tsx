import React from 'react';

// A generic type for icon props
type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

// Example for a "Flip" icon from the spec
export const FlipIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill={color} />
  </svg>
);

// Add other icons here as needed
// e.g., HomeIcon, SettingsIcon, PlayIcon, StarIcon