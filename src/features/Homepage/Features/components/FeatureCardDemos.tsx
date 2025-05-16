import { CheckCircle, Heart, Pause, Play } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';

/**
 * Sample workout component for the Customized Workouts feature
 */
export const SampleWorkout: React.FC = () => {
  return (
    <div className="text-white h-full w-full flex flex-col overflow-hidden">
      <ul className="space-y-2 text-xs flex-1 overflow-y-auto pr-2">
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Goblet Squats</span>
            <p className="text-gray-300 text-[10px]">3 × 12 reps</p>
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Push-ups</span>
            <p className="text-gray-300 text-[10px]">3 × 15 reps</p>
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Walking Lunges</span>
            <p className="text-gray-300 text-[10px]">3 × 10 reps each</p>
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Kettlebell Swings</span>
            <p className="text-gray-300 text-[10px]">3 × 15 reps</p>
          </div>
        </li>
        <li className="flex items-start">
          <CheckCircle size={12} className="text-lime-300 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium">Plank</span>
            <p className="text-gray-300 text-[10px]">3 × 45 seconds</p>
          </div>
        </li>
      </ul>
      <div className="mt-2 pt-1 border-t border-white/10 text-[8px] text-gray-400/70">
        <p className="italic text-[7px]">* AI-optimized for your full fitness profile</p>
      </div>
    </div>
  );
};

/**
 * Progress chart component for the Real-Time Tracking feature
 */
export const ProgressChart: React.FC = () => {
  return (
    <div className="text-white h-full w-full flex flex-col">
      <h4 className="text-cyan-300 text-sm font-bold mb-3">Weekly Progress</h4>

      <div className="flex-1 relative">
        {/* Chart grid */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-gray-700/30"
              style={{ top: `${20 * i}%` }}
            ></div>
          ))}
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-px bg-gray-700/30"
              style={{ left: `${100 / 6 * i}%` }}
            ></div>
          ))}
        </div>

        {/* Progress line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          {/* Animated progress path */}
          <path
            d="M0,80 C40,70 60,40 80,30 S120,50 140,40 S180,10 200,20"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            className="chart-line animate-draw-line drop-shadow-[0_0_3px_rgba(132,204,22,0.5)]"
          />

          {/* Heart at end of line */}
          <Heart
            size={16}
            className="text-rose-500 fill-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.5)] opacity-0 animate-heartbeat animate-heart-pulse animate-fade-in"
            style={{
              transform: 'translate(196px, 16px)',
              transformOrigin: 'center',
              animationDelay: '2.4s, 2.4s, 2.4s'
            }}
          />
        </svg>

        {/* Data points */}
        {[
          { x: 0, y: 80 },
          { x: 40, y: 70 },
          { x: 80, y: 30 },
          { x: 120, y: 50 },
          { x: 160, y: 60 },
          { x: 200, y: 20 }
        ].map((point, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 bg-gradient-to-br from-lime-400 to-cyan-400 rounded-full opacity-0 scale-0 animate-point-fade"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              animationDelay: `${i * 0.4 + 0.5}s`
            }}
          ></div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-[10px] text-gray-400">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="px-3 py-1 bg-lime-500/20 rounded-full text-lime-400 text-xs font-semibold">
          +12% this week
        </div>
      </div>
    </div>
  );
};

/**
 * Video player component for the Expert Advice feature
 */
export const VideoPlayer = forwardRef<HTMLVideoElement>((_, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Update play state when video state changes
  useEffect(() => {
    const videoElement = ref as React.RefObject<HTMLVideoElement>;
    if (!videoElement.current) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.current.addEventListener('play', handlePlay);
    videoElement.current.addEventListener('pause', handlePause);

    return () => {
      if (videoElement.current) {
        videoElement.current.removeEventListener('play', handlePlay);
        videoElement.current.removeEventListener('pause', handlePause);
      }
    };
  }, [ref]);

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="flex-1 relative">
        <video
          ref={ref}
          src="./wp-content/themes/fitcopilot/public/videos/Mission-Bay-Footage.mp4"
          className="h-full w-full object-cover rounded-md"
          muted
          loop
          playsInline
        />

        {/* Overlay with play/pause button */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
          <button
            className="h-12 w-12 rounded-full bg-violet-500/80 flex items-center justify-center hover:bg-violet-600/80 transition-colors"
            onClick={() => {
              const videoElement = ref as React.RefObject<HTMLVideoElement>;
              if (videoElement.current) {
                if (isPlaying) {
                  videoElement.current.pause();
                } else {
                  videoElement.current.play().catch(logger.error);
                }
              }
            }}
          >
            {isPlaying ? (
              <Pause size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white ml-1" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="video-progress">
          <div
            className={`video-progress-bar ${isPlaying ? 'animate-progress' : ''}`}
            style={{
              width: isPlaying ? 'auto' : '0%'
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{isPlaying ? "2:34" : "0:00"}</span>
          <span>5:00</span>
        </div>
      </div>
    </div>
  );
});

// Add display name for forwarded ref component
VideoPlayer.displayName = 'VideoPlayer'; 