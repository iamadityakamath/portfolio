import React from 'react'
import { ChevronRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f5f5f7]">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1d1d1f]">Hello, I'm Alex</h1>
          <p className="text-xl md:text-2xl text-[#86868b] max-w-[600px] leading-relaxed">
            A creative developer crafting elegant digital experiences with attention to detail
          </p>
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
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <ChevronRight className="h-8 w-8 text-[#86868b] rotate-90" />
      </div>
    </section>
  )
}