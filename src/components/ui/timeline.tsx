import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface TimelineItemProps {
  title: string;
  content: ReactNode;
  isLast?: boolean;
}

const TimelineItem = ({ title, content, isLast = false }: TimelineItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset visibility when scrolling back up
          setIsVisible(false);
        }
      },
      {
        threshold: 0.7, // Trigger when 70% of the item is visible for a more focused reveal
        rootMargin: '0px 0px -20% 0px' // Adjust when the effect triggers to ensure one item at a time
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  return (
    <div ref={itemRef} className="relative pb-12">
      {!isLast && (
        <div
          className={`absolute left-5 top-5 -ml-px h-full w-1 transition-all duration-700 ${isVisible ? 'bg-gradient-to-b from-blue-500 via-indigo-500 to-blue-400 shadow-sm' : 'bg-gray-200'}`}
          aria-hidden="true"
        />
      )}
      <div className="relative flex items-start space-x-3">
        <div className="relative">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ${isVisible ? 'bg-gradient-to-r from-blue-500 to-indigo-600 scale-110 shadow-lg' : 'bg-gray-300'} ring-8 ring-white`}>
            <span className="text-white font-semibold">•</span>
          </div>
        </div>
        <div className={`min-w-0 flex-1 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <div>
            <div className="text-sm font-medium text-gray-900">{title}</div>
          </div>
          <div className="mt-2 text-sm text-gray-700">{content}</div>
        </div>
      </div>
    </div>
  );
};

interface TimelineProps {
  items: Array<{
    title: string;
    content: ReactNode;
  }>;
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((item, index) => (
          <li key={index}>
            <TimelineItem
              title={item.title}
              content={item.content}
              isLast={index === items.length - 1}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}