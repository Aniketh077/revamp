import { X, ExternalLink } from 'lucide-react';

interface CalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  calLink?: string; // e.g., 'flownetics/consultation' or full URL
}

export default function CalBookingModal({ isOpen, onClose, calLink = 'flownetics/consultation' }: CalBookingModalProps) {
  if (!isOpen) return null;

  // Extract the Cal.com link path and construct the booking URL
  let bookingUrl: string;
  if (calLink && calLink.startsWith('http')) {
    // Use the full URL as-is (e.g., https://cal.com/me-aniketh/30min)
    bookingUrl = calLink;
  } else if (calLink) {
    // Construct full URL from path (e.g., me-aniketh/30min -> https://cal.com/me-aniketh/30min)
    bookingUrl = `https://cal.com/${calLink}`;
  } else {
    // Fallback
    bookingUrl = 'https://cal.com/flownetics/consultation';
  }

  const handleOpenInNewWindow = () => {
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-black">Schedule a Consultation</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInNewWindow}
              className="text-sm text-brand-purple hover:text-brand-purple/80 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open in new tab</span>
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cal.com Embed */}
        <div className="flex-1 overflow-hidden">
          <iframe
            key={bookingUrl} // Force reload when URL changes
            src={bookingUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              minHeight: '600px',
            }}
            title="Cal.com Booking"
            loading="lazy"
            allow="camera; microphone; geolocation"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

