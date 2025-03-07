import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  url: string;
  alt: string;
}

interface ScrollingPhotoGalleryProps {
  photos: Photo[];
  autoScroll?: boolean;
  scrollInterval?: number;
}

const ScrollingPhotoGallery: React.FC<ScrollingPhotoGalleryProps> = ({
  photos,
  autoScroll = true,
  scrollInterval = 3000
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const totalWidth = scrollContainerRef.current.scrollWidth;
      setContainerWidth(containerWidth);
      setTotalWidth(totalWidth);
    }

    const handleResize = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.clientWidth);
        setTotalWidth(scrollContainerRef.current.scrollWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [photos]);

  useEffect(() => {
    if (!autoScroll || isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const newPosition = scrollPosition + 300;
        const maxScroll = totalWidth - containerWidth;
        
        if (newPosition >= maxScroll) {
          setScrollPosition(0);
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          setScrollPosition(newPosition);
          scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
        }
      }
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, scrollInterval, scrollPosition, containerWidth, totalWidth, isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(totalWidth - containerWidth, scrollPosition + scrollAmount);
      
      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative w-full my-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 py-4"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>
          {`
            .flex::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-80 h-60 rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105"
          >
            <img 
              src={photo.url} 
              alt={photo.alt} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition z-10"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition z-10"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
};

export default ScrollingPhotoGallery;