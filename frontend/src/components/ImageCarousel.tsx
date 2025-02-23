import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
  url: string;
  alt: string;
}

interface ImageCarouselProps {
  images: Image[];
  isAdmin?: boolean;
  onImageUpload?: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, isAdmin, onImageUpload }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-xl">
      <div
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {isAdmin && (
              <button
                onClick={() => onImageUpload?.(index)}
                className="absolute top-4 right-4 bg-white/90 text-gray-800 px-4 py-2 rounded-md shadow-lg hover:bg-white transition"
              >
                Replace Image
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}

export default ImageCarousel