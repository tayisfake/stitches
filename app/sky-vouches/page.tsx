"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileCheck2, ExternalLink } from "lucide-react"
import { MenuButton } from "@/components/menu-button"
import { useRouter } from "next/navigation"
import RainBackground from "@/components/rain-background"
import GlitterBackground from "@/components/glitter-background"
import { ProofModal } from "@/components/proof-modal"

interface SkyVouch {
  username: string
  date: string
  amount: number
  from: string
  to: string
  details: string
  hash?: string
  ltcAmount: number
  proof?: {
    type: "video" | "image"
    url: string
  }
}

// Find the skyVouches array at the beginning and add the $415 vouch at the top
const skyVouches: SkyVouch[] = [
  {
    username: "Sky",
    date: "March 24, 2025 7:24 PM",
    amount: 415.0,
    from: "USDC SOL",
    to: "Chime",
    details: "USDC SOL to Chime exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0887-S9eNh.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "March 23, 2025 6:41 PM",
    amount: 1800.0,
    from: "Apple Pay",
    to: "USDC SOL",
    details: "Apple Pay to USDC SOL exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0888-9x3I7SrQZ3OZiv3zCBc46mcyybFgv5.jpeg",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 27, 2025 3:33 PM",
    amount: 2250.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "video",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1315577824483474135-qTrJcVOg7KEzjFe5zY0EjNH9ONXLpW.mp4",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 26, 2025 9:15 AM",
    amount: 3000.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "video",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-5563039702602171605-gGd2SMTIatOfWLT0xdOv0Rvw2B71BU.mp4",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "March 23, 2025 6:39 PM",
    amount: 1800.0,
    from: "Apple Pay",
    to: "USDC SOL",
    details: "Apple Pay to USDC SOL exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0888-BMhcJ.jpeg",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "March 19, 2025 10:35 PM",
    amount: 400.0,
    from: "PayPal",
    to: "USDC SOL",
    details: "PayPal to USDC SOL exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0864-0MDrYagqopIqJCUufpRyomjLxTzrmu.jpeg",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "March 18, 2025 6:14 PM",
    amount: 760.0,
    from: "Venmo",
    to: "USDC",
    details: "Venmo to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ecLBY4VkFwXMhEkGfpGLwEcubcgyLS.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "March 18, 2025 6:01 PM",
    amount: 500.0,
    from: "Venmo",
    to: "USDC SOL",
    details: "Venmo to USDC SOL exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-03-18-18-10-24-HTpA8YqjaXjKybUACiubsqkq7anXlJ.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "March 17, 2025 5:22 PM",
    amount: 1590.0,
    from: "USDC SOL",
    to: "Card",
    details: "USDC SOL to Card exchange (1590$ -> 1500$)",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-03-17-17-27-56-DaBrak9hHqHIAx7WhHgWrRwQQmw73D.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 12, 2025",
    amount: 500.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0419-iQ5mbfVNbuinhU8UgjUnVESJIZGxsc.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 10, 2025",
    amount: 800.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0387-ywjo5Koe195216m5E6e4EjmHeN4x7F.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 5, 2025",
    amount: 100.0,
    from: "Venmo",
    to: "USDC",
    details: "Venmo to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0426-6B7alhlzElbtbPyZUQAVpyh7DzOdsO.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 8, 2025",
    amount: 250.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0480-W3DTpdEOfVBHJV21bWN7khRJQkZSZO.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 4, 2025",
    amount: 200.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0465-lIFHtLkovAcICbIbmBhesxLoySAs47.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 2, 2025",
    amount: 580.0,
    from: "PayPal",
    to: "USDC",
    details: "PayPal to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0439.jpg-BW3VeIwRJdW2JT3Q8bQfyepb5iHfpD.jpeg",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 11, 2025",
    amount: 1650.0,
    from: "Skrill",
    to: "USDC",
    details: "Skrill to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-02-24-20-38-51-UHULwg6sSjlN2eJFiqMw6N1kiqd4O7.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 11, 2025",
    amount: 350.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-02-24-20-39-01-y5QiLPjOCyiw9SXs1eGJ7vtrEnnAi0.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 19, 2025",
    amount: 250.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-02-24-20-21-20-LnkpluHkuUx17ox6cspcsxa4VkTZj7.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 17, 2025",
    amount: 580.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-02-24-20-22-56-FXAG3dMhwe1rQjpZanN5Htbrwbu8Zo.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 15, 2025",
    amount: 200.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "video",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2435323054995601393-iYJj1qvHhjXgO6P56RpYVezlcCeARL.mp4",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 21, 2025",
    amount: 980.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "video",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5229078194094708964-nBR15GfWWFbJXhGLdqF3JDwwEWBmmg.mp4",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 20, 2025",
    amount: 1105.0,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange (450 + 605)",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-02-24-20-15-59-21pSgiuNYJadDrtRkNGIvp7nyKASRo.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 11, 2025",
    amount: 2500.0,
    from: "Skrill",
    to: "USDC",
    details: "Large crypto exchange completed",
    proof: {
      type: "video",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-2978783063471440894-f2ZfsOxhuTDMVedUt1Dm09kxaKKncg.mp4",
    },
    ltcAmount: 25.0,
  },
  {
    username: "Sky",
    date: "Jan 20, 2025",
    amount: 2375.0,
    from: "Chime",
    to: "USDC",
    details: "Chime to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0329-ixQuIGPTs6wZqmrANgnMm5FzVNMQwi.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 27, 2025",
    amount: 400.0,
    from: "Venmo",
    to: "USDC",
    details: "Venmo to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0335-0iu6ogZGmS1Dqf2nu1OC0xT042Y2Y7.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 18, 2025",
    amount: 435.0,
    from: "USDC",
    to: "PayPal",
    details: "USDC to PayPal exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4AB2A060-8B83-48E8-8170-96D71B8E6DC3.jpg-Ijn5j6ETObvEWARB8x7e9EQDTBe9G3.jpeg",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 14, 2025",
    amount: 105.0,
    from: "Venmo",
    to: "USDC",
    details: "Venmo to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0334-td70ap8cDDufSDvW853MTFiNVs7uDx.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 8, 2025",
    amount: 675.0,
    from: "Chime",
    to: "USDC",
    details: "Chime to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0333-VfMscSSmm6Tgz2QE5eLXVtfE1lRMBB.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 19, 2025",
    amount: 149.0,
    from: "Chime",
    to: "USDC",
    details: "Chime to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0330-pFoLhOYqtQCcz6eAZL7BDfnjeMHDg9.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 17, 2025",
    amount: 285.0,
    from: "Chime",
    to: "USDC",
    details: "Chime to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-02-24-21-05-41-Hqo7l4cdu1LdpGx2DqXI6F98W8j6zt.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 16, 2025",
    amount: 2300.0,
    from: "Skrill",
    to: "USDC",
    details: "Skrill to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0328-nGOauKETPn9btygtIOUhAmbUm6ZbCD.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 15, 2025",
    amount: 400.0,
    from: "Zelle",
    to: "USDC",
    details: "Zelle to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0332-IHhG4Q46Qr0sEiuW2pGLgD14AujXcQ.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 9, 2025",
    amount: 500.0,
    from: "Skrill",
    to: "USDC",
    details: "Skrill to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0331-mWxtAvebAuS18kX6k1VPMBHow5vfXM.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 7, 2025",
    amount: 500.0,
    from: "Skrill",
    to: "USDC",
    details: "Skrill to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hE0OrkkulRRtndqZ9rXm42VnPcABdH.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 18, 2025",
    amount: 1020.0,
    from: "Chime",
    to: "USDC",
    details: "Chime to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0325-iIoBjhwR63BcZMKcq7ysgAzBzGMAoP.webp",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Jan 27, 2025",
    amount: 217.04,
    from: "Skrill",
    to: "USDC",
    details: "Skrill to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rdCmFuENqpgtnLgeVpUa0pDkiYOfVK.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 10, 2025",
    amount: 1017.0,
    from: "Card",
    to: "USDC",
    details: "Card to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cTk378nuU7eVHkTT9mbnLc8KF6QeMg.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Feb 10, 2025",
    amount: 500.0,
    from: "Card",
    to: "USDC",
    details: "Card to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-B5ub7yNFezVD1Ba70LpNlkNS0tLk9T.png",
    },
    ltcAmount: 0,
  },
  {
    username: "Sky",
    date: "Nov 7, 2024 7:37 PM",
    amount: 85.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.17476752 LTC at $72.35/LTC",
    hash: "c236378c37f872ede41a0ee9e6e234955b4831baa6c4591adb56828bc50758b2",
    ltcAmount: 1.17476752,
  },
  {
    username: "Sky",
    date: "Oct 30, 2024 5:29 PM",
    amount: 240.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 3.32686863 LTC at $72.14/LTC",
    hash: "b2ac1614f01d46d98a3c73038f82610710ef23a785b4543b70f684f4453fe3c6",
    ltcAmount: 3.32686863,
  },
  {
    username: "Sky",
    date: "Oct 21, 2024 5:36 PM",
    amount: 100.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.41143681 LTC at $70.85/LTC",
    hash: "373cb2f3b5c1aa69708209264fa800fe9066382e2d939c9b66c0d7c7eb487a37",
    ltcAmount: 1.41143681,
  },
  {
    username: "Sky",
    date: "Dec 30, 2024 11:58 AM",
    amount: 286.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.92883164 LTC at $97.65/LTC",
    hash: "c871075ad21faf458a7b018461f40f34024ddf309d36c6a913329684c95c9923",
    ltcAmount: 2.92883164,
  },
  {
    username: "Sky",
    date: "Nov 3, 2024 1:37 PM",
    amount: 96.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.45841666 LTC at $65.82/LTC",
    hash: "7ee52557c0c07cba97a88d1004729d5d04e891031c7222aabc68a09898b6d20a",
    ltcAmount: 1.45841666,
  },
  {
    username: "Sky",
    date: "Nov 3, 2024 4:22 PM",
    amount: 142.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.11624862 LTC at $67.10/LTC",
    hash: "086d9fa5a4835e99a207fe604a65a518a7a00c3309c59535af4ba191d2e9a601",
    ltcAmount: 2.11624862,
  },
  {
    username: "Sky",
    date: "Oct 26, 2024 4:39 PM",
    amount: 71.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.03446184 LTC at $68.63/LTC",
    hash: "aeb18b528becac6bf40c886c274c6ee4075fbdd81b5d724b78cc3ecc9843596a",
    ltcAmount: 1.03446184,
  },
  {
    username: "Sky",
    date: "Oct 23, 2024 5:12 PM",
    amount: 183.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.62931455 LTC at $69.60/LTC",
    hash: "39899aa8cbf3d71b7b048d580930a799c8ae86d0afc846dd631666e382af8fbc",
    ltcAmount: 2.62931455,
  },
  {
    username: "Sky",
    date: "Oct 13, 2024 5:54 PM",
    amount: 190.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.93029415 LTC at $64.84/LTC",
    hash: "3809fae3d9e5806c811f59605c199a758584df9aa0080ea9921b17cccb4c0932",
    ltcAmount: 2.93029415,
  },
  {
    username: "Sky",
    date: "Oct 24, 2024 6:27 AM",
    amount: 323.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 4.63215679 LTC at $69.73/LTC",
    hash: "082df76c294bda2650d5b0c519c5c6e3b419bb8ad5e8fe118b0469cb02c5af15",
    ltcAmount: 4.63215679,
  },
  {
    username: "Sky",
    date: "Oct 5, 2024 9:56 PM",
    amount: 120.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.80194128 LTC at $66.59/LTC",
    hash: "a3d4eb7c7c1c6c8f8b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9b9dc3fbc",
    ltcAmount: 1.80194128,
  },
  {
    username: "Sky",
    date: "Oct 13, 2024 4:01 PM",
    amount: 323.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 4.99420598 LTC at $64.67/LTC",
    hash: "cc7a7fe5983afc0ab221fc06168931721e9ccee8bbd4bc405eb96f8e6f4e8a7d",
    ltcAmount: 4.99420598,
  },
  {
    username: "Sky",
    date: "Oct 13, 2024 10:05 AM",
    amount: 111.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.69972091 LTC at $65.30/LTC",
    hash: "d4d2b67b446235f3e551a0576b5749b2117280aec551f4202dda3dd279c7a724",
    ltcAmount: 1.69972091,
  },
  {
    username: "Sky",
    date: "Oct 9, 2024 8:59 PM",
    amount: 121.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.87815709 LTC at $64.42/LTC",
    hash: "023a7b7dc953fce0aba2ff4b103791f58331a6ce1bbb1f9524948979d9c65756",
    ltcAmount: 1.87815709,
  },
  {
    username: "Sky",
    date: "Oct 7, 2024 9:36 PM",
    amount: 187.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.86832232 LTC at $65.19/LTC",
    hash: "0ba2b066ffc243ea8c49d6eedf4dab599f7702f6c7e8dc3bb158ed28640907fa",
    ltcAmount: 2.86832232,
  },
  {
    username: "Sky",
    date: "Oct 2, 2024 9:03 PM",
    amount: 94.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.48300493 LTC at $63.38/LTC",
    hash: "2a28a2a6348b598138585f1276e5010957eab4c5b9e99454e78dcf3bb2d0a647",
    ltcAmount: 1.48300493,
  },
  {
    username: "Sky",
    date: "Oct 12, 2024 11:49 AM",
    amount: 36.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 0.54294968 LTC at $66.30/LTC",
    hash: "a03156db7d9d24ef6c897ee02efd286ff43f0d91c0185474d1f69b30e89b3eaf",
    ltcAmount: 0.54294968,
  },
  {
    username: "Sky",
    date: "Oct 13, 2024 12:23 AM",
    amount: 152.5,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.32133763 LTC at $65.69/LTC",
    hash: "d12c8b7e4ded3a3c3725a7c60cfbb6826038a3bf8999b522e8b5dbf464fafe7c",
    ltcAmount: 2.32133763,
  },
  {
    username: "Sky",
    date: "Oct 8, 2024 8:44 PM",
    amount: 96.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.46397675 LTC at $65.57/LTC",
    hash: "436e4f1234567890abcdef1234567890abcdef1234567890abcdef123430036e",
    ltcAmount: 1.46397675,
  },
  {
    username: "Sky",
    date: "Sep 30, 2024 5:12 PM",
    amount: 132.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.95991511 LTC at $67.35/LTC",
    hash: "e578b9e922af607a18cc59ce150ee1d80cc3f3e3679a1d5b6c32890646c55357",
    ltcAmount: 1.95991511,
  },
  {
    username: "Sky",
    date: "Sep 29, 2024 7:10 AM",
    amount: 75.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.08711827 LTC at $68.99/LTC",
    hash: "c46774d32f0a181c32211bc63fda90d8477070b7c46f28130015612aeabbc27d",
    ltcAmount: 1.08711827,
  },
  {
    username: "Sky",
    date: "Sep 27, 2024 6:09 AM",
    amount: 134.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.93404476 LTC at $69.28/LTC",
    hash: "57961d5280ca690945720d58ff7f5466b5429c5d018c1bf320133dcb772074bc",
    ltcAmount: 1.93404476,
  },
  {
    username: "Sky",
    date: "Sep 25, 2024 8:41 PM",
    amount: 191.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.87781044 LTC at $66.37/LTC",
    hash: "334b8f24758c03e74dd033016bfac544d4aa0acdbf0769748cc4c0fd9dd8218c",
    ltcAmount: 2.87781044,
  },
  {
    username: "Sky",
    date: "Sep 24, 2024 9:46 PM",
    amount: 76.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.13670776 LTC at $66.86/LTC",
    hash: "9f77a1a2cf498ac30cdb2b54e77bf703946397df844ed99903d0d08859eb2130",
    ltcAmount: 1.13670776,
  },
  {
    username: "Sky",
    date: "Sep 24, 2024 7:09 PM",
    amount: 158.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.36704540 LTC at $66.75/LTC",
    hash: "f53de981a4f37f364c025dd667809ae28931dc3648cd4257d69d12c61145e3f7",
    ltcAmount: 2.3670454,
  },
  {
    username: "Sky",
    date: "Sep 22, 2024 9:07 PM",
    amount: 172.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.51554352 LTC at $68.37/LTC",
    hash: "02b1f298da0d03b6dd29a64296bc312c35745c343088919f0134edd140a8bc51",
    ltcAmount: 2.51554352,
  },
  {
    username: "Sky",
    date: "Sep 22, 2024 6:28 PM",
    amount: 106.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.57891237 LTC at $67.13/LTC",
    hash: "5c24944fe271a7eb342680d330b29d9f97587ece00942506aea72972f542d419",
    ltcAmount: 1.57891237,
  },
  {
    username: "Sky",
    date: "Sep 22, 2024 4:10 PM",
    amount: 101.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 1.48825293 LTC at $67.86/LTC",
    hash: "307ef2f402155f98498380dcc59c8ba322299d421e199b8e9e6d7394f8fba2c5",
    ltcAmount: 1.48825293,
  },
  {
    username: "Sky",
    date: "Sep 21, 2024 11:04 AM",
    amount: 180.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.71862676 LTC at $66.21/LTC",
    hash: "8d6e2ae0891d334d18ee9b6c9a2acba4c0fa9d19deefbe7d860870ce72f42443",
    ltcAmount: 2.71862676,
  },
  {
    username: "Sky",
    date: "Sep 20, 2024 1:10 PM",
    amount: 285.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 4.41860885 LTC at $64.50/LTC",
    hash: "7ce26f8cc3dbc2a85261a625337d95b4025f45cddfef9ac40c17d893b7311d8f",
    ltcAmount: 4.41860885,
  },
  {
    username: "Sky",
    date: "Sep 16, 2024 9:13 PM",
    amount: 384.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 6.18308125 LTC at $62.10/LTC",
    hash: "59a40b0c68dd03df7551dfbe9d529059974e725e0460a1ff0582a694a80adc21",
    ltcAmount: 6.18308125,
  },
  {
    username: "Sky",
    date: "Sep 17, 2024 8:36 AM",
    amount: 263.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 4.20128216 LTC at $62.60/LTC",
    hash: "5bc550339a51f64b89a20dc254aa13bdd4a118f7211024210bfa84dd7aa39ab2",
    ltcAmount: 4.20128216,
  },
  {
    username: "Sky",
    date: "Sep 20, 2024 6:05 PM",
    amount: 365.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 5.59473136 LTC at $65.24/LTC",
    hash: "370b4bed538e9d7410cd4d338f1d3909c001453082467723ec3b434e321cc26e",
    ltcAmount: 5.59473136,
  },
  {
    username: "Sky",
    date: "Sep 21, 2024 4:21 PM",
    amount: 161.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 2.40676106 LTC at $66.89/LTC",
    hash: "7590abdc8e21440fbd9967ad2a4e6f86a8dffd04ee84ebd467899d30056d6f51",
    ltcAmount: 2.40676106,
  },
  {
    username: "Sky",
    date: "Sep 21, 2024 5:12 PM",
    amount: 385.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 5.77168548 LTC at $66.70/LTC",
    hash: "ec0877c8b0c11eb366a4d0f9c2bfdb5a1b63735a4875c33b53f87b0c0b2839d",
    ltcAmount: 5.77168548,
  },
  {
    username: "Sky",
    date: "Sep 18, 2024 8:10 AM",
    amount: 326.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 5.15293236 LTC at $63.26/LTC",
    hash: "f1402e670f2e3cf8b02e58d08419472a4301383ab7de6907bfa8588d63552dc5",
    ltcAmount: 5.15293236,
  },
  {
    username: "Sky",
    date: "Sep 18, 2024 8:51 PM",
    amount: 380.0,
    from: "Proxy",
    to: "Proxy",
    details: "LTC Transaction: 5.81751798 LTC at $65.32/LTC",
    hash: "67c7af3f3ea78958246a0eddeee36c2a676189f800d0b870bcbaeb0a3a7a4ad9",
    ltcAmount: 5.81751798,
  },
]

