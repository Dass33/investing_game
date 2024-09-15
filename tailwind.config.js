/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsz,tsx}"
    ],
    safelist: [
        'bg-figma-honey',
        'bg-figma-rose',
        'bg-figma-lavender',
        'bg-figma-pool',
        'bg-figma-teal',
        'bg-figma-lime',
        'bg-figma-forest',
        'bg-figma-berries',
        'bg-figma-carrots'
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
                'figma-lavender': '#721C7A',
                'figma-pool': '#199CF9',
                'figma-teal': '#02A3A4',
                'figma-lime': '#0CB43F',
                'figma-forest': '#028661',
            }
        },
    },
    plugins: [],
}

