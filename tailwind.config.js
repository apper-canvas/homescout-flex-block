/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2B6CB0",
        secondary: "#4A5568",
        accent: "#3182CE",
        surface: "#FFFFFF",
        background: "#F7FAFC",
        success: "#48BB78",
        warning: "#ED8936",
        error: "#F56565",
        info: "#4299E1"
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 6px 12px rgba(0, 0, 0, 0.15)',
        'header': '0 2px 4px rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        'hero': '12px',
        'card': '8px'
      },
      animation: {
        'scale-pulse': 'scalePulse 0.3s ease-in-out',
        'slide-in': 'slideIn 0.4s ease-out'
      },
      keyframes: {
        scalePulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        slideIn: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}