export default function SkyVouchesPage() {
  const router = useRouter()
  const [selectedProof, setSelectedProof] = useState<{
    type: "video" | "image"
    url: string
  } | null>(null)

  // Sort vouches by amount in descending order instead of date
  const sortedVouches = [...skyVouches].sort((a, b) => b.amount - a.amount)

  const totalVolume = skyVouches.reduce((sum, vouch) => sum + vouch.amount, 0)
  const totalLTC = skyVouches.reduce((sum, vouch) => sum + vouch.ltcAmount, 0)
  const totalUSDC = skyVouches.reduce((sum, vouch) => (vouch.to === "USDC" ? sum + vouch.amount : sum), 0)

  // Function to handle setting the proof, ensuring we never pass undefined
  const handleSetProof = (proof: { type: "video" | "image"; url: string } | undefined) => {
    setSelectedProof(proof || null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000066] via-[#4B0082] to-[#9933FF] dark:from-black dark:to-[#1a0033] p-6 relative overflow-hidden">
      <GlitterBackground />
      <RainBackground />
      <MenuButton />
      <Button
        onClick={() => router.push("/vouches")}
        className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Vouches
      </Button>

      <div className="max-w-7xl mx-auto space-y-8 pt-16 relative z-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => window.open("https://oguser.com/exchange", "_blank")}
              className="bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white px-6 py-3 rounded-xl flex items-center gap-2 justify-center backdrop-blur-sm"
            >
              <span className="font-semibold">OGUsers Profile</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-white">Sky Vouches</h1>
          <div className="flex justify-center gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <p className="text-lg text-gray-400">Total Volume</p>
              <p className="text-3xl font-bold text-white">${totalVolume.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <p className="text-lg text-gray-400">Total LTC</p>
              <p className="text-3xl font-bold text-white">{totalLTC.toFixed(8)} LTC</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <p className="text-lg text-gray-400">Total USDC</p>
              <p className="text-3xl font-bold text-white">${totalUSDC.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 max-w-lg mx-auto">
            <p className="text-gray-300 text-sm">
              All transactions verified on Litecoin blockchain with address:
              <br />
              <span className="font-mono text-xs break-all text-blue-300">LZmjSLnK4kSkJrhCjVLfDxKqRNGuPBkC8H</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedVouches.map((vouch, index) => (
            <Card
              key={index}
              className="bg-white/[0.02] backdrop-blur-md border-white/5 shadow-xl p-4 rounded-xl hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-purple-300 font-semibold">{vouch.username}</div>
                  <div className="text-xs text-gray-400">{vouch.date}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 flex-grow">
                  <div className="text-white text-sm">
                    <span className="text-gray-400">Amount:</span>{" "}
                    <span className="font-semibold">${vouch.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-white text-sm mt-1">
                    <span className="text-gray-400">From:</span> <span className="font-semibold">{vouch.from}</span>
                  </div>
                  <div className="text-white text-sm mt-1">
                    <span className="text-gray-400">To:</span> <span className="font-semibold">{vouch.to}</span>
                  </div>
                  <div className="text-white text-sm mt-2 text-gray-400 border-t border-gray-700 pt-2">
                    {vouch.details}
                  </div>
                  {vouch.hash && (
                    <div className="text-xs text-blue-300/70 mt-2 font-mono break-all">
                      <a
                        href={`https://blockchair.com/litecoin/transaction/${vouch.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors"
                      >
                        {vouch.hash}
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  {vouch.hash ? (
                    <span className="text-green-400 text-sm flex items-center">✓ Blockchain Verified</span>
                  ) : (
                    <span className="text-sm text-gray-400">Video Proof Available</span>
                  )}
                  {vouch.proof && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
                      onClick={() => handleSetProof(vouch.proof)}
                    >
                      <FileCheck2 className="w-4 h-4 mr-1" />
                      View Proof
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedProof && <ProofModal isOpen={true} onClose={() => setSelectedProof(null)} proof={selectedProof} />}
    </div>
  )
}
