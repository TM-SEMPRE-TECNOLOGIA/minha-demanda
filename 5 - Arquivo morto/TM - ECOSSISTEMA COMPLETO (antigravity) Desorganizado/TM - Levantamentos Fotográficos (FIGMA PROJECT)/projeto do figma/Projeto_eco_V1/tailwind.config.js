/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "var(--TM-background)",
                foreground: "var(--TM-foreground)",
                primary: {
                    DEFAULT: "var(--TM-primary)",
                    foreground: "var(--TM-primary-foreground)",
                },
                card: {
                    DEFAULT: "var(--TM-card)",
                    foreground: "var(--TM-card-foreground)",
                },
            },
        },
    },
    plugins: [],
}
