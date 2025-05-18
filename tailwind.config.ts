import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Soft color palette
        lavender: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        sage: {
          50: "#f6f7f6",
          100: "#e3e7e3",
          200: "#c6cfc5",
          300: "#a3b1a1",
          400: "#7d8f7a",
          500: "#5f6f5c",
          600: "#4a5548",
          700: "#3c4439",
          800: "#2f342e",
          900: "#272b26",
          950: "#171a16",
        },
        sand: {
          50: "#f9f7f4",
          100: "#f0ebe3",
          200: "#e2d8c9",
          300: "#d1bea7",
          400: "#bea083",
          500: "#b08c6c",
          600: "#a07a5e",
          700: "#85634f",
          800: "#6d5244",
          900: "#5a453a",
          950: "#302319",
        },
        // Updated softer colors
        blush: {
          50: "#fdf6f8",
          100: "#faedf1",
          200: "#f5dbe3",
          300: "#edc0cd",
          400: "#e0a0b3",
          500: "#d27f97",
          600: "#c0607d",
          700: "#a04967",
          800: "#833c56",
          900: "#6d3448",
          950: "#3e1a26",
        },
        mint: {
          50: "#f2fbf7",
          100: "#e6f7ef",
          200: "#ceeede",
          300: "#a9dfc5",
          400: "#7cc9a3",
          500: "#57b185",
          600: "#3e906a",
          700: "#327456",
          800: "#2b5d47",
          900: "#254d3b",
          950: "#122b21",
        },
        sky: {
          50: "#f4f9fd",
          100: "#e9f3fa",
          200: "#d4e7f5",
          300: "#b0d4ec",
          400: "#84b9df",
          500: "#5a9ad0",
          600: "#3f7dbc",
          700: "#3466a0",
          800: "#2f5584",
          900: "#2a486d",
          950: "#1c2e47",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
