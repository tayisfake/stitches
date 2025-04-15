"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, ArrowLeft, FileCheck2 } from "lucide-react"
import { TelegramIcon, DiscordIcon } from "@/components/ui/icons"
import { MenuButton } from "@/components/menu-button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import RainBackground from "@/components/rain-background"
import GlitterBackground from "@/components/glitter-background"
import { ProofModal } from "@/components/proof-modal"

// Add the new vouches at the beginning of the vouches array
const vouches = [
  {
    username: "leo",
    date: "4/11/25, 5:32 PM",
    amount: 150,
    from: "LTC",
    to: "Zelle",
    details: "LTC to Zelle exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-04-11-17-33-41-4WKieHp3ZLsCk9soMJks4mYEZIlq5F.png",
    },
  },
  {
    username: "leo",
    date: "4/11/25, 5:32 PM",
    amount: 150,
    from: "LTC",
    to: "Zelle",
    details: "LTC to Zelle exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img-2025-04-11-17-33-41-4WKieHp3ZLsCk9soMJks4mYEZIlq5F.png",
    },
  },
  {
    username: "hud",
    date: "3/23/25, 10:51 AM",
    amount: 2000,
    from: "Venmo",
    to: "Crypto",
    details: "Venmo to crypto exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0889-Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9.png",
    },
  },
  {
    username: "hud",
    date: "3/23/25, 6:39 PM",
    amount: 1800,
    from: "Apple Pay",
    to: "USDC SOL",
    details: "Apple Pay to USDC SOL exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0888-BMhcJ.jpeg",
    },
  },
  {
    username: "hud",
    date: "3/22/25, 6:03 PM",
    amount: 1784,
    from: "Apple Pay",
    to: "USDC SOL",
    details: "Apple Pay to USDC SOL exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0881-Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9Yd9Ij9.png",
    },
  },
  {
    username: "leo",
    date: "3/16/25, 2:14 PM",
    amount: 185,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "! tyltr",
    date: "3/14/25, 1:15 PM",
    amount: 40,
    from: "Zelle",
    to: "SOL",
    details: "Zelle to SOL exchange (again)",
  },
  {
    username: "! tyltr",
    date: "3/13/25, 9:21 AM",
    amount: 40,
    from: "Zelle",
    to: "SOL",
    details: "Zelle to SOL exchange",
  },
  {
    username: "Kuma",
    date: "3/12/25, 8:20 PM",
    amount: 147,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "bloody",
    date: "3/11/25, 4:18 PM",
    amount: 180,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange - fast exchange",
  },
  {
    username: "bloody",
    date: "3/11/25, 4:28 PM",
    amount: 280,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
  },
  {
    username: "Rah",
    date: "3/11/25, 11:09 PM",
    amount: 2500,
    from: "Crypto",
    to: "Apple Pay",
    details: "Crypto to Apple Pay exchange",
  },
  {
    username: "bloody",
    date: "3/11/25, 8:46 PM",
    amount: 100,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
  },
  {
    username: "Sey",
    date: "3/11/25, 10:21 PM",
    amount: 500,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
    proof: {
      type: "image",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qASWZMW8sxmhTcQtIZz4Fu0oM32QOz.png",
    },
  },
  {
    username: "nomo",
    date: "3/7/25, 12:24 AM",
    amount: 120,
    from: "Venmo",
    to: "Crypto",
    details: "Venmo to crypto exchange",
  },
  {
    username: "bloody",
    date: "3/6/25, 10:17 PM",
    amount: 110,
    from: "Apple Pay",
    to: "USDC",
    details: "Apple Pay to USDC exchange",
  },
  {
    username: "wael",
    date: "3/4/25, 7:28 PM",
    amount: 400,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "krsvctr",
    date: "3/4/25, 11:02 PM",
    amount: 44,
    from: "PayPal",
    to: "LTC",
    details: "PayPal FNF to LTC exchange (44$ -> 41$)",
  },
  {
    username: "Furiouseagle",
    date: "3/4/25, 8:38 PM",
    amount: 488,
    from: "USDC",
    to: "Venmo",
    details: "USDC to Venmo exchange",
  },
  {
    username: "Squashy",
    date: "3/4/25, 7:40 PM",
    amount: 260,
    from: "LTC",
    to: "Venmo",
    details: "LTC to Venmo exchange",
  },
  {
    username: "wael",
    date: "3/4/25, 12:35 PM",
    amount: 500,
    from: "PayPal",
    to: "Crypto",
    details: "PayPal to Crypto exchange",
  },
  {
    username: "idkanygooduser",
    date: "3/2/25, 2:25 PM",
    amount: 380,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange, fast",
  },
  {
    username: "batman",
    date: "3/1/25, 8:12 PM",
    amount: 48,
    from: "LTC",
    to: "PayPal",
    details: "LTC to PayPal exchange (48$ -> 44$)",
  },
  {
    username: "ImFedexG",
    date: "2/27/25, 11:08 PM",
    amount: 200,
    from: "Varo",
    to: "Solana",
    details: "Varo to Solana exchange",
  },
  {
    username: "LATEK",
    date: "2/24/25, 11:18 AM",
    amount: 1039,
    from: "Venmo",
    to: "USDC Poly",
    details: "Venmo to USDC Poly exchange",
  },
  {
    username: "pappou3",
    date: "2/25/25, 5:11 PM",
    amount: 300,
    from: "LTC",
    to: "Venmo",
    details: "LTC to Venmo exchange",
  },
  {
    username: "Takhar",
    date: "2/25/25, 8:46 PM",
    amount: 400,
    from: "PayPal",
    to: "Crypto",
    details: "PayPal to crypto exchange",
  },
  {
    username: "yourmomisfire",
    date: "2/25/25, 7:08 PM",
    amount: 150,
    from: "Apple Pay",
    to: "LTC",
    details: "Apple Pay to LTC exchange",
  },
  {
    username: "Squashy",
    date: "2/25/25, 10:48 AM",
    amount: 140,
    from: "LTC",
    to: "Venmo",
    details: "LTC to Venmo exchange",
  },
  {
    username: "yourmomisfire",
    date: "2/25/25, 5:05 PM",
    amount: 72,
    from: "Apple Pay",
    to: "LTC",
    details: "Apple Pay to LTC exchange",
  },
  {
    username: "yourmomisfire",
    date: "2/25/25, 5:05 PM",
    amount: 72,
    from: "Apple Pay",
    to: "LTC",
    details: "Apple Pay to LTC exchange",
  },
  {
    username: "anubis20x",
    date: "2/25/25, 1:16 AM",
    amount: 35,
    from: "Venmo",
    to: "PayPal",
    details: "Venmo to PayPal exchange",
  },
  // October 2022 Vouches
  {
    username: "heisenberg",
    date: "10/18/2022 12:43 PM",
    amount: 200,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "heisenberg",
    date: "10/18/2022 3:42 PM",
    amount: 400,
    from: "Mixed",
    to: "Mixed",
    details: "Additional exchange completed",
  },
  {
    username: "heisenberg",
    date: "10/20/2022 5:21 PM",
    amount: 400,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "heisenberg",
    date: "10/21/2022 3:19 PM",
    amount: 160,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "heisenberg",
    date: "10/24/2022 4:16 PM",
    amount: 186,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "voyuh",
    date: "10/27/2022 3:17 PM",
    amount: 60,
    from: "PayPal",
    to: "BTC",
    details: "PayPal to BTC exchange with bonus",
  },
  // November 2022 Vouches
  {
    username: "Jordan<3",
    date: "11/16/2022 8:17 PM",
    amount: 70,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed after delay",
  },
  {
    username: "tacohitbox",
    date: "11/16/2022 9:01 PM",
    amount: 50,
    from: "Cash App",
    to: "Mixed",
    details: "Cash App exchange completed",
  },
  {
    username: "TheRainMan",
    date: "11/18/2022 12:58 PM",
    amount: 200,
    from: "Mixed",
    to: "Mixed",
    details: "Second account exchange, multiple deals",
  },
  // December 2022 Vouches
  {
    username: "William",
    date: "12/12/2022 9:06 PM",
    amount: 150,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "voyuh",
    date: "12/16/2022 5:43 PM",
    amount: 30,
    from: "Cash App",
    to: "BTC",
    details: "Cash App to BTC exchange",
  },
  {
    username: "Advanced",
    date: "12/19/2022 9:28 AM",
    amount: 54,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange 54$ to 50$",
  },
  {
    username: "heisenberg",
    date: "12/19/2022 7:08 PM",
    amount: 194,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "TheRainMan",
    date: "12/20/2022 7:06 PM",
    amount: 500,
    from: "Mixed",
    to: "Mixed",
    details: "Large exchange completed",
  },
  {
    username: "SuperMonkey7023",
    date: "12/24/2022 2:59 PM",
    amount: 300,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "complexisbad",
    date: "12/26/2022 8:13 PM",
    amount: 50,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Jordan<3",
    date: "12/26/2022 9:05 PM",
    amount: 400,
    from: "Mixed",
    to: "Mixed",
    details: "Multiple band exchanges, very satisfied",
  },
  {
    username: "Jordan<3",
    date: "12/27/2022 4:22 AM",
    amount: 150,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange plus additional $15 pending",
  },
  {
    username: "Jordan<3",
    date: "12/27/2022 4:34 AM",
    amount: 20,
    from: "Mixed",
    to: "Mixed",
    details: "Additional exchange with no profit",
  },
  {
    username: "voyuh",
    date: "12/27/2022 11:40 AM",
    amount: 650,
    from: "Cash App",
    to: "BTC",
    details: "Cash App to BTC exchange",
  },
  {
    username: "Jordan<3",
    date: "12/27/2022 12:28 PM",
    amount: 111,
    from: "Cash App",
    to: "BTC",
    details: "Cash App to BTC exchange",
  },
  {
    username: "Jordan<3",
    date: "12/27/2022 10:44 PM",
    amount: 222,
    from: "Mixed",
    to: "Mixed",
    details: "Two $111 exchanges back to back",
  },
  {
    username: "iHateZz",
    date: "12/28/2022 4:16 PM",
    amount: 100,
    from: "Apple Pay",
    to: "Crypto",
    details: "Apple Pay to crypto exchange",
  },
  {
    username: "Jordan<3",
    date: "12/28/2022 10:47 PM",
    amount: 200,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "thrasher",
    date: "12/30/2022 2:13 AM",
    amount: 12.5,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  // New December 2022 vouches
  {
    username: "Jordan<3",
    date: "12/30/2022 2:50 PM",
    amount: 200,
    from: "Mixed",
    to: "Mixed",
    details: "Another $200 exchanged",
  },
  // January 2023 vouches
  {
    username: "Jordan<3",
    date: "01/01/2023 7:16 PM",
    amount: 260,
    from: "Mixed",
    to: "Crypto",
    details: "Crypto exchange completed",
  },
  {
    username: "livvy karr",
    date: "01/08/2023 12:52 AM",
    amount: 170,
    from: "BTC",
    to: "Cash App",
    details: "Exchange BTC to CashApp low fee $170->$164 love the guy",
  },
  // February 2023 vouches
  {
    username: "Castro",
    date: "02/03/2023 7:03 PM",
    amount: 15,
    from: "USD",
    to: "BTC",
    details: "$15 to $10 BTC exchange",
  },
  {
    username: "Castro",
    date: "02/03/2023 9:05 PM",
    amount: 37,
    from: "USD",
    to: "BTC",
    details: "AGAING TODAY $37 to $33 BTC",
  },
  // March 2023 vouches
  {
    username: "Bloody",
    date: "03/16/2023 1:17 PM",
    amount: 25,
    from: "Cash App",
    to: "LTC",
    details: "$25 -> $20 fast exchange",
  },
  {
    username: "Bloody",
    date: "03/16/2023 3:40 PM",
    amount: 30,
    from: "Cash App",
    to: "LTC",
    details: "$30 -> $25! Really quick response and I recommend",
  },
  {
    username: "Bloody",
    date: "03/17/2023 7:43 PM",
    amount: 40,
    from: "Cash App",
    to: "LTC",
    details: "$40 -> $33 fast and awesome! 10/10",
  },
  {
    username: "Jordan<3",
    date: "03/23/2023 12:44 AM",
    amount: 150,
    from: "USD",
    to: "BTC",
    details: "Around $150 -> BTC tysm!",
  },
  {
    username: "Jordan<3",
    date: "03/23/2023 10:01 PM",
    amount: 400,
    from: "USD",
    to: "BTC",
    details: "$400 -> BTC exchange",
  },
  // June 2023 vouches
  {
    username: "Bloody",
    date: "06/07/2023 8:35 PM",
    amount: 350,
    from: "Mixed",
    to: "Mixed",
    details: "Convert exchange, went first and recommended",
  },
  {
    username: "xuhu",
    date: "06/08/2023 9:49 AM",
    amount: 100,
    from: "Cash App",
    to: "LTC",
    details: "20th deal, smooth quick and easy",
  },
  {
    username: "nomo",
    date: "06/08/2023 3:09 PM",
    amount: 355,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "Phantom V5",
    date: "06/08/2023 5:17 PM",
    amount: 50,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC $50 (doing 265 on Monday)",
  },
  {
    username: "xuhu",
    date: "06/08/2023 6:57 PM",
    amount: 200,
    from: "Cash App",
    to: "LTC",
    details: "ANOTHER $200 CA to LTC smooth and quick",
  },
  {
    username: "mikail",
    date: "06/09/2023 10:07 PM",
    amount: 90,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Bloody",
    date: "06/09/2023 10:08 PM",
    amount: 600,
    from: "Cash App",
    to: "BTC",
    details: "CashApp to BTC exchange",
  },
  {
    username: "xuhu",
    date: "06/10/2023 10:26 AM",
    amount: 20,
    from: "LTC",
    to: "Cash App",
    details: "LTC to CA exchange",
  },
  {
    username: "eqlipsa",
    date: "06/11/2023 2:24 PM",
    amount: 130,
    from: "USD",
    to: "Mixed",
    details: "USD exchange completed",
  },
  {
    username: "Aacer",
    date: "06/11/2023 2:32 PM",
    amount: 35,
    from: "Mixed",
    to: "Mixed",
    details: "Account exchange completed",
  },
  {
    username: "xuhu",
    date: "06/11/2023 2:48 PM",
    amount: 160,
    from: "LTC",
    to: "Cash App",
    details: "LTC to CA exchange GG",
  },
  {
    username: "xxstjay",
    date: "06/11/2023 6:16 PM",
    amount: 100,
    from: "Mixed",
    to: "Mixed",
    details: "$100 + ehead exchange",
  },
  {
    username: "nomo",
    date: "06/11/2023 6:21 PM",
    amount: 670,
    from: "Cash App",
    to: "LTC",
    details: "CA to LTC exchange",
  },
  // January 2023 Vouch
  {
    username: "Peekz",
    date: "01/04/2023 12:00 PM",
    amount: 5780,
    from: "Mixed",
    to: "Mixed",
    details: "Large crypto exchange completed",
  },
  // August 2023 Vouches
  {
    username: "Eren",
    date: "08/10/2023 2:31 PM",
    amount: 88,
    from: "Cash App",
    to: "Crypto",
    details: "Cash App to crypto exchange",
  },
  {
    username: "Jordan<3",
    date: "08/12/2023 11:37 AM",
    amount: 290,
    from: "USD",
    to: "LTC",
    details: "USD to LTC exchange",
  },
  {
    username: "mika",
    date: "07/06/23, 3:23 PM",
    amount: 100,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange like 100 buckaroons",
  },
  {
    username: "! HomelessCorey",
    date: "07/06/23, 10:06 PM",
    amount: 100,
    from: "LTC",
    to: "Cash App",
    details: "LTC to Cash App exchange",
  },
  {
    username: "rawr",
    date: "07/07/23, 9:52 PM",
    amount: 130,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "crab",
    date: "07/08/23, 8:56 AM",
    amount: 245,
    from: "Cash App",
    to: "LTC",
    details: "Cash App to LTC exchange",
  },
  {
    username: "Reaper",
    date: "07/08/23, 3:51 PM",
    amount: 100,
    from: "LTC",
    to: "Cash App",
    details: "LTC to Cash App exchange",
  },
  {
    username: "Eren",
    date: "07/09/23, 3:17 AM",
    amount: 500,
    from: "Mixed",
    to: "Mixed",
    details: "Multiple deals worth hundreds",
  },
  {
    username: "tyler",
    date: "07/09/23, 10:00 AM",
    amount: 500,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Aura",
    date: "07/09/23, 5:30 PM",
    amount: 50,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "mintys",
    date: "07/09/23, 8:39 PM",
    amount: 50,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Eren",
    date: "07/09/23, 8:39 PM",
    amount: 100,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Bloody",
    date: "07/09/23, 8:40 PM",
    amount: 7000,
    from: "Mixed",
    to: "Mixed",
    details: "Exchanged over 7k worth",
  },
  {
    username: "Sedgesg",
    date: "07/11/23, 3:48 PM",
    amount: 30,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "imikos",
    date: "07/11/23, 7:59 PM",
    amount: 400,
    from: "Mixed",
    to: "Mixed",
    details: "Instant exchange",
  },
  {
    username: "nomo",
    date: "07/15/23, 12:49 PM",
    amount: 1070,
    from: "Cash App/Venmo",
    to: "LTC",
    details: "CA/Venmo to LTC exchange",
  },
  {
    username: "Sedgesg",
    date: "07/15/23, 2:22 PM",
    amount: 40,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "! HomelessCorey",
    date: "07/15/23, 9:59 PM",
    amount: 100,
    from: "LTC",
    to: "Cash App",
    details: "LTC to CA exchange",
  },
  {
    username: "mintys",
    date: "07/16/23, 12:41 AM",
    amount: 20,
    from: "Cash App",
    to: "LTC",
    details: "Exchange with 25% fee CA-LTC",
  },
  {
    username: "rawr",
    date: "07/16/23, 1:37 AM",
    amount: 90,
    from: "Venmo",
    to: "LTC",
    details: "Exchanged Venmo to LTC",
  },
  // High Value Vouches
  {
    username: "bloody",
    date: "1/27/25, 9:30 PM",
    amount: 10000,
    from: "Mixed",
    to: "Mixed",
    details: "10000+ in total exchanges",
  },
  {
    username: "poligon",
    date: "1/28/25, 10:03 AM",
    amount: 10000,
    from: "Mixed",
    to: "Mixed",
    details: "10k total exchanges",
  },
  {
    username: "Sey",
    date: "2/14/25, 11:13 PM",
    amount: 6500,
    from: "Apple Pay",
    to: "Crypto",
    details: "6500 apple pay exchange",
  },
  {
    username: "Khabib",
    date: "1/31/25, 6:14 PM",
    amount: 4650,
    from: "Apple Pay",
    to: "LTC",
    details: "4.5k + 100 ApplePay to LTC",
  },
  {
    username: "latek",
    date: "2/8/25, 5:24 AM",
    amount: 1500,
    from: "Venmo",
    to: "LTC",
    details: "1.5k+ venmo to LTC in past 3 days",
  },
  {
    username: "Rah",
    date: "1/20/25, 1:06 PM",
    amount: 1500,
    from: "Mixed",
    to: "Mixed",
    details: "1.5k+ total exchanges",
  },
  // Regular Vouches
  {
    username: "Rext",
    date: "1/28/25, 3:21 PM",
    amount: 200,
    from: "Fire Skrill",
    to: "Crypto",
    details: "Fire skrill to crypto exchange",
  },
  {
    username: "leo",
    date: "1/16/25, 5:34 PM",
    amount: 200,
    from: "Zelle",
    to: "LTC",
    details: "Zelle to LTC exchange",
  },
  {
    username: "Latek",
    date: '1/2    to: "LTC',
    details: "BEST EXCHANGER ON GANG 🔥",
  },
  {
    username: "j - nomo",
    date: "1/31/25, 4:08 PM",
    amount: 188,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Rah",
    date: "1/27/25, 9:30 PM",
    amount: 180,
    from: "Apple Pay",
    to: "Crypto",
    details: "Apple Pay to crypto exchange",
  },
  {
    username: "c4in_mp4",
    date: "1/20/25, 4:20 PM",
    amount: 175,
    from: "LTC",
    to: "Wise",
    details: "LTC to Wise exchange",
  },
  {
    username: "Lowfo",
    date: "2/9/25, 9:00 AM",
    amount: 170,
    from: "PayPal",
    to: "LTC",
    details: "PP to LTC exchange",
  },
  {
    username: "Latek",
    date: "1/20/25, 10:42 AM",
    amount: 150,
    from: "Zelle",
    to: "LTC",
    details: "Zelle to LTC exchange",
  },
  {
    username: "Frosty_",
    date: "2/4/25, 12:51 AM",
    amount: 150,
    from: "PayPal",
    to: "LTC",
    details: "PP to LTC exchange",
  },
  {
    username: "Wan",
    date: "2/7/25, 10:32 PM",
    amount: 140,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "Jaxs",
    date: "1/28/25, 1:59 PM",
    amount: 111,
    from: "Venmo",
    to: "SOL",
    details: "Venmo to SOL exchange",
  },
  {
    username: "Apeware",
    date: "1/31/25, 11:57 PM",
    amount: 100,
    from: "Apple Pay",
    to: "Solana",
    details: "Apple Pay to Solana exchange",
  },
  {
    username: "exotiC",
    date: "2/9/25, 6:50 AM",
    amount: 95,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "Khabib",
    date: "1/14/25, 7:49 PM",
    amount: 80,
    from: "Apple Pay",
    to: "LTC",
    details: "AP to LTC exchange",
  },
  {
    username: "!Kmoney",
    date: "1/15/25, 3:54 PM",
    amount: 75,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "Zyxfly",
    date: "2/12/25, 11:09 PM",
    amount: 70,
    from: "Card",
    to: "LTC",
    details: "Card to LTC exchange",
  },
  {
    username: "naci",
    date: "1/17/25, 11:28 PM",
    amount: 67,
    from: "LTC",
    to: "PayPal",
    details: "LTC to PayPal exchange",
  },
  {
    username: "drizzydrake",
    date: "2/5/25, 12:04 AM",
    amount: 65,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "bucket.getter14",
    date: "1/16/25, 12:50 PM",
    amount: 54,
    from: "Apple Cash",
    to: "LTC",
    details: "Apple Cash to LTC exchange",
  },
  {
    username: "Creter",
    date: "2/8/25, 11:00 PM",
    amount: 55,
    from: "PayPal",
    to: "LTC",
    details: "USDC to LTC, PayPal to LTC exchange",
  },
  {
    username: "faytana",
    date: "1/17/25, 3:41 PM",
    amount: 50,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "drizzydrake",
    date: "2/3/25, 12:46 PM",
    amount: 50,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "smalls",
    date: "1/24/25, 7:27 PM",
    amount: 42,
    from: "Apple Cash",
    to: "LTC",
    details: "1:1 Apple Cash to LTC exchange",
  },
  {
    username: "Creter",
    date: "2/12/25, 9:51 PM",
    amount: 42,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "Trippy",
    date: "1/19/25, 4:42 PM",
    amount: 43,
    from: "LTC",
    to: "Apple Pay",
    details: "LTC to Apple Pay exchange",
  },
  {
    username: "ok",
    date: "2/10/25, 9:25 PM",
    amount: 40,
    from: "Apple Pay",
    to: "LTC",
    details: "Apple Pay to LTC exchange",
  },
  {
    username: "Kalis",
    date: "2/3/25, 9:07 PM",
    amount: 39,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "La Casa De Naplette",
    date: "1/18/25, 11:41 AM",
    amount: 38,
    from: "PayPal",
    to: "Crypto",
    details: "PP to crypto exchange",
  },
  {
    username: "Kalis",
    date: "1/17/25, 7:04 PM",
    amount: 38,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "Ruxorly",
    date: "1/18/25, 12:05 AM",
    amount: 35,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "Creter",
    date: "2/2/25, 10:10 PM",
    amount: 31,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "smalls",
    date: "1/26/25, 7:00 PM",
    amount: 30,
    from: "Apple Cash",
    to: "LTC",
    details: "1:1 Apple Cash to LTC exchange",
  },
  {
    username: "linglong222",
    date: "1/27/25, 8:55 PM",
    amount: 25,
    from: "Apple Pay",
    to: "LTC",
    details: "Apple Pay to LTC exchange",
  },
  {
    username: "somethf",
    date: "1/31/25, 11:09 PM",
    amount: 25,
    from: "PayPal",
    to: "LTC",
    details: "Quick and easy PayPal to LTC exchange",
  },
  {
    username: "woke",
    date: "2/10/25, 5:59 PM",
    amount: 25,
    from: "PayPal",
    to: "LTC",
    details: "PP to LTC exchange",
  },
  {
    username: "drizzydrake",
    date: "2/14/25, 1:04 PM",
    amount: 25,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "catmizxc35586",
    date: "2/13/25, 10:32 PM",
    amount: 20,
    from: "PayPal",
    to: "LTC",
    details: "PP to LTC exchange",
  },
  {
    username: "skibidisigma30",
    date: "2/10/25, 5:40 PM",
    amount: 13,
    from: "PayPal",
    to: "LTC",
    details: "PP to LTC tysm",
  },
  {
    username: "ghosty",
    date: "2/10/25, 9:00 PM",
    amount: 10,
    from: "Apple Pay",
    to: "LTC",
    details: "AP to LTC exchange",
  },
  {
    username: "latek",
    date: "2/20/25, 4:29 PM",
    amount: 2000,
    from: "Mixed",
    to: "Mixed",
    details: "Another 2k or sum light",
  },
  {
    username: "Lowfo",
    date: "2/20/25, 11:24 AM",
    amount: 200,
    from: "B4U",
    to: "PayPal",
    details: "1:1 b4u 50$ and pp 150$",
  },
  {
    username: "j-nomo",
    date: "2/21/25, 6:58 PM",
    amount: 219,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Rah",
    date: "2/18/25, 10:34 PM",
    amount: 460,
    from: "Crypto",
    to: "Apple Pay",
    details: "30$ crypto to Apple Pay and 430$ exchange",
  },
  {
    username: "bloody",
    date: "2/19/25, 10:10 PM",
    amount: 75,
    from: "PayPal",
    to: "SOL",
    details: "Fast and legit exchange",
  },
  {
    username: "drizzydrake",
    date: "2/20/25, 9:50 AM",
    amount: 100,
    from: "Venmo",
    to: "LTC",
    details: "Venmo LTC exchange",
  },
  {
    username: "notions",
    date: "2/18/25, 2:19 PM",
    amount: 100,
    from: "PayPal",
    to: "LTC",
    details: "PP to LTC exchange",
  },
  {
    username: "daze",
    date: "2/18/25, 8:14 PM",
    amount: 80,
    from: "Venmo",
    to: "LTC",
    details: "Venmo to LTC exchange",
  },
  {
    username: "Zxi",
    date: "2/17/25, 11:42 PM",
    amount: 78,
    from: "LTC",
    to: "Venmo",
    details: "LTC to Venmo exchange",
  },
  {
    username: "Zyxfly",
    date: "2/18/25, 8:50 PM",
    amount: 36,
    from: "Card",
    to: "USDC SOL",
    details: "Card to USDC SOL exchange",
  },
  {
    username: "ignas / volatic",
    date: "2/20/25, 5:26 PM",
    amount: 51,
    from: "LTC",
    to: "PayPal",
    details: "LTC to PayPal exchange",
  },
  {
    username: "wael",
    date: "2/20/25, 8:16 PM",
    amount: 100,
    from: "USD",
    to: "Mixed",
    details: "USD exchange",
  },
  {
    username: "kuxivv",
    date: "2/23/25, 1:50 PM",
    amount: 20,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Zyxfly",
    date: "2/22/25, 11:24 PM",
    amount: 10,
    from: "Card",
    to: "USDC SOL",
    details: "Card to USDC SOL exchange",
  },
  {
    username: "daze",
    date: "2/18/25, 8:24 PM",
    amount: 5,
    from: "Venmo",
    to: "LTC",
    details: "Additional Venmo to LTC exchange",
  },
  {
    username: "noraismommy",
    date: "06/05/2023 12:00 PM",
    amount: 70,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "nomo",
    date: "06/06/2023 12:00 PM",
    amount: 415,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "alixn",
    date: "07/06/2023 12:00 PM",
    amount: 800,
    from: "Mixed",
    to: "Mixed",
    details: "800+ exchanged",
  },
  {
    username: "chika",
    date: "07/06/2023 12:00 PM",
    amount: 500,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Eren",
    date: "07/23/2023 12:00 PM",
    amount: 80,
    from: "Cash App",
    to: "Crypto",
    details: "CashApp to crypto exchange",
  },
  {
    username: "Jordan<3",
    date: "07/23/2023 12:00 PM",
    amount: 150,
    from: "Venmo",
    to: "Crypto",
    details: "Venmo to crypto exchange",
  },
  {
    username: "wren",
    date: "07/23/2023 12:00 PM",
    amount: 300,
    from: "LTC",
    to: "Cash App",
    details: "LTC to CashApp exchange",
  },
  {
    username: "nomo",
    date: "07/23/2023 12:00 PM",
    amount: 400,
    from: "Venmo/Cash App",
    to: "LTC",
    details: "Venmo/CashApp to LTC exchange",
  },
  {
    username: "CrazyDiamond",
    date: "07/24/2023 12:00 PM",
    amount: 100,
    from: "Venmo",
    to: "Crypto",
    details: "Venmo to crypto exchange",
  },
  {
    username: "wren",
    date: "07/24/2023 12:00 PM",
    amount: 528,
    from: "LTC",
    to: "Cash App",
    details: "LTC to CashApp exchange",
  },
  {
    username: "Jordan<3",
    date: "07/25/2023 12:00 PM",
    amount: 500,
    from: "PayPal/Apple Pay",
    to: "LTC",
    details: "PayPal/Apple Pay to LTC exchange",
  },
  {
    username: "Sedgesg",
    date: "07/25/2023 12:00 PM",
    amount: 68,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "wren",
    date: "07/25/2023 12:00 PM",
    amount: 1000,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "Burger",
    date: "07/29/2023 12:00 PM",
    amount: 250,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "wren",
    date: "07/31/2023 12:00 PM",
    amount: 200,
    from: "LTC",
    to: "PayPal",
    details: "LTC to PayPal exchange",
  },
  {
    username: "tag is bad",
    date: "08/01/2023 12:00 PM",
    amount: 300,
    from: "ETH",
    to: "PayPal",
    details: "ETH to PayPal exchange",
  },
  {
    username: "Jordan<3",
    date: "08/03/2023 12:00 PM",
    amount: 325,
    from: "USD",
    to: "LTC",
    details: "USD to LTC exchange",
  },
  {
    username: "Adam",
    date: "08/06/2023 12:00 PM",
    amount: 140,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "dustin",
    date: "09/14/2023 2:18 PM",
    amount: 95,
    from: "LTC",
    to: "Cash App",
    details: "LTC to CashApp exchange",
  },
  {
    username: "Coinpixel.co",
    date: "09/16/2023 9:41 PM",
    amount: 450,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Jordan<3",
    date: "09/18/2023 7:53 AM",
    amount: 200,
    from: "LTC",
    to: "Mixed",
    details: "LTC exchange completed",
  },
  {
    username: "Anonymous",
    date: "09/19/2023 11:25 AM",
    amount: 1500,
    from: "PayPal",
    to: "USDT",
    details: "PayPal to USDT exchange",
  },
  {
    username: "CrazyDiamond",
    date: "09/20/2023 11:26 AM",
    amount: 150,
    from: "Venmo",
    to: "Crypto",
    details: "Venmo to crypto exchange",
  },
  {
    username: "Jordan<3",
    date: "09/20/2023 9:22 PM",
    amount: 90,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange - Quick service",
  },
  {
    username: "ximmer",
    date: "09/21/2023 11:07 AM",
    amount: 150,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "Anonymous",
    date: "09/22/2023 12:23 PM",
    amount: 500,
    from: "PayPal",
    to: "USDT",
    details: "PayPal to USDT exchange",
  },
  {
    username: "ximmer",
    date: "09/22/2023 6:32 PM",
    amount: 100,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to Litecoin exchange",
  },
  {
    username: "Dom",
    date: "09/23/2023 9:49 AM",
    amount: 100,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "Jordan<3",
    date: "09/23/2023 1:02 PM",
    amount: 70,
    from: "Cash App",
    to: "PayPal",
    details: "CashApp to PayPal exchange",
  },
  {
    username: "Jordan<3",
    date: "09/23/2023 1:28 PM",
    amount: 165,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "kd",
    date: "09/23/2023 1:34 PM",
    amount: 34,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "Djoko Koprivica",
    date: "09/24/2023 11:15 AM",
    amount: 30,
    from: "LTC",
    to: "PayPal",
    details: "LTC to PayPal exchange - Low fee service",
  },
  {
    username: "Polar",
    date: "09/24/2023 11:18 AM",
    amount: 66,
    from: "Apple Pay",
    to: "LTC",
    details: "Apple Pay to LTC exchange",
  },
  {
    username: "JohnsonAndJake",
    date: "09/24/2023 1:55 PM",
    amount: 130,
    from: "Cash App",
    to: "LTC",
    details: "Cash App to LTC exchange",
  },
  {
    username: "Jordan<3",
    date: "09/24/2023 4:38 PM",
    amount: 40,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "Djoko Koprivica",
    date: "09/25/2023 11:44 AM",
    amount: 200,
    from: "LTC",
    to: "PayPal",
    details: "LTC to PayPal exchange",
  },
  {
    username: "Molotov",
    date: "09/25/2023 8:51 AM",
    amount: 150,
    from: "PayPal",
    to: "Mixed",
    details: "PayPal exchange - Included tip",
  },
  {
    username: "Anonymous",
    date: "09/25/2023 4:54 PM",
    amount: 500,
    from: "PayPal",
    to: "USDT",
    details: "PayPal to USDT exchange",
  },
  {
    username: "Jojanek",
    date: "09/27/2023 12:21 PM",
    amount: 130,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "dwukk",
    date: "09/28/2023 3:49 PM",
    amount: 20,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "spooky",
    date: "09/28/2023 8:24 PM",
    amount: 44,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Zoe",
    date: "09/28/2023 8:27 PM",
    amount: 95,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "homelesscorey1",
    date: "09/28/2023 9:23 PM",
    amount: 166,
    from: "LTC",
    to: "Mixed",
    details: "LTC exchange completed",
  },
  {
    username: "CrazyDiamond",
    date: "08/08/2023 1:40 PM",
    amount: 400,
    from: "Venmo",
    to: "Crypto",
    details: "Venmo to crypto exchange",
  },
  {
    username: "Jordan<3",
    date: "08/12/2023 11:37 AM",
    amount: 290,
    from: "USD",
    to: "LTC",
    details: "USD to LTC exchange",
  },
  {
    username: "Fael",
    date: "08/25/2023 7:43 AM",
    amount: 250,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Coinpixel.co",
    date: "08/26/2023 2:20 PM",
    amount: 420,
    from: "Cash App",
    to: "Mixed",
    details: "CashApp exchange",
  },
  {
    username: "jarvis",
    date: "08/27/2023 9:07 AM",
    amount: 500,
    from: "Mixed",
    to: "Mixed",
    details: "Multiple exchanges completed",
  },
  {
    username: "bolt",
    date: "08/27/2023 9:52 AM",
    amount: 100,
    from: "LTC",
    to: "Cash App",
    details: "LTC to CashApp exchange - 5 minute completion",
  },
  {
    username: "ximmer",
    date: "08/27/2023 12:50 PM",
    amount: 100,
    from: "Cash App",
    to: "Crypto",
    details: "Quick CashApp to crypto exchange",
  },
  {
    username: "vosa",
    date: "08/27/2023 1:19 PM",
    amount: 16,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange - Low fees",
  },
  {
    username: "Adam",
    date: "08/27/2023 1:34 PM",
    amount: 120,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Jordan<3",
    date: "08/29/2023 4:01 PM",
    amount: 35,
    from: "Cash App",
    to: "LTC",
    details: "Fast CashApp to LTC exchange",
  },
  {
    username: "Jordan<3",
    date: "08/29/2023 7:30 PM",
    amount: 99,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "wren",
    date: "08/30/2023 12:08 PM",
    amount: 21,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "ShahRukh",
    date: "08/30/2023 12:12 PM",
    amount: 50,
    from: "Mixed",
    to: "LTC",
    details: "LTC received successfully",
  },
  {
    username: "wren",
    date: "08/30/2023 6:33 PM",
    amount: 330,
    from: "Cash App",
    to: "LTC",
    details: "CashApp to LTC exchange",
  },
  {
    username: "nomo",
    date: "08/30/2023 7:06 PM",
    amount: 700,
    from: "Mixed",
    to: "Mixed",
    details: "Quick exchange completed",
  },
  {
    username: "Tobcus",
    date: "09/01/2023 6:55 AM",
    amount: 200,
    from: "Crypto",
    to: "PayPal",
    details: "Crypto to PayPal exchange",
  },
  {
    username: "CrazyDiamond",
    date: "09/01/2023 7:09 AM",
    amount: 680,
    from: "PayPal",
    to: "Crypto",
    details: "PayPal to crypto exchange",
  },
  {
    username: "Carsteel",
    date: "09/01/2023 10:06 AM",
    amount: 125,
    from: "LTC",
    to: "PayPal",
    details: "LTC to PayPal exchange",
  },
  {
    username: "bn",
    date: "09/03/2023 12:28 PM",
    amount: 140,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Deleted User",
    date: "09/03/2023 12:29 PM",
    amount: 147,
    from: "PayPal",
    to: "Crypto",
    details: "PayPal to crypto exchange",
  },
  {
    username: "Penguin",
    date: "09/03/2023 7:14 PM",
    amount: 40,
    from: "LTC",
    to: "PayPal",
    details: "LTC to PayPal exchange",
  },
  {
    username: "Coinpixel.co",
    date: "09/05/2023 7:47 PM",
    amount: 800,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Bloody",
    date: "09/05/2023 11:56 PM",
    amount: 1400,
    from: "Mixed",
    to: "Mixed",
    details: "Large exchange completed",
  },
  {
    username: "Jordan<3",
    date: "09/06/2023 8:43 AM",
    amount: 400,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "wren",
    date: "09/06/2023 9:40 AM",
    amount: 1100,
    from: "Cash App",
    to: "Crypto",
    details: "CashApp to crypto exchange",
  },
  {
    username: "nomo",
    date: "09/09/2023 3:32 PM",
    amount: 580,
    from: "Mixed",
    to: "LTC",
    details: "Exchange to LTC completed",
  },
  {
    username: "BlueySNS",
    date: "09/09/2023 10:33 PM",
    amount: 250,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "Coinpixel.co",
    date: "09/09/2023 11:02 PM",
    amount: 470,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed",
  },
  {
    username: "tdyne",
    date: "09/12/2023 12:21 PM",
    amount: 185,
    from: "Cash App",
    to: "Mixed",
    details: "CashApp exchange completed",
  },
  {
    username: "wren",
    date: "09/12/2023 12:22 PM",
    amount: 185,
    from: "Cash App",
    to: "PayPal",
    details: "CashApp to PayPal exchange",
  },
  {
    username: "Jesse",
    date: "09/12/2023 4:57 PM",
    amount: 200,
    from: "ETH",
    to: "PayPal",
    details: "Fast ETH to PayPal exchange",
  },
  {
    username: "CrazyDiamond",
    date: "09/12/2023 5:18 PM",
    amount: 800,
    from: "Venmo",
    to: "Crypto",
    details: "Venmo to crypto exchange",
  },
  {
    username: "CrazyDiamond",
    date: "09/13/2023 11:07 AM",
    amount: 100,
    from: "Venmo",
    to: "Crypto",
    details: "Venmo to crypto exchange",
  },
  {
    username: "ximmer",
    date: "09/14/2023 12:12 AM",
    amount: 50,
    from: "Mixed",
    to: "Mixed",
    details: "Exchange completed successfully",
  },
  {
    username: "BlueySNS",
    date: "09/14/2023 9:10 AM",
    amount: 2000,
    from: "PayPal",
    to: "Cash App",
    details: "PayPal to CashApp exchange",
  },
  {
    username: "Kuma",
    date: "2/24/25, 9:56 PM",
    amount: 90,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
  {
    username: "mytzi",
    date: "2/24/25, 7:52 AM",
    amount: 200,
    from: "PayPal",
    to: "LTC",
    details: "PayPal to LTC exchange",
  },
]

export default function VouchesPage() {
  const router = useRouter()
  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const [selectedProof, setSelectedProof] = useState<{
    type: "video" | "image"
    url: string
  } | null>(null)

  // Sort vouches by amount in descending order
  const sortedVouches = [...vouches].sort((a, b) => b.amount - a.amount)

  // Filter vouches by selected year
  const filteredVouches = sortedVouches.filter((vouch) => {
    const vouchYear = new Date(vouch.date).getFullYear()
    return vouchYear === selectedYear
  })

  const totalVolume = vouches.reduce((sum, vouch) => {
    const amount = typeof vouch.amount === "number" ? vouch.amount : 0
    return sum + amount
  }, 0)
  const vouchCount = vouches.length

  // Function to handle setting the proof, ensuring we never pass undefined
  const handleSetProof = (proof: { type: "video" | "image"; url: string } | undefined) => {
    setSelectedProof(proof || null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000066] via-[#4B0082] to-[#9933FF] dark:from-black dark:to-[#1a0033] p-6 relative overflow-hidden">
      <GlitterBackground />
      <RainBackground />
      <MenuButton />
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={() => router.push("/sky-vouches")} className="bg-white/10 hover:bg-white/20 text-white">
          Sky vouches
        </Button>
        <Button onClick={() => router.push("/")} className="bg-white/10 hover:bg-white/20 text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 pt-16 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Vouches</h1>
          <div className="flex justify-center gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <p className="text-lg text-gray-400">Total Volume (Discord)</p>
              <p className="text-3xl font-bold text-white">${totalVolume.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <p className="text-lg text-gray-400">Total Vouches</p>
              <p className="text-3xl font-bold text-white">{vouchCount}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Button
            className="bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white px-6 py-3 rounded-xl flex items-center gap-2 justify-center backdrop-blur-sm"
            onClick={() => window.open("https://oguser.com/87", "_blank")}
          >
            <span className="font-semibold">OGUsers</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            className="bg-[#229ED9] hover:bg-[#1d8ac0] text-white px-6 py-3 rounded-xl flex items-center gap-2 justify-center backdrop-blur-sm"
            onClick={() => window.open("https://t.me/Tayvouches", "_blank")}
          >
            <TelegramIcon className="w-5 h-5" />
            <span className="font-semibold">Telegram</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-6 py-3 rounded-xl flex items-center gap-2 justify-center backdrop-blur-sm"
            onClick={() => window.open("https://discord.gg/8XQBQzHz", "_blank")}
          >
            <DiscordIcon className="w-5 h-5" />
            <span className="font-semibold">Discord</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-4 mt-12 mb-8">
          {[2025, 2024, 2023, 2022].map((year) => (
            <Button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-2 backdrop-blur-sm ${
                selectedYear === year
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                  : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
              } rounded-xl transition-all duration-200`}
            >
              {year}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVouches.length > 0 ? (
            filteredVouches.map((vouch, index) => (
              <Card
                key={index}
                className={`bg-white/[0.02] backdrop-blur-md border-white/5 shadow-xl p-4 rounded-xl hover:scale-[1.02] transition-transform duration-200 ${
                  vouch.amount >= 1000 ? "ring-2 ring-purple-500/30" : ""
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-purple-300 font-semibold">{vouch.username}</div>
                    <div className="text-xs text-gray-400">{vouch.date}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 flex-grow">
                    <div className="text-white text-sm">
                      <span className="text-gray-400">Amount:</span>{" "}
                      <span className={`font-semibold ${vouch.amount >= 1000 ? "text-purple-300" : ""}`}>
                        ${vouch.amount.toLocaleString()}
                      </span>
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
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-green-400 text-sm flex items-center">✓ Verified</span>
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No vouches found for {selectedYear}</p>
            </div>
          )}
        </div>
      </div>
      {selectedProof && <ProofModal isOpen={true} onClose={() => setSelectedProof(null)} proof={selectedProof} />}
    </div>
  )
}
