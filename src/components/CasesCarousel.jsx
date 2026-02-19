"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CASES_IMAGES } from '../constants/cases';

const CasesCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? CASES_IMAGES.length - 1 : prev - 1));
    };

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === CASES_IMAGES.length - 1 ? 0 : prev + 1));
    }, []);

    // Auto-play functionality: Changes every 5 seconds
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
            className="relative group w-full h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Images */}
            {CASES_IMAGES.map((image, index) => (
                <div
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <img
                        src={image.src.src || image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover object-top"
                    />
                    {/* The specific gradient requested by the user */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                </div>
            ))}

            {/* Navigation Controls */}
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
            <div className="absolute bottom-24 left-0 right-0 z-20 flex justify-center space-x-2">
                {CASES_IMAGES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CasesCarousel;
