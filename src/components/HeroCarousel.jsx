import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80',
    title: 'Bienvenidos a San Juan de Dios • Distrito 03',
    subtitle: 'Nuestra comunidad unida avanzando hacia el futuro.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    title: 'Naturaleza, Historia y Comunidad Organizada',
    subtitle: 'Protegiendo nuestro entorno y fomentando el turismo rural.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
    title: 'Junta de Desarrollo Integral • Por el bienestar de todas las familias',
    subtitle: 'Trabajando de la mano con los vecinos de todos los sectores.'
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 'min(60vh, 560px)',
      overflow: 'hidden',
      backgroundColor: '#0F172A'
    }}>
      
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: index === currentIndex ? 1 : 0
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, rgba(0, 43, 127, 0.85) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '3rem 2rem 4rem 2rem'
          }}>
            <div className="stitch-container" style={{ textAlign: 'center' }}>
              <h1 style={{
                color: 'white',
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                fontWeight: '900',
                margin: '0 0 0.5rem 0',
                textShadow: '0 4px 6px rgba(0,0,0,0.5)',
                lineHeight: 1.2
              }}>
                {slide.title}
              </h1>
              <p style={{
                color: '#E2E8F0',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                margin: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Controles: Flechas */}
      <button
        onClick={goToPrevious}
        style={{
          position: 'absolute',
          top: '50%',
          left: '1rem',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(4px)',
          border: 'none',
          color: 'white',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={goToNext}
        style={{
          position: 'absolute',
          top: '50%',
          right: '1rem',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(4px)',
          border: 'none',
          color: 'white',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
      >
        <ChevronRight size={32} />
      </button>

      {/* Controles: Dots */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        zIndex: 10
      }}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: index === currentIndex ? '32px' : '10px',
              height: '10px',
              borderRadius: '99px',
              background: index === currentIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
