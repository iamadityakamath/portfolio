import React, { useRef, useState } from 'react';
import { use3dEffect } from './ui/use3dEffect';
import { Modal } from './ui/Modal';
import { ArrowRight } from 'lucide-react';

interface ProjectLink {
  url: string;
  label: string;
  icon: 'github' | 'demo' | 'website' | 'other';
}

interface ProjectCardProps {
  title: string;
  description: string;
  // Short info to display below the title
  shortInfo?: string;
  image: string;
  tags: string[];
  link?: string;
  // Optional array of links for the project (GitHub, demo, etc.)
  links?: ProjectLink[];
  // Optional array of additional images for the modal
  additionalImages?: string[];
  // Optional detailed description for the modal
  detailedDescription?: string;
  // Flag to indicate if description contains markdown/rich text
  isRichText?: boolean;
}

export function ProjectCard({ 
  title, 
  description, 
  shortInfo = "", 
  image, 
  tags, 
  link, 
  links = [], 
  additionalImages = [], 
  detailedDescription = "",
  isRichText = false
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleMouseMove, handleMouseLeave, transform, transition } = use3dEffect(cardRef);
  
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Prepare images array for modal (main image + additional images)
  const allImages = [image, ...additionalImages];

  // Handle card click separately from 3D effect
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent the click from interfering with the 3D effect
    e.stopPropagation();
    setIsModalOpen(true);
  };
  
  // Handle modal close with proper cleanup
  const handleModalClose = () => {
    setIsModalOpen(false);
    // Reset any 3D effect state to ensure clean interaction after modal closes
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
  };

  return (
    <>
      <div 
        ref={cardRef}
        className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer" 
        style={{ transform, transition }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
      {/* Mobile view: Title first, then image, then content */}
      <div className="block md:hidden p-6 pb-2">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        {shortInfo && <p className="text-sm text-gray-600 mb-2">{shortInfo}</p>}
      </div>
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      {/* Desktop view: Title after image */}
      <div className="p-6">
        <h3 className="hidden md:block text-xl font-bold text-gray-900 mb-2">{title}</h3>
        {shortInfo && <p className="hidden md:block text-sm text-gray-600 mb-3">{shortInfo}</p>}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-end items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
          info
          <ArrowRight className="ml-1" size={16} />
        </div>
      </div>
    </div>
      
      {/* Modal for displaying additional project details */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        title={title}
        description={detailedDescription || description}
        images={allImages}
        isRichText={isRichText}
        links={links}
      />
    </>
  );
}