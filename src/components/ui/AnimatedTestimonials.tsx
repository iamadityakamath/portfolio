import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AnimatedTestimonialsProps {
  images: string[];
  autoplayInterval?: number;
}

export const AnimatedTestimonials: React.FC<AnimatedTestimonialsProps> = ({
  images,
  autoplayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [images.length, isAnimating]);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [images.length, isAnimating]);

  // Preload all images
  useEffect(() => {
    // Initialize the imagesLoaded state array
    setImagesLoaded(new Array(images.length).fill(false));
    
    // Create an array to hold all image elements for preloading
    const imageElements: HTMLImageElement[] = [];
    
    // Preload each image
    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        // Update the loaded state for this specific image
        setImagesLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
      
      imageElements.push(img);
    });
    
    // Cleanup function
    return () => {
      // Remove references to avoid memory leaks
      imageElements.forEach(img => {
        img.onload = null;
      });
    };
  }, [images]);
  
  // Check if all images are loaded
  useEffect(() => {
    if (imagesLoaded.length > 0 && imagesLoaded.every(loaded => loaded)) {
      setAllImagesLoaded(true);
    }
  }, [imagesLoaded]);
  
  // Autoplay effect
  useEffect(() => {
    // Only start autoplay when all images are loaded
    if (!allImagesLoaded) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [goToNext, autoplayInterval, allImagesLoaded]);

  if (!images.length) return null;

  // Calculate indices for the stacked cards
  const getStackedIndices = () => {
    const indices = [];
    // Add current index
    indices.push(currentIndex);
    
    // Add next 3 indices for the stack
    for (let i = 1; i <= 3; i++) {
      indices.push((currentIndex + i) % images.length);
    }
    
    return indices;
  };
  
  const stackedIndices = getStackedIndices();

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-visible">
      {/* Loading indicator */}
      {!allImagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-50">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Stacked Images */}
      <div className="relative w-full h-full perspective-1000">
        {stackedIndices.map((imageIndex, stackIndex) => {
          // Apply different styling based on position in stack
          const isActive = stackIndex === 0;
          const offset = stackIndex * 4; // Offset for stacking effect
          const scale = 1 - (stackIndex * 0.05); // Decreasing scale for depth
          const opacity = 1 - (stackIndex * 0.15); // Decreasing opacity
          const zIndex = 10 - stackIndex; // Decreasing z-index
          const rotation = stackIndex * -5; // Slight rotation for each card
          
          return (
            <div
              key={imageIndex}
              className={cn(
                "absolute rounded-lg overflow-hidden shadow-xl transition-all duration-500",
                isActive ? "z-10" : "z-0"
              )}
              style={{
                transform: `translateY(${offset}px) scale(${scale}) rotateZ(${rotation}deg)`,
                opacity: opacity,
                zIndex: zIndex,
                width: '100%',
                height: '100%',
              }}
            >
              <img
                ref={el => imageRefs.current[imageIndex] = el}
                src={images[imageIndex]}
                alt={`Profile ${imageIndex + 1}`}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  allImagesLoaded ? "opacity-100" : "opacity-0"
                )}
                loading="eager"
                decoding="async"
                style={{
                  filter: isAnimating ? 'none' : 'none',
                  willChange: 'transform, opacity',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
        <button
          onClick={goToPrevious}
          className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors focus:outline-none"
          aria-label="Previous image"
        >
          <ChevronLeft size={18} className="text-gray-800" />
        </button>
        <button
          onClick={goToNext}
          className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors focus:outline-none"
          aria-label="Next image"
        >
          <ChevronRight size={18} className="text-gray-800" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setDirection(index > currentIndex ? 'right' : 'left');
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-4'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};