import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Github, ExternalLink, Globe, Link } from 'lucide-react';
import './modal-styles.css';

interface ProjectLink {
  url: string;
  label: string;
  icon: 'github' | 'demo' | 'website' | 'other';
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  images: string[];
  // Flag to determine if description contains markdown/HTML
  isRichText?: boolean;
  // Optional array of links for the project
  links?: ProjectLink[];
}

export function Modal({ isOpen, onClose, title, description, images, isRichText = false, links = [] }: ModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Handle clicking outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Handle escape key to close modal
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Navigate to previous image
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Navigate to next image
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Handle animation states and reset image index when modal closes
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Reset to first image when modal is closed
      setCurrentImageIndex(0);
      
      // Use a timeout to ensure animation completes before removing the modal
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match the duration in the CSS transition
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Only render the modal if it's open or still animating
  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out ${isOpen ? 'bg-black bg-opacity-50 backdrop-blur-sm' : 'bg-black bg-opacity-0 backdrop-blur-none pointer-events-none'}`}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 ease-in-out relative ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - positioned differently for mobile and desktop */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200 ease-in-out"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        {/* Mobile view: Title first */}
        <div className="block md:hidden p-4 border-b">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        
        {/* Image Gallery - Full width on mobile, half width on desktop */}
        <div className="w-full md:w-1/2 relative h-[45vh] md:h-[90vh] bg-gray-100 md:border-r p-2 md:p-4">
          
          {images.length > 0 ? (
            <>
              <div className="w-full h-full flex items-center justify-center p-1 md:p-4">
                <img 
                  src={images[currentImageIndex]} 
                  alt={`${title} - image ${currentImageIndex + 1}`} 
                  className="max-w-[98%] max-h-[98%] mx-auto object-contain transition-opacity duration-300 ease-in-out rounded-xl shadow-md"
                />
              </div>
              
              {/* Project links - displayed below the image */}
              {links && links.length > 0 && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {links.map((link, index) => {
                    // Determine which icon to use based on the link type
                    let IconComponent;
                    switch(link.icon) {
                      case 'github':
                        IconComponent = Github;
                        break;
                      case 'demo':
                        IconComponent = ExternalLink;
                        break;
                      case 'website':
                        IconComponent = Globe;
                        break;
                      default:
                        IconComponent = Link;
                    }
                    
                    return (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium text-gray-800"
                      >
                        <IconComponent size={16} />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              )}
              
              {/* Navigation arrows (only show if more than one image) */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white shadow-md transition-transform duration-200 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white shadow-md transition-transform duration-200 hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No images available
            </div>
          )}
        </div>

        {/* Content - Full width on mobile, half width on desktop */}
        <div className="w-full md:w-1/2 flex flex-col h-[50vh] md:h-[90vh]">
          {/* Modal Header - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex justify-between items-center p-6 pl-8 pr-16 border-b">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          </div>

          {/* Description - Scrollable */}
          <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
            {isRichText ? (
              <div 
                className="text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
                style={{
                  /* Additional styles to ensure proper list rendering */
                  '--tw-prose-bullets': 'rgb(107, 114, 128)',
                }}
              />
            ) : (
              <p className="text-gray-600 whitespace-pre-line text-justify">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}