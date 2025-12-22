import { useState } from 'react';
import { X, MapPin, Mail, Phone, Linkedin, Instagram, Send } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { subscribeNewsletter } from '../lib/api';

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (isHomePage) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/' + href);
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscribeMessage('');

    try {
      await subscribeNewsletter(email);
      setSubscribeMessage('Thank you for subscribing!');
      setEmail('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      if (errorMessage.includes('already')) {
        setSubscribeMessage('You are already subscribed!');
      } else {
        setSubscribeMessage(errorMessage);
      }
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setSubscribeMessage(''), 5000);
    }
  };

  return (
    <>
      <footer className="bg-brand-black text-white pt-8 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
            <div>
              <div className="mb-3">
                <img 
                  src="/media/footerimage-removebg-preview.png" 
                  alt="Flownetics Logo" 
                  className="h-12 w-auto mb-3 object-contain"
                />
               
           
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                Revolutionizing chemical manufacturing through continuous flow technology and AI-driven innovation.
              </p>
              <div className="flex gap-2">
                <a
                  href="https://linkedin.com/company/flownetics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-brand-purple/20 flex items-center justify-center hover:bg-brand-purple transition-colors rounded"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/flownetics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-brand-purple/20 flex items-center justify-center hover:bg-brand-purple transition-colors rounded"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium mb-3">Company</h4>
              <ul className="space-y-2 text-xs text-gray-400 font-light">
                <li>
                  <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="hover:text-brand-purple transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#pillars" onClick={(e) => handleNavClick(e, '#pillars')} className="hover:text-brand-purple transition-colors">
                    Platform
                  </a>
                </li>
                <li>
                  <a href="#blog" onClick={(e) => handleNavClick(e, '#blog')} className="hover:text-brand-purple transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:text-brand-purple transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-medium mb-3">Newsletter</h4>
              <p className="text-gray-400 text-xs mb-3">
                Stay updated with the latest in flow chemistry and AI-driven innovation.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-3 py-2 bg-white/10 border border-brand-purple/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-colors text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-brand-purple hover:bg-brand-purple/80 text-white px-3 py-2 rounded font-medium transition-colors flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  <Send className="w-3 h-3" />
                </button>
                {subscribeMessage && (
                  <p className={`text-xs ${subscribeMessage.includes('Thank you') ? 'text-green-400' : 'text-yellow-400'}`}>
                    {subscribeMessage}
                  </p>
                )}
              </form>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex flex-col gap-1.5 text-xs text-gray-400">
                  <button
                    onClick={() => setShowPrivacy(true)}
                    className="hover:text-brand-purple transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => setShowTerms(true)}
                    className="hover:text-brand-purple transition-colors text-left"
                  >
                    Terms & Conditions
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium mb-3">Contact Us</h4>
              <div className="space-y-2.5 text-xs text-gray-400 font-light">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white mb-0.5">
                      FLOWNETICS Engineering Private Limited
                    </p>
                    <p className="leading-relaxed">
                      148/A, Industrial Suburb 1st Stage,<br />
                      Yeswanthpura-560022<br />
                      Bangalore, India
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-purple flex-shrink-0" />
                  <a
                    href="mailto:sales@flownetics-engg.com"
                    className="hover:text-white transition-colors"
                  >
                    sales@flownetics-engg.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-purple flex-shrink-0" />
                  <a
                    href="tel:+919035021855"
                    className="hover:text-white transition-colors"
                  >
                    +91 90350 21855
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
            <p>&copy; 2024 Flownetics Engineering Private Limited. All rights reserved.</p>
            <p>Engineered with precision and innovation.</p>
          </div>
        </div>
      </footer>

      {showPrivacy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-brand-black">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacy(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-8 py-6 space-y-6 text-brand-gray">
              <p className="text-sm text-gray-500">Last updated: December 15, 2024</p>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">1. Information We Collect</h3>
                <p className="leading-relaxed">
                  We collect information that you provide directly to us, including name, email address, phone number,
                  company information, and any other information you choose to provide when you contact us or use our services.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">2. How We Use Your Information</h3>
                <p className="leading-relaxed mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and complete transactions</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Develop new products and services</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">3. Information Sharing</h3>
                <p className="leading-relaxed">
                  We do not share your personal information with third parties except as necessary to provide our services,
                  comply with the law, or protect our rights. We may share information with service providers who perform
                  services on our behalf.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">4. Data Security</h3>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">5. Your Rights</h3>
                <p className="leading-relaxed">
                  You have the right to access, update, or delete your personal information. You may also have the right
                  to restrict or object to certain processing of your data. Contact us at sales@flownetics-engg.com to
                  exercise these rights.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">6. Contact Us</h3>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at sales@flownetics-engg.com
                  or +91 90350 21855.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {showTerms && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-brand-black">Terms & Conditions</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-8 py-6 space-y-6 text-brand-gray">
              <p className="text-sm text-gray-500">Last updated: December 15, 2024</p>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">1. Acceptance of Terms</h3>
                <p className="leading-relaxed">
                  By accessing and using the services provided by Flownetics Engineering Private Limited, you accept
                  and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do
                  not use our services.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">2. Services</h3>
                <p className="leading-relaxed">
                  Flownetics provides continuous flow chemistry technology, AI-driven process optimization, and related
                  manufacturing services. We reserve the right to modify, suspend, or discontinue any aspect of our
                  services at any time.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">3. Intellectual Property</h3>
                <p className="leading-relaxed">
                  All content, technology, software, and materials provided by Flownetics are protected by intellectual
                  property rights. You may not copy, modify, distribute, or create derivative works without our express
                  written permission.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">4. Confidentiality</h3>
                <p className="leading-relaxed">
                  Both parties agree to maintain the confidentiality of any proprietary or confidential information
                  shared during the course of our business relationship. This obligation continues even after the
                  termination of services.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">5. Limitation of Liability</h3>
                <p className="leading-relaxed">
                  Flownetics shall not be liable for any indirect, incidental, special, or consequential damages arising
                  from the use or inability to use our services. Our total liability shall not exceed the amount paid
                  for the services in question.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">6. Governing Law</h3>
                <p className="leading-relaxed">
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
                  Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-brand-black mb-3">7. Contact Information</h3>
                <p className="leading-relaxed">
                  For questions regarding these Terms and Conditions, please contact us at sales@flownetics-engg.com
                  or call +91 90350 21855.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
