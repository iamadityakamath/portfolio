import React, { useState, useEffect } from 'react';
import { ChevronRight } from "lucide-react";

// Simple text rotation component with customizable colors
const TextRotator = ({ words, duration = 3000, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      // Change word after fade out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        // Fade in
        setIsVisible(true);
      }, 500); // Half a second for fade out
      
    }, duration);
    
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span 
      className={`inline-block min-w-[280px] text-left transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {words[currentIndex]}
    </span>
  );
};

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f5f5f7]">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1d1d1f]">Hello, I'm Aditya Kamath</h1>
          <div className="text-xl md:text-2xl text-[#86868b] flex items-center justify-center">
            <span className="mr-2">I am</span>
            <TextRotator 
              words={[
                "a ML Enthusiast",
                "an MSIM student at UIUC",
                "data-driven problem solver",
                "an AI enthusiast",
                "a storyteller with data",
                "always learning"
              ]} 
              duration={3000}
              className="text-blue-600 font-medium text-justify"
            />
          </div>
          <div className="pt-6">
            <button
              className="rounded-full px-8 py-6 bg-[#0071e3] hover:bg-[#0077ED] text-white font-medium text-base"
              onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-32 left-0 right-0 flex justify-center animate-bounce cursor-pointer"
           onClick={() => document.getElementById('experience').scrollIntoView({ behavior: 'smooth' })}
      >
        <ChevronRight className="h-8 w-8 text-[#86868b] rotate-90" />
      </div>
    </section>
  );
}