import { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Maximize } from 'lucide-react';

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && video) {
            video.play().catch(err => console.log('Video play failed:', err));
          } else if (video) {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.log('Fullscreen failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="px-6 py-12 bg-gradient-to-b from-white to-brand-light relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div ref={containerRef} className="aspect-video w-full max-h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl relative border-2 border-brand-purple/20 group hover:border-brand-purple/40 transition-all">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              playsInline
            >
              <source src="/media/pixverse_v5.5_image_text_360p_use_the_same_ima.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={restart}
                className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                aria-label="Restart video"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleMute}
                className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleFullscreen}
                className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                aria-label="Toggle fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-center mt-8 text-brand-gray font-medium text-sm">Flownetics - future of chemistry</p>
        </div>
      </section>

      <div className="relative overflow-hidden bg-gradient-to-r from-brand-black via-gray-900 to-brand-black py-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/10 via-transparent to-brand-orange/10"></div>
        <div className="animate-marquee whitespace-nowrap flex relative z-10">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="inline-block text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest mx-8 italic bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green bg-clip-text text-transparent"
            >
              CHEMISTRY IN MOTION
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </>
  );
}
