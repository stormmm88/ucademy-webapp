import { Manrope, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); 

const arial = localFont({
  src: [
    {
      path: "../app/ariali.ttf",
      weight: '400',
      style: 'italic',
    },
    {
      path: "../app/arialbd.ttf",
      weight: '700',
    },
    {
      path: "../app/arialbi.ttf",
      weight: '700',
      style: 'italic',
    }
  ],
  display: "swap",
})

export { manrope, geistSans, geistMono, arial };