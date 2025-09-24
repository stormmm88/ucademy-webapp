import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}",] ,
  theme: { 
    extend: {
        colors: {
            primary: "#4347b5",
        },
        fontFamily: {
            primary: ["var(--font-manrope)", "sans-serif"],
        },
    }, 
  },
  plugins: [],
};
export default config;