import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000066] via-[#4B0082] to-[#9933FF]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
        <p className="text-white text-lg">Loading payment interface...</p>
      </div>
    </div>
  )
}
