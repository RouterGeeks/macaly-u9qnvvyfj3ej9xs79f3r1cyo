import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'woso-gradient': 'linear-gradient(135deg, #6B46C1 0%, #06B6D4 50%, #111827 100%)',
        'woso-gradient-soft': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
        'woso-gradient-card': 'linear-gradient(145deg, rgba(107,70,193,0.9) 0%, rgba(6,182,212,0.8) 50%, rgba(17,24,39,0.9) 100%)',
        'woso-gradient-purple': 'linear-gradient(135deg, #8B5CF6 0%, #6B46C1 50%, #4C1D95 100%)',
        'woso-gradient-teal': 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 50%, #155E75 100%)',
        'woso-gradient-dark': 'linear-gradient(135deg, #374151 0%, #111827 50%, #000000 100%)',
        'woso-gradient-electric': 'linear-gradient(135deg, #A855F7 0%, #3B82F6 50%, #06B6D4 70%, #22D3EE 100%)',
        'wosolive-gradient': 'linear-gradient(135deg, #A855F7 0%, #6B46C1 50%, #06B6D4 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // WoSoLive Bold Ombre Brand Colors
        'woso-purple': {
          '50': '#FAF5FF',
          '100': '#F3E8FF', 
          '200': '#E9D5FF',
          '300': '#D8B4FE',
          '400': '#C084FC',
          '500': '#A855F7', // Electric purple
          '600': '#9333EA',
          '700': '#7C3AED',
          '800': '#6B46C1', // Deep purple
          '900': '#581C87'
        },
        'woso-teal': {
          '50': '#ECFEFF',
          '100': '#CFFAFE',
          '200': '#A5F3FC',
          '300': '#67E8F9',
          '400': '#22D3EE',
          '500': '#06B6D4', // Logo-matching turquoise
          '600': '#0891B2',
          '700': '#0E7490',
          '800': '#155E75', // Deep teal-blue
          '900': '#164E63'
        },
        'woso-blue': {
          '50': '#EFF6FF',
          '100': '#DBEAFE',
          '200': '#BFDBFE',
          '300': '#93C5FD',
          '400': '#60A5FA',
          '500': '#3B82F6', // Electric blue
          '600': '#2563EB',
          '700': '#1D4ED8',
          '800': '#1E40AF',
          '900': '#1E3A8A'
        },
        'woso-gray': {
          '50': '#F9FAFB',
          '100': '#F3F4F6',
          '200': '#E5E7EB',
          '300': '#D1D5DB',
          '400': '#9CA3AF',
          '500': '#6B7280',
          '600': '#4B5563',
          '700': '#374151',
          '800': '#1F2937', // Charcoal
          '900': '#111827'  // Near black
        },
        'woso-black': '#000000',       // Pure black
        'woso-cream': '#FEFEFE',       // Pure white for contrast
        'woso-white': '#FFFFFF',       // Pure white
        
        // System Colors (keeping shadcn compatibility)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },

      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',

      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;

