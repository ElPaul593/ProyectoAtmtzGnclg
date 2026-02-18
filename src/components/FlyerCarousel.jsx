"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FLYER_IMAGES } from '../constants/flyers';

const FlyerCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? FLYER_IMAGES.length - 1 : prev - 1));
    };

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === FLYER_IMAGES.length - 1 ? 0 : prev + 1));
    }, []);

    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isHovered, nextSlide]);

    return (
        <div
            className="relative group w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Container - Reverted to "Old" Design Style (Rounded 3rem, Rotated) */}
            <div className="relative overflow-hidden rounded-[3rem] shadow-2xl bg-white h-[500px] md:h-[650px] transition-all duration-500 transform rotate-2 hover:rotate-0 border-4 border-white/50">

                {/* Images */}
                {FLYER_IMAGES.map((image, index) => (
                    <div
                        key={image.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <img
                            src={image.src.src || image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay - Subtle for arrow visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                ))}

                {/* Floating Controls - Kept minimal */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
                    {FLYER_IMAGES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>

            </div>

            {/* Backdrops - Adjusted to match old design if needed or kept as subtle glow */}
            <div className="absolute inset-0 bg-[#6A4C93] rounded-[3rem] transform translate-x-4 translate-y-4 -z-10 opacity-20"></div>
        </div>
    );
};

export default FlyerCarousel;
