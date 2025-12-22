import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
  {
    number: '01',
    label: 'Audit',
    title: 'Analysis',
    description: 'We analyze your current synthesis to identify efficiency gaps.',
    color: 'brand-purple',
    labelColor: 'text-brand-purple',
    delay: '0ms'
  },
  {
    number: '02',
    label: 'Pilot',
    title: 'Proof of Concept',
    description: 'We prove the yield in our lab, demonstrating conversion rates.',
    color: 'brand-blue',
    labelColor: 'text-brand-blue',
    delay: '200ms'
  },
  {
    number: '03',
    label: 'Deploy',
    title: 'FaaS Activation',
    description: 'We build, ship, and commission your FaaS unit.',
    color: 'brand-green',
    labelColor: 'text-brand-green',
    delay: '400ms'
  }
];

export default function Advantage() {
  const titleRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="advantage" className="py-32 px-6 bg-gradient-to-b from-brand-light to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start relative z-10">
        <div ref={titleRef} className="lg:w-1/3 lg:sticky lg:top-32 reveal-on-scroll">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-green blur-lg opacity-30"></div>
              <h2 className="relative text-4xl font-semibold tracking-tighter bg-gradient-to-r from-brand-purple via-brand-blue to-brand-green bg-clip-text text-transparent">
                The Path to<br />Production.
              </h2>
            </div>
          </div>
          <p className="text-brand-gray text-lg leading-relaxed">
            We've removed the barriers. From analysis to full-scale production in three rapid sprints.
          </p>
        </div>
        <div className="lg:w-2/3 grid gap-6 relative">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
          <svg className="absolute left-8 top-0 h-full w-0.5" style={{ zIndex: 0 }}>
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
      className={`bg-brand-light p-10 rounded-3xl reveal-on-scroll border-l-4 border-${color} transition-all hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] relative z-10`}
      style={{ transitionDelay: delay }}
    >
      <div className={`absolute -left-12 top-12 w-8 h-8 rounded-full bg-${color} flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse`}>
        {index + 1}
      </div>
      <span className={`${labelColor} text-xs font-bold uppercase tracking-widest mb-4 block`}>{number} {label}</span>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-brand-gray">{description}</p>
    </div>
  );
}
