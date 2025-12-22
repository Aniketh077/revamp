import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Hero() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const flowTarget = document.getElementById('flow-text');
    if (flowTarget) {
      const phrase = 'Means Going With the Flow.';
      let charCount = 0;

      const wrappedHtml = phrase
        .split(' ')
        .map((word) => {
          const letters = word
            .split('')
            .map((char) => {
              return `<span class="char" style="--char-index: ${charCount++}">${char}</span>`;
            })
            .join('');
          return `<span class="word">${letters}</span>`;
        })
        .join('');

      flowTarget.innerHTML = wrappedHtml;
      flowTarget.classList.remove('opacity-0');
    }

    const words = ['Chemistry', 'Manufacturing', 'Production', 'Scale-up'];
    let wordIndex = 0;

    const interval = setInterval(() => {
      if (wrapperRef.current && textRef.current) {
        wrapperRef.current.style.opacity = '0';
        wrapperRef.current.style.transform = 'translateY(10px)';

        setTimeout(() => {
          wordIndex = (wordIndex + 1) % words.length;
          if (textRef.current) {
            textRef.current.textContent = words[wordIndex];
          }

          if (wrapperRef.current) {
            wrapperRef.current.style.opacity = '1';
            wrapperRef.current.style.transform = 'translateY(0)';
          }
        }, 500);
      }
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

          {/* Headline with Flow Animation */}
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.3] mb-8 text-brand-black">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-green">Flow Revolution,</span>
            <br />

            {/* Static prefix */}
            <span>Smart </span>

            {/* Layout Stabilizer: Fixed width to prevent sentence shift */}
            <span className="inline-block w-[9em] text-center align-bottom mx-1">
              {/* Dynamic Wrapper: Shrinks/Grows with text, Animates opacity/transform */}
              <span
                ref={wrapperRef}
                className="relative inline-block transition-all duration-500 opacity-100 translate-y-0"
              >
                {/* Text Target */}
                <span ref={textRef} className="text-brand-purple relative z-10">
                  Chemistry
                </span>
                {/* Chemical Bond Underline SVG (Matches width of wrapper) */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-4 text-brand-purple/50"
                  viewBox="0 0 100 15"
                  preserveAspectRatio="none"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    d="M0 10 L10 2 L20 10 L30 2 L40 10 L50 2 L60 10 L70 2 L80 10 L90 2 L100 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>

            {/* Remainder of sentence with Flow Animation */}
            <span id="flow-text" className="text-brand-black inline-block opacity-0">
              Means Going With the Flow.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-gray-500 font-normal max-w-3xl mx-auto leading-relaxed mb-10">
            Scale from feasibility to production without heavy upfront investment.
            <br />
            Manufacture products at <span className="text-brand-black font-medium">40% below</span> current market costs.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                const element = document.querySelector('#ai-architect');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
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

      <style>{`
        .word {
          display: inline-block;
          white-space: nowrap;
          margin-right: 0.25em;
          vertical-align: top;
        }

        .char {
          display: inline-block;
          opacity: 0;
          animation: flowReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          animation-delay: calc(var(--char-index) * 0.04s);
          will-change: transform, opacity, filter;
        }

        @keyframes flowReveal {
          0% {
            opacity: 0;
            transform: translateX(-15px) scaleX(0.9);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scaleX(1);
            filter: blur(0);
          }
        }
      `}</style>
    </>
  );
}
