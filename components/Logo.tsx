import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'inverted';
}

const Logo: React.FC<LogoProps> = ({ className, variant = 'default' }) => {
  const brandColor = "#594f5c";
  
  const style: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
  };

  const classes = `tracking-tight ${className}`;

  if (variant === 'inverted') {
    // For dark backgrounds, use a light text color with a brand-colored glow
    return (
      <div 
        className={`${classes} text-gray-200`} 
        style={{...style, textShadow: `0 0 8px ${brandColor}`}}
      >
        Peekafuture
      </div>
    );
  }

  // Default for light backgrounds
  return (
    <div 
      className={classes} 
      style={{...style, color: brandColor}}
    >
      Peekafuture
    </div>
  );
};

export default Logo;
