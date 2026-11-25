import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  metadataBase: new URL("https://seavik-gamma.vercel.app"),
  title: {
    default: "Mao Seavik — ML Engineer & Full-Stack Developer",
    template: "%s — Mao Seavik",
  },
  description:
    "Portfolio of Mao Seavik (Seavik) — Machine Learning Engineer & Full-Stack Developer specializing in Deep Learning, LLM Fine-Tuning (LoRA/PEFT), Data Science, and full-stack web applications.",
  icons: {
    icon: [
      { url: "/favicon.svg?v=3", type: "image/svg+xml" },
      { url: "/favicon.ico?v=3", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: [
      { url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Mao Seavik — ML Engineer & Full-Stack Developer",
    description:
      "Portfolio of Mao Seavik (Seavik) — Machine Learning Engineer & Full-Stack Developer specializing in Deep Learning, LLM Fine-Tuning, and production web systems.",
    url: "https://seavik-gamma.vercel.app",
    siteName: "Mao Seavik",
    images: [
      {
        url: "/images/about/profile.png",
        width: 1200,
        height: 630,
        alt: "Mao Seavik — ML Engineer & Full-Stack Developer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mao Seavik — ML Engineer & Full-Stack Developer",
    description:
      "Portfolio of Mao Seavik (Seavik) — Machine Learning Engineer & Full-Stack Developer specializing in Deep Learning, LLM Fine-Tuning, and production web systems.",
    images: ["/images/about/profile.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches);if(d){document.documentElement.classList.add('dark');var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content','#09090b');}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600&family=Great+Vibes&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
