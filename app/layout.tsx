import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ThemeToggle from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stitches Exchanges",
  description: "Exchange your currency for cryptocurrency with Stitches Exchanges",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stitch-7_63858271949078.2%20(1).jpg-oFBiTGUQIQ74IxV8Y2AWHIFWVP6TVA.jpeg",
        type: "image/jpeg",
      },
    ],
    shortcut: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stitch-7_63858271949078.2%20(1).jpg-oFBiTGUQIQ74IxV8Y2AWHIFWVP6TVA.jpeg",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/stitch-7_63858271949078.2%20(1).jpg-oFBiTGUQIQ74IxV8Y2AWHIFWVP6TVA.jpeg",
        type: "image/jpeg",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'