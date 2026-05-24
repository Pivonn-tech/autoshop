'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LightboxProps {
  images: {
    url: string;
    alt: string;
  }[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Main Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '90vw',
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={images[currentIndex]?.url}
          alt={images[currentIndex]?.alt}
          fill
          style={{ objectFit: 'contain' }}
          priority
          sizes="90vw"
        />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#FFFFFF20',
          border: 'none',
          borderRadius: '50%',
          width: '2.5rem',
          height: '2.5rem',
          color: '#FFFFFF',
          fontSize: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF40';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#FFFFFF20';
        }}
      >
        ✕
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#FFFFFF20',
            border: 'none',
            borderRadius: '50%',
            width: '3rem',
            height: '3rem',
            color: '#FFFFFF',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF40';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF20';
          }}
        >
          ◀
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#FFFFFF20',
            border: 'none',
            borderRadius: '50%',
            width: '3rem',
            height: '3rem',
            color: '#FFFFFF',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF40';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF20';
          }}
        >
          ▶
        </button>
      )}

      {/* Counter & Info */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          color: '#FFFFFF',
          fontSize: '0.875rem',
          backgroundColor: '#000000cc',
          padding: '0.75rem 1rem',
          borderRadius: '0.25rem',
        }}
      >
        {currentIndex + 1} of {images.length}
      </div>

      {/* Keyboard Help */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          color: '#FFFFFF80',
          fontSize: '0.75rem',
          backgroundColor: '#000000cc',
          padding: '0.75rem 1rem',
          borderRadius: '0.25rem',
          textAlign: 'right',
        }}
      >
        <div>← → to navigate</div>
        <div>ESC to close</div>
      </div>
    </div>
  );
}
