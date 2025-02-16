"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowRightIcon } from "lucide-react"
import { useCoinGecko } from "@/lib/use-coin-gecko"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

const paymentMethods = [
  { value: "chime", label: "Chime" },
  { value: "skrill", label: "Skrill" },
  { value: "venmo", label: "Venmo" },
  { value: "applepay", label: "Apple Pay" },
  { value: "paypal", label: "PayPal" },
  { value: "card", label: "Card" },
  { value: "bank", label: "Bank Transfer" },
]

const networks = [
  { value: "sol", label: "Solana" },
  { value: "poly", label: "Polygon" },
  { value: "eth", label: "Ethereum" },
]

export default function CryptoExchange() {
  const [sendCurrency, setSendCurrency] = useState("usd")
  const [getCurrency, setGetCurrency] = useState("")
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [network, setNetwork] = useState("")
  const [processingFee, setProcessingFee] = useState(0)
  const [amountAfterFees, setAmountAfterFees] = useState(0)
  const [cryptoAmount, setCryptoAmount] = useState(0)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [discordId, setDiscordId] = useState("")
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const hcaptchaRef = useRef<HTMLDivElement>(null)

  const { cryptoList, loading, error, fetchCryptoPrice } = useCoinGecko()

  useEffect(() => {
    if (amount && paymentMethod && getCurrency) {
      updateProcessingFees()
    }
  }, [amount, paymentMethod, getCurrency])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => Math.max(0, prev - 1))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldownTime])

  useEffect(() => {
    if (isDialogOpen) {
      // Reset hCaptcha when dialog opens
      ;(window as any).hcaptcha?.reset()
    }
  }, [isDialogOpen])

  async function updateProcessingFees() {
    try {
      if (!getCurrency) {
        throw new Error("Please select a cryptocurrency")
      }

      if (!amount || isNaN(Number.parseFloat(amount))) {
        throw new Error("Please enter a valid amount")
      }

      if (!paymentMethod) {
        throw new Error("Please select a payment method")
      }

      const minimumFee = 4
      const lowAmountFee = 3
      const lowAmountThreshold = 15
      const amountNum = Number.parseFloat(amount)

      const processingRate = ["chime", "skrill", "venmo", "applepay"].includes(paymentMethod)
        ? 5
        : paymentMethod === "paypal"
          ? 6.5
          : 7.5
      let fee = (amountNum * processingRate) / 100

      if (amountNum < lowAmountThreshold) {
        fee = lowAmountFee
      } else {
        fee = Math.max(fee, minimumFee)
      }

      let afterFees = amountNum - fee

      // If the amount after fees is negative or zero, adjust the fee
      if (afterFees <= 0) {
        fee = amountNum - 1 // Set fee to leave $1 after fees
        afterFees = 1 // Ensure the amount after fees is $1
      }

      setProcessingFee(fee)
      setAmountAfterFees(afterFees)

      let cryptoPrice
      if (getCurrency === "tether" || getCurrency === "usd-coin") {
        cryptoPrice = 1 // 1:1 ratio for USDT and USDC
      } else {
        cryptoPrice = await fetchCryptoPrice(getCurrency, sendCurrency)
        if (cryptoPrice === 0) {
          throw new Error(`Unable to fetch price for ${getCurrency}`)
        }
      }

      setCryptoAmount(afterFees / cryptoPrice)
      setPriceError(null)
    } catch (error) {
      console.error("Error updating processing fees:", error)
      setPriceError(error instanceof Error ? error.message : "An unknown error occurred")
      setProcessingFee(0)
      setAmountAfterFees(0)
      setCryptoAmount(0)
    }
  }

  async function handleExchange() {
    setIsDialogOpen(true)
  }

  const handleDiscordIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setDiscordId(value)
    setSubmitStatus(null)
  }

  async function handleSubmitExchange() {
    if (!discordId) {
      setSubmitStatus({ type: "error", message: "Please enter your Discord ID" })
      return
    }

    const hcaptchaResponse = (window as any).hcaptcha?.getResponse()
    if (!hcaptchaResponse) {
      setSubmitStatus({ type: "error", message: "Please complete the CAPTCHA" })
      return
    }

    if (isSubmitting || cooldownTime > 0) {
      return
    }

    setIsSubmitting(true)
    setCooldownTime(60) // Set cooldown to 60 seconds

    try {
      const response = await fetch("/api/send-exchange-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sendCurrency,
          getCurrency,
          amount,
          paymentMethod,
          network: showNetworkDropdown ? network : null,
          discordId,
          captchaResponse: hcaptchaResponse,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          setSubmitStatus({ type: "error", message: "You must be a member of the Discord server to create a ticket" })
        } else if (response.status === 429) {
          setSubmitStatus({ type: "error", message: data.error })
        } else {
          setSubmitStatus({ type: "error", message: data.error || "Failed to send exchange data" })
        }
        return
      }

      setSubmitStatus({
        type: "success",
        message: "Exchange details sent successfully! Check Discord for your ticket.",
      })
      setTimeout(() => {
        setIsDialogOpen(false)
        setSubmitStatus(null)
        setDiscordId("")
        ;(window as any).hcaptcha?.reset()
      }, 2000)
    } catch (error) {
      console.error("Error submitting exchange:", error)
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSubmitting(false)
      // Reset hCaptcha after submission
      ;(window as any).hcaptcha?.reset()
    }
  }

  const showNetworkDropdown = getCurrency === "tether" || getCurrency === "usd-coin"
  const showConfirmExchange = amount && paymentMethod && getCurrency && (!showNetworkDropdown || network)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      <Card className="w-full bg-white bg-opacity-10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">Exchange NOW!</CardTitle>
          <CardDescription className="text-center text-gray-200">Exchange your currency for crypto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="send-currency" className="text-white">
              You Send
            </Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={sendCurrency} onValueChange={setSendCurrency}>
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 text-white border-gray-600 rounded-xl">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-600 rounded-xl">
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                  <SelectItem value="aud">AUD</SelectItem>
                  <SelectItem value="jpy">JPY</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-grow bg-white bg-opacity-20 text-white placeholder-gray-400 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="get-currency" className="text-white">
              You Get
            </Label>
            <Select value={getCurrency} onValueChange={setGetCurrency}>
              <SelectTrigger className="w-full bg-gray-800 text-white border-gray-600 rounded-xl">
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-600 rounded-xl">
                {cryptoList.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {showNetworkDropdown && (
            <div className="space-y-2">
              <Label htmlFor="network" className="text-white">
                Network
              </Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-600 rounded-xl">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-600 rounded-xl">
                  {networks.map((net) => (
                    <SelectItem key={net.value} value={net.value}>
                      {net.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="payment-method" className="text-white">
              Payment Method
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full bg-gray-800 text-white border-gray-600 rounded-xl">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-600 rounded-xl">
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {priceError && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{priceError}</AlertDescription>
            </Alert>
          )}
          {amount && paymentMethod && getCurrency && !priceError && (
            <div className="w-full p-4 bg-white bg-opacity-20 rounded-xl text-white">
              <p className="text-sm sm:text-base">
                <strong>Processing Fee:</strong> {processingFee.toFixed(2)} {sendCurrency.toUpperCase()}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Amount After Fees:</strong> {amountAfterFees.toFixed(2)} {sendCurrency.toUpperCase()}
              </p>
              <p className="text-sm sm:text-base">
                <strong>You Receive:</strong> {cryptoAmount.toFixed(8)} {getCurrency.toUpperCase()}
              </p>
            </div>
          )}
          <AnimatedButton onClick={handleExchange} disabled={!showConfirmExchange}>
            <ArrowRightIcon className="mr-2 h-4 w-4" />
            {showConfirmExchange ? "Confirm Exchange" : "Exchange Now"}
          </AnimatedButton>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Exchange</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please enter your Discord ID to proceed with the exchange.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="discord-id">Discord ID</Label>
              <Input
                id="discord-id"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter your Discord ID"
                value={discordId}
                onChange={handleDiscordIdChange}
                maxLength={20}
                className="bg-gray-800 border-gray-700 text-white rounded-xl"
              />
            </div>
            <div
              ref={hcaptchaRef}
              className="h-captcha"
              data-sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
              data-theme="dark"
            ></div>
            {submitStatus && (
              <Alert variant={submitStatus.type === "success" ? "default" : "destructive"} className="rounded-xl">
                <AlertDescription>{submitStatus.message}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-transparent text-white hover:bg-gray-800 rounded-xl w-full sm:w-auto mb-2 sm:mb-0"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitExchange}
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl w-full sm:w-auto"
              disabled={isSubmitting || cooldownTime > 0 || submitStatus?.type === "error"}
            >
              {isSubmitting
                ? "Submitting..."
                : cooldownTime > 0
                  ? `Wait ${Math.floor(cooldownTime / 60)}m ${cooldownTime % 60}s`
                  : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AnimatedButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
      {...props}
    >
      {children}
    </Button>
  )
}

