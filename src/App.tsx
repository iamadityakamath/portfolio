import React from 'react';
import { ChatBot } from './components/ChatBot';
import { NavBar } from './components/NavBar';
import { Dock } from './components/Dock';
import HeroSection from './components/HeroSection';
import TimelineDemo from './components/TimelineDemo';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillsSection';
import PortfolioSection from './components/PortfolioSection';
import ContactSection from './components/ContactSection';
import { AnimatedTestimonials } from './components/ui/AnimatedTestimonials';
import { Reveal } from './components/ui/Reveal';
import { useCountUp } from './hooks/useCountUp';

const STATS: { value: number; suffix?: string; decimals?: number; label: string; sub: string }[] = [
  { value: 3, suffix: '+', label: 'Years Experience', sub: 'Production ML & GenAI' },
  { value: 10, suffix: 'k+', label: 'Daily Active Users', sub: 'Conversational AI platform' },
  { value: 4.0, decimals: 1, label: 'Graduate GPA', sub: 'MSIM, UIUC' },
  { value: 2, suffix: 'x', label: 'GCP Certified', sub: 'ML Engineer, Cloud Architect' },
];

function StatCard({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const { ref, display } = useCountUp(stat.value, { decimals: stat.decimals ?? 0 });

  return (
    <Reveal delay={index * 70}>
      <div ref={ref} className="card card-hover h-full rounded-2xl p-6 text-center">
        <div className="text-heading font-bold text-accent md:text-[1.75rem]">
          {display}
          {stat.suffix}
        </div>
        <div className="mt-1 text-sm font-semibold text-content">{stat.label}</div>
        <div className="mt-1 text-xs text-content-tertiary">{stat.sub}</div>
      </div>
    </Reveal>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <NavBar />

      <main>
        <HeroSection />

        {/* About */}
        <section id="about" className="bg-surface-subtle py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
              <Reveal className="order-2 md:order-1">
                <h2 className="text-title-sm text-content md:text-title">About Me</h2>
                <div className="mt-6 space-y-4 text-content-secondary">
                  <p className="leading-relaxed">
                    I&rsquo;m a Machine Learning Engineer with three years of production experience
                    designing generative and agentic AI systems &mdash; including a conversational
                    AI platform that served 10k+ daily users at 99.9% uptime.
                  </p>
                  <p className="leading-relaxed">
                    I work across retrieval-augmented generation, multi-agent orchestration, and the
                    Model Context Protocol, plus the data pipelines and cloud infrastructure that
                    keep those systems running. Most recently I&rsquo;ve been at Rivian building
                    <span className="whitespace-nowrap"> fault-finder</span>, an MCP server that cut
                    vehicle fault investigation time by 70%, after shipping an insurance claims
                    copilot at Symmetric IT Services and a GKE-based conversational AI platform at
                    Quantiphi.
                  </p>
                  <p className="leading-relaxed">
                    I&rsquo;m currently pursuing an MS in Information Management at the University of
                    Illinois Urbana-Champaign, chasing the same thing throughout: turning messy data
                    into decisions people can act on.
                  </p>
                </div>
              </Reveal>

              <Reveal className="order-1 flex justify-center md:order-2" delay={100}>
                <AnimatedTestimonials
                  images={[
                    '/images/about me/Aditya Kamath 1.webp',
                    '/images/about me/Aditya Kamath 2.webp',
                    '/images/about me/Aditya Kamath 3.webp',
                    '/images/about me/Aditya Kamath 5.webp',
                  ]}
                  autoplayInterval={5000}
                />
              </Reveal>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </div>
        </section>

        <SkillsSection />
        <TimelineDemo />
        <EducationSection />
        <PortfolioSection />
        <ContactSection />
      </main>

      <footer className="border-t border-hairline bg-surface py-10 pb-28 text-center">
        <p className="text-sm text-content-tertiary">
          &copy; {new Date().getFullYear()} Aditya Kamath
        </p>
      </footer>

      <Dock />
      <ChatBot />
    </div>
  );
}
