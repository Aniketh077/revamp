import { Target, Lightbulb, Users, TrendingUp } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-24 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-purple/5 rounded-full blur-3xl"></div>

      <div ref={ref} className="max-w-7xl mx-auto relative z-10 reveal-on-scroll">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green blur-lg opacity-30"></div>
              <h2 className="relative text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green bg-clip-text text-transparent px-4">
                About Flownetics
              </h2>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-800 max-w-4xl mx-auto mb-6 leading-relaxed">
            Revolutionizing Chemical Manufacturing Through Innovation.
          </p>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg text-gray-600 leading-relaxed">
              Flownetics is pioneering the transformation of chemical manufacturing with cutting-edge
              continuous flow technology and AI-driven process optimization. We're building the future
              of sustainable, efficient chemical production.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our Flow-as-a-Service (FaaS) model eliminates traditional barriers to entry, enabling
              pharmaceutical and chemical companies to achieve unprecedented efficiency gains while
              reducing capital investment and environmental impact.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="group bg-white rounded-2xl p-6 border-2 border-brand-purple/20 hover:border-brand-purple hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-purple to-purple-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Democratize continuous flow chemistry through innovative technology and accessible service models.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 border-2 border-brand-green/20 hover:border-brand-green hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-green to-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI-powered process design and optimization delivering 30% cost reduction and 10x faster development.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 border-2 border-brand-orange/20 hover:border-brand-orange hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-orange to-orange-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Partnership</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Collaborative approach ensuring your success through dedicated support and expertise.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 border-2 border-brand-blue/20 hover:border-brand-blue hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Growth</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Scalable solutions from lab to production, growing with your business needs seamlessly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
