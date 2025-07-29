import React from 'react';

// Günlük Görev İkonu - Ana sayfadaki gibi kare içinde gradient
export const GunlukGorevIcon = ({ size = 56, fontSize = 28, style = {} }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ff8c00, #1e40af)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Math.max(fontSize, 24),
    flexShrink: 0,
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
    ...style
  }}>
    📅
  </div>
);

// Hızlı Başla İkonu - Ana sayfadaki gibi kare içinde gradient
export const HizliBaslaIcon = ({ size = 56, fontSize = 28, style = {} }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #4a90e2, #ffb347)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: fontSize,
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    ...style
  }}>
    🚀
  </div>
);

// Günlük Görev İkonu - Küçük boyut (başlık için)
export const GunlukGorevIconSmall = ({ size = 32, fontSize = 16, style = {} }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ff8c00, #1e40af)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Math.max(fontSize, 18),
    flexShrink: 0,
    boxShadow: '0 3px 12px rgba(59, 130, 246, 0.4)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
    ...style
  }}>
    📅
  </div>
);

// Hızlı Başla İkonu - Küçük boyut (başlık için)
export const HizliBaslaIconSmall = ({ size = 32, fontSize = 16, style = {} }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #4a90e2, #ffb347)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: fontSize,
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    ...style
  }}>
    🚀
  </div>
); 