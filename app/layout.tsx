import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Stitches Exchanges",
  description: "Exchange your currency for cryptocurrency with Stitches Exchanges",
  icons: {
    icon: [
      {
        url: "https://static.wikia.nocookie.net/disney/images/a/a8/Profile_-_Stitch.jpeg/revision/latest?cb=20190312072323",
        type: "image/jpeg",
      },
    ],
    shortcut: [
      {
        url: "https://static.wikia.nocookie.net/disney/images/a/a8/Profile_-_Stitch.jpeg/revision/latest?cb=20190312072323",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "https://static.wikia.nocookie.net/disney/images/a/a8/Profile_-_Stitch.jpeg/revision/latest?cb=20190312072323",
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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'