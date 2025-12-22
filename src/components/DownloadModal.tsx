import { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (userData: UserData) => Promise<void>;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

export default function DownloadModal({ isOpen, onClose, onDownload }: DownloadModalProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.company) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await onDownload(formData);
      setFormData({ name: '', email: '', phone: '', company: '' });
      onClose();
    } catch (err) {
      setError('Failed to send report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-brand-gray" />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green opacity-80 mb-4"></div>
            <h2 className="text-2xl font-bold text-brand-black mb-2">Download ROI Report</h2>
            <p className="text-sm text-brand-gray">Enter your details to receive the comprehensive ROI analysis report via email.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-brand-gray">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-brand-light border-none rounded-lg p-3 text-sm text-brand-black placeholder-gray-400 focus:ring-2 focus:ring-brand-purple outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-brand-gray">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="w-full bg-brand-light border-none rounded-lg p-3 text-sm text-brand-black placeholder-gray-400 focus:ring-2 focus:ring-brand-purple outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-brand-gray">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-brand-light border-none rounded-lg p-3 text-sm text-brand-black placeholder-gray-400 focus:ring-2 focus:ring-brand-purple outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-widest mb-1.5 text-brand-gray">
                Company Name *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company"
                className="w-full bg-brand-light border-none rounded-lg p-3 text-sm text-brand-black placeholder-gray-400 focus:ring-2 focus:ring-brand-purple outline-none"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-brand-purple to-brand-green text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download Report</span>
                </>
              )}
            </button>

            <p className="text-xs text-center text-brand-gray mt-4">
              By downloading, you agree to receive communications from Flownetics Engineering.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
