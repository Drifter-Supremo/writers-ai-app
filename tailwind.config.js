/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this covers all component files
  ],
  
  theme: {
    extend: {
      colors: {
        // New Retro Space Palette
        'primary-bg': '#0f303d', // Deep Teal/Green
        'card-bg': '#1a4a58',    // Lighter Teal/Green for cards/panels
        'accent-orange': '#f58a07', // Vibrant Orange
        'accent-cream': '#f9f4d9', // Cream/Light Yellow
        'text-primary': '#f9f4d9', // Alias for accent-cream
        'text-secondary': '#d1ccb6', // Lighter Cream/Gray
        'status-success': '#5a9a6a', // Muted Green
        'status-error': '#b04a4a',   // Muted Red
        'status-warning': '#d9a05b', // Muted Yellow/Orange

        // Define hover/focus variations if needed, e.g.:
        'accent-orange-hover': '#d97904', // Darker orange for hover
      },
      // Remove old background gradients
      backgroundImage: {}, 
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' }
        }
      },
      // Update shadows if needed, or remove if using default Tailwind shadows
      boxShadow: {
        'card': '0 2px 5px rgba(0, 0, 0, 0.2)', // Example subtle shadow for dark theme
        'minimal': '0 1px 3px rgba(0, 0, 0, 0.1)', // Keep if used
      },
      // Remove old ring colors if not used with the new theme
      ringColor: {},
      ringOffsetColor: {},
      ringWidth: {},
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'], // Default system sans-serif
        migra: ['"Migra"', 'serif'] // Add Migra font
      },
    },
  },
  plugins: [],
}
