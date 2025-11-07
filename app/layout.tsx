import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0132e607dc1f64b98950858e753068e6.jpg-wtV9UYUPlsB5T9i1CwMqva5xLg4x0P.jpeg"
          sizes="any"
        />
      </head>
      <body className={`${inter.className} transition-colors duration-300 dark`}>{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
