import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:           "hsl(var(--background))",
        foreground:           "hsl(var(--foreground))",
        card:                 "hsl(var(--card))",
        "card-foreground":    "hsl(var(--card-foreground))",
        muted:                "hsl(var(--muted))",
        "muted-foreground":   "hsl(var(--muted-foreground))",
        border:               "hsl(var(--border))",
        input:                "hsl(var(--input))",
        primary:              "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        destructive:          "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        ring:                 "hsl(var(--ring))",

        sidebar: {
          bg:     "hsl(var(--sidebar-bg))",
          deeper: "hsl(var(--sidebar-deeper))",
          fg:     "hsl(var(--sidebar-fg))",
          muted:  "hsl(var(--sidebar-muted))",
          border: "hsl(var(--sidebar-border))",
        },

        accent: {
          green:  "hsl(var(--accent-green))",
          red:    "hsl(var(--accent-red))",
          orange: "hsl(var(--accent-orange))",
          blue:   "hsl(var(--accent-blue))",
          yellow: "hsl(var(--accent-yellow))",
          pink:   "hsl(var(--accent-pink))",
          teal:   "hsl(var(--accent-teal))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [typography],
};