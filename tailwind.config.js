/* your tailwind.config.js file */

module.exports = {
    content: ["./src/**/*.{html,js}"],
    safelist: [
      'min-w-10'
    ],
    future: {
          hoverOnlyWhenSupported: false,
      },
    theme: {
      extend: {
        minWidth: {
          '10': '2.5rem',   // 10 × 0.25rem
          '12': '3rem',     // 12 × 0.25rem
          '16': '4rem',     // 16 × 0.25rem
          '20': '5rem',     // 20 × 0.25rem
        },
        minHeight: {
          '10': '2.5rem',   // 10 × 0.25rem
          '12': '3rem',     // 12 × 0.25rem
          '16': '4rem',     // 16 × 0.25rem
          '20': '5rem',     // 20 × 0.25rem
        },
      },
    },
    plugins: [
      require('@aegov/design-system'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms')
    ],
  }
  