/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      colors: {
        base:   '#0c0c0f',
        surface:'#131318',
        card:   '#1b1b22',
        border: '#2c2c38',
        amber:  { DEFAULT:'#e8a020', light:'#ffbe4a', muted:'#7a5010' },
        slate:  { soft:'#8888a8', bright:'#c0c0d8' },
        green:  { task:'#34c77b' },
        red:    { task:'#e85555' },
        blue:   { task:'#5588ff' },
      },
      animation: {
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up':  'fadeUp 0.5s ease both',
        'pop':      'pop 0.2s ease both',
      },
      keyframes: {
        slideIn: { from:{ opacity:0, transform:'translateX(-12px)' }, to:{ opacity:1, transform:'translateX(0)' } },
        fadeUp:  { from:{ opacity:0, transform:'translateY(16px)' },  to:{ opacity:1, transform:'translateY(0)' } },
        pop:     { '0%':{ transform:'scale(0.94)' }, '60%':{ transform:'scale(1.03)' }, '100%':{ transform:'scale(1)' } },
      },
      boxShadow: {
        card: '0 2px 24px rgba(0,0,0,0.4)',
        glow: '0 0 24px rgba(232,160,32,0.2)',
      },
    },
  },
  plugins: [],
}