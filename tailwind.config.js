/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#DBEAFE',
          lighter: '#EFF6FF'
        },
        navy: {
          DEFAULT: '#0F172A',
          secondary: '#1E293B'
        },
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0'
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B'
        },
        status: {
          success: '#16A34A',
          successBg: '#DCFCE7',
          warning: '#D97706',
          warningBg: '#FEF3C7',
          critical: '#DC2626',
          criticalBg: '#FEE2E2',
          info: '#2563EB',
          infoBg: '#DBEAFE'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)',
        raised: '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)'
      },
      borderRadius: {
        card: '10px'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(8px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out',
        slideIn: 'slideIn 0.2s ease-out'
      }
    }
  },
  plugins: []
}
