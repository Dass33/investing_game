/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsz,tsx}"
    ],
    safelist: [
        'bg-figma-honey',
        'bg-figma-lavender',
        'bg-figma-pool',
        'bg-figma-teal',
        'bg-figma-berries',
        'bg-figma-winter',
        'bg-figma-indigo',
        'bg-figma-pale',
    ],
    theme: {
        extend: {
            colors: {
                'figma-black': '#0B1F42',
                'figma-stone': '#245375',
                'figma-light-gray': '#A7BAC8',
                'figma-honey': '#FFD32A',
                'figma-carrots': '#FF6130',
                'figma-berries': '#E1015B',
                'figma-rose': '#EB4C79',
                'figma-lavender': '#AA4BB3',
                'figma-pool': '#199CF9',
                'figma-teal': '#02A3A4',
                'figma-lime': '#0CB43F',
                'figma-forest': '#028661',
                'figma-winter': '#9FD7FF',
                'figma-indigo': '#ACABD3',
                'figma-pale': '#FF9CC4',
                'figma-white': '#EEF1F4',

            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}

