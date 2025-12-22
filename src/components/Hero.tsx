import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const heroRef = useScrollReveal<HTMLDivElement>();

  const rotatingWords = ['Manufacturing', 'Production', 'Scale-up'];

  useEffect(() => {
    // Rotating words animation
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-16 overflow-hidden bg-white">
        {/* Clean Tech Background: Dot Pattern + Subtle Mesh */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Dot Pattern */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(128, 128, 128, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(128, 128, 128, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
          />
          
          {/* Subtle Mesh Gradient (Right) */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-brand-purple/10 to-brand-green/10 rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/3" />
          
          {/* Subtle Mesh Gradient (Left) */}
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-brand-orange/5 to-brand-purple/5 rounded-full blur-[100px] opacity-40 -translate-x-1/3 translate-y-1/3" />
        </div>

        <div ref={heroRef} className="relative z-10 max-w-5xl text-center reveal-on-scroll">
          {/* Pill Badge (Salesforce Style) */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 mb-6 sm:mb-8 shadow-sm transition-transform hover:scale-105 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-purple"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase text-gray-600">Factory-as-a-Service</span>
          </div>

          {/* Headline with Rotating Words Animation */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.3] mb-6 md:mb-8 text-brand-black px-4 sm:px-0"
            aria-label="Join the Flow Revolution, smart manufacturing means going with the flow."
          >
            <span className="inline-block animate-slideInUp opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              Join the Flow
            </span>
            <br />
            <span className="inline-block animate-slideInUp opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-green">
                Revolution
              </span>
              , smart{' '}
            </span>
            <span className="rotating-word-container inline-block animate-slideInUp opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              {rotatingWords.map((word, index) => (
                <span
                  key={word}
                  className={`rotating-word ${index === currentWordIndex ? 'active' : ''}`}
                >
                  {word}
                </span>
              ))}
            </span>
            <br />
            <span className="inline-block animate-slideInUp opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              means going with the flow.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-gray-500 font-normal max-w-3xl mx-auto leading-relaxed mb-8 md:mb-10 px-4 sm:px-0">
            We remove the fear of heavy upfront investment by letting you scale step-by-step from feasibility to full production.{' '}
            <span className="hidden sm:inline"><br /></span>
            Manufacture products at <span className="text-brand-black font-medium">40% below</span> current market costs.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={() => {
                const element = document.querySelector('#ai-architect');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-brand-purple to-brand-green text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm font-semibold hover:shadow-2xl hover:shadow-brand-purple/50 transition-all shadow-lg hover:-translate-y-0.5 w-full sm:w-auto sm:min-w-[180px]"
            >
              Start Feasibility Audit
            </button>
            <button
              onClick={() => {
                const element = document.querySelector('#pillars');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-brand-black px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm font-medium hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex items-center gap-2 w-full sm:w-auto sm:min-w-[180px] justify-center"
            >
              Explore Platform <ArrowRight className="w-4 h-4 text-brand-purple" />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .rotating-word-container {
          position: relative;
          display: inline-block;
          min-width: 140px;
          height: 1.2em;
          vertical-align: baseline;
        }

        .rotating-word {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          white-space: nowrap;
          background: linear-gradient(to right, #e07742, #702594);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .rotating-word.active {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        @media (min-width: 640px) {
          .rotating-word-container {
            min-width: 180px;
          }
        }

        @media (min-width: 768px) {
          .rotating-word-container {
            min-width: 220px;
          }
        }

        @media (min-width: 1024px) {
          .rotating-word-container {
            min-width: 260px;
          }
        }

        @media (min-width: 1280px) {
          .rotating-word-container {
            min-width: 320px;
          }
        }
      `}</style>
    </>
  );
}
