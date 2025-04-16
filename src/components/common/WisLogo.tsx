import React, { useState, useEffect, useMemo } from 'react';

interface WisLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dark' | 'light' | 'ultra' | 'gold';
  className?: string;
  animated?: boolean;
}

const WisLogo: React.FC<WisLogoProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  animated = true,
}) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);
  
  // Generate sparkles for ultra premium effect
  useEffect(() => {
    if (variant === 'ultra') {
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 6,
        delay: Math.random() * 2,
      }));
      setSparkles(newSparkles);
    }
  }, [variant]);

  // Size mapping
  const dimensions = useMemo(() => {
    const sizes = {
      sm: { height: 32, width: 100, fontSize: 16 },
      md: { height: 40, width: 120, fontSize: 20 },
      lg: { height: 48, width: 150, fontSize: 24 },
      xl: { height: 64, width: 200, fontSize: 32 },
    };
    return sizes[size];
  }, [size]);

  // Color themes based on variant
  const colors = useMemo(() => {
    const themes = {
      default: {
        primary: 'linear-gradient(135deg, #5e17eb, #8a4fff)',
        secondary: '#ffffff',
        textColor: '#333333',
        shadowColor: 'rgba(94, 23, 235, 0.6)',
        accentColor: '#ffd700'
      },
      dark: {
        primary: 'linear-gradient(135deg, #26203a, #4b3a6b)',
        secondary: '#222222',
        textColor: '#ffffff',
        shadowColor: 'rgba(30, 20, 60, 0.8)',
        accentColor: '#c2a0ff'
      },
      light: {
        primary: 'linear-gradient(135deg, #d7c1ff, #a882ff)',
        secondary: '#f8f8f8',
        textColor: '#5e17eb',
        shadowColor: 'rgba(215, 193, 255, 0.8)',
        accentColor: '#5e17eb'
      },
      ultra: {
        primary: 'linear-gradient(135deg, #7928CA, #FF0080)',
        secondary: '#000000',
        textColor: '#ffffff',
        shadowColor: 'rgba(255, 0, 128, 0.7)',
        accentColor: '#00ffff'
      },
      gold: {
        primary: 'linear-gradient(135deg, #FFD700, #FFA500)',
        secondary: '#ffffff',
        textColor: '#333333',
        shadowColor: 'rgba(255, 215, 0, 0.6)',
        accentColor: '#5e17eb'
      }
    };
    return themes[variant];
  }, [variant]);

  // 3D effect styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    ...(className ? {} : { height: dimensions.height, width: dimensions.width }),
    perspective: '800px',
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.primary,
    padding: '12px 16px',
    borderRadius: '16px',
    boxShadow: `0 10px 30px ${colors.shadowColor}, 0 -2px 6px rgba(255,255,255,0.2) inset`,
    transformStyle: 'preserve-3d',
    transform: animated ? 'rotateY(-15deg) rotateX(5deg)' : 'none',
    transition: 'transform 0.5s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const letterStyle: React.CSSProperties = {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: dimensions.fontSize * 1.4,
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    letterSpacing: '-1px',
    margin: '0 4px',
    display: 'inline-block',
    position: 'relative',
    transform: 'translateZ(10px)',
  };

  const dotStyle: React.CSSProperties = {
    position: 'absolute',
    width: dimensions.fontSize * 0.5,
    height: dimensions.fontSize * 0.5,
    right: dimensions.fontSize * 0.4,
    top: dimensions.fontSize * 0.4,
    borderRadius: '50%',
    background: colors.accentColor,
    boxShadow: `0 0 10px ${colors.accentColor}, 0 0 5px ${colors.accentColor}`,
  };

  const shineStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% 200%',
    animation: animated ? 'shine 3s infinite ease-in-out' : 'none',
    pointerEvents: 'none',
    opacity: 0.7,
  };

  return (
    <div className={className} style={containerStyle} 
         onMouseEnter={(e) => {
           if (animated) {
             const element = e.currentTarget.querySelector('.logo-inner') as HTMLElement;
             if (element) element.style.transform = 'rotateY(5deg) rotateX(-5deg)';
           }
         }}
         onMouseLeave={(e) => {
           if (animated) {
             const element = e.currentTarget.querySelector('.logo-inner') as HTMLElement;
             if (element) element.style.transform = 'rotateY(-15deg) rotateX(5deg)';
           }
         }}>
      <div className="logo-inner" style={logoStyle}>
        <span style={letterStyle}>W</span>
        <span style={letterStyle}>i</span>
        <span style={letterStyle}>s</span>
        <span style={dotStyle}></span>
        <div style={shineStyle}></div>
      </div>
      
      {variant === 'ultra' && sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          style={{
            position: 'absolute',
            top: `${sparkle.y}%`,
            left: `${sparkle.x}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: colors.accentColor,
            borderRadius: '50%',
            boxShadow: `0 0 ${sparkle.size * 2}px ${colors.accentColor}`,
            animation: `sparkle 1.5s infinite ${sparkle.delay}s`,
            zIndex: 0,
          }}
        />
      ))}

      <style>
        {`
        @keyframes sparkle {
          0% { transform: scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          80%, 100% { transform: translateX(150%) rotate(45deg); }
        }
        `}
      </style>
    </div>
  );
};

export default WisLogo; 