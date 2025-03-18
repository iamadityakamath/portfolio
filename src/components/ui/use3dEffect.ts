import { useState, useEffect, RefObject } from 'react';

type Use3dEffectResult = {
  handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
  transform: string;
  transition: string;
};

export function use3dEffect(ref: RefObject<HTMLElement>, tiltAmount: number = 10): Use3dEffectResult {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Reset position when component unmounts or when dependencies change
  useEffect(() => {
    return () => {
      setPosition({ x: 0, y: 0 });
      setIsHovered(false);
    };
  }, []);

  // Handle mouse movement over the card
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;

    const element = ref.current;
    const rect = element.getBoundingClientRect();
    
    // Calculate position relative to the center of the element
    const x = (e.clientX - rect.left) / element.offsetWidth - 0.5;
    const y = (e.clientY - rect.top) / element.offsetHeight - 0.5;
    
    setPosition({ x, y });
    setIsHovered(true);
  };

  // Reset the card position when mouse leaves
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Calculate the transform and transition styles
  const transform = isHovered
    ? `perspective(1000px) rotateX(${position.y * -tiltAmount}deg) rotateY(${position.x * tiltAmount}deg) scale3d(1.05, 1.05, 1.05)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

  const transition = isHovered
    ? 'transform 0.1s ease'
    : 'transform 0.3s ease';

  return {
    handleMouseMove,
    handleMouseLeave,
    transform,
    transition,
  };
}