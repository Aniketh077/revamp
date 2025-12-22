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
        <div className="w-full lg:w-2/3 grid gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
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
      className="bg-gradient-to-br from-white via-brand-light to-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl reveal-on-scroll border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group cursor-pointer"
      style={{
        transitionDelay: delay,
        borderColor: color
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
          >
            {index + 1}
          </div>
          <div>
            <span className={`${labelColor} text-xs font-bold uppercase tracking-widest block mb-1`}>
              {number}
            </span>
            <span className={`${labelColor} text-sm font-semibold uppercase tracking-wide`}>
              {label}
            </span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-brand-black group-hover:scale-[1.02] transition-transform duration-300">
          {title}
        </h3>
        <p className="text-brand-gray text-sm sm:text-base leading-relaxed">{description}</p>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-1.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-3xl"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}
