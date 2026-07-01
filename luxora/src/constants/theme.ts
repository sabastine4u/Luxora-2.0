export const THEME = {
  colors: {
    navy: {
      950: '#070B14',
      900: '#0B1120',
      850: '#0E1626',
      800: '#111B30',
      700: '#1A2740',
      600: '#243352',
      500: '#33446B',
    },
    gold: {
      50: '#FBF7EC',
      100: '#F6ECC8',
      200: '#EEDB97',
      300: '#E4C766',
      400: '#D4AF37',
      500: '#B8932B',
      600: '#947421',
      700: '#6E551A',
    },
    cream: '#F8F6F0',
    ink: '#E5E7EB',
  },
  typography: {
    fontFamily: {
      heading: 'Montserrat, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  animationDurations: {
    fast: '0.3s',
    normal: '0.7s',
    slow: '0.8s',
    shimmer: '2.5s',
    float: '6s',
  },
  shadows: {
    lux: '0 20px 60px -15px rgba(0, 0, 0, 0.5)',
    gold: '0 10px 40px -10px rgba(212, 175, 55, 0.35)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
  },
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 40,
    header: 50,
    overlay: 60,
    modal: 100,
  }
} as const;
