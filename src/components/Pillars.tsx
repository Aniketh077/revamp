import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const pillars = [
  {
    id: 1,
    title: 'Design Excellence',
    description: 'Bespoke reactors tailored specifically to your molecule.',
    detailedDescription: 'Our proprietary reactor modeling software simulates fluid dynamics with 99.8% accuracy before a single piece of steel is cut.',
    number: '01',
    accentColor: 'text-brand-orange',
    borderColor: 'border-brand-orange'
  },
  {
    id: 2,
    title: 'Flexibility',
    description: 'Scale from grams to tons seamlessly.',
    detailedDescription: 'Modular skid designs allow for plug-and-play capacity expansion without facility downtime.',
    number: '02',
    accentColor: 'text-brand-purple',
    borderColor: 'border-brand-purple'
  },
  {
    id: 3,
    title: 'End-to-End Support',
    description: "We don't just build; we guide.",
    detailedDescription: '24/7 remote monitoring and on-site engineering support ensure peak OEE.',
    number: '03',
    accentColor: 'text-brand-blue',
    borderColor: 'border-brand-blue'
  },
  {
    id: 4,
    title: 'Compliance',
    description: 'ISO & GMP ready architectures.',
    detailedDescription: 'Pre-validated software modules reduce qualification time by up to 60%.',
    number: '04',
    accentColor: 'text-brand-green',
    borderColor: 'border-brand-green'
  },
  {
    id: 5,
    title: 'Sustainability',
    description: '40% less energy. Zero waste protocols.',
    detailedDescription: 'Closed-loop solvent recycling and precise thermal management drastically cut carbon footprint.',
    number: '05',
    accentColor: 'text-brand-green',
    borderColor: 'border-brand-green'
  },
  {
    id: 6,
    title: 'Innovation Engine',
    description: 'Continuous R&D integration.',
    detailedDescription: 'Access our central R&D library to constantly upgrade your process parameters via OTA updates.',
    number: '06',
    accentColor: 'text-brand-purple',
    borderColor: 'border-brand-purple'
  },
];

export default function Pillars() {
  const [activePillar, setActivePillar] = useState<number | null>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePillarClick = (pillarId: number) => {
    if (pillarId !== activePillar && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setActivePillar(pillarId);
        setTimeout(() => setIsAnimating(false), 400);
      }, 300);
    }
  };

  const selectedPillar = pillars.find((p) => p.id === activePillar);

  return (
    <section id="pillars" className="relative py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-brand-light overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-orange/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green blur-lg opacity-30"></div>
              <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green bg-clip-text text-transparent">
                The Flownetics Standard.
              </h2>
            </div>
          </div>
          <p className="text-brand-gray text-base sm:text-lg">Click to explore each pillar.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-3 sm:space-y-4">
            {pillars.map((pillar) => {
              const isActive = activePillar === pillar.id;

              return (
                <div
                  key={pillar.id}
                  onClick={() => handlePillarClick(pillar.id)}
                  className={`pillar-card p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white border transition-all duration-500 cursor-pointer hover:shadow-lg group relative overflow-hidden ${
                    isActive
                      ? 'border-brand-purple shadow-xl scale-[1.02]'
                      : 'border-gray-100 shadow-sm hover:border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <span className={`text-xs font-bold uppercase transition-colors duration-500 ${
                      isActive ? 'text-brand-purple' : 'text-gray-300'
                    }`}>
                      {pillar.number}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-all duration-500 ${
                        isActive
                          ? 'text-brand-purple translate-x-0 opacity-100'
                          : 'text-gray-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>

                  <h3 className={`text-base sm:text-lg font-semibold mb-1.5 transition-colors duration-300 ${
                    isActive ? 'text-brand-purple' : 'text-brand-black group-hover:text-brand-purple'
                  }`}>
                    {pillar.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{pillar.description}</p>

                  <div
                    className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-500 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                    }`}
                    style={{ backgroundColor: isActive ? '#702594' : '#e0e0e0' }}
                  ></div>
                </div>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start h-fit">
            {selectedPillar && (
              <div
                className={`detail-panel bg-gradient-to-br from-gray-50 to-white border-2 border-brand-purple rounded-3xl p-8 sm:p-10 shadow-2xl cursor-purple transition-all duration-300 flex flex-col ${
                  isAnimating ? 'slide-out' : 'slide-in'
                }`}
                style={{ minHeight: '800px' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-sm font-bold uppercase ${selectedPillar.accentColor}`}>
                    {selectedPillar.number}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">{selectedPillar.title}</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">
                  {selectedPillar.description}
                </p>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Technical Details
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                    {selectedPillar.detailedDescription}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm mb-4 flex-grow">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Key Benefits
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedPillar.accentColor} mt-1.5 flex-shrink-0`}></div>
                      <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">Industry-leading accuracy and precision</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedPillar.accentColor} mt-1.5 flex-shrink-0`}></div>
                      <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">Comprehensive support and documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedPillar.accentColor} mt-1.5 flex-shrink-0`}></div>
                      <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">Proven results in production environments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedPillar.accentColor} mt-1.5 flex-shrink-0`}></div>
                      <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">Scalable architecture for future growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${selectedPillar.accentColor} mt-1.5 flex-shrink-0`}></div>
                      <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">Cost-effective implementation and maintenance</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 mt-auto">
                  <a
                    href={`/pillar/${selectedPillar.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-xs font-bold uppercase tracking-widest ${selectedPillar.accentColor} hover:underline transition-all`}
                  >
                    Learn More <ArrowRight className="w-3 h-3 ml-2" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .pillar-card {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .pillar-card:hover {
          transform: translateX(4px);
        }

        .detail-panel {
          will-change: transform, opacity;
          position: sticky;
          top: 6rem;
        }

        @media (min-width: 1024px) {
          .detail-panel {
            min-height: 800px;
            max-height: calc(100vh - 8rem);
            overflow-y: auto;
          }

          .detail-panel::-webkit-scrollbar {
            width: 6px;
          }

          .detail-panel::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }

          .detail-panel::-webkit-scrollbar-thumb {
            background: #702594;
            border-radius: 10px;
          }

          .detail-panel::-webkit-scrollbar-thumb:hover {
            background: #8e30bc;
          }
        }

        @media (max-width: 1023px) {
          .detail-panel {
            min-height: 500px;
          }
        }

        .slide-out {
          animation: slideOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        .slide-in {
          animation: slideIn 0.4s cubic-bezier(0, 0, 0.2, 1) forwards;
        }

        @keyframes slideOut {
          0% {
            transform: translateX(0) scale(1) rotateY(0deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-30px) scale(0.95) rotateY(-5deg);
            opacity: 0;
          }
        }

        @keyframes slideIn {
          0% {
            transform: translateX(30px) scale(0.95) rotateY(5deg);
            opacity: 0;
          }
          100% {
            transform: translateX(0) scale(1) rotateY(0deg);
            opacity: 1;
          }
        }

        .cursor-purple {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23702594" d="M5 3l14 9-6.5 1.5L10 20z"/></svg>') 0 0, auto;
        }

        .cursor-purple a,
        .cursor-purple button {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23702594" d="M8 6.5v11l6-5.5z"/></svg>') 12 12, pointer;
        }
      `}</style>
    </section>
  );
}
