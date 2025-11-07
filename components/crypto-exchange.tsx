"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useCoinGecko } from "@/lib/use-coin-gecko"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TelegramIcon, ArrowRightIcon } from "@/components/ui/icons"

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
  { value: "eth", label: "Ethereum" },
  { value: "poly", label: "Polygon" },
]

interface CryptoExchangeProps {
  mode: "buy" | "sell"
}

export default function CryptoExchange({ mode }: CryptoExchangeProps) {
  const [sendCurrency, setSendCurrency] = useState(mode === "buy" ? "usd" : "")
  const [getCurrency, setGetCurrency] = useState(mode === "sell" ? "usd" : "")
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [processingFee, setProcessingFee] = useState(0)
  const [amountAfterFees, setAmountAfterFees] = useState(0)
  const [cryptoAmount, setCryptoAmount] = useState(0)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState("")

  const { cryptoList, loading, error, fetchCryptoPrice } = useCoinGecko()

  // Reset states when mode changes
  useEffect(() => {
    setSendCurrency(mode === "buy" ? "usd" : "")
    setGetCurrency(mode === "sell" ? "usd" : "")
    setAmount("")
    setPaymentMethod("")
    setProcessingFee(0)
    setAmountAfterFees(0)
    setCryptoAmount(0)
    setPriceError(null)
    setSelectedNetwork("")
  }, [mode])

  useEffect(() => {
    if (amount && paymentMethod && (mode === "buy" ? getCurrency : sendCurrency)) {
      updateProcessingFees()
    }
  }, [amount, paymentMethod, getCurrency, sendCurrency, mode])

  async function updateProcessingFees() {
    try {
      const cryptoCurrency = mode === "buy" ? getCurrency : sendCurrency
      if (!cryptoCurrency) {
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

      // Adjust processing rates based on mode
      const processingRate =
        mode === "buy"
          ? ["chime", "skrill", "venmo", "applepay"].includes(paymentMethod)
            ? 5
            : paymentMethod === "paypal"
              ? 6.5
              : 7.5
          : ["chime", "skrill", "venmo", "applepay"].includes(paymentMethod)
            ? 3
            : paymentMethod === "paypal"
              ? 4.5
              : 5.5

      let fee = (amountNum * processingRate) / 100

      if (amountNum < lowAmountThreshold) {
        fee = lowAmountFee
      } else {
        fee = Math.max(fee, minimumFee)
      }

      // Calculate total after fees
      let total = amountNum - fee

      if (total <= 0) {
        fee = amountNum - 1
        total = 1
      }

      setProcessingFee(fee)
      setAmountAfterFees(total)

      let cryptoPrice
      if (cryptoCurrency === "tether" || cryptoCurrency === "usd-coin") {
        cryptoPrice = 1
      } else {
        cryptoPrice = await fetchCryptoPrice(cryptoCurrency, "usd")
        if (cryptoPrice === 0) {
          throw new Error(`Unable to fetch price for ${cryptoCurrency}`)
        }
      }

      if (mode === "buy") {
        setCryptoAmount(total / cryptoPrice)
      } else {
        setCryptoAmount(amountNum)
        setAmountAfterFees(total) // Use the total directly for sell mode
      }

      setPriceError(null)
    } catch (error) {
      console.error("Error updating processing fees:", error)
      setPriceError(error instanceof Error ? error.message : "An unknown error occurred")
      setProcessingFee(0)
      setAmountAfterFees(0)
      setCryptoAmount(0)
    }
  }

  function handleExchange() {
    window.open("https://t.me/umtay0", "_blank")
  }

  const isStablecoin = (currency: string) => currency === "tether" || currency === "usd-coin"
  const requiresNetwork = mode === "buy" ? isStablecoin(getCurrency) : isStablecoin(sendCurrency)

  const showConfirmExchange =
    amount && paymentMethod && (mode === "buy" ? getCurrency : sendCurrency) && (!requiresNetwork || selectedNetwork)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Determine which currency selectors to show based on mode
  const CurrencySelector = ({ type }: { type: "fiat" | "crypto" }) => {
    const isFiat = type === "fiat"
    const value = isFiat ? (mode === "buy" ? sendCurrency : getCurrency) : mode === "buy" ? getCurrency : sendCurrency
    const setValue = isFiat
      ? mode === "buy"
        ? setSendCurrency
        : setGetCurrency
      : mode === "buy"
        ? setGetCurrency
        : setSendCurrency

    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 text-white border-gray-600 rounded-xl">
          <SelectValue placeholder={`Select ${isFiat ? "currency" : "cryptocurrency"}`} />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white border-gray-600 rounded-xl">
          {isFiat ? (
            <>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
              <SelectItem value="aud">AUD</SelectItem>
              <SelectItem value="jpy">JPY</SelectItem>
            </>
          ) : (
            cryptoList.map((coin) => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    )
  }

  return (
    <>
      <Card className="w-full bg-card/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            {mode === "buy" ? "Buy Crypto" : "Sell Crypto"}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {mode === "buy" ? "Exchange your currency for crypto" : "Exchange your crypto for currency"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="send-currency" className="text-white">
              You Send
            </Label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {mode === "buy" ? <CurrencySelector type="fiat" /> : <CurrencySelector type="crypto" />}
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "")
                  if (value === "" || (!isNaN(Number.parseFloat(value)) && isFinite(Number(value)))) {
                    setAmount(value)
                  }
                }}
                className="flex-grow bg-white bg-opacity-20 text-white placeholder-gray-400 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="get-currency" className="text-white">
              You Get
            </Label>
            {mode === "buy" ? <CurrencySelector type="crypto" /> : <CurrencySelector type="fiat" />}
          </div>
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
          {requiresNetwork && (
            <div className="space-y-2">
              <Label htmlFor="network" className="text-white">
                Network
              </Label>
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-600 rounded-xl">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-600 rounded-xl">
                  {networks.map((network) => (
                    <SelectItem key={network.value} value={network.value}>
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {priceError && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{priceError}</AlertDescription>
            </Alert>
          )}
          {amount && paymentMethod && (mode === "buy" ? getCurrency : sendCurrency) && !priceError && (
            <div className="w-full p-4 bg-white bg-opacity-20 rounded-xl text-white">
              <p className="text-sm sm:text-base">
                <strong>Processing Fee:</strong> {processingFee.toFixed(2)}{" "}
                {mode === "buy" ? sendCurrency.toUpperCase() : getCurrency.toUpperCase()}
              </p>
              <p className="text-sm sm:text-base">
                <strong>{mode === "buy" ? "Amount After Fees" : "You Receive"}:</strong> {amountAfterFees.toFixed(2)}{" "}
                {mode === "buy" ? sendCurrency.toUpperCase() : getCurrency.toUpperCase()}
              </p>
              {mode === "buy" && (
                <p className="text-sm sm:text-base">
                  <strong>You Receive:</strong> {cryptoAmount.toFixed(8)} {getCurrency.toUpperCase()}
                  {requiresNetwork &&
                    selectedNetwork &&
                    ` on ${networks.find((n) => n.value === selectedNetwork)?.label}`}
                </p>
              )}
              {mode === "sell" && requiresNetwork && selectedNetwork && (
                <p className="text-sm sm:text-base">
                  <strong>Network:</strong> {networks.find((n) => n.value === selectedNetwork)?.label}
                </p>
              )}
            </div>
          )}
          <AnimatedButton onClick={handleExchange} disabled={!showConfirmExchange}>
            <div className="flex items-center justify-center">
              {showConfirmExchange ? (
                <>
                  <span className="mr-2">Contact @umtay0</span>
                  <TelegramIcon className="h-5 w-5" />
                </>
              ) : (
                <>
                  <span className="mr-2">
                    {mode === "buy" ? "Buy" : "Sell"} Now
                    {requiresNetwork && !selectedNetwork ? " (Select Network)" : ""}
                  </span>
                  <ArrowRightIcon className="h-5 w-5" />
                </>
              )}
            </div>
          </AnimatedButton>
        </CardFooter>
      </Card>
    </>
  )
}

function AnimatedButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
      {...props}
    >
      {children}
    </Button>
  )
}
