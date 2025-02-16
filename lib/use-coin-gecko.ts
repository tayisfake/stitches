"use client"

import { useState, useEffect } from "react"

export function useCoinGecko() {
  const [cryptoList, setCryptoList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const topCryptos = [
    "bitcoin",
    "ethereum",
    "tether",
    "usd-coin",
    "bnb",
    "solana",
    "xrp",
    "cardano",
    "dogecoin",
    "tron",
    "polkadot",
    "matic-network",
    "litecoin",
    "shiba-inu",
    "bitcoin-cash",
    "avalanche-2",
    "uniswap",
    "chainlink",
    "stellar",
    "cosmos",
  ]

  useEffect(() => {
    fetchCryptoList()
  }, [])

  async function fetchCryptoList() {
    try {
      setLoading(true)
      const response = await fetch("https://api.coingecko.com/api/v3/coins/list")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCryptoList(data.filter((coin) => topCryptos.includes(coin.id)))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching crypto list:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      setLoading(false)
    }
  }

  async function fetchCryptoPrice(cryptoId: string, currency: string) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${currency}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (!data[cryptoId] || !data[cryptoId][currency]) {
        throw new Error(`Price data not available for ${cryptoId} in ${currency}`)
      }
      return data[cryptoId][currency]
    } catch (error) {
      console.error("Error fetching crypto price:", error)
      throw error
    }
  }

  return { cryptoList, loading, error, fetchCryptoPrice }
}

