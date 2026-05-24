'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface GalleryProps {
  images: {
    url: string;
    alt: string;
  }[];
  title: string;
  onLightboxOpen?: (imageIndex: number) => void;
}

const colors = {
  background: '#0A0A0A',
  surface: '#1A1A1A',
  text: '#FFFFFF',
  accent: '#FFD700',
  textSecondary: '#666666',
};

export default function ImageGallery({
  images,
  title,
  onLightboxOpen,
}: GalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: colors.textSecondary }}>No images available</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Main Image - Swiper Carousel */}
      <div
        style={{
          position: 'relative',
          backgroundColor: colors.surface,
          borderRadius: '0.5rem',
          overflow: 'hidden',
          aspectRatio: '16 / 9',
          cursor: 'pointer',
        }}
        onClick={() => onLightboxOpen?.(activeIndex)}
      >
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation={{
            nextEl: '.gallery-next',
            prevEl: '.gallery-prev',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          style={{ height: '100%' }}
        >
          {images.map((image, idx) => (
            <SwiperSlide key={idx} style={{ height: '100%' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority={idx === 0}
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          className="gallery-prev"
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            backgroundColor: colors.accent,
            color: colors.background,
            border: 'none',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ◀
        </button>

        <button
          className="gallery-next"
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            backgroundColor: colors.accent,
            color: colors.background,
            border: 'none',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ▶
        </button>

        {/* Fullscreen indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: colors.accent + 'cc',
            color: colors.background,
            padding: '0.5rem 0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            zIndex: 5,
          }}
        >
          Click to expand ⛶
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
          }}
        >
          <Swiper
            onSwiper={setThumbsSwiper}
            slidesPerView="auto"
            spaceBetween={8}
            watchSlidesProgress
            modules={[Thumbs]}
            style={{
              display: 'flex',
              width: '100%',
            }}
          >
            {images.map((image, idx) => (
              <SwiperSlide
                key={idx}
                style={{
                  width: 'auto',
                  aspectRatio: '4 / 3',
                  minWidth: '80px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '60px',
                    borderRadius: '0.25rem',
                    overflow: 'hidden',
                    border: `2px solid ${colors.textSecondary}40`,
                    opacity: activeIndex === idx ? 1 : 0.5,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Image
                    src={image.url}
                    alt={`${image.alt} thumbnail`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="80px"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Image Counter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.5rem',
          borderTop: `1px solid ${colors.textSecondary}20`,
        }}
      >
        <p
          style={{
            color: colors.textSecondary,
            fontSize: '0.875rem',
            margin: 0,
          }}
        >
          {activeIndex + 1} of {images.length}
        </p>
        <button
          onClick={() => onLightboxOpen?.(activeIndex)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: colors.accent + '20',
            border: `1px solid ${colors.accent}`,
            borderRadius: '0.25rem',
            color: colors.accent,
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.accent;
            e.currentTarget.style.color = colors.background;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.accent + '20';
            e.currentTarget.style.color = colors.accent;
          }}
        >
          View Full Resolution
        </button>
      </div>
    </div>
  );
}
