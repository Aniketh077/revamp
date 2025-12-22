import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import CalBookingModal from './CalBookingModal';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCalModal, setShowCalModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { href: '#pillars', label: 'Platform' },
    { href: '#ai-architect', label: 'AI Architect' },
    { href: '#calculator', label: 'Savings' },
    { href: '#about', label: 'About' },
    { href: '#blog', label: 'Blog' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

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

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <a href="/" onClick={handleLogoClick} className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-3">
          <img src="/media/flownetics.png" alt="Flownetics" className="h-5 sm:h-4 w-auto" />
          <div className="hidden sm:block">

          </div>
        </a>

        <div className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-light text-brand-black">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-brand-purple transition-colors relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-purple transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <button
          onClick={() => setShowCalModal(true)}
          className="hidden md:block bg-brand-black text-white text-xs font-medium px-4 lg:px-6 py-2 lg:py-3 rounded-2xl hover:bg-gradient-purple transition-all shadow-lg"
        >
          Book Consultation
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-brand-light transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl animate-fade-in">
          <div className="px-4 py-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block py-3 px-4 text-brand-black hover:bg-brand-light hover:text-brand-purple transition-all font-light"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setShowCalModal(true);
                setIsMenuOpen(false);
              }}
              className="block w-full text-center mt-4 bg-brand-black text-white font-medium px-6 py-3 rounded-2xl hover:bg-gradient-purple transition-all"
            >
              Book Consultation
            </button>
          </div>
        </div>
      )}

      <CalBookingModal 
        isOpen={showCalModal} 
        onClose={() => setShowCalModal(false)}
        calLink={import.meta.env.VITE_CAL_LINK}
      />
    </nav>
  );
}
