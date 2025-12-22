import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { pillars } from './Pillars';

export default function PillarDetail() {
  const { pillarId } = useParams<{ pillarId: string }>();
  const navigate = useNavigate();
  const pillar = pillars.find((p) => p.id === parseInt(pillarId || '0'));

  const handleBackClick = () => {
    navigate('/');
    setTimeout(() => {
      const pillarsSection = document.getElementById('pillars');
      if (pillarsSection) {
        pillarsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!pillar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Pillar not found</h1>
          <button
            onClick={handleBackClick}
            className="text-brand-purple hover:text-brand-orange transition-colors font-semibold"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-brand-purple text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-white/80 hover:text-white transition-all duration-300 mb-12 group font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </button>

          <div className="max-w-4xl">
            <span className="inline-block text-sm font-bold uppercase tracking-widest text-brand-orange mb-6">
              {pillar.number}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              {pillar.title}
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-light leading-relaxed">
              {pillar.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Overview</h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Our approach to {pillar.title.toLowerCase()} represents years of research and development
                in advanced flow chemistry technology. This pillar is fundamental to delivering exceptional
                results in continuous manufacturing.
              </p>
              <p className="text-xl font-medium text-gray-900">
                {pillar.detailedDescription}
              </p>
              <p>
                This pillar forms a critical foundation of our commitment to delivering world-class
                continuous flow solutions that transform chemical manufacturing processes across industries.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-brand-purple to-brand-orange p-8 rounded-2xl text-white h-fit">
            <h3 className="text-2xl font-bold mb-6">Key Metrics</h3>
            <div className="space-y-6">
              <div>
                <div className="text-5xl font-bold mb-2">40%</div>
                <div className="text-white/90">Time Savings</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">35%</div>
                <div className="text-white/90">Cost Reduction</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">99.8%</div>
                <div className="text-white/90">Quality Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">Technical Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Real-Time Analytics',
                description: 'State-of-the-art monitoring systems with comprehensive data visualization and reporting capabilities.'
              },
              {
                title: 'Advanced Automation',
                description: 'Intelligent protocols ensuring consistent, repeatable results with minimal operator intervention.'
              },
              {
                title: 'Scalable Architecture',
                description: 'Designed for seamless growth from laboratory scale to full production capacity.'
              },
              {
                title: 'System Integration',
                description: 'Compatible with existing laboratory and manufacturing infrastructure for smooth deployment.'
              },
              {
                title: 'Regulatory Compliance',
                description: 'Comprehensive data logging and documentation for meeting industry standards and requirements.'
              },
              {
                title: 'Process Optimization',
                description: 'Continuous monitoring and adjustment capabilities for maximum efficiency and yield.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl border-l-4 border-brand-orange hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">Business Impact</h2>
          <div className="bg-gradient-to-r from-gray-50 to-white p-10 rounded-2xl border border-gray-200">
            <ul className="space-y-5 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-brand-orange font-bold mr-4 text-2xl">→</span>
                <span>Reduce time-to-market by up to 40% with accelerated development cycles</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-orange font-bold mr-4 text-2xl">→</span>
                <span>Minimize waste and maximize resource efficiency throughout production</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-orange font-bold mr-4 text-2xl">→</span>
                <span>Lower operational costs through intelligent automation and optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-orange font-bold mr-4 text-2xl">→</span>
                <span>Improve product quality and ensure batch-to-batch consistency</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-orange font-bold mr-4 text-2xl">→</span>
                <span>Enable faster iteration and continuous process improvement</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">Key Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Industry-leading accuracy and precision',
              'Comprehensive technical support',
              'Proven production results',
              'Seamless system integration',
              'Continuous improvements',
              'Expert technical team',
              'Advanced analytics platform',
              'Full regulatory compliance'
            ].map((benefit, index) => (
              <div
                key={index}
                className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-purple transition-all duration-300 hover:shadow-xl"
              >
                <span className="text-lg font-medium text-gray-900">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-purple to-brand-orange p-12 rounded-3xl text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Process?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Contact our team to discuss how {pillar.title.toLowerCase()} can deliver
            measurable results for your manufacturing operations.
          </p>
          <button
            onClick={handleContactClick}
            className="inline-block bg-white text-brand-purple px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
}
