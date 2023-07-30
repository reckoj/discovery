module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
      fontFamily: {
          sans: ['Roboto', 'sans-serif'],
      },
      screens: {
          'screen1200': { 'max': '1200px' },
          'screen1024': { 'max': '1024px' },
          'screen991': { 'max': '991px' },
          'screen800': { 'max': '800px' },
          'screen500': { 'max': '500px' }
      },
      extend: {
        width: {
            'board': 'calc(100% - 280px)'
        },
        backgroundColor:{
            'primary': '#145369',
            'secondary': '#4FC6F0',
            'secondary-imp': '#4FC6F0 !important',
            'accent': '#BEA925',
            'transparent': 'rgba(0, 0, 0, 0.0767)'
        },
        colors:{
            'primary': '#145369',
            'secondary': '#4FC6F0',
            'accent': '#BEA925'
        }
    },
  },
  variants: {
      extend: {},
  },
  plugins: [],
}
