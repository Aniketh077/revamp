import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
  {
    number: '01',
    label: 'Audit',
    title: 'Analysis',
    description: 'We analyze your current synthesis to identify efficiency gaps.',
    color: '#702594',
    labelColor: 'text-brand-purple',
    delay: '0ms'
  },
  {
    number: '02',
    label: 'Pilot',
    title: 'Proof of Concept',
    description: 'We prove the yield in our lab, demonstrating conversion rates.',
    color: '#1406b3',
    labelColor: 'text-brand-blue',
    delay: '200ms'
  },
  {
    number: '03',
    label: 'Deploy',
    title: 'FaaS Activation',
    description: 'We build, ship, and commission your FaaS unit.',
    color: '#057210',
    labelColor: 'text-brand-green',
    delay: '400ms'
  }
];

export default function Advantage() {
  const titleRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="advantage" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-brand-light to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-blue/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-start relative z-10">
        <div ref={titleRef} className="w-full lg:w-1/3 lg:sticky lg:top-32 reveal-on-scroll mb-8 lg:mb-0">
          <div className="inline-block mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-green blur-lg opacity-30"></div>
              <h2 className="relative text-3xl sm:text-4xl font-semibold tracking-tighter bg-gradient-to-r from-brand-purple via-brand-blue to-brand-green bg-clip-text text-transparent">
                The Path to<br />Production.
              </h2>
            </div>
          </div>
          <p className="text-brand-gray text-base sm:text-lg leading-relaxed">
            We've removed the barriers. From analysis to full-scale production in three rapid sprints.
          </p>
        </div>
        <div className="w-full lg:w-2/3 grid gap-4 sm:gap-6 relative">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
          <svg className="absolute left-4 sm:left-8 top-0 h-full w-0.5 hidden sm:block" style={{ zIndex: 0 }}>
            <line x1="0" y1="0" x2="0" y2="100%" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="8,4" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#702594" />
                <stop offset="50%" stopColor="#1406b3" />
                <stop offset="100%" stopColor="#057210" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}

function StepCard({ number, label, title, description, color, labelColor, delay, index }: {
  number: string;
  label: string;
  title: string;
  description: string;
  color: string;
  labelColor: string;
  delay: string;
  index: number;
}) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-brand-light to-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl reveal-on-scroll border-l-4 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] relative z-10 group cursor-pointer"
      style={{
        transitionDelay: delay,
        borderLeftColor: color
      }}
    >
      <div
        className="absolute -left-6 sm:-left-12 top-8 sm:top-12 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: color }}
      >
        {index + 1}
      </div>

      <div className="flex items-start justify-between gap-4 mb-4">
        <span className={`${labelColor} text-xs font-bold uppercase tracking-widest`}>
          {number} {label}
        </span>
        <ArrowRight
          className={`${labelColor} w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300`}
        />
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:text-brand-purple transition-colors duration-300">
        {title}
      </h3>
      <p className="text-brand-gray text-sm sm:text-base leading-relaxed">{description}</p>

      <div
        className="absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}
