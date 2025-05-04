/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          dark: '#1E3A8A',
          light: '#3B82F6',
        },
        secondary: {
          DEFAULT: '#6B7280',
          dark: '#4B5563',
          light: '#9CA3AF',
        },
        accent: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399',
        },
        fundo: '#E0F2FE',
        navbar: '#1E3A8A',
        texto: '#374151',
        destaque: '#D4AF37',
        vue: '#3B82F6',
        branco: '#FFFFFF',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1F2937',
            a: {
              color: '#1E40AF',
              '&:hover': {
                color: '#1E3A8A',
              },
            },
            h1: {
              color: '#111827',
            },
            h2: {
              color: '#111827',
            },
            h3: {
              color: '#111827',
            },
            h4: {
              color: '#111827',
            },
            strong: {
              color: '#111827',
            },
            code: {
              color: '#1E40AF',
            },
            pre: {
              color: '#1F2937',
              backgroundColor: '#F3F4F6',
            },
            blockquote: {
              color: '#1F2937',
              borderLeftColor: '#1E40AF',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 