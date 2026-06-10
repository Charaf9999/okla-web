/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: '#D96C3B', terracottaD: '#C25A2C', cacao: '#3A2A1A',
        cream: '#FFF4E6', olive: '#6F8F45', saffron: '#F2B84B',
        brick: '#C94C3D', sand: '#E8E2D8', ink: '#2A1D12',
        card: '#FFFCF6', muted: '#8B7A68',
      },
      fontFamily: {
        head: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 40px -14px rgba(58,42,26,.4)',
        glow: '0 12px 28px -10px rgba(217,108,59,.7)',
      },
    },
  },
  plugins: [],
}
