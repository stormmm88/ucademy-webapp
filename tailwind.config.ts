import type { Config } from 'tailwindcss';
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
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
  plugins: [animate],
};
export default config;