/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}"
    ],
    theme: {
        extend: {
          colors: {
            primary: '#137fec',
            'bg-page': '#f6f7f8',
            'bg-card': '#ffffff',
            'bg-soft': '#f8fafc',
            'border-soft': '#e5e7eb',
            'text-muted': '#94a3b8',
          },
        },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  };
