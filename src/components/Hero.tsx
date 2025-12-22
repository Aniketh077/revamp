import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import CalBookingModal from './CalBookingModal';

export default function Hero() {
  const [showCalModal, setShowCalModal] = useState(false);
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 mb-8 shadow-sm transition-transform hover:scale-105 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-purple"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase text-gray-600">Factory-as-a-Service</span>
          </div>

          {/* Headline with Rotating Words Animation */}
          <h1
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.15] mb-8 text-brand-black"
            aria-label="Join the Flow Revolution, smart manufacturing means going with the flow."
          >
            <span className="block mb-2">
              Join the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-green">
                Flow Revolution
              </span>
            </span>
            <span className="block">
              Smart{' '}
              <span className="rotating-word-container">
                {rotatingWords.map((word, index) => (
                  <span
                    key={word}
                    className={`rotating-word ${index === currentWordIndex ? 'active' : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
              {' '}means
            </span>
            <span className="block">
              going with the flow.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-gray-500 font-normal max-w-3xl mx-auto leading-relaxed mb-10">
            We remove the fear of heavy upfront investment by letting you scale step-by-step from feasibility to full production.<br />
            Manufacture products at <span className="text-brand-black font-medium">40% below</span> current market costs.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowCalModal(true)}
              className="bg-brand-black text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 min-w-[180px]"
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
              className="text-brand-black px-8 py-4 rounded-full text-sm font-medium hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex items-center gap-2 min-w-[180px] justify-center"
            >
              Explore Platform <ArrowRight className="w-4 h-4 text-brand-purple" />
            </button>
          </div>
        </div>
      </section>

      <CalBookingModal 
        isOpen={showCalModal} 
        onClose={() => setShowCalModal(false)}
        calLink={import.meta.env.VITE_CAL_LINK}
      />

      <style>{`
        .rotating-word-container {
          min-width: 320px;
          height: 1.2em;
          vertical-align: middle;
          display: inline-block;
        }

        .rotating-word {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          transform: translateY(30px) scale(0.9);
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

        @media (max-width: 768px) {
          .rotating-word-container {
            min-width: 220px;
          }
        }
      `}</style>
    </>
  );
}
